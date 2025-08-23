import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCalendarAlt, FaCalendarDay, FaCalendarWeek } from 'react-icons/fa';
import { motion } from 'framer-motion';

const getYearStyles = (index) => {
  const colors = [
    { iconColor: 'text-indigo-600 dark:text-indigo-400' },
    { iconColor: 'text-teal-600 dark:text-teal-400' },
    { iconColor: 'text-orange-600 dark:text-orange-400' },
    { iconColor: 'text-green-600 dark:text-green-400' },
    { iconColor: 'text-purple-600 dark:text-purple-400' },
  ];
  return colors[index % colors.length];
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 12 }
  },
};

const YearCard = ({ year, icon, subjectKey, index }) => {
  const navigate = useNavigate();
  const { iconColor } = getYearStyles(index);

  const handleClick = () => {
    navigate(`/boards?subject=${subjectKey}&year=${year}`);
  };

  return (
    <motion.div
      onClick={handleClick}
      variants={cardVariants}
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative flex flex-col items-center justify-center p-4 min-h-[160px] rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group
        bg-white/50 dark:bg-gray-800/50 backdrop-blur-md 
        border border-gray-200/50 dark:border-gray-700/50
        hover:ring-2 hover:ring-purple-400 hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-offset-gray-950`}
    >
      <div className={`p-4 rounded-full bg-white dark:bg-gray-700 ${iconColor} mb-3`}>
        {React.cloneElement(icon, { className: `text-3xl` })}
      </div>
      
      <h3 className="text-xl md:text-2xl font-semibold text-center leading-tight text-gray-900 dark:text-gray-100">
        {year}
      </h3>
      
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

const Years = () => {
  const [searchParams] = useSearchParams();
  const subjectKey = searchParams.get('subject');

  const years = [
    { year: 2025, icon: <FaCalendarAlt /> },
    { year: 2024, icon: <FaCalendarDay /> },
    { year: 2023, icon: <FaCalendarWeek /> },
    { year: 2022, icon: <FaCalendarAlt /> },
    { year: 2021, icon: <FaCalendarDay /> },
  ];

  const getSubjectTitle = (key) => {
    if (!key) return 'Selected Subject';
    const words = key.split('-');
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const subjectTitle = getSubjectTitle(subjectKey);

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
          Select a Year for
          <br/>
          <span className="bg-gradient-to-r from-purple-500 to-indigo-600 text-transparent bg-clip-text">{subjectTitle}</span>
        </h1>
        <p className="mt-4 text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Choose a year to see the board questions.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl relative z-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {years.map((yearData, index) => (
            <YearCard
              key={yearData.year}
              year={yearData.year}
              icon={yearData.icon}
              subjectKey={subjectKey}
              index={index} 
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Years;