import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Landmark, GraduationCap, BookOpen, Globe, Building2, MapPin, School, Library, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

// উন্নত কালার প্যালেট
const getBoardColor = (index) => {
  const colors = [
    { text: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'hover:border-cyan-500/30' },
    { text: 'text-blue-500', bg: 'bg-blue-500/10', border: 'hover:border-blue-500/30' },
    { text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'hover:border-emerald-500/30' },
    { text: 'text-rose-500', bg: 'bg-rose-500/10', border: 'hover:border-rose-500/30' },
    { text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'hover:border-amber-500/30' },
    { text: 'text-violet-500', bg: 'bg-violet-500/10', border: 'hover:border-violet-500/30' },
    { text: 'text-teal-500', bg: 'bg-teal-500/10', border: 'hover:border-teal-500/30' },
    { text: 'text-orange-500', bg: 'bg-orange-500/10', border: 'hover:border-orange-500/30' },
  ];
  return colors[index % colors.length];
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  },
  hover: { y: -5, transition: { duration: 0.2 } }
};

const BoardCard = ({ boardName, icon, boardKey, subjectKey, year, index }) => {
  const navigate = useNavigate();
  const { text, bg, border } = getBoardColor(index);

  return (
    <motion.button
      onClick={() => navigate(`/mcq?subject=${subjectKey}&year=${year}&board=${boardKey}`)}
      variants={cardVariants}
      whileHover="hover"
      whileTap={{ scale: 0.96 }}
      className={`group relative flex flex-col items-center justify-center p-4 rounded-[2rem] transition-all duration-300
        bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800
        shadow-sm hover:shadow-xl ${border}`}
    >
      {/* Icon Circle */}
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:rotate-6 ${bg} ${text}`}>
        {React.cloneElement(icon, { size: 22, strokeWidth: 2 })}
      </div>
      
      {/* Board Name (Bengali) */}
      <h3 className="text-lg font-bold tracking-tight text-gray-800 dark:text-zinc-100 font-['Hind_Siliguri']">
        {boardName}
      </h3>
      
      <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 dark:text-zinc-500 mt-0.5">
        শিক্ষা বোর্ড
      </p>

      {/* Mini Indicator */}
      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all">
        <ChevronRight size={14} className={text} />
      </div>
    </motion.button>
  );
};

const Boards = () => {
  const [searchParams] = useSearchParams();
  const subjectKey = searchParams.get('subject');
  const year = searchParams.get('year');

  const boards = [
    { boardName: 'ঢাকা', icon: <Landmark />, boardKey: 'dhaka' },
    { boardName: 'রাজশাহী', icon: <School />, boardKey: 'rajshahi' },
    { boardName: 'কুমিল্লা', icon: <BookOpen />, boardKey: 'comilla' },
    { boardName: 'যশোর', icon: <Globe />, boardKey: 'jessore' },
    { boardName: 'চট্টগ্রাম', icon: <Building2 />, boardKey: 'chittagong' },
    { boardName: 'বরিশাল', icon: <GraduationCap />, boardKey: 'barisal' },
    { boardName: 'সিলেট', icon: <Library />, boardKey: 'sylhet' },
    { boardName: 'দিনাজপুর', icon: <MapPin />, boardKey: 'dinajpur' },
    { boardName: 'ময়মনসিংহ', icon: <Landmark />, boardKey: 'mymensingh' },
  ];

  const getSubjectTitle = (key) => {
    if (!key) return 'বিষয়';
    return key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#080808] py-16 px-4 font-['Hind_Siliguri']">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        
        {/* Header */}
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm mb-4"
          >
            <Sparkles size={14} className="text-cyan-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Board Selection</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-3 tracking-tighter">
            বোর্ড <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">নির্বাচন করুন</span>
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 text-sm">
             <span className="font-bold text-blue-600">{year}</span> সালের <span className="font-bold text-blue-600">{getSubjectTitle(subjectKey)}</span> বিষয়ের বোর্ডসমূহ
          </p>
        </header>

        {/* Compact Board Grid */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {boards.map((board, index) => (
            <BoardCard
              key={board.boardKey}
              {...board}
              subjectKey={subjectKey}
              year={year}
              index={index}
            />
          ))}
        </motion.div>

        {/* Action Hint */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 inline-flex items-center gap-2 text-xs text-gray-400 dark:text-zinc-600 border-t border-gray-100 dark:border-zinc-800 pt-6"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          আপনার বোর্ডটি নির্বাচন করলেই পরীক্ষা শুরু হয়ে যাবে
        </motion.div>
      </div>
    </div>
  );
};

export default Boards;