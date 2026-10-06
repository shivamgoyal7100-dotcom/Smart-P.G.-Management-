import React from 'react';
import { ShieldCheck, Wind, CalendarCheck, ShieldAlert, Check } from 'lucide-react';
import { getImageUrl, formatCurrency } from '../utils/helpers';

const RoomCard = ({ room, onBookClick }) => {
  const isAC = room.category === 'ac';
  const isAvailable = room.availability === 'Available';
  
  // Get first image URL
  const roomImage = room.images && room.images.length > 0 
    ? getImageUrl(room.images[0])
    : 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';

  return (
    <div 
      className={`glass-card rounded-[24px] overflow-hidden flex flex-col h-full border transition-all duration-300 relative group ${
        isAC 
          ? 'border-accent/40 shadow-glow-orange hover:border-accent' 
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Category / Premium Tag Badge */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <span className={`px-3 py-1 rounded-lg text-[10px] font-extrabold tracking-wider uppercase shadow-md ${
          isAC 
            ? 'bg-gradient-to-r from-accent to-orange-600 text-white animate-pulse'
            : 'bg-slate-800/90 text-slate-300'
        }`}>
          {isAC ? 'Elite AC Room' : 'Standard Cooler Room'}
        </span>
        
        <span className="px-3 py-1 rounded-lg text-[10px] font-extrabold tracking-wider bg-slate-900/95 text-white shadow-md uppercase">
          {room.type} Sharing
        </span>
      </div>

      {/* Availability Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className={`px-3 py-1 rounded-lg text-[10px] font-extrabold tracking-wider uppercase shadow-md flex items-center space-x-1 ${
          isAvailable 
            ? 'bg-emerald-500 text-white' 
            : 'bg-rose-500 text-white'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full bg-white shrink-0 ${isAvailable ? 'animate-ping' : ''}`}></span>
          <span>{room.availability}</span>
        </span>
      </div>

      {/* Image Container */}
      <div className="h-56 relative w-full overflow-hidden shrink-0">
        <img
          src={roomImage}
          alt={room.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-darkBg-dark/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-slate-400 text-xs font-semibold">Monthly rent</span>
            <span className="text-white text-2xl font-extrabold leading-none mt-1">
              {formatCurrency(room.price)}
              <span className="text-xs text-slate-400 font-medium">/mo</span>
            </span>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 flex flex-col grow justify-between">
        <div className="space-y-4">
          <h3 className="text-white font-extrabold text-lg leading-snug group-hover:text-accent transition duration-200">
            {room.title}
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
            {room.description || 'Spacious room configuration, designed for maximum comfort and privacy.'}
          </p>

          {/* Facility Icons */}
          <div>
            <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Amenities Included:</h4>
            <div className="flex flex-wrap gap-1.5">
              {room.facilities.slice(0, 5).map((fac, idx) => (
                <span 
                  key={idx} 
                  className="px-2 py-1 rounded bg-slate-800/80 text-[10px] text-slate-300 font-medium border border-slate-700/30 flex items-center space-x-1"
                >
                  <Check size={10} className="text-accent" />
                  <span>{fac}</span>
                </span>
              ))}
              {room.facilities.length > 5 && (
                <span className="px-2 py-0.5 rounded bg-slate-800/80 text-[10px] text-slate-400 font-semibold border border-slate-700/30">
                  +{room.facilities.length - 5} More
                </span>
              )}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-6 mt-4 border-t border-slate-800/60">
          {isAvailable ? (
            <button
              onClick={() => onBookClick(room)}
              className="w-full py-3 bg-accent hover:bg-accent-hover text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-glow-orange group-hover:scale-[1.01] transition-all duration-200"
            >
              <CalendarCheck size={16} />
              <span>Book This Room</span>
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3 bg-slate-800 text-slate-500 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 border border-slate-700 cursor-not-allowed"
            >
              <ShieldAlert size={16} />
              <span>Room Occupied</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
