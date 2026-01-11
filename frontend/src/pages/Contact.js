import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { submitToNetlify } from '../lib/utils';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL;

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitToNetlify('contact-form', formData);

      if (BACKEND_URL) {
        try {
          await axios.post(`${BACKEND_URL}/api/contact`, formData);
        } catch (backendErr) {
          console.error('Backend forwarding failed:', backendErr.response?.status, backendErr.response?.data || backendErr.message);
        }
      }

      toast.success('Message sent! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => window.location.href = '/thank-you', 800);
    } catch (error) {
      console.error('Contact submission error:', error);
      const axiosResp = error.response;
      const message = axiosResp?.data?.detail || axiosResp?.data?.message || error.message || 'Failed to send message. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 md:py-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h1 className="font-nunito font-bold text-4xl sm:text-5xl text-slate-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-outfit max-w-2xl mx-auto">
            Have questions about our competitions? We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8 space-y-6" data-testid="contact-form">
              <div>
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  name="name"
                  data-testid="contact-name-input"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-12 rounded-xl border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 bg-slate-50 focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  data-testid="contact-email-input"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-12 rounded-xl border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 bg-slate-50 focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  data-testid="contact-message-input"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="rounded-xl border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 bg-slate-50 focus:bg-white transition-all"
                  required
                />
              </div>

              <Button
                type="submit"
                data-testid="contact-submit-btn"
                disabled={loading}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-full h-12 font-bold shadow-lg shadow-violet-200 transition-transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8" data-testid="contact-info">
              <h3 className="font-nunito font-bold text-2xl mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-violet-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-outfit font-medium text-slate-900">Email</p>
                    <a href="mailto:info@educompete.org" className="text-slate-600 hover:text-violet-600 transition-colors">
                      info@educompete.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-teal-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-outfit font-medium text-slate-900">Phone</p>
                    <a href="tel:+1234567890" className="text-slate-600 hover:text-teal-600 transition-colors">
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-outfit font-medium text-slate-900">Address</p>
                    <p className="text-slate-600">
                      123 Education Street<br />
                      Community Center<br />
                      City, State 12345
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-3xl shadow-lg p-8 text-white">
              <h3 className="font-nunito font-bold text-2xl mb-4">Office Hours</h3>
              <div className="space-y-2 font-outfit">
                <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                <p>Saturday: 10:00 AM - 2:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;