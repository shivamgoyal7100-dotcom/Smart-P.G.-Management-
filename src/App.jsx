import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import UserProtectedRoute from './components/UserProtectedRoute';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Home />} />
          
          {/* Admin Authentication */}
          <Route path="/admin-login" element={<AdminLogin />} />
          
          {/* User Authentication */}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          
          {/* Protected User Dashboard */}
          <Route 
            path="/profile" 
            element={
              <UserProtectedRoute>
                <UserProfile />
              </UserProtectedRoute>
            } 
          />
          
          {/* Protected Admin Dashboard */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
