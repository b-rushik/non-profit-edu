import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Button } from '../components/ui/button';
import { submitToNetlify } from '../lib/utils';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL;

const StudentRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age_grade: '',
    school: '',
    email: '',
    phone: '',
    consent: false,
  });

  useEffect(() => {
    const checkLimit = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/registrations/count`);
        setLimitReached(response.data.students_limit_reached);
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

    if (!formData.consent) {
      toast.error('Please provide consent to collect data');
      return;
    }

    setLoading(true);
    try {
      // Submit to Netlify Forms (required for Netlify to collect submissions)
      await submitToNetlify('student-registration', formData);

      // If a backend URL is configured, also send there (optional)
      if (BACKEND_URL) {
        await axios.post(`${BACKEND_URL}/api/students/register`, formData);
      }

      toast.success('Registration successful! We look forward to seeing you at the event.');
      setTimeout(() => navigate('/thank-you'), 1200);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.detail || 'Registration failed');
        if (error.response.data.detail === 'Registration limit reached') {
          setLimitReached(true);
        }
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (limitReached) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" data-testid="registration-closed">
        <div className="max-w-md text-center">
          <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="font-nunito font-bold text-3xl text-slate-900 mb-4">Registration Closed</h2>
          <p className="text-slate-600 font-outfit mb-6">
            We've reached our maximum capacity of 1000 registrations. Please check back for future events!
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
          <div className="text-center mb-10">
            <div className="bg-gradient-to-br from-violet-600 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-nunito font-bold text-4xl sm:text-5xl text-slate-900 mb-4">
              Student Registration
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-outfit">
              Register for the Spell-Bee competition and showcase your talents!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8 space-y-6" data-testid="student-registration-form">
            <div>
              <Label htmlFor="name">Student Name *</Label>
              <Input
                id="name"
                name="name"
                data-testid="student-name-input"
                value={formData.name}
                onChange={handleChange}
                className="h-12 rounded-xl border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 bg-slate-50 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <Label htmlFor="age_grade">Age/Grade *</Label>
              <Input
                id="age_grade"
                name="age_grade"
                data-testid="student-grade-input"
                placeholder="e.g., Grade 7 or 13 years"
                value={formData.age_grade}
                onChange={handleChange}
                className="h-12 rounded-xl border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 bg-slate-50 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <Label htmlFor="school">School *</Label>
              <Input
                id="school"
                name="school"
                data-testid="student-school-input"
                value={formData.school}
                onChange={handleChange}
                className="h-12 rounded-xl border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 bg-slate-50 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Parent/Student Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                data-testid="student-email-input"
                value={formData.email}
                onChange={handleChange}
                className="h-12 rounded-xl border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 bg-slate-50 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                data-testid="student-phone-input"
                value={formData.phone}
                onChange={handleChange}
                className="h-12 rounded-xl border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 bg-slate-50 focus:bg-white transition-all"
                required
              />
            </div>

            <div className="flex items-start space-x-2 bg-violet-50 p-4 rounded-xl">
              <Checkbox
                id="consent"
                data-testid="student-consent-checkbox"
                checked={formData.consent}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consent: checked }))}
                className="mt-1"
              />
              <Label htmlFor="consent" className="text-sm text-slate-700 leading-relaxed cursor-pointer">
                I consent to the collection of this data for competition purposes. I understand that the information will be used solely for event management and communication.
              </Label>
            </div>

            <Button
              type="submit"
              data-testid="student-submit-btn"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-full h-12 font-bold shadow-lg shadow-violet-200 transition-transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Complete Registration'
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentRegistration;