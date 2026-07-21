import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { authService } from '../services/api';
import { useAuthStore } from '../context/store';
import { containerVariants, itemVariants } from '../animations/variants';

const Login = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      // Verify token exists in response
      if (!response.data.token) {
        throw new Error('No token received from server');
      }

      // Store token and user data
      setToken(response.data.token);
      setUser(response.data.user);

      // A greeting belongs to a successful login, not to the entire browser tab.
      // Clear the previous marker so Jarvis can welcome the user after this login.
      const userId = response.data.user?.id || response.data.user?.email || 'guest';
      sessionStorage.removeItem(`jarvis-greeting-spoken:${userId}`);

      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('email', formData.email);
      }

      toast.success('Logged in successfully!');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-neon-pink/20 rounded-full blur-3xl -top-48 -right-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl -bottom-48 -left-48 animate-pulse" />
      </div>

      <motion.div
        className="relative w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Glass card */}
        <motion.div
          variants={itemVariants}
          className="bg-dark-900/80 backdrop-blur-xl border border-neon-pink/30 rounded-2xl p-8 shadow-2xl"
        >
          {/* Logo/Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-center mb-8">
            <Sparkles className="text-neon-pink mr-2" size={32} />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-pink to-neon-magenta bg-clip-text text-transparent">
              JARVIS
            </h1>
          </motion.div>

          {/* Title */}
          <motion.h2 variants={itemVariants} className="text-2xl font-bold text-white mb-2">
            Welcome Back
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-400 mb-6">
            Login to your AI assistant
          </motion.p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-dark-800/50 border border-neon-pink/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/30 transition"
                placeholder="Enter your email"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark-800/50 border border-neon-pink/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/30 transition"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 bg-dark-800 border-neon-pink/30 rounded accent-neon-pink"
              />
              <label className="ml-2 text-sm text-gray-400">Remember me</label>
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-neon-pink to-neon-magenta text-white font-bold py-2 rounded-lg hover:from-neon-magenta hover:to-neon-pink transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.p variants={itemVariants} className="text-center text-gray-400 mt-6">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-neon-pink hover:text-neon-magenta transition"
            >
              Sign up here
            </button>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
