import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  const defaultReviews = [
    {
      _id: 't1',
      name: 'Rahul Sharma',
      rating: 5,
      review: 'Very clean rooms and excellent food. The location is very near to public transport, and the environment is very peaceful for studies.'
    },
    {
      _id: 't2',
      name: 'Aman Verma',
      rating: 5,
      review: 'Best PG near JNU Hospital. Fully furnished rooms with separate cupboards, comfortable mattresses, and daily cleaning. Internet is also super fast.'
    },
    {
      _id: 't3',
      name: 'Priyanshu Jha',
      rating: 5,
      review: 'Affordable and peaceful environment. The chef prepares excellent homestyle meals. Staff is very helpful and cooperative.'
    }
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/testimonials');
        if (res.data.success && res.data.testimonials.length > 0) {
          setReviews(res.data.testimonials);
        } else {
          setReviews(defaultReviews);
        }
      } catch (error) {
        console.error('Failed to load testimonials:', error.message);
        setReviews(defaultReviews);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="py-24 bg-darkBg text-center">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (reviews.length === 0) return null;

  const currentReview = reviews[activeIdx];

  return (
    <section id="reviews" className="py-24 relative bg-darkBg overflow-hidden border-t border-slate-800/40">
      {/* Background visual graphics */}
      <div className="absolute top-1/4 left-1/10 w-80 h-80 bg-accent/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-xs text-accent font-extrabold uppercase tracking-widest mb-3">Testimonials</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            What Our Residents Say
          </p>
          <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Testimonial slider frame */}
        <div className="relative glass-card p-8 sm:p-12 rounded-[32px] border border-slate-800/80 shadow-premium min-h-[250px] flex flex-col justify-between">
          
          {/* Quote Icon watermark */}
          <div className="absolute top-6 right-8 text-slate-700/20 pointer-events-none">
            <Quote size={80} />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            
            {/* Stars */}
            <div className="flex items-center space-x-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < currentReview.rating ? 'fill-accent text-accent' : 'text-slate-700'}
                />
              ))}
            </div>

            {/* Testimonial text with transition */}
            <AnimatePresence mode="wait">
              <motion.p
                key={activeIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-slate-200 text-lg md:text-xl font-medium leading-relaxed italic max-w-2xl"
              >
                "{currentReview.review}"
              </motion.p>
            </AnimatePresence>

            {/* User details */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx + '-name'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">
                  {currentReview.name}
                </h4>
                <p className="text-slate-400 text-xs mt-1">Hostel Resident</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-10">
            {/* Left arrow */}
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full bg-slate-800 hover:bg-accent text-slate-300 hover:text-white flex items-center justify-center transition-colors duration-200 border border-slate-700/60 shadow-md"
              aria-label="Previous Review"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Indicators */}
            <div className="flex items-center space-x-2">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                    activeIdx === idx 
                      ? 'bg-accent w-6 shadow-glow-orange' 
                      : 'bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                ></button>
              ))}
            </div>

            {/* Right arrow */}
            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full bg-slate-800 hover:bg-accent text-slate-300 hover:text-white flex items-center justify-center transition-colors duration-200 border border-slate-700/60 shadow-md"
              aria-label="Next Review"
            >
              <ChevronRight size={20} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;
