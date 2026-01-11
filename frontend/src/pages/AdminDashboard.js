import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, LogOut, Loader2, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }

    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/admin/event`);
        setEventData(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };
    fetchEvent();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${BACKEND_URL}/api/admin/event`, eventData);
      toast.success('Event updated successfully!');
    } catch (error) {
      toast.error('Failed to update event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    navigate('/admin');
  };

  return (
    <div className="py-16 md:py-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-nunito font-bold text-4xl text-slate-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 font-outfit">
              Manage your latest event information
            </p>
          </div>
          <Button
            onClick={handleLogout}
            data-testid="admin-logout-btn"
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8 space-y-6" data-testid="admin-event-form">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-violet-600 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-nunito font-bold text-2xl text-slate-900">
                Latest Event Details
              </h2>
            </div>

            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                name="title"
                data-testid="admin-event-title-input"
                value={eventData.title}
                onChange={handleChange}
                className="h-12 rounded-xl border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 bg-slate-50 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Event Description *</Label>
              <Textarea
                id="description"
                name="description"
                data-testid="admin-event-description-input"
                value={eventData.description}
                onChange={handleChange}
                rows={4}
                className="rounded-xl border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 bg-slate-50 focus:bg-white transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="date">Event Date *</Label>
                <Input
                  id="date"
                  name="date"
                  data-testid="admin-event-date-input"
                  value={eventData.date}
                  onChange={handleChange}
                  placeholder="e.g., March 15, 2025"
                  className="h-12 rounded-xl border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 bg-slate-50 focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  data-testid="admin-event-location-input"
                  value={eventData.location}
                  onChange={handleChange}
                  className="h-12 rounded-xl border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 bg-slate-50 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              data-testid="admin-save-btn"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-full h-12 font-bold shadow-lg shadow-violet-200 transition-transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;