import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  // Check if admin & user tokens exist on load and fetch profiles
  useEffect(() => {
    const loadAdmin = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const res = await api.get('/auth/profile');
          if (res.data.success) {
            setAdmin(res.data.admin);
          } else {
            localStorage.removeItem('adminToken');
          }
        } catch (error) {
          console.error('Error loading admin profile:', error.message);
          localStorage.removeItem('adminToken');
        }
      }
      setLoading(false);
    };

    const loadUser = async () => {
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          const res = await api.get('/users/profile');
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            localStorage.removeItem('userToken');
          }
        } catch (error) {
          console.error('Error loading user profile:', error.message);
          localStorage.removeItem('userToken');
        }
      }
      setUserLoading(false);
    };

    loadAdmin();
    loadUser();
  }, []);

  // Admin login handler
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);
        setAdmin(res.data.admin);
        return { success: true };
      }
      return { success: false, message: 'Invalid server response' };
    } catch (error) {
      console.error('Auth Context Login Error:', error.response?.data?.message || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check credentials.',
      };
    }
  };

  // Admin logout handler
  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  // User login handler
  const userLogin = async (email, password) => {
    try {
      const res = await api.post('/users/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('userToken', res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: 'Invalid server response' };
    } catch (error) {
      console.error('User Login Error:', error.response?.data?.message || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check credentials.',
      };
    }
  };

  // User register handler
  const userRegister = async (name, email, mobile, password) => {
    try {
      const res = await api.post('/users/register', { name, email, mobile, password });
      if (res.data.success) {
        localStorage.setItem('userToken', res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: 'Invalid server response' };
    } catch (error) {
      console.error('User Register Error:', error.response?.data?.message || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please check fields.',
      };
    }
  };

  // User logout handler
  const userLogout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      admin, 
      loading, 
      login, 
      logout,
      user,
      userLoading,
      userLogin,
      userRegister,
      userLogout,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
