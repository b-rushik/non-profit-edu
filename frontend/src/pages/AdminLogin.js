import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/login`, { password });
      localStorage.setItem('adminToken', response.data.token);
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Invalid password');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-violet-600 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-nunito font-bold text-3xl text-slate-900 mb-2">
              Admin Login
            </h1>
            <p className="text-slate-600 font-outfit">
              Enter your password to access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="admin-login-form">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                data-testid="admin-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 bg-slate-50 focus:bg-white transition-all"
                placeholder="Enter admin password"
                required
              />
              <p className="text-xs text-slate-500 mt-2 font-outfit">
                Default password: admin123
              </p>
            </div>

            <Button
              type="submit"
              data-testid="admin-login-btn"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-full h-12 font-bold shadow-lg shadow-violet-200 transition-transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;