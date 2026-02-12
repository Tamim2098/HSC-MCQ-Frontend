import React, { useState, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, GraduationCap, Sparkles } from 'lucide-react';

// ইমেজ ইমপোর্ট (পাথ ঠিক করে দেওয়া হয়েছে)
import ictImg from "../../assets/ict.png";
import bangla1Img from "../../assets/bangla-1st.png";
import bangla2Img from "../../assets/bangla-2nd.png";
import physics1Img from "../../assets/physics-1st.png";
import physics2Img from "../../assets/physics-2nd.png";
import chemistry1Img from "../../assets/chemistry-1st.png";
import chemistry2Img from "../../assets/chemistry-2nd.png";
import math1Img from "../../assets/math-1st.png";
import math2Img from "../../assets/math-2nd.png";
import biology1Img from "../../assets/biology-1st.png";
import biology2Img from "../../assets/biology-2nd.png";

const useCanHover = () => {
  const [canHover, setCanHover] = useState(false);
  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    setCanHover(mediaQuery.matches);
    const listener = (e) => setCanHover(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);
  return canHover;
};

const subjects = [
  { title: 'বাংলা ১ম', image: bangla1Img, subjectKey: 'bangla-1st' },
  { title: 'বাংলা ২য়', image: bangla2Img, subjectKey: 'bangla-2nd' },
  { title: 'তথ্য ও যোগাযোগ প্রযুক্তি', image: ictImg, subjectKey: 'ict' },
  { title: 'পদার্থবিজ্ঞান ১ম', image: physics1Img, subjectKey: 'physics-1st' },
  { title: 'পদার্থবিজ্ঞান ২য়', image: physics2Img, subjectKey: 'physics-2nd' },
  { title: 'রসায়ন ১ম', image: chemistry1Img, subjectKey: 'chemistry-1st' },
  { title: 'রসায়ন ২য়', image: chemistry2Img, subjectKey: 'chemistry-2nd' },
  { title: 'উচ্চতর গণিত ১ম', image: math1Img, subjectKey: 'math-1st' },
  { title: 'উচ্চতর গণিত ২য়', image: math2Img, subjectKey: 'math-2nd' },
  { title: 'জীববিজ্ঞান ১ম', image: biology1Img, subjectKey: 'biology-1st' },
  { title: 'জীববিজ্ঞান ২য়', image: biology2Img, subjectKey: 'biology-2nd' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: { 
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 25 } 
  },
  hover: { 
    y: -5,
    transition: { type: 'spring', stiffness: 400, damping: 15 } 
  }
};

const SubjectCard = ({ title, image, subjectKey }) => {
  const navigate = useNavigate();
  const canHover = useCanHover();

  return (
    <motion.div
      variants={cardVariants}
      whileHover={canHover ? "hover" : undefined}
      whileTap={{ scale: 0.95 }}
      className="relative cursor-pointer group"
      onClick={() => navigate(`/years?subject=${subjectKey}`)}
    >
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-2 shadow-sm hover:shadow-xl hover:border-cyan-500/30 transition-all duration-300">
        
        {/* Compact Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50 dark:bg-zinc-800">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Minimal Title */}
        <div className="py-3 px-1 text-center">
          <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-zinc-200 font-['Hind_Siliguri'] line-clamp-1 transition-colors group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
            {title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
};

const Subjects = () => {
  const [showNotice, setShowNotice] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#080808] py-12 px-4 sm:px-6 lg:px-8 font-['Hind_Siliguri']">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Compact Header */}
        <header className="text-center mb-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm mb-4"
          >
            <Sparkles size={14} className="text-cyan-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">HSC Question Bank</span>
          </motion.div>
          
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-3 tracking-tighter">
            বিষয় <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">নির্বাচন করুন</span>
          </h1>
        </header>

        {/* Floating Notice */}
        <AnimatePresence>
          {showNotice && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-lg mx-auto mb-10"
            >
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-500/20">
                <AlertTriangle className="text-amber-500 shrink-0" size={18} />
                <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-400 flex-1">
                  এখন শুধুমাত্র <strong className="font-bold">Biology (Rajshahi Board)</strong> লাইভ আছে।
                </p>
                <button onClick={() => setShowNotice(false)} className="text-amber-500 p-1 hover:bg-amber-100 dark:hover:bg-amber-800 rounded-lg">
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compact Grid System */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {subjects.map((s, index) => (
            <SubjectCard key={index} {...s} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Subjects;