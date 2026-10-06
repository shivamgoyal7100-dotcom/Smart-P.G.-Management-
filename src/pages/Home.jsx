import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import RoomCard from '../components/RoomCard';
import Facilities from '../components/Facilities';
import FoodSection from '../components/FoodSection';
import GallerySection from '../components/GallerySection';
import Testimonials from '../components/Testimonials';
import EnquiryForm from '../components/EnquiryForm';
import BookingFormModal from '../components/BookingFormModal';
import Footer from '../components/Footer';

import api from '../services/api';
import { Phone, MessageSquare, MapPin, Mail, Navigation, Sparkles } from 'lucide-react';

const Home = () => {
  const [content, setContent] = useState({});
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  
  // Booking Modal State
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        // Fetch Homepage Configuration
        const contentRes = await api.get('/content');
        if (contentRes.data.success) {
          setContent(contentRes.data.content);
        }

        // Fetch Rooms List
        const roomsRes = await api.get('/rooms');
        if (roomsRes.data.success) {
          setRooms(roomsRes.data.rooms);
        }
      } catch (error) {
        console.error('Home Page loading error:', error.message);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchData();
  }, []);

  const handleBookClick = (room) => {
    setSelectedRoom(room);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setSelectedRoom(null);
    setIsBookingOpen(false);
  };

  const handleWhatsappRedirect = () => {
    const waNum = content.whatsappNumber || '919876543210';
    const msg = encodeURIComponent('Hi, I want to know about room availability.');
    window.open(`https://wa.me/${waNum}?text=${msg}`, '_blank');
  };

  // Filter AC and Non-AC Rooms to show them separately
  const acRooms = rooms.filter(room => room.category === 'ac');
  const nonAcRooms = rooms.filter(room => room.category === 'non-ac');

  const phone = content.contactPhone || '+91 98765 43210';
  const email = content.contactEmail || 'info@parihostel.com';
  const address = content.contactAddress || 'Near Pari Circle, JNU Hospital Road, Jagatpura, Jaipur';

  return (
    <div className="bg-darkBg min-h-screen text-slate-100 selection:bg-accent selection:text-white relative">
      
      {/* Navbar */}
      <Navbar />

      {/* Hero Banner Section */}
      <Hero content={content} onBookClick={() => {
        const target = document.querySelector('#rooms');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }} />

      {/* About Section */}
      <About content={content} />

      {/* Rooms Listing Section */}
      <section id="rooms" className="py-24 relative bg-darkBg border-t border-slate-800/40">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-80 h-80 bg-primary-950/10 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs text-accent font-extrabold uppercase tracking-widest mb-3">Lodgings</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              Choose Your Comfort Room sharing
            </p>
            <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full"></div>
          </div>

          {loadingRooms ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(idx => (
                <div key={idx} className="h-96 rounded-[24px] bg-slate-800 animate-pulse border border-slate-700"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-20">
              
              {/* Category 1: Standard Cooler Rooms */}
              {nonAcRooms.length > 0 && (
                <div>
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-2.5 h-6 bg-slate-500 rounded-full"></div>
                    <h3 className="text-2xl font-extrabold text-white font-sans">Standard Air Cooler Rooms</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {nonAcRooms.map(room => (
                      <RoomCard key={room._id} room={room} onBookClick={handleBookClick} />
                    ))}
                  </div>
                </div>
              )}

              {/* Category 2: Elite AC Rooms (Premium Styling) */}
              {acRooms.length > 0 && (
                <div className="relative pt-6">
                  {/* Premium overlay glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent/10 to-orange-500/5 rounded-3xl blur-xl opacity-30 pointer-events-none"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-3">
                        <div className="w-2.5 h-6 bg-accent rounded-full animate-pulse"></div>
                        <h3 className="text-2xl font-extrabold text-white font-sans">
                          Elite Air-Conditioned Rooms
                        </h3>
                      </div>
                      <span className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 bg-accent/15 border border-accent/30 text-accent rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                        <Sparkles size={10} />
                        <span>Premium Sector</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {acRooms.map(room => (
                        <RoomCard key={room._id} room={room} onBookClick={handleBookClick} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {rooms.length === 0 && (
                <div className="text-center py-16 glass-card rounded-[24px]">
                  <p className="text-slate-400">No rooms listed at this moment. Check back soon!</p>
                </div>
              )}

            </div>
          )}

        </div>
      </section>

      {/* Facilities Section */}
      <Facilities />

      {/* Food Mess Schedule */}
      <FoodSection />

      {/* Photo Gallery Tour */}
      <GallerySection />

      {/* Location Details and Contact Page Section */}
      <section id="location" className="py-24 relative bg-darkBg border-t border-slate-800/40">
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-950/5 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Map & Address info */}
            <div className="lg:col-span-6 flex flex-col space-y-6">
              <div>
                <h2 className="text-xs text-accent font-extrabold uppercase tracking-widest mb-3">Our Location</h2>
                <h3 className="text-3xl font-extrabold text-white font-sans tracking-tight">
                  Reach Us Easily
                </h3>
                <div className="w-12 h-1 bg-accent mt-3 rounded-full"></div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                The PG is located right on the main JNU Hospital Road in Jagatpura, Jaipur. Its strategic position offers easy access to local transit points (buses, cabs, e-rickshaws) and major institutions.
              </p>

              {/* Address details */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-start space-x-3.5">
                  <MapPin className="text-accent shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="text-white font-bold text-sm">Hostel Address</h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">{address}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3.5">
                  <Phone className="text-accent shrink-0" size={18} />
                  <div>
                    <h4 className="text-white font-bold text-sm">Phone Number</h4>
                    <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-slate-400 text-xs mt-0.5 hover:text-accent transition duration-200">
                      {phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3.5">
                  <Mail className="text-accent shrink-0" size={18} />
                  <div>
                    <h4 className="text-white font-bold text-sm">Email Address</h4>
                    <a href={`mailto:${email}`} className="text-slate-400 text-xs mt-0.5 hover:text-accent transition duration-200">
                      {email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Map embed Container */}
              <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-800 shadow-md relative group">
                <iframe
                  title="PG Location Map Embed"
                  src={content.googleMapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.428456860002!2d75.8458992754642!3d26.826315576698662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db64d7df63f25%3A0xe54ef86b976db5b1!2sJNU%20Hospital%2C%20Jaipur!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
                
                {/* Float Direction CTA overlay */}
                <div className="absolute bottom-4 right-4 z-10">
                  <a
                    href={content.googleMapDirectionsUrl || "https://maps.google.com/?q=JNU+Hospital+Jagatpura+Jaipur"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-xl shadow-glow-orange transition duration-200"
                  >
                    <Navigation size={14} className="fill-white" />
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Inquiry form */}
            <div id="contact" className="lg:col-span-6 lg:mt-12">
              <EnquiryForm />
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials Review Slider */}
      <Testimonials />

      {/* Footer */}
      <Footer content={content} />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3.5">
        
        {/* Floating Call CTA */}
        <a
          href={`tel:${phone.replace(/\s+/g, '')}`}
          className="w-14 h-14 rounded-full bg-slate-900 text-accent border border-slate-700 hover:border-accent hover:text-white flex items-center justify-center shadow-lg transition duration-300 hover:scale-105 active:scale-95"
          title="Call Hostel Owner"
          aria-label="Call Hostel Owner"
        >
          <Phone size={22} className="animate-pulse" />
        </a>

        {/* Floating WhatsApp CTA */}
        <button
          onClick={handleWhatsappRedirect}
          className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg transition duration-300 hover:bg-emerald-700 hover:scale-105 active:scale-95"
          title="WhatsApp enquiry"
          aria-label="WhatsApp enquiry"
        >
          <MessageSquare size={22} />
        </button>

      </div>

      {/* Booking Form Modal Overlay */}
      {isBookingOpen && (
        <BookingFormModal
          room={selectedRoom}
          isOpen={isBookingOpen}
          onClose={handleCloseBooking}
        />
      )}

    </div>
  );
};

export default Home;
