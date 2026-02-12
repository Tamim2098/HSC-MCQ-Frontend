import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
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

    try {
      const response = await fetch(`${backendUrl}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'লগইন ব্যর্থ হয়েছে।');
      }

      if (data.token) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin', { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#080808] flex items-center justify-center p-4 font-['Hind_Siliguri'] relative overflow-hidden transition-colors duration-300">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-cyan-500/5 blur-[100px] pointer-events-none" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        {/* Logo/Icon Area */}
        <div className="text-center mb-8">
          <motion.div 
            variants={itemVariants}
            className="w-16 h-16 bg-cyan-500 text-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-cyan-500/20"
          >
            <ShieldCheck size={32} />
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Access</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-gray-500 dark:text-zinc-500 text-sm mt-1">
            ম্যানেজমেন্ট প্যানেলে প্রবেশ করতে লগইন করুন
          </motion.p>
        </div>

        {/* Login Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl dark:shadow-none transition-colors"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-2 ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 focus:border-cyan-500 outline-none transition-all dark:text-white"
                  placeholder="আপনার ইউজারনেম"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 focus:border-cyan-500 outline-none transition-all dark:text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-500/5 p-3 rounded-xl border border-red-100 dark:border-red-500/20 text-xs font-bold"
                >
                  <AlertCircle size={14} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-black shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  প্রবেশ করা হচ্ছে...
                </>
              ) : (
                'লগইন করুন'
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Bottom Hint */}
        <motion.p 
          variants={itemVariants}
          className="text-center mt-8 text-xs text-gray-400 dark:text-zinc-600"
        >
          আপনার পাসওয়ার্ড ভুলে গেলে অ্যাডমিনিস্ট্রেটরের সাথে যোগাযোগ করুন
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
