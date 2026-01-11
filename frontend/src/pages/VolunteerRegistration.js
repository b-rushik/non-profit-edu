import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { submitToNetlify } from '../lib/utils';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL;

const VolunteerRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
  });

  useEffect(() => {
    const checkLimit = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/registrations/count`);
        setLimitReached(response.data.volunteers_limit_reached);
      } catch (error) {
        console.error('Error checking limit:', error);
      }
    };
    checkLimit();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Phone validation
    const phoneDigits = (formData.phone || '').replace(/\D/g, '');
    if (phoneDigits.length > 10) {
      toast.error('Phone number must be at most 10 digits');
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData, phone: phoneDigits };
      await submitToNetlify('volunteer-registration', payload);

      // Mark optimistic local submission so the home page can reflect updated counts
      try {
        localStorage.setItem('recentSubmission', JSON.stringify({ type: 'volunteers' }));
      } catch (e) {}

      if (BACKEND_URL) {
        try {
          await axios.post(`${BACKEND_URL}/api/volunteers/register`, payload);
          try {
            await axios.get(`${BACKEND_URL}/api/registrations/count`);
          } catch (e) {}
        } catch (backendErr) {
          console.error('Backend forwarding failed:', backendErr.response?.status, backendErr.response?.data || backendErr.message);
          // continue — user already submitted via Netlify
        }
      }

      toast.success('Thank you for volunteering! We will contact you soon.');
      setTimeout(() => navigate('/thank-you'), 1200);
    } catch (error) {
      console.error('Volunteer registration error:', error);
      const axiosResp = error.response;
      const message = axiosResp?.data?.detail || axiosResp?.data?.message || error.message || 'Something went wrong. Please try again.';
      if (axiosResp?.status === 400) {
        toast.error(message);
        if (message === 'Registration limit reached') {
          setLimitReached(true);
        }
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (limitReached) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" data-testid="volunteer-closed">
        <div className="max-w-md text-center">
          <div className="bg-teal-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-teal-600" />
          </div>
          <h2 className="font-nunito font-bold text-3xl text-slate-900 mb-4">Volunteer Slots Full</h2>
          <p className="text-slate-600 font-outfit mb-6">
            We've reached our maximum capacity of volunteers. Thank you for your interest!
          </p>
          <Button onClick={() => navigate('/')} data-testid="back-home-btn">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h1 className="font-nunito font-bold text-4xl sm:text-5xl text-slate-900 mb-4">
                Become a Volunteer
              </h1>
              <p className="text-base sm:text-lg text-slate-600 font-outfit">
                Join our team of dedicated educators and help make our events successful!
              </p>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.pexels.com/photos/7692559/pexels-photo-7692559.jpeg"
                alt="Teacher helping student"
                className="rounded-2xl shadow-lg w-full h-full object-cover"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8 space-y-6" data-testid="volunteer-registration-form">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                data-testid="volunteer-name-input"
                value={formData.name}
                onChange={handleChange}
                className="h-12 rounded-xl border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 bg-slate-50 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                data-testid="volunteer-email-input"
                value={formData.email}
                onChange={handleChange}
                className="h-12 rounded-xl border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 bg-slate-50 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                data-testid="volunteer-phone-input"
                value={formData.phone}
                onChange={handleChange}
                className="h-12 rounded-xl border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 bg-slate-50 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <Label htmlFor="organization">School/Organization *</Label>
              <Input
                id="organization"
                name="organization"
                data-testid="volunteer-organization-input"
                placeholder="Current workplace or affiliation"
                value={formData.organization}
                onChange={handleChange}
                className="h-12 rounded-xl border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 bg-slate-50 focus:bg-white transition-all"
                required
              />
            </div>

            <Button
              type="submit"
              data-testid="volunteer-submit-btn"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-full h-12 font-bold shadow-lg shadow-teal-200 transition-transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default VolunteerRegistration;