import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, PhoneCall, CalendarCheck, MapPin, Shield, CheckCircle, ShieldCheck } from 'lucide-react';

const Hero = ({ content = {}, onBookClick }) => {
  const heroTitle = content.heroTitle || 'Comfortable & Affordable Boys PG in Jagatpura, Jaipur';
  const heroSubtitle = content.heroSubtitle || 'Fully Furnished | Affordable | Safe | Prime Location';
  const whatsappNumber = content.whatsappNumber || '919876543210';
  const phone = content.contactPhone || '+919876543210';

  const floatingCards = [
    { title: 'Near JNU Hospital', desc: 'Just 2 mins walk', icon: MapPin },
    { title: 'Near Pari Circle', desc: 'Excellent transit hubs', icon: MapPin },
    { title: 'On Road Property', desc: 'Easy public transport access', icon: CheckCircle },
    { title: 'Fully Furnished', desc: 'Bed, Desk, Cupboard included', icon: ShieldCheck },
    { title: 'AC & Non AC Rooms', desc: 'Choose your comfort plan', icon: Shield },
  ];

  const handleWhatsappRedirect = () => {
    const message = encodeURIComponent('Hi, I want to know about room availability.');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden grid-bg">
      {/* Background Decorative Circles */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-primary-950/20 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/10 right-1/10 w-80 h-80 bg-accent/10 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Left Column */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-slate-800/80 border border-slate-700/60 rounded-full py-1.5 px-4 w-fit mx-auto lg:mx-0 shadow-sm"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping"></span>
              <span className="text-xs text-slate-200 font-semibold tracking-wider uppercase">Boys PG Accommodation</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight font-sans tracking-tight"
            >
              Comfortable & <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-500 shadow-sm">
                Affordable Boys PG
              </span> <br />
              in Jagatpura, Jaipur
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-slate-300 text-lg md:text-xl font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {heroSubtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <button
                onClick={onBookClick}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-accent hover:bg-accent-hover text-white rounded-2xl text-base font-bold shadow-glow-orange hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <CalendarCheck size={18} />
                <span>Book Now</span>
              </button>

              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-slate-850 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-500 rounded-2xl text-base font-bold transition duration-200"
              >
                <PhoneCall size={18} className="text-accent" />
                <span>Contact Now</span>
              </a>

              <button
                onClick={handleWhatsappRedirect}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-base font-bold shadow-lg shadow-emerald-600/20 transition duration-200"
              >
                <MessageSquare size={18} />
                <span>WhatsApp</span>
              </button>
            </motion.div>
          </div>

          {/* Graphic/Image Right Column */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Main Picture Frame */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-72 h-96 sm:w-80 sm:h-[450px] rounded-[32px] overflow-hidden shadow-premium border-2 border-slate-800"
            >
              <img
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
                alt="Premium Pari PG Hostel Exterior"
                className="w-full h-full object-cover hover:scale-110 transition duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-darkBg-dark/80 via-transparent to-transparent"></div>
              
              {/* Little card overlay */}
              <div className="absolute bottom-6 left-6 right-6 glass-card p-4 rounded-2xl flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-white text-xs font-bold">100% Safe Environment</h4>
                  <p className="text-slate-400 text-[10px]">CCTV & Guard Monitored</p>
                </div>
              </div>
            </motion.div>

            {/* Back Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent blur-2xl rounded-full scale-75 -z-10"></div>
          </div>
        </div>

        {/* Floating Cards Carousel/Grid */}
        <div className="mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {floatingCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div 
                  key={idx} 
                  className="glass-card p-5 rounded-2xl flex flex-col space-y-2 hover:border-accent/40 transition duration-300 shadow-lg group hover:-translate-y-1"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-white transition duration-300">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-white font-bold text-sm pt-2">{card.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
