import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, Trophy, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL;

const Home = () => {
  const [eventData, setEventData] = useState(null);
  const [registrationCount, setRegistrationCount] = useState({ students: 0, volunteers: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, countRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/admin/event`),
          axios.get(`${BACKEND_URL}/api/registrations/count`)
        ]);
        setEventData(eventRes.data);
        // Apply optimistic local increment if a recent submission was made via Netlify
        let counts = countRes.data;
        try {
          const recent = localStorage.getItem('recentSubmission');
          if (recent) {
            const parsed = JSON.parse(recent);
            if (parsed?.type === 'students') {
              counts = { ...counts, students: (counts.students || 0) + 1 };
            } else if (parsed?.type === 'volunteers') {
              counts = { ...counts, volunteers: (counts.volunteers || 0) + 1 };
            }
            localStorage.removeItem('recentSubmission');
          }
        } catch (e) {
          // ignore localStorage errors
        }

        setRegistrationCount(counts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <section className="hero-gradient py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-white text-sm font-outfit font-medium">Non-Profit Initiative</span>
              </div>
              <h1 className="font-nunito font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                Empowering Students Through Competition
              </h1>
              <p className="text-base sm:text-lg text-violet-100 mb-8 font-outfit">
                Join our educational competitions designed to showcase talent, build confidence, and celebrate learning excellence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/student-registration"
                  data-testid="hero-register-btn"
                  className="bg-white text-violet-600 hover:bg-slate-50 rounded-full px-8 py-4 font-bold shadow-xl transition-transform hover:-translate-y-1 btn-lift text-center"
                >
                  Register as Student
                </Link>
                <Link
                  to="/volunteer-registration"
                  data-testid="hero-volunteer-btn"
                  className="bg-violet-800 text-white hover:bg-violet-900 rounded-full px-8 py-4 font-bold shadow-xl transition-transform hover:-translate-y-1 btn-lift text-center"
                >
                  Volunteer With Us
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block"
            >
              <img
                src="https://images.unsplash.com/photo-1758270705657-f28eec1a5694?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwyfHxkaXZlcnNlJTIwc3R1ZGVudHMlMjBoYXBweSUyMGxlYXJuaW5nfGVufDB8fHx8MTc2ODAyMDEwNXww&ixlib=rb-4.1.0&q=85"
                alt="Happy students learning"
                className="rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-violet-100 text-violet-600 rounded-full px-4 py-2 mb-4 font-outfit font-medium">
            <Calendar className="w-4 h-4" />
            Latest Event
          </span>
          <h2 className="font-nunito font-bold text-4xl sm:text-5xl text-slate-900 mb-4">
            {eventData?.title || 'Loading...'}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-outfit">
            {eventData?.description || ''}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 p-8 card-hover" data-testid="event-details-card">
            <div className="bg-gradient-to-br from-violet-600 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-nunito font-bold text-2xl text-slate-900 mb-2">Event Details</h3>
            <div className="space-y-3 font-outfit text-slate-600">
              <p><strong>Date:</strong> {eventData?.date || 'TBA'}</p>
              <p><strong>Location:</strong> {eventData?.location || 'TBA'}</p>
            </div>
            <Link
              to="/spell-bee"
              data-testid="learn-more-btn"
              className="inline-flex items-center gap-2 text-violet-600 font-bold mt-6 hover:gap-3 transition-all"
            >
              Learn More <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl shadow-xl p-8 text-white" data-testid="stats-card">
            <Trophy className="w-16 h-16 mb-6" />
            <h3 className="font-nunito font-bold text-2xl mb-6">Registration Stats</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-4xl font-bold">{registrationCount.students}</p>
                <p className="text-amber-100 font-outfit">Students Registered</p>
              </div>
              <div>
                <p className="text-4xl font-bold">{registrationCount.volunteers}</p>
                <p className="text-amber-100 font-outfit">Volunteers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="font-nunito font-bold text-4xl sm:text-5xl text-slate-900 text-center mb-12">
            Why Join Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-2xl p-8 card-hover" data-testid="benefit-card-1">
              <div className="bg-teal-500 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-nunito font-bold text-xl mb-3">Skill Development</h3>
              <p className="text-slate-600 font-outfit">
                Enhance language proficiency and public speaking skills through friendly competition.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 card-hover" data-testid="benefit-card-2">
              <div className="bg-violet-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-nunito font-bold text-xl mb-3">Recognition</h3>
              <p className="text-slate-600 font-outfit">
                Earn certificates and awards while building confidence on stage.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 card-hover" data-testid="benefit-card-3">
              <div className="bg-amber-400 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-nunito font-bold text-xl mb-3">Community</h3>
              <p className="text-slate-600 font-outfit">
                Connect with like-minded students and supportive educators.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;