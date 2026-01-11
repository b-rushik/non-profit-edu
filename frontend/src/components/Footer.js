import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-nunito font-bold text-xl mb-4">ubuntu educational society</h3>
            <p className="text-slate-400 font-outfit">
              Empowering students through educational competitions and fostering a love for learning.
            </p>
          </div>

          <div>
            <h4 className="font-nunito font-bold text-lg mb-4">Quick Links</h4>
            <div className="space-y-2 font-outfit">
              <Link to="/" className="block text-slate-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/spell-bee" className="block text-slate-400 hover:text-white transition-colors">
                Spell-Bee Event
              </Link>
              <Link to="/volunteer-registration" className="block text-slate-400 hover:text-white transition-colors">
                Become a Volunteer
              </Link>
              <Link to="/contact" className="block text-slate-400 hover:text-white transition-colors">
                Contact Us
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-nunito font-bold text-lg mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              Support Our Cause
            </h4>
            <p className="text-slate-400 font-outfit mb-4">
              Scan the QR code to donate and help us continue organizing educational competitions.
            </p>
            <div className="bg-white p-4 rounded-xl inline-block" data-testid="donation-qr-code">
              <img
                src="/donation-qr.png"
                alt="Donation QR Code"
                className="w-32 h-32"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 font-outfit text-sm">
              © 2025 ubuntu educational society. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-slate-400 text-sm font-outfit">
              <a href="mailto:info@educompete.org" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                info@educompete.org
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                +1 (234) 567-890
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;