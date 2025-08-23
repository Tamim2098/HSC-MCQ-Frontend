import React from 'react';
import { useState, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFlask, FaAtom, FaCalculator, FaMicroscope, FaDna, FaSatelliteDish, FaTimes } from 'react-icons/fa';
import { GiNotebook, GiChemicalBolt } from 'react-icons/gi';
import { motion, AnimatePresence } from 'framer-motion';

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


const subjectStyles = {
  physics: { iconColor: 'text-indigo-600 dark:text-indigo-400' },
  chemistry: { iconColor: 'text-teal-600 dark:text-teal-400' },
  math: { iconColor: 'text-orange-600 dark:text-orange-400' },
  biology: { iconColor: 'text-green-600 dark:text-green-400' },
  default: { iconColor: 'text-gray-600 dark:text-gray-400' },
};

const getSubjectStyles = (subjectKey) => {
  const subjectType = subjectKey.split('-')[0];
  return subjectStyles[subjectType] || subjectStyles.default;
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 12 }
  },
};

const SubjectCard = ({ title, icon, subjectKey }) => {
  const navigate = useNavigate();
  const { iconColor } = getSubjectStyles(subjectKey);
  const canHover = useCanHover();

  const handleClick = () => {
    navigate(`/years?subject=${subjectKey}`);
  };

  return (
    <motion.div
      onClick={handleClick}
      variants={cardVariants}
      whileHover={canHover ? { scale: 1.05, y: -8 } : {}}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative flex flex-col items-center justify-center p-4 min-h-[160px] rounded-2xl shadow-lg transition-shadow duration-300 cursor-pointer group
        bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700/50
        [@media(hover:hover)]:hover:shadow-2xl 
        [@media(hover:hover)]:hover:ring-2 
        [@media(hover:hover)]:hover:ring-purple-400 
        [@media(hover:hover)]:hover:ring-offset-2 
        [@media(hover:hover)]:hover:ring-offset-white 
        dark:[@media(hover:hover)]:hover:ring-offset-gray-950`}
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={`p-4 rounded-full bg-gray-100 dark:bg-gray-700 ${iconColor} mb-3`}
      >
        {React.cloneElement(icon, { className: `text-3xl` })}
      </motion.div>
      
      <h3 className="text-base md:text-lg font-semibold text-center leading-tight text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      
      <div className="absolute bottom-2 right-2 opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-opacity duration-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${iconColor}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const Subjects = () => {
  const [showNotice, setShowNotice] = useState(true);
  const subjects = [
    { title: 'Physics First Paper', icon: <FaAtom />, subjectKey: 'physics-1st' },
    { title: 'Physics Second Paper', icon: <FaSatelliteDish />, subjectKey: 'physics-2nd' },
    { title: 'Chemistry First Paper', icon: <FaFlask />, subjectKey: 'chemistry-1st' },
    { title: 'Chemistry Second Paper', icon: <GiChemicalBolt />, subjectKey: 'chemistry-2nd' },
    { title: 'Higher Math First Paper', icon: <FaCalculator />, subjectKey: 'math-1st' },
    { title: 'Higher Math Second Paper', icon: <GiNotebook />, subjectKey: 'math-2nd' },
    { title: 'Biology First Paper', icon: <FaMicroscope />, subjectKey: 'biology-1st' },
    { title: 'Biology Second Paper', icon: <FaDna />, subjectKey: 'biology-2nd' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-black transition-colors duration-500 p-8 flex flex-col items-center">
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 dark:opacity-10"></div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-5xl text-center mb-12 relative z-10"
      >
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
          HSC MCQ <span className="bg-gradient-to-r from-purple-500 to-indigo-600 text-transparent bg-clip-text">TestZone</span>
        </h1>
        <p className="mt-4 text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Choose a subject to start your MCQ test.
        </p>
      </motion.div>

      <AnimatePresence>
        {showNotice && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="w-full max-w-xl p-4 mb-8 relative z-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-lg shadow-xl border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-gray-100"
          >
            <div className="flex items-start">
              <span className="text-2xl mr-3 text-yellow-500">⚠️</span>
              <div className="flex-grow">
                <p className="font-bold">Notice:</p>
                <p className="mt-1 text-sm md:text-base">
                  This is a beta version. The 2025 Biology First and Second Paper questions for the Rajshahi Board have been added. More questions will be added soon.
                </p>
              </div>
              <button
                onClick={() => setShowNotice(false)}
                className="ml-4 p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Close Notice"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl relative z-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.subjectKey}
              {...subject}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Subjects;