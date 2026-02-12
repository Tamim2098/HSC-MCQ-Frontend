import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, CalendarDays, CalendarRange, ChevronRight, Clock, History, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

// উন্নত কালার ম্যাপিং
const getYearColor = (index) => {
  const colors = [
    { text: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'hover:border-cyan-500/30' },
    { text: 'text-blue-500', bg: 'bg-blue-500/10', border: 'hover:border-blue-500/30' },
    { text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'hover:border-emerald-500/30' },
    { text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'hover:border-amber-500/30' },
    { text: 'text-rose-500', bg: 'bg-rose-500/10', border: 'hover:border-rose-500/30' },
  ];
  return colors[index % colors.length];
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 20 }
  },
  hover: { y: -5, transition: { duration: 0.2 } }
};

const YearCard = ({ year, icon, subjectKey, index }) => {
  const navigate = useNavigate();
  const { text, bg, border } = getYearColor(index);

  return (
    <motion.button
      onClick={() => navigate(`/boards?subject=${subjectKey}&year=${year}`)}
      variants={cardVariants}
      whileHover="hover"
      whileTap={{ scale: 0.95 }}
      className={`group relative flex flex-col items-center justify-center p-4 rounded-3xl transition-all duration-300
        bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800
        shadow-sm hover:shadow-xl ${border}`}
    >
      {/* Year Circle Container */}
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 ${bg} ${text}`}>
        {React.cloneElement(icon, { size: 24, strokeWidth: 2 })}
      </div>
      
      {/* Year Text */}
      <h3 className="text-xl font-black tracking-tighter text-gray-800 dark:text-zinc-100 font-['Hind_Siliguri']">
        {year}
      </h3>
      
      <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 dark:text-zinc-500 mt-1">
        প্রশ্নপত্র
      </p>

      {/* Mini Arrow Indicator */}
      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
        <ChevronRight size={14} className={text} />
      </div>
    </motion.button>
  );
};

const Years = () => {
  const [searchParams] = useSearchParams();
  const subjectKey = searchParams.get('subject');

  const years = [
    { year: 2025, icon: <Clock /> },
    { year: 2024, icon: <CalendarDays /> },
    { year: 2023, icon: <CalendarRange /> },
    { year: 2022, icon: <Calendar /> },
    { year: 2021, icon: <History /> },
  ];

  const getSubjectTitle = (key) => {
    if (!key) return 'বিষয়';
    return key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#080808] py-16 px-4 font-['Hind_Siliguri']">
      
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        
        {/* Compact Header */}
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm mb-4"
          >
            <Sparkles size={14} className="text-cyan-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Archive Selection</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-3 tracking-tighter">
            সাল <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">নির্বাচন করুন</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
             <span className="font-bold text-cyan-600 dark:text-cyan-400">{getSubjectTitle(subjectKey)}</span>-এর বিগত বছরের বোর্ড প্রশ্নসমূহ
          </p>
        </header>

        {/* Compact Grid */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {years.map((yearData, index) => (
            <YearCard
              key={yearData.year}
              {...yearData}
              subjectKey={subjectKey}
              index={index} 
            />
          ))}
        </motion.div>

        {/* Back Button Hint */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-xs text-gray-400 dark:text-zinc-600"
        >
          অন্য বিষয় নির্বাচন করতে চাইলে ব্যাক বাটনে ক্লিক করুন
        </motion.p>
      </div>
    </div>
  );
};

export default Years;