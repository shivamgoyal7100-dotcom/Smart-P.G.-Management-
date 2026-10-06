import React from 'react';
import { Coffee, Utensils, Moon, Check, ChefHat } from 'lucide-react';

const FoodSection = () => {
  const foodSchedule = [
    {
      meal: 'Breakfast',
      time: '8:00 AM - 9:30 AM',
      description: 'Healthy start to the day with fresh milk, tea, and rotating Indian breakfasts (Poha, Aloo Paratha, Puri Sabzi, Idli, etc.).',
      icon: Coffee,
      color: 'from-amber-500/20 to-orange-500/10 hover:border-amber-500/40 text-amber-400'
    },
    {
      meal: 'Lunch',
      time: '1:00 PM - 2:30 PM',
      description: 'Hearty homestyle lunch including seasonal vegetables, daal tadka, steamed basmati rice, hot rotis, fresh salad, and pickle.',
      icon: Utensils,
      color: 'from-accent/20 to-orange-600/10 hover:border-accent/40 text-accent'
    },
    {
      meal: 'Dinner',
      time: '8:00 PM - 9:30 PM',
      description: 'Wholesome dinner comprising light daal, dry subzi, paneer dishes (special weekends), rice, freshly prepared chapatis, and sweet dessert.',
      icon: Moon,
      color: 'from-indigo-500/20 to-purple-500/10 hover:border-indigo-500/40 text-indigo-400'
    }
  ];

  const highlights = [
    'Experienced in-house chef preparing fresh meals',
    'Pure RO drinking water served with meals',
    'Special festive menus and Sunday sweets',
    'Hygienic and clean stainless-steel dining area',
    'High quality raw ingredients & vegetables purchased daily',
    'Nutritionally balanced, home-style taste'
  ];

  return (
    <section id="food" className="py-24 relative bg-darkBg overflow-hidden border-t border-slate-800/40">
      {/* Background glow circle */}
      <div className="absolute top-1/2 left-1/10 w-80 h-80 bg-primary-950/15 rounded-full filter blur-3xl pointer-events-none -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs text-accent font-extrabold uppercase tracking-widest mb-3">Hostel Mess</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            Home Style Delicious Food
          </p>
          <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full"></div>
          <p className="text-slate-400 text-sm mt-4">
            Fresh homemade food prepared with care, ensuring complete health, nutrition, and hygiene every single day.
          </p>
        </div>

        {/* Layout: Info Grid and Chef Feature */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Chef details Left */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="glass-card p-8 rounded-3xl border border-slate-800 relative group overflow-hidden">
              {/* Card visual effect */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/15 rounded-full filter blur-xl group-hover:scale-125 transition duration-500"></div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent to-orange-500 text-white flex items-center justify-center shadow-glow-orange shrink-0">
                  <ChefHat size={32} />
                </div>
                <div>
                  <h3 className="text-white font-extrabold text-lg">In-House Culinary Chef</h3>
                  <span className="text-[10px] text-accent font-bold uppercase tracking-wider">Hygienic Cooked Meals</span>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium">
                "Our experienced in-house chef is dedicated to preparing fresh, hygienic, and comforting homestyle meals every day. We maintain the highest standards of cleanliness in our kitchen, sourcing fresh local vegetables daily to deliver a taste that feels just like home."
              </p>

              {/* Tick lists */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-center space-x-2.5">
                    <div className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                      <Check size={12} />
                    </div>
                    <span className="text-slate-300 text-xs font-semibold">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Meal schedule cards Right */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            {foodSchedule.map((schedule, idx) => {
              const MealIcon = schedule.icon;
              return (
                <div 
                  key={idx}
                  className={`glass-card p-6 rounded-2xl border border-slate-800 bg-gradient-to-r flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition duration-300 group hover:-translate-x-1 ${schedule.color}`}
                >
                  <div className="flex items-start sm:items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-slate-800 transition duration-300 shrink-0">
                      <MealIcon size={24} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2.5">
                        <h4 className="text-white font-extrabold text-base leading-none">{schedule.meal}</h4>
                        <span className="px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 text-[10px] font-bold border border-slate-700/30">
                          {schedule.time}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs mt-2 leading-relaxed max-w-lg">
                        {schedule.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FoodSection;
