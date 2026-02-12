import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, Zap, ChevronRight, PlayCircle, GraduationCap, Users, Trophy } from 'lucide-react';

// Animation variants - শুধুমাত্র শুরুতে আসার জন্য
const mainContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', damping: 20, stiffness: 100 },
  },
};

const HeroSection = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const handleStartMCQ = () => navigate('/subjects');

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-center bg-white dark:bg-[#050505] text-gray-900 dark:text-gray-200">
      
      {/* Background Elements - Fixed (No animations) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px] dark:bg-cyan-500/10" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] dark:bg-emerald-500/10" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* Left Side: Text Content */}
          <motion.div
            variants={mainContainerVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-3/5 text-center lg:text-left"
          >
            <motion.div variants={fadeUpVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900/50 text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
              <Zap size={14} className="fill-current" />
              Next Gen Learning Platform
            </motion.div>

            <motion.h1 variants={fadeUpVariants} className="text-5xl sm:text-6xl lg:text-8xl font-extrabold leading-[1.1] mb-8 tracking-tight text-gray-900 dark:text-white">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500">
                HSC Journey
              </span>
            </motion.h1>
            
            <motion.p variants={fadeUpVariants} className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed text-gray-600 dark:text-gray-400">
              সবচেয়ে আধুনিক MCQ প্ল্যাটফর্ম। Physics থেকে Biology—সব বিষয়ের অধ্যায়ভিত্তিক প্র্যাকটিস, লাইভ রেজাল্ট এবং বিস্তারিত এনালাইটিক্স এখন এক জায়গায়।
            </motion.p>

            <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
              <button
                onClick={handleStartMCQ}
                className="w-full sm:w-auto px-10 py-4 font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 bg-cyan-600 text-white hover:bg-cyan-500 shadow-cyan-500/25 active:scale-95"
              >
                Start Practicing
                <ChevronRight size={20} />
              </button>
              
              <button
                className="w-full sm:w-auto px-10 py-4 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 bg-transparent text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900 active:scale-95"
              >
                <PlayCircle size={20} className="text-cyan-500" />
                How it works
              </button>
            </motion.div>
          </motion.div>

          {/* Right Side: Bento Grid (One-time entrance animation) */}
          <motion.div 
            variants={mainContainerVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-2/5 grid grid-cols-2 gap-4 relative"
          >
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px]" />
            
            <StatCard icon={<Users className="text-blue-500" />} label="Active Students" value="10k+" delay={0.4} />
            <StatCard icon={<Trophy className="text-amber-500" />} label="Success Rate" value="98%" delay={0.5} />
            <div className="col-span-2">
               <StatCard 
                 icon={<GraduationCap className="text-emerald-500" />} 
                 label="Verified Questions" 
                 value="5000+" 
                 delay={0.6} 
                 fullWidth 
               />
            </div>

            {/* Static Indicator */}
            <motion.div 
              variants={fadeUpVariants}
              className="absolute -right-4 -top-8 p-3 rounded-xl bg-white dark:bg-zinc-900 shadow-xl border border-gray-100 dark:border-zinc-800 hidden md:block"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[10px] font-bold uppercase tracking-tighter dark:text-gray-400">Live Exams Running</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Bottom Bar */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <FeatureItem 
            icon={<Zap />} 
            title="Instant Analysis" 
            desc="পরীক্ষা শেষ হওয়া মাত্রই পেয়ে যাবে অটোমেটিক রেজাল্ট ও ভুলগুলোর ব্যাখ্যা।"
            color="text-cyan-500"
          />
          <FeatureItem 
            icon={<CheckCircle />} 
            title="Syllabus Focused" 
            desc="HSC শর্ট ও ফুল সিলেবাসের প্রতিটি অধ্যায় থেকে বাছাইকৃত প্রশ্ন।"
            color="text-emerald-500"
          />
          <FeatureItem 
            icon={<Clock />} 
            title="Real-time Timer" 
            desc="বোর্ড পরীক্ষার মতো টাইম প্রেসারে পরীক্ষা দিয়ে নিজেকে গড়ে তোলো।"
            color="text-amber-500"
          />
        </motion.div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ icon, label, value, delay, fullWidth = false }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    className={`p-6 rounded-[2rem] bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-gray-100 dark:border-zinc-800 shadow-sm transition-all ${fullWidth ? 'flex items-center justify-between' : ''}`}
  >
    <div className={`p-3 rounded-2xl bg-gray-50 dark:bg-zinc-800 w-fit mb-3 ${fullWidth ? 'mb-0' : ''}`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <p className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-1">{value}</p>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
    </div>
  </motion.div>
);

const FeatureItem = ({ icon, title, desc, color }) => (
  <motion.div 
    variants={fadeUpVariants}
    className="group p-8 rounded-3xl bg-gray-50/50 dark:bg-zinc-900/30 border border-transparent hover:border-gray-200 dark:hover:border-zinc-800 transition-all"
  >
    <div className={`mb-4 ${color}`}>
      {React.cloneElement(icon, { size: 32, strokeWidth: 2.5 })}
    </div>
    <h3 className="text-xl font-bold mb-3 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

export default HeroSection;