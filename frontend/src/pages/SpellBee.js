import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Award, BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const SpellBee = () => {
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/admin/event`);
        setEventData(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };
    fetchEvent();
  }, []);

  return (
    <div>
      <section className="hero-gradient py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-nunito font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                {eventData?.title || 'Spell-Bee Competition'}
              </h1>
              <p className="text-base sm:text-lg text-violet-100 mb-8 font-outfit">
                {eventData?.description || 'A competition showcasing English language proficiency.'}
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
                <div className="space-y-3 text-white font-outfit">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" />
                    <span>{eventData?.date || 'Date TBA'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" />
                    <span>{eventData?.location || 'Location TBA'}</span>
                  </div>
                </div>
              </div>
              <Link
                to="/student-registration"
                data-testid="spellbee-register-btn"
                className="inline-block bg-white text-violet-600 hover:bg-slate-50 rounded-full px-8 py-4 font-bold shadow-xl transition-transform hover:-translate-y-1 btn-lift"
              >
                Register Now
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src="https://images.pexels.com/photos/12497065/pexels-photo-12497065.jpeg"
                alt="Student at spelling bee"
                className="rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="font-nunito font-bold text-4xl sm:text-5xl text-slate-900 text-center mb-12">
          Competition Highlights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all p-8 card-hover" data-testid="highlight-card-1">
            <div className="bg-violet-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-nunito font-bold text-xl mb-3">Multiple Rounds</h3>
            <p className="text-slate-600 font-outfit">
              Progress through preliminary, semi-final, and final rounds with increasing difficulty.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all p-8 card-hover" data-testid="highlight-card-2">
            <div className="bg-teal-500 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-nunito font-bold text-xl mb-3">Grade Categories</h3>
            <p className="text-slate-600 font-outfit">
              Compete within your grade level: Elementary (3-5), Middle (6-8), and High School (9-12).
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all p-8 card-hover" data-testid="highlight-card-3">
            <div className="bg-amber-400 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Award className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-nunito font-bold text-xl mb-3">Prizes & Recognition</h3>
            <p className="text-slate-600 font-outfit">
              Winners receive trophies, certificates, and recognition at our awards ceremony.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="font-nunito font-bold text-4xl sm:text-5xl text-slate-900 mb-6">
            Ready to Compete?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mb-8 font-outfit">
            Registration is open! Secure your spot and showcase your spelling prowess.
          </p>
          <Link
            to="/student-registration"
            data-testid="spellbee-cta-btn"
            className="inline-flex items-center gap-2 bg-violet-600 text-white hover:bg-violet-700 rounded-full px-8 py-4 font-bold shadow-lg shadow-violet-200 transition-transform hover:-translate-y-1 btn-lift"
          >
            Register Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SpellBee;