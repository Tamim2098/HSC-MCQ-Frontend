import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 100,
      when: 'beforeChildren',
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 150,
    }
  },
};

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const backendUrl = 'https://hsc-mcq-backend.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!username || !password) {
      setError('Please enter both username and password.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'An error occurred. Please try again.');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin', { replace: true });
      } else {
        setError('Login successful, but no token received.');
      }
    } catch (err) {
      setError('An error occurred. Please check your internet connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-black transition-colors duration-500 p-8 flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 dark:opacity-10"></div>
      
      <div className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400/20 dark:bg-purple-700/10 blur-3xl animate-pulse-slow"></div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-white/20 dark:border-gray-700/50 transform transition-all duration-300 hover:shadow-3xl"
      >
        <motion.h2
          variants={itemVariants}
          className="text-3xl font-extrabold text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text animate-text-gradient mb-6"
        >
          Admin Login
        </motion.h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={itemVariants}>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
              placeholder="Enter your username"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
              placeholder="Enter your password"
            />
          </motion.div>
          {error && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-red-600 dark:text-red-400 text-sm font-medium text-center bg-red-100/50 dark:bg-red-900/50 p-3 rounded-xl border border-red-200 dark:border-red-800"
            >
              {error}
            </motion.p>
          )}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            {loading ? 'Logging in...' : 'Login'}
             <span className="absolute inset-0 rounded-xl bg-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></span>
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;