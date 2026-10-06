import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { getImageUrl, formatCurrency } from '../utils/helpers';
import { 
  Home as HomeIcon, Calendar, MessageSquare, Image as ImageIcon, 
  Star, Settings, LogOut, ShieldAlert, Plus, Trash2, Edit2, 
  Check, X, Sparkles, CheckCircle2, RefreshCw, Upload, Eye,
  Users, Zap, CreditCard, Search, Filter, PhoneCall, UserCheck, FileText
} from 'lucide-react';

const AdminDashboard = () => {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState('residents'); // Default to residents tab for convenience

  // Database lists
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [content, setContent] = useState({});
  const [residents, setResidents] = useState([]);
  const [electricityBills, setElectricityBills] = useState([]);

  // Search and Filters
  const [residentSearch, setResidentSearch] = useState('');
  const [residentFilter, setResidentFilter] = useState('all');
  const [billSearch, setBillSearch] = useState('');
  const [billFilter, setBillFilter] = useState('all');
  const [enquirySearch, setEnquirySearch] = useState('');

  // Loading indicator states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals / Form overlays
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  
  // Resident Modals
  const [showResidentModal, setShowResidentModal] = useState(false);
  const [editingResident, setEditingResident] = useState(null);
  const [viewingResident, setViewingResident] = useState(null);

  // Electricity Bill Modal
  const [showBillModal, setShowBillModal] = useState(false);

  // Room form states
  const [roomForm, setRoomForm] = useState({
    title: '',
    type: 'single',
    category: 'non-ac',
    price: '',
    description: '',
    facilities: '',
  });
  const [roomFiles, setRoomFiles] = useState([]);
  const [roomExistingImages, setRoomExistingImages] = useState([]);

  // Resident form state
  const [residentForm, setResidentForm] = useState({
    name: '',
    email: '',
    mobile: '',
    emergencyContact: '',
    guardianName: '',
    guardianMobile: '',
    idProofType: 'Aadhaar',
    idProofNumber: '',
    institutionOrCompany: '',
    permanentAddress: '',
    room: '',
    bedNumber: 'Bed 1',
    checkInDate: new Date().toISOString().split('T')[0],
    monthlyRent: '',
    rentDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    rentStatus: 'Pending',
    notes: '',
  });

  // Electricity Bill form state
  const [billForm, setBillForm] = useState({
    resident: '',
    month: `${new Date().toLocaleString('en-US', { month: 'long' })} ${new Date().getFullYear()}`,
    previousReading: 0,
    currentReading: 0,
    unitsConsumed: 0,
    ratePerUnit: 10,
    amount: 0,
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Unpaid',
    notes: '',
  });

  // Gallery upload states
  const [galleryCategory, setGalleryCategory] = useState('building');
  const [galleryCaption, setGalleryCaption] = useState('');
  const [galleryFile, setGalleryFile] = useState(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    heroTitle: '',
    heroSubtitle: '',
    aboutText: '',
    contactPhone: '',
    contactEmail: '',
    contactAddress: '',
    whatsappNumber: '',
    googleMapEmbedUrl: '',
    googleMapDirectionsUrl: '',
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // 1. Rooms
      const roomsRes = await api.get('/rooms');
      if (roomsRes.data.success) setRooms(roomsRes.data.rooms);

      // 2. Bookings
      const bookingsRes = await api.get('/bookings');
      if (bookingsRes.data.success) setBookings(bookingsRes.data.bookings);

      // 3. Enquiries
      const enquiriesRes = await api.get('/enquiries');
      if (enquiriesRes.data.success) setEnquiries(enquiriesRes.data.enquiries);

      // 4. Gallery
      const galleryRes = await api.get('/gallery');
      if (galleryRes.data.success) setGallery(galleryRes.data.images);

      // 5. Testimonials
      const testimonialsRes = await api.get('/testimonials?all=true');
      if (testimonialsRes.data.success) setTestimonials(testimonialsRes.data.testimonials);

      // 6. Homepage Content
      const contentRes = await api.get('/content');
      if (contentRes.data.success) {
        setContent(contentRes.data.content);
        setSettingsForm({
          heroTitle: contentRes.data.content.heroTitle || '',
          heroSubtitle: contentRes.data.content.heroSubtitle || '',
          aboutText: contentRes.data.content.aboutText || '',
          contactPhone: contentRes.data.content.contactPhone || '',
          contactEmail: contentRes.data.content.contactEmail || '',
          contactAddress: contentRes.data.content.contactAddress || '',
          whatsappNumber: contentRes.data.content.whatsappNumber || '',
          googleMapEmbedUrl: contentRes.data.content.googleMapEmbedUrl || '',
          googleMapDirectionsUrl: contentRes.data.content.googleMapDirectionsUrl || '',
        });
      }

      // 7. Living Students (Residents)
      const residentsRes = await api.get('/residents');
      if (residentsRes.data.success) setResidents(residentsRes.data.residents);

      // 8. Electricity Bills
      const billsRes = await api.get('/electricity-bills');
      if (billsRes.data.success) setElectricityBills(billsRes.data.bills);

    } catch (err) {
      console.error('Dashboard Fetch Error:', err.message);
      setErrorMsg('Failed to load dashboard parameters. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
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

  // ================= RESIDENT HANDLERS =================

  const openAddResident = () => {
    setEditingResident(null);
    setResidentForm({
      name: '',
      email: '',
      mobile: '',
      emergencyContact: '',
      guardianName: '',
      guardianMobile: '',
      idProofType: 'Aadhaar',
      idProofNumber: '',
      institutionOrCompany: '',
      permanentAddress: '',
      room: rooms.length > 0 ? rooms[0]._id : '',
      bedNumber: 'Bed 1',
      checkInDate: new Date().toISOString().split('T')[0],
      monthlyRent: rooms.length > 0 ? rooms[0].price : 8000,
      rentDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      rentStatus: 'Pending',
      notes: '',
    });
    setShowResidentModal(true);
  };

  const openEditResident = (res) => {
    setEditingResident(res);
    setResidentForm({
      name: res.name || '',
      email: res.email || '',
      mobile: res.mobile || '',
      emergencyContact: res.emergencyContact || '',
      guardianName: res.guardianName || '',
      guardianMobile: res.guardianMobile || '',
      idProofType: res.idProofType || 'Aadhaar',
      idProofNumber: res.idProofNumber || '',
      institutionOrCompany: res.institutionOrCompany || '',
      permanentAddress: res.permanentAddress || '',
      room: res.room ? res.room._id : (rooms[0]?._id || ''),
      bedNumber: res.bedNumber || 'Bed 1',
      checkInDate: res.checkInDate ? new Date(res.checkInDate).toISOString().split('T')[0] : '',
      monthlyRent: res.monthlyRent || '',
      rentDueDate: res.rentDueDate ? new Date(res.rentDueDate).toISOString().split('T')[0] : '',
      rentStatus: res.rentStatus || 'Pending',
      notes: res.notes || '',
    });
    setShowResidentModal(true);
  };

  const handleResidentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let res;
      if (editingResident) {
        res = await api.put(`/residents/${editingResident._id}`, residentForm);
      } else {
        res = await api.post('/residents', residentForm);
      }

      if (res.data.success) {
        triggerToast(editingResident ? 'Resident background & rent details updated!' : 'New resident added to PG successfully!');
        setShowResidentModal(false);
        const refreshRes = await api.get('/residents');
        if (refreshRes.data.success) setResidents(refreshRes.data.residents);
      }
    } catch (err) {
      console.error(err);
      triggerToast(err.response?.data?.message || 'Error processing resident profile.', true);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleRentStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Paid' ? 'Pending' : currentStatus === 'Pending' ? 'Overdue' : 'Paid';
    try {
      const res = await api.put(`/residents/${id}`, { rentStatus: nextStatus });
      if (res.data.success) {
        setResidents(residents.map(r => r._id === id ? { ...r, rentStatus: nextStatus } : r));
        triggerToast(`Resident rent status marked as ${nextStatus}!`);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error updating rent status.', true);
    }
  };

  const handleDeleteResident = async (id) => {
    if (!window.confirm('Are you sure you want to remove this resident from current living records?')) return;
    try {
      const res = await api.delete(`/residents/${id}`);
      if (res.data.success) {
        setResidents(residents.filter(r => r._id !== id));
        triggerToast('Resident record removed.');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Failed to delete resident record.', true);
    }
  };

  // ================= ELECTRICITY BILL HANDLERS =================

  const openAddBill = (preselectedResidentId = '') => {
    const defaultRes = residents.find(r => r._id === preselectedResidentId) || residents[0];
    const initialPrev = 1200;
    const initialCurr = 1350;
    const initialUnits = initialCurr - initialPrev;
    const initialRate = 10;
    
    setBillForm({
      resident: defaultRes ? defaultRes._id : '',
      month: `${new Date().toLocaleString('en-US', { month: 'long' })} ${new Date().getFullYear()}`,
      previousReading: initialPrev,
      currentReading: initialCurr,
      unitsConsumed: initialUnits,
      ratePerUnit: initialRate,
      amount: initialUnits * initialRate,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Unpaid',
      notes: '',
    });
    setShowBillModal(true);
  };

  const handleBillReadingsChange = (prev, curr, rate) => {
    const p = Number(prev) || 0;
    const c = Number(curr) || 0;
    const r = Number(rate) || 10;
    const units = c >= p ? c - p : 0;
    const tot = units * r;
    
    setBillForm(prevForm => ({
      ...prevForm,
      previousReading: p,
      currentReading: c,
      unitsConsumed: units,
      ratePerUnit: r,
      amount: tot,
    }));
  };

  const handleBillSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/electricity-bills', billForm);
      if (res.data.success) {
        triggerToast('Monthly electricity bill generated and published onsite for student!');
        setShowBillModal(false);
        const refreshBills = await api.get('/electricity-bills');
        if (refreshBills.data.success) setElectricityBills(refreshBills.data.bills);
      }
    } catch (err) {
      console.error(err);
      triggerToast(err.response?.data?.message || 'Error generating bill.', true);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleBillStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Paid' ? 'Unpaid' : 'Paid';
    try {
      const res = await api.put(`/electricity-bills/${id}`, { status: nextStatus });
      if (res.data.success) {
        setElectricityBills(electricityBills.map(b => b._id === id ? { ...b, status: nextStatus } : b));
        triggerToast(`Electricity bill marked as ${nextStatus}!`);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Failed to toggle bill status.', true);
    }
  };

  const handleDeleteBill = async (id) => {
    if (!window.confirm('Delete this electricity bill record?')) return;
    try {
      const res = await api.delete(`/electricity-bills/${id}`);
      if (res.data.success) {
        setElectricityBills(electricityBills.filter(b => b._id !== id));
        triggerToast('Electricity bill record deleted.');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error deleting bill record.', true);
    }
  };

  // ================= ROOM CRUD HANDLERS =================

  const openAddRoom = () => {
    setEditingRoom(null);
    setRoomForm({
      title: '',
      type: 'single',
      category: 'non-ac',
      price: '',
      description: '',
      facilities: 'Study Table, Chair, Bed, Mattress, Pillow, Bedsheet, Cupboard, Cooler, Attached Washroom',
    });
    setRoomFiles([]);
    setRoomExistingImages([]);
    setShowRoomModal(true);
  };

  const openEditRoom = (room) => {
    setEditingRoom(room);
    setRoomForm({
      title: room.title,
      type: room.type,
      category: room.category,
      price: room.price.toString(),
      description: room.description || '',
      facilities: room.facilities.join(', '),
    });
    setRoomFiles([]);
    setRoomExistingImages(room.images || []);
    setShowRoomModal(true);
  };

  const handleRoomFileChange = (e) => {
    setRoomFiles(Array.from(e.target.files));
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', roomForm.title);
    formData.append('type', roomForm.type);
    formData.append('category', roomForm.category);
    formData.append('price', roomForm.price);
    formData.append('description', roomForm.description);
    
    const facArray = roomForm.facilities.split(',').map(f => f.trim()).filter(Boolean);
    facArray.forEach(fac => formData.append('facilities', fac));

    if (editingRoom) {
      formData.append('existingImages', JSON.stringify(roomExistingImages));
    }

    roomFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      let res;
      if (editingRoom) {
        res = await api.put(`/rooms/${editingRoom._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await api.post('/rooms', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.data.success) {
        triggerToast(editingRoom ? 'Room updated successfully!' : 'New room added successfully!');
        setShowRoomModal(false);
        const roomsRes = await api.get('/rooms');
        if (roomsRes.data.success) setRooms(roomsRes.data.rooms);
      }
    } catch (err) {
      console.error(err);
      triggerToast(err.response?.data?.message || 'Error processing room upload.', true);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAvailability = async (id, currentVal) => {
    const newVal = currentVal === 'Available' ? 'Occupied' : 'Available';
    try {
      const res = await api.put(`/rooms/${id}/availability`, { availability: newVal });
      if (res.data.success) {
        setRooms(rooms.map(r => r._id === id ? { ...r, availability: newVal } : r));
        triggerToast(`Room status updated to ${newVal}!`);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Failed to toggle availability.', true);
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room and all its images?')) return;
    try {
      const res = await api.delete(`/rooms/${id}`);
      if (res.data.success) {
        setRooms(rooms.filter(r => r._id !== id));
        triggerToast('Room deleted successfully.');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error deleting room.', true);
    }
  };

  // ================= BOOKING OPERATION HANDLERS =================

  const updateBookingStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/bookings/${id}`, { status: newStatus });
      if (res.data.success) {
        setBookings(bookings.map(b => b._id === id ? { ...b, status: newStatus } : b));
        triggerToast(`Booking request marked as ${newStatus}!`);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error updating booking.', true);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Delete this booking record?')) return;
    try {
      const res = await api.delete(`/bookings/${id}`);
      if (res.data.success) {
        setBookings(bookings.filter(b => b._id !== id));
        triggerToast('Booking record deleted.');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error deleting booking.', true);
    }
  };

  // ================= ENQUIRY OPERATION HANDLERS =================

  const updateEnquiryStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/enquiries/${id}`, { status: newStatus });
      if (res.data.success) {
        setEnquiries(enquiries.map(e => e._id === id ? { ...e, status: newStatus } : e));
        triggerToast(`Enquiry marked as ${newStatus}.`);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error updating enquiry.', true);
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Delete this enquiry record?')) return;
    try {
      const res = await api.delete(`/enquiries/${id}`);
      if (res.data.success) {
        setEnquiries(enquiries.filter(e => e._id !== id));
        triggerToast('Enquiry record deleted.');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error deleting enquiry.', true);
    }
  };

  // ================= GALLERY & SETTINGS HANDLERS =================

  const handleGalleryUpload = async (e) => {
    e.preventDefault();
    if (!galleryFile) {
      triggerToast('Please choose an image to upload.', true);
      return;
    }
    setSubmitting(true);

    const formData = new FormData();
    formData.append('category', galleryCategory);
    formData.append('caption', galleryCaption);
    formData.append('image', galleryFile);

    try {
      const res = await api.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        triggerToast('Image uploaded to gallery successfully!');
        setGalleryCaption('');
        setGalleryFile(null);
        const fileInput = document.getElementById('gallery-file-field');
        if (fileInput) fileInput.value = '';
        
        const galleryRes = await api.get('/gallery');
        if (galleryRes.data.success) setGallery(galleryRes.data.images);
      }
    } catch (err) {
      console.error(err);
      triggerToast(err.response?.data?.message || 'Error uploading image.', true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    try {
      const res = await api.delete(`/gallery/${id}`);
      if (res.data.success) {
        setGallery(gallery.filter(g => g._id !== id));
        triggerToast('Gallery image deleted.');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error deleting photo.', true);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.put('/content', settingsForm);
      if (res.data.success) {
        triggerToast('Homepage content saved successfully!');
        setContent(res.data.content);
      }
    } catch (err) {
      console.error(err);
      triggerToast('Failed to save settings.', true);
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered Lists
  const filteredResidents = residents.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(residentSearch.toLowerCase()) || 
                          r.email.toLowerCase().includes(residentSearch.toLowerCase()) ||
                          r.mobile.includes(residentSearch);
    const matchesFilter = residentFilter === 'all' || r.rentStatus.toLowerCase() === residentFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const filteredBills = electricityBills.filter(b => {
    const residentName = b.resident?.name || '';
    const matchesSearch = residentName.toLowerCase().includes(billSearch.toLowerCase()) ||
                          b.month.toLowerCase().includes(billSearch.toLowerCase());
    const matchesFilter = billFilter === 'all' || b.status.toLowerCase() === billFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const filteredEnquiries = enquiries.filter(e => 
    e.name.toLowerCase().includes(enquirySearch.toLowerCase()) ||
    e.email.toLowerCase().includes(enquirySearch.toLowerCase()) ||
    e.mobile.includes(enquirySearch)
  );

  // Render loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg text-slate-100 relative">
        <Navbar isDashboard={true} />
        <div className="pt-28 pb-16 max-w-7xl mx-auto px-4 text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-400">Loading admin control portal...</p>
        </div>
      </div>
    );
  }

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

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
              <span>Admin Control Panel</span>
              <span className="text-xs py-1 px-2.5 bg-accent/20 text-accent font-extrabold rounded-lg uppercase tracking-wider">Pro Edition</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1">Logged in as {admin?.name || 'Administrator'} ({admin?.email})</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-200 border border-slate-700 hover:border-rose-900 rounded-xl text-xs font-bold transition duration-200"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Grid Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Navigation Tabs */}
          <div className="lg:col-span-3 glass-card p-4 rounded-[20px] border border-slate-800 space-y-1.5">
            {[
              { id: 'residents', name: 'Living Students', count: residents.length, icon: Users },
              { id: 'electricity', name: 'Electricity Bills', count: electricityBills.length, icon: Zap },
              { id: 'rooms', name: 'Room Inventory', count: rooms.length, icon: HomeIcon },
              { id: 'bookings', name: 'Bookings', count: bookings.length, icon: Calendar },
              { id: 'enquiries', name: 'Enquiries', count: enquiries.length, icon: MessageSquare },
              { id: 'gallery', name: 'Gallery Manager', count: gallery.length, icon: ImageIcon },
              { id: 'testimonials', name: 'Reviews', count: testimonials.length, icon: Star },
              { id: 'settings', name: 'Site Config', count: null, icon: Settings }
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

          {/* Right Column: Viewport */}
          <div className="lg:col-span-9 space-y-6">

            {/* ================= TAB: LIVING STUDENTS (RESIDENTS) ================= */}
            {activeTab === 'residents' && (
              <div className="space-y-6">
                
                {/* Stats Summary Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="glass-card p-4 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Total Residents</span>
                    <p className="text-2xl font-black text-white mt-1">{residents.length}</p>
                  </div>
                  <div className="glass-card p-4 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">Rent Paid</span>
                    <p className="text-2xl font-black text-emerald-400 mt-1">
                      {residents.filter(r => r.rentStatus === 'Paid').length}
                    </p>
                  </div>
                  <div className="glass-card p-4 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">Rent Pending</span>
                    <p className="text-2xl font-black text-amber-400 mt-1">
                      {residents.filter(r => r.rentStatus === 'Pending' || r.rentStatus === 'Overdue').length}
                    </p>
                  </div>
                  <div className="glass-card p-4 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-accent font-bold uppercase">Monthly Revenue</span>
                    <p className="text-2xl font-black text-accent mt-1">
                      {formatCurrency(residents.reduce((acc, r) => acc + (r.monthlyRent || 0), 0))}
                    </p>
                  </div>
                </div>

                {/* Top Action & Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-2 grow max-w-md">
                    <div className="relative grow">
                      <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search resident name, email, mobile..."
                        value={residentSearch}
                        onChange={(e) => setResidentSearch(e.target.value)}
                        className="glass-input pl-9 pr-4 py-2.5 rounded-xl text-xs w-full"
                      />
                    </div>
                    <select
                      value={residentFilter}
                      onChange={(e) => setResidentFilter(e.target.value)}
                      className="glass-input px-3 py-2.5 rounded-xl text-xs bg-slate-900 text-slate-300"
                    >
                      <option value="all">All Status</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>

                  <button 
                    onClick={openAddResident}
                    className="flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-bold shadow-glow-orange shrink-0 transition"
                  >
                    <Plus size={14} />
                    <span>Add Living Student</span>
                  </button>
                </div>

                {/* Residents Table */}
                <div className="glass-card rounded-[22px] overflow-hidden border border-slate-800/80 shadow-md">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs text-slate-300">
                      <thead className="bg-slate-850/80 text-white font-extrabold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-4">Student & Contact</th>
                          <th className="p-4">Assigned Room & Bed</th>
                          <th className="p-4">Background Info</th>
                          <th className="p-4">Monthly Rent</th>
                          <th className="p-4">Rent Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                        {filteredResidents.map((res) => (
                          <tr key={res._id} className="hover:bg-slate-800/20 transition">
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-white">{res.name}</span>
                                <span className="text-[10px] text-slate-400">{res.mobile}</span>
                                <span className="text-[10px] text-slate-500">{res.email}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-200">
                                  {res.room ? res.room.title : 'Unassigned Room'}
                                </span>
                                <span className="text-[10px] text-accent font-bold">
                                  {res.bedNumber || 'Bed 1'} • Joined {new Date(res.checkInDate).toLocaleDateString('en-IN')}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className="text-[11px] text-slate-300 font-medium">
                                  {res.institutionOrCompany || 'N/A'}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  ID: {res.idProofType} ({res.idProofNumber || 'N/A'})
                                </span>
                              </div>
                            </td>
                            <td className="p-4 font-bold text-white whitespace-nowrap">
                              {formatCurrency(res.monthlyRent)}/mo
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <button
                                onClick={() => toggleRentStatus(res._id, res.rentStatus)}
                                className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase transition border ${
                                  res.rentStatus === 'Paid'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                    : res.rentStatus === 'Overdue'
                                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
                                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                                }`}
                                title="Click to toggle status"
                              >
                                {res.rentStatus}
                              </button>
                            </td>
                            <td className="p-4 text-right whitespace-nowrap space-x-1.5">
                              <button
                                onClick={() => setViewingResident(res)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition"
                                title="View Background Details"
                              >
                                <Eye size={13} />
                              </button>
                              <button
                                onClick={() => openAddBill(res._id)}
                                className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-white border border-amber-500/20 transition"
                                title="Generate Electricity Bill"
                              >
                                <Zap size={13} />
                              </button>
                              <button
                                onClick={() => openEditResident(res)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition"
                                title="Edit Resident Info"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteResident(res._id)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-900 transition"
                                title="Remove Resident"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredResidents.length === 0 && (
                          <tr>
                            <td colSpan="6" className="p-8 text-center text-slate-500 text-xs">
                              No living students found matching search.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB: ELECTRICITY MONTHLY BILLS ================= */}
            {activeTab === 'electricity' && (
              <div className="space-y-6">
                
                {/* Stats Summary Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="glass-card p-4 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Total Bills Posted</span>
                    <p className="text-2xl font-black text-white mt-1">{electricityBills.length}</p>
                  </div>
                  <div className="glass-card p-4 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">Paid Electricity Bills</span>
                    <p className="text-2xl font-black text-emerald-400 mt-1">
                      {electricityBills.filter(b => b.status === 'Paid').length}
                    </p>
                  </div>
                  <div className="glass-card p-4 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">Unpaid Bills</span>
                    <p className="text-2xl font-black text-amber-400 mt-1">
                      {electricityBills.filter(b => b.status === 'Unpaid' || b.status === 'Overdue').length}
                    </p>
                  </div>
                  <div className="glass-card p-4 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-accent font-bold uppercase">Total Power Billing</span>
                    <p className="text-2xl font-black text-accent mt-1">
                      {formatCurrency(electricityBills.reduce((acc, b) => acc + (b.amount || 0), 0))}
                    </p>
                  </div>
                </div>

                {/* Search & Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-2 grow max-w-md">
                    <div className="relative grow">
                      <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search student or billing month..."
                        value={billSearch}
                        onChange={(e) => setBillSearch(e.target.value)}
                        className="glass-input pl-9 pr-4 py-2.5 rounded-xl text-xs w-full"
                      />
                    </div>
                    <select
                      value={billFilter}
                      onChange={(e) => setBillFilter(e.target.value)}
                      className="glass-input px-3 py-2.5 rounded-xl text-xs bg-slate-900 text-slate-300"
                    >
                      <option value="all">All Bills</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>

                  <button 
                    onClick={() => openAddBill()}
                    className="flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-bold shadow-glow-orange shrink-0 transition"
                  >
                    <Plus size={14} />
                    <span>Create Electricity Bill</span>
                  </button>
                </div>

                {/* Bills Table */}
                <div className="glass-card rounded-[22px] overflow-hidden border border-slate-800/80 shadow-md">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs text-slate-300">
                      <thead className="bg-slate-850/80 text-white font-extrabold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-4">Resident & Room</th>
                          <th className="p-4">Month</th>
                          <th className="p-4">Meter Readings</th>
                          <th className="p-4">Units Consumed</th>
                          <th className="p-4">Bill Amount</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                        {filteredBills.map((b) => (
                          <tr key={b._id} className="hover:bg-slate-800/20 transition">
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-white">{b.resident?.name || 'Resident Deleted'}</span>
                                <span className="text-[10px] text-slate-400">{b.room?.title || 'Room N/A'}</span>
                              </div>
                            </td>
                            <td className="p-4 font-semibold text-slate-200">{b.month}</td>
                            <td className="p-4 text-[11px] text-slate-400">
                              {b.previousReading} &rarr; {b.currentReading}
                            </td>
                            <td className="p-4 font-bold text-amber-400">
                              {b.unitsConsumed} Units @ ₹{b.ratePerUnit}/unit
                            </td>
                            <td className="p-4 font-black text-white whitespace-nowrap">
                              {formatCurrency(b.amount)}
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <button
                                onClick={() => toggleBillStatus(b._id, b.status)}
                                className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase transition border ${
                                  b.status === 'Paid'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
                                }`}
                                title="Click to toggle status"
                              >
                                {b.status}
                              </button>
                            </td>
                            <td className="p-4 text-right whitespace-nowrap">
                              <button
                                onClick={() => handleDeleteBill(b._id)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-900 transition"
                                title="Delete Record"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredBills.length === 0 && (
                          <tr>
                            <td colSpan="7" className="p-8 text-center text-slate-500 text-xs">
                              No electricity bills generated yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB: ROOMS ================= */}
            {activeTab === 'rooms' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-white">Room Inventory Listing</h3>
                  <button 
                    onClick={openAddRoom}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-bold transition shadow-glow-orange"
                  >
                    <Plus size={14} />
                    <span>Add New Room</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rooms.map(room => (
                    <div key={room._id} className="glass-card rounded-[22px] overflow-hidden border border-slate-850 p-5 flex space-x-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-slate-800 border border-slate-700">
                        <img
                          src={room.images && room.images.length > 0 ? getImageUrl(room.images[0]) : ''}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex flex-col justify-between grow">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold uppercase">
                              {room.type} sharing
                            </span>
                            <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase ${room.category === 'ac' ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-slate-800 text-slate-400'}`}>
                              {room.category}
                            </span>
                          </div>
                          <h4 className="text-white font-extrabold text-sm mt-1.5 line-clamp-1">{room.title}</h4>
                          <p className="text-accent font-extrabold text-xs mt-1">{formatCurrency(room.price)}/mo</p>
                        </div>

                        <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-850">
                          <button
                            onClick={() => toggleAvailability(room._id, room.availability)}
                            className={`px-3 py-1 rounded-lg text-[9px] font-extrabold uppercase transition ${
                              room.availability === 'Available'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                            }`}
                          >
                            {room.availability}
                          </button>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openEditRoom(room)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition"
                              title="Edit Room"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room._id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-900 transition"
                              title="Delete Room"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB: BOOKINGS ================= */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-extrabold text-white">Resident Booking Requests</h3>
                
                <div className="glass-card rounded-[22px] overflow-hidden border border-slate-800/80 shadow-md">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs text-slate-300">
                      <thead className="bg-slate-850/80 text-white font-extrabold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Contact</th>
                          <th className="p-4">Desired Room</th>
                          <th className="p-4">Check-In</th>
                          <th className="p-4">Duration</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                        {bookings.map((booking) => (
                          <tr key={booking._id} className="hover:bg-slate-800/20 transition">
                            <td className="p-4 font-bold text-white whitespace-nowrap">{booking.name}</td>
                            <td className="p-4">
                              <div className="flex flex-col">
                                <a href={`tel:${booking.mobile}`} className="hover:text-accent font-medium">{booking.mobile}</a>
                                <span className="text-[10px] text-slate-500">{booking.email}</span>
                              </div>
                            </td>
                            <td className="p-4 font-semibold text-slate-200">
                              {booking.preferredRoom ? booking.preferredRoom.title : 'Invalid Room'}
                            </td>
                            <td className="p-4 whitespace-nowrap">{new Date(booking.checkInDate).toLocaleDateString('en-IN')}</td>
                            <td className="p-4">{booking.duration} Mo.</td>
                            <td className="p-4 whitespace-nowrap">
                              <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                                booking.status === 'Approved' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : booking.status === 'Rejected'
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="p-4 text-right whitespace-nowrap space-x-1.5">
                              {booking.status === 'Pending' && (
                                <>
                                  <button
                                    onClick={() => updateBookingStatus(booking._id, 'Approved')}
                                    className="p-1 rounded bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 transition"
                                    title="Approve Booking"
                                  >
                                    <Check size={12} />
                                  </button>
                                  <button
                                    onClick={() => updateBookingStatus(booking._id, 'Rejected')}
                                    className="p-1 rounded bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 transition"
                                    title="Reject Booking"
                                  >
                                    <X size={12} />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDeleteBooking(booking._id)}
                                className="p-1 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-900 transition"
                                title="Delete Record"
                              >
                                <Trash2 size={12} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB: ENQUIRIES ================= */}
            {activeTab === 'enquiries' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h3 className="text-lg font-extrabold text-white">General Enquiries</h3>
                  <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search enquiries..."
                      value={enquirySearch}
                      onChange={(e) => setEnquirySearch(e.target.value)}
                      className="glass-input pl-9 pr-4 py-2 rounded-xl text-xs w-full"
                    />
                  </div>
                </div>

                <div className="glass-card rounded-[22px] overflow-hidden border border-slate-800/80 shadow-md">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs text-slate-300">
                      <thead className="bg-slate-850/80 text-white font-extrabold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-4">User</th>
                          <th className="p-4">Contact</th>
                          <th className="p-4">Preferred Type</th>
                          <th className="p-4">Message</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                        {filteredEnquiries.map((enquiry) => (
                          <tr key={enquiry._id} className="hover:bg-slate-800/20 transition">
                            <td className="p-4 font-bold text-white whitespace-nowrap">{enquiry.name}</td>
                            <td className="p-4">
                              <div className="flex flex-col">
                                <a href={`tel:${enquiry.mobile}`} className="hover:text-accent font-medium">{enquiry.mobile}</a>
                                <span className="text-[10px] text-slate-500">{enquiry.email}</span>
                              </div>
                            </td>
                            <td className="p-4 font-bold capitalize text-slate-200">{enquiry.roomType}</td>
                            <td className="p-4 max-w-xs truncate" title={enquiry.message}>{enquiry.message}</td>
                            <td className="p-4 whitespace-nowrap">
                              <select
                                value={enquiry.status}
                                onChange={(e) => updateEnquiryStatus(enquiry._id, e.target.value)}
                                className="bg-slate-900 border border-slate-800 text-[10px] font-bold rounded p-1 text-slate-200 cursor-pointer"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Resolved">Resolved</option>
                              </select>
                            </td>
                            <td className="p-4 text-right whitespace-nowrap">
                              <button
                                onClick={() => handleDeleteEnquiry(enquiry._id)}
                                className="p-1 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-900 transition"
                                title="Delete Record"
                              >
                                <Trash2 size={12} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB: GALLERY ================= */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="glass-card p-6 rounded-[22px] border border-slate-800/85">
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4">Upload Gallery Image</h3>
                  <form onSubmit={handleGalleryUpload} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Category</label>
                      <select
                        value={galleryCategory}
                        onChange={(e) => setGalleryCategory(e.target.value)}
                        className="glass-input px-3.5 py-2.5 rounded-xl text-xs appearance-none bg-slate-900 cursor-pointer"
                      >
                        <option value="building">Building</option>
                        <option value="rooms">Rooms</option>
                        <option value="ac">AC Rooms</option>
                        <option value="washroom">Washroom</option>
                        <option value="study">Study Area</option>
                        <option value="dining">Dining Area</option>
                        <option value="food">Food</option>
                        <option value="entrance">Entrance</option>
                      </select>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Caption</label>
                      <input
                        type="text"
                        value={galleryCaption}
                        onChange={(e) => setGalleryCaption(e.target.value)}
                        placeholder="e.g. Spacious dining hall layout"
                        className="glass-input px-3.5 py-2.5 rounded-xl text-xs"
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Image File</label>
                      <input
                        type="file"
                        id="gallery-file-field"
                        onChange={(e) => setGalleryFile(e.target.files[0])}
                        className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-slate-200 file:cursor-pointer w-full"
                        required
                      />
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ================= TAB: REVIEWS ================= */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6">
                <h3 className="text-lg font-extrabold text-white">Student & Parent Reviews</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonials.map((test) => (
                    <div key={test._id} className="glass-card p-5 rounded-2xl border border-slate-800 flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-sm">{test.name}</h4>
                        <div className="flex items-center space-x-1 my-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} className={i < test.rating ? "text-amber-400 fill-amber-400" : "text-slate-600"} />
                          ))}
                        </div>
                        <p className="text-slate-300 text-xs mt-2 italic font-serif">"{test.review}"</p>
                      </div>
                      <button
                        onClick={() => handleDeleteReview(test._id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB: SETTINGS ================= */}
            {activeTab === 'settings' && (
              <div className="glass-card p-6 rounded-[22px] border border-slate-800">
                <h3 className="text-lg font-extrabold text-white mb-6">Website Configuration</h3>
                <form onSubmit={handleSettingsSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300">Hero Main Title</label>
                    <input
                      type="text"
                      value={settingsForm.heroTitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                      className="glass-input p-3 rounded-xl text-xs w-full mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300">Contact Address</label>
                    <input
                      type="text"
                      value={settingsForm.contactAddress}
                      onChange={(e) => setSettingsForm({ ...settingsForm, contactAddress: e.target.value })}
                      className="glass-input p-3 rounded-xl text-xs w-full mt-1"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl text-xs shadow-glow-orange"
                  >
                    Save Settings
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ================= ADD / EDIT RESIDENT MODAL ================= */}
      {showResidentModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card p-6 rounded-[24px] border border-slate-800 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-base font-extrabold text-white">
                {editingResident ? 'Edit Resident Profile & Rent' : 'Add New Living Student (Resident)'}
              </h3>
              <button 
                onClick={() => setShowResidentModal(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleResidentSubmit} className="space-y-4">
              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Full Name *</label>
                  <input
                    type="text"
                    value={residentForm.name}
                    onChange={(e) => setResidentForm({ ...residentForm, name: e.target.value })}
                    className="glass-input px-3.5 py-2 rounded-xl text-xs w-full mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Mobile Number *</label>
                  <input
                    type="tel"
                    value={residentForm.mobile}
                    onChange={(e) => setResidentForm({ ...residentForm, mobile: e.target.value })}
                    className="glass-input px-3.5 py-2 rounded-xl text-xs w-full mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Email Address *</label>
                  <input
                    type="email"
                    value={residentForm.email}
                    onChange={(e) => setResidentForm({ ...residentForm, email: e.target.value })}
                    className="glass-input px-3.5 py-2 rounded-xl text-xs w-full mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Emergency Contact</label>
                  <input
                    type="tel"
                    value={residentForm.emergencyContact}
                    onChange={(e) => setResidentForm({ ...residentForm, emergencyContact: e.target.value })}
                    className="glass-input px-3.5 py-2 rounded-xl text-xs w-full mt-1"
                  />
                </div>
              </div>

              {/* Guardian Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Father / Guardian Name</label>
                  <input
                    type="text"
                    value={residentForm.guardianName}
                    onChange={(e) => setResidentForm({ ...residentForm, guardianName: e.target.value })}
                    className="glass-input px-3.5 py-2 rounded-xl text-xs w-full mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Guardian Mobile</label>
                  <input
                    type="tel"
                    value={residentForm.guardianMobile}
                    onChange={(e) => setResidentForm({ ...residentForm, guardianMobile: e.target.value })}
                    className="glass-input px-3.5 py-2 rounded-xl text-xs w-full mt-1"
                  />
                </div>
              </div>

              {/* ID Proof & Institution */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">ID Proof Type</label>
                  <select
                    value={residentForm.idProofType}
                    onChange={(e) => setResidentForm({ ...residentForm, idProofType: e.target.value })}
                    className="glass-input px-3 py-2 rounded-xl text-xs w-full mt-1 bg-slate-900"
                  >
                    <option value="Aadhaar">Aadhaar Card</option>
                    <option value="Passport">Passport</option>
                    <option value="PAN">PAN Card</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Student ID">Student ID</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">ID Proof Number</label>
                  <input
                    type="text"
                    value={residentForm.idProofNumber}
                    onChange={(e) => setResidentForm({ ...residentForm, idProofNumber: e.target.value })}
                    className="glass-input px-3.5 py-2 rounded-xl text-xs w-full mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">College / Workplace</label>
                  <input
                    type="text"
                    value={residentForm.institutionOrCompany}
                    onChange={(e) => setResidentForm({ ...residentForm, institutionOrCompany: e.target.value })}
                    placeholder="e.g. JNU / Infosys"
                    className="glass-input px-3.5 py-2 rounded-xl text-xs w-full mt-1"
                  />
                </div>
              </div>

              {/* Room & Rent Allocation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800 pt-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Assign Room *</label>
                  <select
                    value={residentForm.room}
                    onChange={(e) => {
                      const selectedRm = rooms.find(r => r._id === e.target.value);
                      setResidentForm({
                        ...residentForm,
                        room: e.target.value,
                        monthlyRent: selectedRm ? selectedRm.price : residentForm.monthlyRent
                      });
                    }}
                    className="glass-input px-3 py-2 rounded-xl text-xs w-full mt-1 bg-slate-900"
                    required
                  >
                    {rooms.map(r => (
                      <option key={r._id} value={r._id}>
                        {r.title} ({formatCurrency(r.price)}/mo)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Bed / Spot</label>
                  <input
                    type="text"
                    value={residentForm.bedNumber}
                    onChange={(e) => setResidentForm({ ...residentForm, bedNumber: e.target.value })}
                    placeholder="e.g. Bed 1"
                    className="glass-input px-3.5 py-2 rounded-xl text-xs w-full mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Monthly Rent (₹) *</label>
                  <input
                    type="number"
                    value={residentForm.monthlyRent}
                    onChange={(e) => setResidentForm({ ...residentForm, monthlyRent: e.target.value })}
                    className="glass-input px-3.5 py-2 rounded-xl text-xs w-full mt-1"
                    required
                  />
                </div>
              </div>

              {/* Dates & Rent Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Check-In Date</label>
                  <input
                    type="date"
                    value={residentForm.checkInDate}
                    onChange={(e) => setResidentForm({ ...residentForm, checkInDate: e.target.value })}
                    className="glass-input px-3.5 py-2 rounded-xl text-xs w-full mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Rent Due Date</label>
                  <input
                    type="date"
                    value={residentForm.rentDueDate}
                    onChange={(e) => setResidentForm({ ...residentForm, rentDueDate: e.target.value })}
                    className="glass-input px-3.5 py-2 rounded-xl text-xs w-full mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Rent Payment Status</label>
                  <select
                    value={residentForm.rentStatus}
                    onChange={(e) => setResidentForm({ ...residentForm, rentStatus: e.target.value })}
                    className="glass-input px-3 py-2 rounded-xl text-xs w-full mt-1 bg-slate-900"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase">Permanent Address</label>
                <textarea
                  rows="2"
                  value={residentForm.permanentAddress}
                  onChange={(e) => setResidentForm({ ...residentForm, permanentAddress: e.target.value })}
                  placeholder="Full hometown home address..."
                  className="glass-input px-3.5 py-2 rounded-xl text-xs w-full mt-1"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowResidentModal(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-bold shadow-glow-orange"
                >
                  {submitting ? 'Saving...' : editingResident ? 'Update Resident' : 'Save Resident'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= VIEW RESIDENT BACKGROUND DETAILS MODAL ================= */}
      {viewingResident && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card p-6 rounded-[24px] border border-slate-800 max-w-lg w-full relative">
            <button
              onClick={() => setViewingResident(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>

            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                <UserCheck size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{viewingResident.name}</h3>
                <p className="text-xs text-slate-400">Room: {viewingResident.room?.title || 'N/A'} ({viewingResident.bedNumber})</p>
              </div>
            </div>

            <div className="space-y-3 text-xs divide-y divide-slate-850">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400 font-bold uppercase">Mobile Number:</span>
                <span className="text-white font-medium">{viewingResident.mobile}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400 font-bold uppercase">Emergency Contact:</span>
                <span className="text-white font-medium">{viewingResident.emergencyContact || 'Not specified'}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400 font-bold uppercase">Father / Guardian:</span>
                <span className="text-white font-medium">{viewingResident.guardianName || 'N/A'} ({viewingResident.guardianMobile || 'N/A'})</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400 font-bold uppercase">ID Verification:</span>
                <span className="text-accent font-bold">{viewingResident.idProofType} ({viewingResident.idProofNumber || 'Not provided'})</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400 font-bold uppercase">Institution / Workplace:</span>
                <span className="text-white font-medium">{viewingResident.institutionOrCompany || 'N/A'}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400 font-bold uppercase">Check-In Date:</span>
                <span className="text-white font-medium">{new Date(viewingResident.checkInDate).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400 font-bold uppercase">Monthly Rent:</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(viewingResident.monthlyRent)} ({viewingResident.rentStatus})</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-400 font-bold uppercase block mb-1">Permanent Home Address:</span>
                <p className="text-slate-200 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  {viewingResident.permanentAddress || 'No permanent address record uploaded.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ELECTRICITY BILL MODAL ================= */}
      {showBillModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card p-6 rounded-[24px] border border-slate-800 max-w-md w-full">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                <Zap className="text-accent" size={18} />
                <span>Create Monthly Electricity Bill</span>
              </h3>
              <button 
                onClick={() => setShowBillModal(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleBillSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase">Select Student Resident *</label>
                <select
                  value={billForm.resident}
                  onChange={(e) => setBillForm({ ...billForm, resident: e.target.value })}
                  className="glass-input px-3 py-2.5 rounded-xl text-xs w-full mt-1 bg-slate-900 text-white font-bold"
                  required
                >
                  <option value="">-- Choose Resident --</option>
                  {residents.map(r => (
                    <option key={r._id} value={r._id}>
                      {r.name} ({r.room ? r.room.title : 'No Room'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase">Billing Month & Year *</label>
                <input
                  type="text"
                  value={billForm.month}
                  onChange={(e) => setBillForm({ ...billForm, month: e.target.value })}
                  placeholder="e.g. October 2026"
                  className="glass-input px-3.5 py-2 rounded-xl text-xs w-full mt-1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Previous Reading</label>
                  <input
                    type="number"
                    value={billForm.previousReading}
                    onChange={(e) => handleBillReadingsChange(e.target.value, billForm.currentReading, billForm.ratePerUnit)}
                    className="glass-input px-3 py-2 rounded-xl text-xs w-full mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Current Reading</label>
                  <input
                    type="number"
                    value={billForm.currentReading}
                    onChange={(e) => handleBillReadingsChange(billForm.previousReading, e.target.value, billForm.ratePerUnit)}
                    className="glass-input px-3 py-2 rounded-xl text-xs w-full mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Units Consumed</label>
                  <input
                    type="number"
                    value={billForm.unitsConsumed}
                    onChange={(e) => setBillForm({ ...billForm, unitsConsumed: Number(e.target.value), amount: Number(e.target.value) * billForm.ratePerUnit })}
                    className="glass-input px-3 py-2 rounded-xl text-xs w-full mt-1 font-bold text-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Rate / Unit (₹)</label>
                  <input
                    type="number"
                    value={billForm.ratePerUnit}
                    onChange={(e) => handleBillReadingsChange(billForm.previousReading, billForm.currentReading, e.target.value)}
                    className="glass-input px-3 py-2 rounded-xl text-xs w-full mt-1"
                  />
                </div>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Total Calculated Bill:</span>
                <span className="text-lg font-black text-emerald-400">{formatCurrency(billForm.amount)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Payment Due Date *</label>
                  <input
                    type="date"
                    value={billForm.dueDate}
                    onChange={(e) => setBillForm({ ...billForm, dueDate: e.target.value })}
                    className="glass-input px-3 py-2 rounded-xl text-xs w-full mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Initial Status</label>
                  <select
                    value={billForm.status}
                    onChange={(e) => setBillForm({ ...billForm, status: e.target.value })}
                    className="glass-input px-3 py-2 rounded-xl text-xs w-full mt-1 bg-slate-900"
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBillModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-bold shadow-glow-orange"
                >
                  {submitting ? 'Posting...' : 'Post Bill Onsite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ROOM MODAL ================= */}
      {showRoomModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card p-6 rounded-[24px] border border-slate-800 max-w-lg w-full">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-base font-extrabold text-white">
                {editingRoom ? 'Edit Room Inventory' : 'Add New Room Listing'}
              </h3>
              <button 
                onClick={() => setShowRoomModal(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleRoomSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase">Room Title</label>
                <input
                  type="text"
                  value={roomForm.title}
                  onChange={(e) => setRoomForm({ ...roomForm, title: e.target.value })}
                  placeholder="e.g. Elite Single Seater Room (AC)"
                  className="glass-input px-3.5 py-2 rounded-xl text-xs w-full mt-1"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Sharing</label>
                  <select
                    value={roomForm.type}
                    onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                    className="glass-input px-3 py-2 rounded-xl text-xs w-full mt-1 bg-slate-900"
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="triple">Triple</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Category</label>
                  <select
                    value={roomForm.category}
                    onChange={(e) => setRoomForm({ ...roomForm, category: e.target.value })}
                    className="glass-input px-3 py-2 rounded-xl text-xs w-full mt-1 bg-slate-900"
                  >
                    <option value="ac">AC</option>
                    <option value="non-ac">Non-AC</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Rent / Mo (₹)</label>
                  <input
                    type="number"
                    value={roomForm.price}
                    onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })}
                    className="glass-input px-3.5 py-2 rounded-xl text-xs w-full mt-1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase">Facilities (Comma Separated)</label>
                <input
                  type="text"
                  value={roomForm.facilities}
                  onChange={(e) => setRoomForm({ ...roomForm, facilities: e.target.value })}
                  placeholder="Study Table, Bed, Air Cooler, Attached Washroom"
                  className="glass-input px-3.5 py-2 rounded-xl text-xs w-full mt-1"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase">Upload Room Photos</label>
                <input
                  type="file"
                  multiple
                  onChange={handleRoomFileChange}
                  className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-slate-200 file:cursor-pointer w-full mt-1"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-bold shadow-glow-orange"
                >
                  {submitting ? 'Uploading...' : editingRoom ? 'Update Room' : 'Save Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
