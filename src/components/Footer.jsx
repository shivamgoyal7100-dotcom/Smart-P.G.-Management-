import React from 'react';
import { Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

const Footer = ({ content = {} }) => {
  const phone = content.contactPhone || '+91 98765 43210';
  const email = content.contactEmail || 'info@parihostel.com';
  const address = content.contactAddress || 'Near Pari Circle, JNU Hospital Road, Jagatpura, Jaipur';

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About PG', href: '#about' },
    { name: 'Room Pricing', href: '#rooms' },
    { name: 'Facilities & Services', href: '#facilities' },
    { name: 'Food Schedule', href: '#food' },
    { name: 'Photo Gallery', href: '#gallery' },
    { name: 'Admin Portal', href: '/admin-login' },
  ];

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-darkBg-dark border-t border-slate-800/80 pt-16 pb-8 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Intro */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-orange-600 flex items-center justify-center shadow-glow-orange">
                <span className="text-white font-extrabold text-xl">P</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-extrabold tracking-wider text-xl leading-none">PARI PG</span>
                <span className="text-[10px] text-accent font-semibold uppercase tracking-widest mt-0.5">Premium Hostel</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Providing modern, safe, and comfortable shared accommodations designed specifically for students and working professionals in Jaipur.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-accent hover:text-white flex items-center justify-center text-slate-400 transition duration-200" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-accent hover:text-white flex items-center justify-center text-slate-400 transition duration-200" aria-label="Instagram">
                <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-accent hover:text-white flex items-center justify-center text-slate-400 transition duration-200" aria-label="Twitter">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 relative pb-2 border-b border-slate-800 w-fit">
              Quick Links
              <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-accent"></span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-accent text-sm transition-colors duration-200 flex items-center space-x-1"
                  >
                    <span>&rsaquo;</span>
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 relative pb-2 border-b border-slate-800 w-fit">
              Contact Us
              <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-accent"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                <span className="text-slate-400 text-sm leading-relaxed">{address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-accent shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-slate-400 hover:text-accent text-sm transition duration-200">
                  {phone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-accent shrink-0" />
                <a href={`mailto:${email}`} className="text-slate-400 hover:text-accent text-sm transition duration-200">
                  {email}
                </a>
              </li>
            </ul>
          </div>

          {/* Location Area Map Info */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 relative pb-2 border-b border-slate-800 w-fit">
              Prime Location
              <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-accent"></span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Located on JNU Hospital Road, Jagatpura, Jaipur. Extremely accessible to local institutions and public transport nodes.
            </p>
            <div className="w-full h-24 rounded-xl overflow-hidden grayscale contrast-125 opacity-60 hover:opacity-100 hover:grayscale-0 transition duration-300 shadow-inner border border-slate-800">
              <iframe
                title="Footer Map Location Preview"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.428456860002!2d75.8458992754642!3d26.826315576698662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db64d7df63f25%3A0xe54ef86b976db5b1!2sJNU%20Hospital%2C%20Jaipur!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-16 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-xs">
          <p>&copy; {new Date().getFullYear()} Pari PG Hostel. All rights reserved. Developed for high-performance MERN standard.</p>
          <button
            onClick={handleScrollTop}
            className="mt-4 sm:mt-0 flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-accent hover:text-white rounded-lg transition duration-200"
            aria-label="Back to top"
          >
            <span>Back to Top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
