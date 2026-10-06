import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getImageUrl } from '../utils/helpers';
import { Image as ImageIcon, Sparkles } from 'lucide-react';

const GallerySection = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const categories = [
    { key: 'all', name: 'All Photos' },
    { key: 'building', name: 'Building' },
    { key: 'rooms', name: 'Rooms' },
    { key: 'ac', name: 'AC Rooms' },
    { key: 'washroom', name: 'Washrooms' },
    { key: 'study', name: 'Study Area' },
    { key: 'dining', name: 'Dining Area' },
    { key: 'food', name: 'Food' },
    { key: 'entrance', name: 'Entrance' }
  ];

  // Default seed mock photos as fallback in case database gallery is empty
  const defaultGallery = [
    {
      _id: 'd1',
      category: 'building',
      caption: 'Pari PG Premium Building Front View',
      image: { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80' }
    },
    {
      _id: 'd2',
      category: 'rooms',
      caption: 'Fully Furnished Single Seater Room',
      image: { url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80' }
    },
    {
      _id: 'd3',
      category: 'ac',
      caption: 'Elite Air Conditioned Deluxe Bed Space',
      image: { url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80' }
    },
    {
      _id: 'd4',
      category: 'washroom',
      caption: 'Clean attached sanitary washroom',
      image: { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80' }
    },
    {
      _id: 'd5',
      category: 'study',
      caption: 'Silent and ventilated study desk space',
      image: { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80' }
    },
    {
      _id: 'd6',
      category: 'dining',
      caption: 'Clean communal dining area',
      image: { url: 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=800&q=80' }
    },
    {
      _id: 'd7',
      category: 'food',
      caption: 'Nutritious homestyle dinner plates',
      image: { url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' }
    },
    {
      _id: 'd8',
      category: 'entrance',
      caption: 'Hostel lobby entrance and security checkpoint',
      image: { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80' }
    }
  ];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        if (res.data.success && res.data.images.length > 0) {
          setImages(res.data.images);
        } else {
          setImages(defaultGallery);
        }
      } catch (error) {
        console.error('Failed to load gallery photos:', error.message);
        setImages(defaultGallery);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filteredImages = activeTab === 'all'
    ? images
    : images.filter(img => img.category.toLowerCase() === activeTab.toLowerCase());

  return (
    <section id="gallery" className="py-24 relative bg-darkBg-dark border-t border-slate-800/40">
      {/* Background Glow */}
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs text-accent font-extrabold uppercase tracking-widest mb-3">Hostel Tour</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            PG Photo Gallery
          </p>
          <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition duration-200 border uppercase tracking-wider ${
                activeTab === cat.key
                  ? 'bg-accent text-white border-accent shadow-glow-orange'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:border-slate-500 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Gallery Image Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="h-64 rounded-2xl bg-slate-800 animate-pulse border border-slate-700"></div>
            ))}
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl border border-slate-800/80">
            <ImageIcon size={48} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No images uploaded under this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((item) => (
              <div 
                key={item._id}
                className="glass-card rounded-[24px] overflow-hidden border border-slate-800/80 group hover:border-accent/40 transition duration-300 relative h-64 shadow-md"
              >
                <img
                  src={getImageUrl(item.image)}
                  alt={item.caption || 'Hostel Picture'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Overlay Caption on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-darkBg-dark/95 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-5">
                  <div>
                    <span className="text-[9px] text-accent font-extrabold uppercase tracking-widest">
                      {item.category}
                    </span>
                    <h4 className="text-white text-xs font-bold mt-1 line-clamp-2 leading-relaxed">
                      {item.caption || 'View hostel facilities'}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
