import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { X, Calendar, Sparkles, ShieldCheck, ShieldAlert } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';

const BookingFormModal = ({ room, isOpen, onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    checkInDate: '',
    duration: '1',
    notes: '',
  });

  useEffect(() => {
    if (user && isOpen) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
      }));
    }
  }, [user, isOpen]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !room) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!formData.name || !formData.mobile || !formData.email || !formData.checkInDate || !formData.duration) {
      setErrorMsg('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        preferredRoom: room._id,
        duration: Number(formData.duration),
        user: user ? (user.id || user._id) : null,
      };

      const res = await api.post('/bookings', payload);
      if (res.data.success) {
        setSuccess(true);
      } else {
        setErrorMsg('Booking submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Booking Submission Error:', err.response?.data?.message || err.message);
      setErrorMsg(err.response?.data?.message || 'Something went wrong. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-darkBg-dark/80 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Modal Dialog Body */}
      <div className="relative glass-card rounded-[28px] border border-slate-800 shadow-premium max-w-lg w-full overflow-hidden animate-zoom-in z-10 bg-slate-900/95">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/80">
          <div className="flex items-center space-x-2">
            <Sparkles className="text-accent" size={20} />
            <h3 className="text-white font-extrabold text-lg">Book Room Bedspace</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center animate-bounce">
              <ShieldCheck size={36} />
            </div>
            <h4 className="text-white font-extrabold text-xl">Booking Request Sent!</h4>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed mx-auto">
              Your reservation request for <strong>{room.title}</strong> has been received. Our manager will call you shortly to confirm the check-in slot.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="mt-6 w-full py-3.5 bg-accent hover:bg-accent-hover text-white rounded-xl text-sm font-bold shadow-glow-orange transition"
            >
              Back to PG Landing
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {/* Selected Room Details card */}
            <div className="p-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[9px] text-accent uppercase tracking-widest font-extrabold">Selected Preference</span>
                <h4 className="text-white font-extrabold text-sm mt-0.5">{room.title}</h4>
                <p className="text-slate-400 text-[10px] uppercase mt-1 tracking-wider">{room.type} sharing &bull; {room.category}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px]">Rent / Month</span>
                <p className="text-white text-base font-extrabold mt-0.5">{formatCurrency(room.price)}</p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs flex items-center space-x-2">
                <ShieldAlert size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Name Input */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="modal-name" className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Your Full Name</label>
              <input
                type="text"
                id="modal-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Aman Gupta"
                className="glass-input px-4 py-3 rounded-xl text-sm"
                required
              />
            </div>

            {/* Mobile & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="modal-mobile" className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Mobile Number</label>
                <input
                  type="tel"
                  id="modal-mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="modal-email" className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  id="modal-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. aman@gmail.com"
                  className="glass-input px-4 py-3 rounded-xl text-sm"
                  required
                />
              </div>
            </div>

            {/* Check in & Duration Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="modal-checkin" className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Preferred Check-In Date</label>
                <div className="relative">
                  <input
                    type="date"
                    id="modal-checkin"
                    name="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]} // Block historical checkins
                    className="glass-input px-4 py-3 rounded-xl text-sm w-full cursor-pointer"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="modal-duration" className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Expected Stay Duration</label>
                <select
                  id="modal-duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="glass-input px-4 py-3 rounded-xl text-sm appearance-none bg-slate-900 cursor-pointer"
                >
                  <option value="1">1 Month</option>
                  <option value="2">2 Months</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months (1 Year)</option>
                </select>
              </div>
            </div>

            {/* Special notes */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="modal-notes" className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Special Requests / Notes</label>
              <textarea
                id="modal-notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g. Prefer corner bed, or single seater near washroom etc."
                rows="2"
                className="glass-input px-4 py-3 rounded-xl text-sm resize-none"
              ></textarea>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl text-sm flex items-center justify-center space-x-2 shadow-glow-orange hover:shadow-orange-500/25 active:scale-95 transition-all duration-200"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Calendar size={16} />
                  <span>Submit Booking Request</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingFormModal;
