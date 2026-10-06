import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, BrainCircuit, Users, Navigation, Bus, Milestone } from 'lucide-react';

const About = ({ content = {} }) => {
  const aboutText = content.aboutText || 'Providing a premium, safe, and peaceful living environment designed specifically for students and working professionals. Located on the main road near Pari Circle, Jagatpura, offering excellent connectivity and modern amenities.';

  const features = [
    {
      title: 'Safe Environment',
      desc: 'Equipped with CCTV surveillance, gated compound, and 24/7 security guard checking.',
      icon: ShieldCheck,
      color: 'text-emerald-400 bg-emerald-500/10'
    },
    {
      title: 'Peaceful Atmosphere',
      desc: 'Noise-free and disciplined environment conducive for studies and resting after work.',
      icon: BrainCircuit,
      color: 'text-indigo-400 bg-indigo-500/10'
    },
    {
      title: 'Suitable for Students & Professionals',
      desc: 'Equipped with workspaces, study tables, high-speed Wi-Fi, and neat arrangements.',
      icon: Users,
      color: 'text-accent bg-accent/10'
    },
    {
      title: 'Easy Transportation',
      desc: 'Located on the main road, making e-rickshaws, buses, and cabs available immediately.',
      icon: Bus,
      color: 'text-sky-400 bg-sky-500/10'
    },
    {
      title: 'Prime Location',
      desc: 'Walking distance to JNU Hospital, Jaipur National University, and local marketplaces.',
      icon: Milestone,
      color: 'text-amber-400 bg-amber-500/10'
    },
    {
      title: 'Hygienic Maintenance',
      desc: 'Daily room cleaning and sanitization routines to maintain neat and refreshing quarters.',
      icon: ShieldCheck,
      color: 'text-rose-400 bg-rose-500/10'
    }
  ];

  return (
    <section id="about" className="py-24 relative bg-darkBg overflow-hidden border-t border-slate-800/40">
      {/* Glow Blur */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary-950/10 rounded-full filter blur-3xl -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs text-accent font-extrabold uppercase tracking-widest mb-3">About Pari PG</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            Your Home Away From Home
          </p>
          <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Description & Feature Grid */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <h3 className="text-2xl font-bold text-white leading-snug">
              Designed for Convenience, Engineered for Comfort.
            </h3>
            <p className="text-slate-300 leading-relaxed font-medium">
              {aboutText}
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              We understand that moving to a new city is challenging. That's why our hostel provides all necessary domestic utilities under one flat monthly rent. No hidden charges, no brokerage—just high-standard living, healthy meals, and a supportive community.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="flex items-start space-x-3.5">
                    <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${feature.color}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm leading-normal">{feature.title}</h4>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Double image overlaps */}
            <div className="relative w-80 h-96">
              
              {/* Back Card */}
              <div className="absolute top-0 right-0 w-64 h-80 rounded-3xl overflow-hidden border border-slate-700/80 shadow-premium opacity-60">
                <img
                  src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80"
                  alt="PG Interior Double Sharing"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Front Card */}
              <div className="absolute bottom-0 left-0 w-64 h-80 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-premium-hover">
                <img
                  src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
                  alt="PG Study Area Cozy Room"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-darkBg-dark/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 glass-card p-3 rounded-xl flex items-center justify-between border border-white/5">
                  <div>
                    <span className="text-[10px] text-accent uppercase tracking-widest font-bold">Location Hub</span>
                    <p className="text-white text-xs font-bold mt-0.5">JNU Hospital Road</p>
                  </div>
                  <span className="text-white text-xs px-2.5 py-1 bg-accent rounded-lg font-bold">100m away</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
