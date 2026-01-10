import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/spell-bee', label: 'Spell-Bee' },
    { path: '/volunteer-registration', label: 'Volunteer' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-nav sticky top-0 z-50 border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group" data-testid="nav-logo">
            <div className="bg-gradient-to-br from-violet-600 to-purple-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-nunito font-bold text-xl text-slate-900">EduCompete</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
                className={`px-4 py-2 rounded-full font-outfit font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-700 hover:bg-violet-50 hover:text-violet-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/student-registration"
              data-testid="nav-register-btn"
              className="ml-4 bg-violet-600 text-white hover:bg-violet-700 rounded-full px-6 py-2 font-bold shadow-lg shadow-violet-200 transition-transform hover:-translate-y-0.5 btn-lift"
            >
              Register Now
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            data-testid="nav-mobile-toggle"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-200"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  data-testid={`nav-mobile-link-${link.label.toLowerCase()}`}
                  className={`block px-4 py-3 rounded-xl font-outfit font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-700 hover:bg-violet-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/student-registration"
                onClick={() => setIsOpen(false)}
                data-testid="nav-mobile-register-btn"
                className="block bg-violet-600 text-white text-center rounded-xl px-4 py-3 font-bold"
              >
                Register Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;