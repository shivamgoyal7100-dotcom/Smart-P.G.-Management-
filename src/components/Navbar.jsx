import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = ({ isDashboard = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { admin, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Rooms & Pricing', href: '#rooms' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Food & Mess', href: '#food' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e, href) => {
    setIsOpen(false);
    
    if (isDashboard || location.pathname !== '/') {
      return;
    }

    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const offset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled || isOpen || isDashboard
        ? 'bg-darkBg/90 backdrop-blur-md py-3.5 shadow-2xl border-b border-slate-800/80' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent via-orange-500 to-amber-500 flex items-center justify-center shadow-glow-orange group-hover:scale-105 transition duration-300">
              <span className="text-white font-black text-xl tracking-tight">P</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black tracking-wide text-lg leading-none">PARI PG</span>
              <span className="text-[9px] text-accent font-extrabold uppercase tracking-widest mt-0.5">Luxury Hostel & Stay</span>
            </div>
          </Link>

          {/* Center Navigation Links (Homepage) */}
          {!isDashboard && (
            <div className="hidden lg:flex items-center space-x-7 bg-slate-900/60 border border-slate-800/80 px-6 py-2 rounded-full backdrop-blur-sm">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-slate-300 hover:text-accent font-semibold text-xs transition duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}

          {/* Right Action Area - Clean Login / Sign Up buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            {admin ? (
              <Link
                to="/admin-dashboard"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-accent text-white shadow-glow-orange transition duration-200"
              >
                <span>Dashboard</span>
              </Link>
            ) : user ? (
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 hover:border-emerald-500 transition duration-200 shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>My Stay</span>
              </Link>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 transition duration-200"
                >
                  <User size={14} className="text-accent" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1.5 px-4.5 py-2.5 rounded-xl text-xs font-extrabold bg-accent text-white hover:bg-accent-hover shadow-glow-orange transition duration-200"
                >
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <div className="flex lg:hidden items-center space-x-2">
            {user && (
              <Link to="/profile" className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700 text-[11px] font-bold">
                My Stay
              </Link>
            )}
            {admin && (
              <Link to="/admin-dashboard" className="px-2.5 py-1.5 rounded-lg bg-accent text-white text-[11px] font-bold">
                Dashboard
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-xl bg-slate-800/80 border border-slate-700"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-darkBg/95 backdrop-blur-xl border-b border-slate-800 shadow-2xl p-5 space-y-4 animate-fade-in">
          {!isDashboard && (
            <div className="space-y-1 divide-y divide-slate-850">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="block py-2.5 text-sm font-semibold text-slate-300 hover:text-accent transition"
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-3">
            {admin ? (
              <Link
                to="/admin-dashboard"
                onClick={() => setIsOpen(false)}
                className="col-span-2 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold bg-accent text-white"
              >
                <span>Go to Dashboard</span>
              </Link>
            ) : user ? (
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="col-span-2 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white"
              >
                <User size={14} />
                <span>My Stay Portal</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl text-xs font-bold bg-accent text-white"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
