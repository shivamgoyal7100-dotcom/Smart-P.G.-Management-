import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ShieldCheck, Mail, Lock, ArrowLeft, ShieldAlert } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      setLoading(false);
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate('/admin-dashboard');
    } else {
      setErrorMsg(res.message || 'Invalid administrator credentials.');
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

      <div className="max-w-md w-full relative z-10">
        
        {/* Logo and title */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent to-orange-600 flex items-center justify-center shadow-glow-orange mb-3">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h2 className="text-white font-extrabold text-2xl font-sans tracking-tight">Admin Portal</h2>
          <p className="text-slate-400 text-xs mt-1">Access secure dashboard to edit room lists and queries.</p>
        </div>

        {/* Login Form card */}
        <div className="glass-card p-8 rounded-[28px] border border-slate-800/80 shadow-premium">
          <form onSubmit={handleLogin} className="space-y-5">
            
            {errorMsg && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs flex items-center space-x-2">
                <ShieldAlert size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Email field */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="email" className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="admin@parihostel.com"
                  className="glass-input pl-10 pr-4 py-3.5 rounded-xl text-sm w-full"
                  required
                />
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Password field */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="password" className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="glass-input pl-10 pr-4 py-3.5 rounded-xl text-sm w-full"
                  required
                />
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-4 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl text-sm flex items-center justify-center space-x-2 shadow-glow-orange hover:shadow-orange-500/25 active:scale-95 transition-all duration-200"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span>Log In to Dashboard</span>
              )}
            </button>

          </form>
        </div>

        {/* Small tip note */}
        <p className="text-center text-slate-500 text-[10px] mt-6">
          Authorized personnel only. Sessions will auto-expire.
        </p>

      </div>
    </div>
  );
};

export default AdminLogin;
