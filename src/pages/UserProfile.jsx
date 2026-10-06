import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { formatCurrency, getImageUrl } from '../utils/helpers';
import { 
  User as UserIcon, Calendar, Mail, Phone, Settings, LogOut, 
  ArrowRight, ShieldAlert, CheckCircle2, Clock, MapPin, Eye,
  Home as HomeIcon, Check, Edit2, Save, X, Zap, FileText, Printer, AlertTriangle
} from 'lucide-react';

const UserProfile = () => {
  const { user, userLogout, setUser } = useAuth();
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState('stay'); // Default to 'stay' info

  // State
  const [residentInfo, setResidentInfo] = useState(null);
  const [isResident, setIsResident] = useState(false);
  const [electricityBills, setElectricityBills] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Editing Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    password: '',
  });

  // Selected Bill for Printable Modal
  const [selectedBillModal, setSelectedBillModal] = useState(null);

  useEffect(() => {
    fetchStudentPortalData();
  }, []);

  const fetchStudentPortalData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // 1. Resident Stay & Rent Profile
      const resInfo = await api.get('/residents/my-resident-info');
      if (resInfo.data.success) {
        setIsResident(resInfo.data.isResident);
        setResidentInfo(resInfo.data.resident);
      }

      // 2. Electricity Bills
      const billsRes = await api.get('/electricity-bills/my-bills');
      if (billsRes.data.success) {
        setElectricityBills(billsRes.data.bills);
      }

      // 3. Room Bookings
      const bookingsRes = await api.get('/bookings/my-bookings');
      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.bookings);
      }
    } catch (err) {
      console.error('Fetch Portal Data Error:', err.message);
      setErrorMsg('Failed to load your resident parameters.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    userLogout();
    navigate('/');
  };

  const triggerToast = (msg, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 5000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        name: profileForm.name,
        email: profileForm.email,
        mobile: profileForm.mobile,
      };
      
      if (profileForm.password.trim()) {
        if (profileForm.password.length < 6) {
          triggerToast('Password must be at least 6 characters.', true);
          setSubmitting(false);
          return;
        }
        payload.password = profileForm.password;
      }

      const res = await api.put('/users/profile', payload);
      if (res.data.success) {
        setUser(res.data.user);
        setIsEditingProfile(false);
        setProfileForm({
          ...profileForm,
          password: '',
        });
        triggerToast('Profile details updated successfully!');
      }
    } catch (err) {
      console.error(err);
      triggerToast(err.response?.data?.message || 'Error updating profile.', true);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrintBill = () => {
    window.print();
  };

  return (
    <div className="bg-darkBg min-h-screen text-slate-100 relative pt-24 pb-16">
      <Navbar isDashboard={true} />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Alerts */}
        {errorMsg && (
          <div className="fixed bottom-6 left-6 z-50 p-4 bg-rose-500 text-white rounded-xl shadow-lg flex items-center space-x-2 animate-bounce">
            <ShieldAlert size={18} />
            <span className="text-xs font-bold">{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="fixed bottom-6 left-6 z-50 p-4 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center space-x-2 animate-bounce">
            <CheckCircle2 size={18} />
            <span className="text-xs font-bold">{successMsg}</span>
          </div>
        )}

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
              <span>Student Resident Portal</span>
              <span className="text-xs py-1 px-2.5 bg-accent/20 text-accent font-extrabold rounded-lg uppercase tracking-wider">On-Site Portal</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1">Check rent status, electricity bills, and stay parameters.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-200 border border-slate-700 hover:border-rose-900 rounded-xl text-xs font-bold transition duration-200"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Side Profile & Navigation */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* User Profile Card */}
            <div className="glass-card p-6 rounded-[22px] border border-slate-850 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full filter blur-xl pointer-events-none"></div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-accent to-orange-600 flex items-center justify-center shadow-glow-orange shrink-0">
                  <UserIcon size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-extrabold text-lg line-clamp-1">{user?.name}</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {isResident ? 'Verified PG Resident' : 'Registered Member'}
                  </span>
                </div>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleProfileSubmit} className="space-y-3">
                  <div>
                    <label className="text-[9px] text-slate-400 font-bold uppercase">Name</label>
                    <input 
                      type="text" 
                      value={profileForm.name} 
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="glass-input px-3.5 py-2 rounded-xl text-xs w-full mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 font-bold uppercase">Email</label>
                    <input 
                      type="email" 
                      value={profileForm.email} 
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="glass-input px-3.5 py-2 rounded-xl text-xs w-full mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 font-bold uppercase">Mobile</label>
                    <input 
                      type="tel" 
                      value={profileForm.mobile} 
                      onChange={(e) => setProfileForm({ ...profileForm, mobile: e.target.value })}
                      className="glass-input px-3.5 py-2 rounded-xl text-xs w-full mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 font-bold uppercase">New Password (optional)</label>
                    <input 
                      type="password" 
                      value={profileForm.password} 
                      onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="glass-input px-3.5 py-2 rounded-xl text-xs w-full mt-1"
                    />
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="flex-1 flex items-center justify-center space-x-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
                    >
                      <Save size={12} />
                      <span>Save</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 flex items-center justify-center space-x-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition border border-slate-700"
                    >
                      <X size={12} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-xs text-slate-300">
                    <Mail size={14} className="text-accent shrink-0" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-300">
                    <Phone size={14} className="text-accent shrink-0" />
                    <span>{user?.mobile}</span>
                  </div>

                  <button
                    onClick={() => {
                      setProfileForm({
                        name: user?.name || '',
                        email: user?.email || '',
                        mobile: user?.mobile || '',
                        password: '',
                      });
                      setIsEditingProfile(true);
                    }}
                    className="w-full mt-3 flex items-center justify-center space-x-1.5 py-2 bg-slate-800 hover:bg-slate-750 text-white hover:text-accent rounded-xl text-xs font-bold border border-slate-700 transition"
                  >
                    <Edit2 size={12} />
                    <span>Edit Profile</span>
                  </button>
                </div>
              )}
            </div>

            {/* Side Navigation Tabs */}
            <div className="glass-card p-4 rounded-[20px] border border-slate-850 space-y-1.5">
              {[
                { id: 'stay', name: 'My PG Stay & Rent', icon: HomeIcon, count: null },
                { id: 'electricity', name: 'Electricity Bills', icon: Zap, count: electricityBills.length },
                { id: 'bookings', name: 'My Bookings', icon: Calendar, count: bookings.length },
              ].map(tab => {
                const TabIcon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition duration-200 ${
                      isSelected 
                        ? 'bg-accent text-white shadow-glow-orange' 
                        : 'bg-transparent text-slate-400 hover:bg-slate-800/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <TabIcon size={16} />
                      <span>{tab.name}</span>
                    </div>
                    {tab.count !== null && (
                      <span className={`px-2 py-0.5 rounded text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Column: Main Viewport Content */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* ================= TAB: MY PG STAY & RENT ================= */}
            {activeTab === 'stay' && (
              <div className="space-y-6">
                <h3 className="text-lg font-extrabold text-white">Current Residency & Rent Details</h3>

                {loading ? (
                  <div className="h-40 rounded-2xl bg-slate-800 animate-pulse border border-slate-700"></div>
                ) : !isResident || !residentInfo ? (
                  <div className="text-center py-12 glass-card rounded-[22px] border border-slate-850 p-6">
                    <HomeIcon className="mx-auto text-slate-500 mb-3" size={36} />
                    <h4 className="text-white font-extrabold text-sm">No Active Resident Record Linked</h4>
                    <p className="text-slate-400 text-xs mt-1 max-w-md mx-auto">
                      Your account email ({user?.email}) is not currently marked as an active living resident by the PG owner admin. Please contact PG management to assign your room.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Stay Card */}
                    <div className="glass-card rounded-[22px] border border-slate-850 p-6 relative overflow-hidden">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                          <span className="text-[10px] px-2.5 py-1 rounded bg-accent/20 text-accent font-black uppercase tracking-widest">
                            {residentInfo.room?.type ? `${residentInfo.room.type} sharing • ${residentInfo.room.category}` : 'Active Stay'}
                          </span>
                          <h4 className="text-xl font-extrabold text-white mt-1">
                            {residentInfo.room?.title || 'Allocated Room'}
                          </h4>
                          <p className="text-xs text-slate-400 font-medium">
                            Assigned Spot: <span className="text-white font-bold">{residentInfo.bedNumber || 'Bed 1'}</span> • Check-In: {new Date(residentInfo.checkInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>

                        {/* Rent Card Status */}
                        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shrink-0 min-w-[200px]">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Monthly Rent</span>
                          <p className="text-2xl font-black text-white mt-0.5">
                            {formatCurrency(residentInfo.monthlyRent)}/mo
                          </p>
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800">
                            <span className="text-[10px] text-slate-400">Payment Status:</span>
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                              residentInfo.rentStatus === 'Paid'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {residentInfo.rentStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Resident Background Parameters on File */}
                    <div className="glass-card rounded-[22px] border border-slate-850 p-6">
                      <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
                        <FileText size={16} className="text-accent" />
                        <span>Background Information on PG File</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/60">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Father / Guardian Contact</span>
                          <p className="text-slate-200 font-semibold">{residentInfo.guardianName || 'N/A'}</p>
                          <p className="text-slate-400 text-[11px]">{residentInfo.guardianMobile || 'No contact number'}</p>
                        </div>

                        <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/60">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Emergency Contact</span>
                          <p className="text-slate-200 font-semibold">{residentInfo.emergencyContact || 'N/A'}</p>
                        </div>

                        <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/60">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Govt ID Verification</span>
                          <p className="text-slate-200 font-semibold">{residentInfo.idProofType}</p>
                          <p className="text-accent text-[11px] font-bold">{residentInfo.idProofNumber || 'N/A'}</p>
                        </div>

                        <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/60">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">College / Workplace</span>
                          <p className="text-slate-200 font-semibold">{residentInfo.institutionOrCompany || 'N/A'}</p>
                        </div>

                        <div className="md:col-span-2 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/60">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Permanent Hometown Address</span>
                          <p className="text-slate-300 font-medium">{residentInfo.permanentAddress || 'Not recorded.'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB: ELECTRICITY BILLS ================= */}
            {activeTab === 'electricity' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
                    <Zap className="text-amber-400" size={20} />
                    <span>My Monthly Electricity Bills</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-bold">{electricityBills.length} Bill Records</span>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[1, 2].map(idx => (
                      <div key={idx} className="h-32 rounded-2xl bg-slate-800 animate-pulse border border-slate-700"></div>
                    ))}
                  </div>
                ) : electricityBills.length === 0 ? (
                  <div className="text-center py-16 glass-card rounded-[22px] border border-slate-850 p-6">
                    <Zap className="mx-auto text-slate-500 mb-3" size={36} />
                    <p className="text-slate-400 text-xs">No electricity bills have been published for your room yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {electricityBills.map(bill => (
                      <div key={bill._id} className="glass-card rounded-[22px] border border-slate-850 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs py-1 px-3 bg-amber-400/10 text-amber-400 font-black rounded-lg uppercase tracking-wider border border-amber-400/20">
                              {bill.month}
                            </span>
                            <span className={`text-[10px] py-1 px-2.5 rounded-lg font-black uppercase ${
                              bill.status === 'Paid'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {bill.status}
                            </span>
                          </div>

                          <div className="text-xs text-slate-300 space-y-1">
                            <p className="font-bold text-white text-sm">
                              Meter Reading: {bill.previousReading} &rarr; {bill.currentReading}
                            </p>
                            <p className="text-slate-400">
                              Units Consumed: <span className="text-amber-400 font-bold">{bill.unitsConsumed} Units</span> @ ₹{bill.ratePerUnit}/unit
                            </p>
                            <p className="text-slate-500 text-[11px]">
                              Due Date: {new Date(bill.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        {/* Payable & Actions */}
                        <div className="flex flex-col md:items-end justify-between space-y-3 pt-3 md:pt-0 border-t border-slate-850 md:border-0">
                          <div className="text-left md:text-right">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Net Bill Amount</span>
                            <span className="text-2xl font-black text-emerald-400">{formatCurrency(bill.amount)}</span>
                          </div>

                          <button
                            onClick={() => setSelectedBillModal(bill)}
                            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-bold border border-slate-700 transition shadow-sm"
                          >
                            <FileText size={14} className="text-accent" />
                            <span>View Bill Invoice</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB: MY BOOKINGS ================= */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-extrabold text-white">Your Room Reservation History</h3>

                {bookings.length === 0 ? (
                  <div className="text-center py-16 glass-card rounded-[22px] border border-slate-850">
                    <Clock className="mx-auto text-slate-500 mb-3" size={32} />
                    <p className="text-slate-400 text-xs">You haven't made any booking requests yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {bookings.map(booking => (
                      <div key={booking._id} className="glass-card rounded-[22px] border border-slate-850 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex space-x-4 items-start">
                          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-750 flex items-center justify-center shrink-0">
                            <HomeIcon className="text-accent" size={20} />
                          </div>
                          <div>
                            <span className="text-[9px] text-accent uppercase tracking-widest font-extrabold">
                              {booking.preferredRoom ? `${booking.preferredRoom.type} sharing • ${booking.preferredRoom.category}` : 'Room details'}
                            </span>
                            <h4 className="text-white font-extrabold text-sm mt-0.5">
                              {booking.preferredRoom ? booking.preferredRoom.title : 'Invalid Room'}
                            </h4>
                            
                            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5 text-xs text-slate-400 font-semibold">
                              <span>In: {new Date(booking.checkInDate).toLocaleDateString('en-IN')}</span>
                              <span>•</span>
                              <span>Stay: {booking.duration} Mo.</span>
                              <span>•</span>
                              <span className="text-slate-300 font-bold">
                                Rent: {booking.preferredRoom ? `${formatCurrency(booking.preferredRoom.price)}/mo` : 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-3 md:pt-0 border-t border-slate-850 md:border-0">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                            booking.status === 'Approved' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : booking.status === 'Rejected'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>

      {/* ================= PRINTABLE DIGITAL BILL MODAL ================= */}
      {selectedBillModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card p-6 rounded-[24px] border border-slate-800 max-w-lg w-full relative print:bg-white print:text-black">
            <button
              onClick={() => setSelectedBillModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white print:hidden"
            >
              <X size={16} />
            </button>

            {/* Bill Header */}
            <div className="border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">PARI HOSTEL & PG</h3>
                  <p className="text-[10px] text-slate-400">Official Monthly Electricity Invoice</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-accent uppercase">{selectedBillModal.month}</span>
                </div>
              </div>
            </div>

            {/* Bill Info Grid */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Resident Name</span>
                  <span className="text-white font-bold">{user?.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Room Details</span>
                  <span className="text-white font-bold">{selectedBillModal.room?.title || 'Assigned Room'}</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-b border-slate-800 py-3">
                <div className="flex justify-between text-slate-300">
                  <span>Previous Meter Reading:</span>
                  <span className="font-mono">{selectedBillModal.previousReading} Units</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Current Meter Reading:</span>
                  <span className="font-mono">{selectedBillModal.currentReading} Units</span>
                </div>
                <div className="flex justify-between font-bold text-amber-400 pt-1 border-t border-slate-850">
                  <span>Total Units Consumed:</span>
                  <span>{selectedBillModal.unitsConsumed} Units</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Electricity Tariff Rate:</span>
                  <span>₹{selectedBillModal.ratePerUnit} / Unit</span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase block">Total Net Amount</span>
                  <span className="text-2xl font-black text-emerald-400">{formatCurrency(selectedBillModal.amount)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Status</span>
                  <span className="text-xs font-black text-white uppercase px-2.5 py-0.5 rounded bg-emerald-500">
                    {selectedBillModal.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end space-x-3 print:hidden">
              <button
                onClick={handlePrintBill}
                className="flex items-center space-x-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700"
              >
                <Printer size={14} />
                <span>Print Bill</span>
              </button>
              <button
                onClick={() => setSelectedBillModal(null)}
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-bold shadow-glow-orange"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserProfile;
