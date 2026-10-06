import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserPlus, Mail, Lock, User, Phone, ArrowLeft, ShieldAlert } from 'lucide-react';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { userRegister } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { name, email, mobile, password, confirmPassword } = formData;

    if (!name || !email || !mobile || !password || !confirmPassword) {
      setErrorMsg('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      setLoading(false);
      return;
    }

    const res = await userRegister(name, email, mobile, password);
    if (res.success) {
      navigate('/profile');
    } else {
      setErrorMsg(res.message || 'Registration failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg flex items-center justify-center p-4 relative grid-bg">
      {/* Background glow circle */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full filter blur-3xl pointer-events-none"></div>
      
      {/* Back button */}
      <div className="absolute top-6 left-6">
        <Link 
          to="/" 
          className="flex items-center space-x-1.5 text-slate-400 hover:text-white transition duration-200 text-sm font-semibold"
        >
          <ArrowLeft size={16} />
          <span>Back to Landing</span>
        </Link>
      </div>

      <div className="max-w-md w-full relative z-10 py-8">
        
        {/* Logo and title */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent to-orange-600 flex items-center justify-center shadow-glow-orange mb-3">
            <UserPlus size={28} className="text-white" />
          </div>
          <h2 className="text-white font-extrabold text-2xl font-sans tracking-tight">Resident Signup</h2>
          <p className="text-slate-400 text-xs mt-1">Create an account to track your room bookings.</p>
        </div>

        {/* Signup Form card */}
        <div className="glass-card p-8 rounded-[28px] border border-slate-800/80 shadow-premium">
          <form onSubmit={handleRegister} className="space-y-4">
            
            {errorMsg && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs flex items-center space-x-2">
                <ShieldAlert size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Name field */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="name" className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Aman Gupta"
                  className="glass-input pl-10 pr-4 py-3 rounded-xl text-sm w-full"
                  required
                />
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Email field */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="email" className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="aman@example.com"
                  className="glass-input pl-10 pr-4 py-3 rounded-xl text-sm w-full"
                  required
                />
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Mobile field */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="mobile" className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Mobile Number</label>
              <div className="relative">
                <input
                  type="tel"
                  id="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="glass-input pl-10 pr-4 py-3 rounded-xl text-sm w-full"
                  required
                />
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Password field */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="password" className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Password (min. 6 chars)</label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="glass-input pl-10 pr-4 py-3 rounded-xl text-sm w-full"
                  required
                />
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Confirm Password field */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="confirmPassword" className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="glass-input pl-10 pr-4 py-3 rounded-xl text-sm w-full"
                  required
                />
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl text-sm flex items-center justify-center space-x-2 shadow-glow-orange hover:shadow-orange-500/25 active:scale-95 transition-all duration-200"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span>Register Account</span>
              )}
            </button>

          </form>

          {/* Toggle link */}
          <div className="mt-6 text-center text-xs">
            <span className="text-slate-400">Already have a resident account? </span>
            <Link to="/login" className="text-accent font-bold hover:underline">
              Log In
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserRegister;
