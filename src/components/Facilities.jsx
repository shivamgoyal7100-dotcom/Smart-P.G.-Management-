import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, ShowerHead, Bed, ShieldAlert, FileSpreadsheet, 
  Table, Armchair, DoorClosed, Wind, Snowflake, Droplet, 
  Trash2, Wifi, Fan, Eye 
} from 'lucide-react';

const Facilities = () => {
  const facilitiesList = [
    { name: 'Fully Furnished Rooms', desc: 'Wooden beds, study tables, closets, and chairs pre-set.', icon: Home },
    { name: 'Attached Washroom', desc: 'Modern private washrooms in every single hostel room.', icon: ShowerHead },
    { name: 'Comfortable Bed & Bedding', desc: 'Orthopedic mattress, clean pillows, and bedsheets provided.', icon: Bed },
    { name: 'Spacious Cupboards', desc: 'Large wardrobe with individual lock storage for safety.', icon: DoorClosed },
    { name: 'Study Table & Chair', desc: 'Dedicated desk space setup for focused study and WFH.', icon: Table },
    { name: 'Air Cooler Facility', desc: 'Heavy duty desert cooler for standard sharing room plans.', icon: Wind },
    { name: 'AC Rooms Available', desc: 'Split AC setups available in separate premium sectors.', icon: Snowflake },
    { name: 'RO Water Cooler', desc: '24/7 cold, purified RO drinking water access on every floor.', icon: Droplet },
    { name: '24×7 Water Supply', desc: 'Constant water pressure and storage tanks.', icon: Droplet },
    { name: 'Proper Ventilation', desc: 'Large windows in every room allowing ample sunlight.', icon: Fan },
    { name: 'Daily Cleaning', desc: 'Routine housekeeping sweeping, mopping, and sanitation.', icon: Trash2 },
    { name: 'High-Speed Wi-Fi', desc: 'Optional robust fiber internet cover for streaming and studies.', icon: Wifi }
  ];

  return (
    <section id="facilities" className="py-24 relative bg-darkBg-dark border-t border-slate-800/40">
      {/* Background radial accent */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-accent/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs text-accent font-extrabold uppercase tracking-widest mb-3">Amenities</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            Top-Tier Facilities For Premium Living
          </p>
          <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Facility Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {facilitiesList.map((facility, idx) => {
            const Icon = facility.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="glass-card p-6 rounded-2xl flex flex-col space-y-3 hover:border-accent/40 transition duration-300 group hover:-translate-y-1 shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-white transition duration-300 shadow-sm shrink-0">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base leading-snug group-hover:text-accent transition duration-200">
                    {facility.name}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    {facility.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Facilities;
