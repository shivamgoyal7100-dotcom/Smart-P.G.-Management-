import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const EnquiryForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    roomType: 'any',
    message: '',
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
      }));
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Client-side validations
    if (!formData.name || !formData.mobile || !formData.email || !formData.message) {
      setErrorMsg('Please fill in all the fields.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/enquiries', formData);
      if (res.data.success) {
        setSuccess(true);
        setFormData({
          name: user ? (user.name || '') : '',
          mobile: user ? (user.mobile || '') : '',
          email: user ? (user.email || '') : '',
          roomType: 'any',
          message: '',
        });
      } else {
        setErrorMsg('Submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Enquiry Submission Error:', err.response?.data?.message || err.message);
      setErrorMsg(err.response?.data?.message || 'Something went wrong. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 sm:p-8 rounded-[28px] border border-slate-800/80 shadow-premium relative">
      {success ? (
        <div className="text-center py-10 flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center animate-bounce">
            <CheckCircle2 size={36} />
          </div>
          <h3 className="text-white font-extrabold text-xl">Enquiry Submitted!</h3>
          <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
            Thank you for contacting Pari PG. We have logged your request. Our owner will get in touch with you shortly.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-center sm:text-left mb-2">
            <h3 className="text-white font-extrabold text-xl">Send an Enquiry</h3>
            <p className="text-slate-400 text-xs mt-1">Fill in the fields to check pricing and availability.</p>
          </div>

          {errorMsg && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs flex items-center space-x-2">
              <ShieldAlert size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Name & Mobile Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="name" className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Priyanshu Sharma"
                className="glass-input px-4 py-3 rounded-xl text-sm"
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="mobile" className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                className="glass-input px-4 py-3 rounded-xl text-sm"
                required
              />
            </div>
          </div>

          {/* Email & Room Type Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="email" className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. priyanshu@gmail.com"
                className="glass-input px-4 py-3 rounded-xl text-sm"
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="roomType" className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Preferred Room sharing</label>
              <select
                id="roomType"
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                className="glass-input px-4 py-3 rounded-xl text-sm appearance-none bg-slate-900 cursor-pointer"
              >
                <option value="any">Any Sharing (Single/Double/Triple)</option>
                <option value="single">Single Seater</option>
                <option value="double">Double Sharing</option>
                <option value="triple">Triple Sharing</option>
              </select>
            </div>
          </div>

          {/* Message Area */}
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="message" className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Your Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="e.g. Hello, I want to ask if single AC rooms are available from next week?"
              rows="4"
              className="glass-input px-4 py-3 rounded-xl text-sm resize-none"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl text-sm flex items-center justify-center space-x-2 shadow-glow-orange hover:shadow-orange-500/25 active:scale-95 transition-all duration-200"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <Send size={16} />
                <span>Submit Enquiry</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default EnquiryForm;
