import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaUniversity, FaGraduationCap, FaBookOpen, FaGlobe } from 'react-icons/fa';
import { motion } from 'framer-motion';

const getBoardStyles = (index) => {
  const colors = [
    { iconColor: 'text-indigo-400' },
    { iconColor: 'text-teal-400' },
    { iconColor: 'text-orange-400' },
    { iconColor: 'text-green-400' },
    { iconColor: 'text-purple-400' },
    { iconColor: 'text-red-400' },
    { iconColor: 'text-blue-400' },
    { iconColor: 'text-yellow-400' },
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

const BoardCard = ({ boardName, icon, boardKey, subjectKey, year, index }) => {
  const navigate = useNavigate();
  const { iconColor } = getBoardStyles(index);

  const handleClick = () => {
    navigate(`/mcq?subject=${subjectKey}&year=${year}&board=${boardKey}`);
  };

  return (
    <motion.div
      onClick={handleClick}
      variants={cardVariants}
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative flex flex-col items-center justify-center p-4 min-h-[160px] rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group
        bg-gray-800/50 backdrop-blur-md 
        border border-gray-700/50
        hover:ring-2 hover:ring-purple-400 hover:ring-offset-2 hover:ring-offset-gray-950`}
    >
      <div className={`p-4 rounded-full bg-gray-700 ${iconColor} mb-3`}>
        {React.cloneElement(icon, { className: `text-3xl` })}
      </div>

      <h3 className="text-base md:text-lg font-semibold text-center leading-tight text-gray-100">
        {boardName}
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
      staggerChildren: 0.07,
    },
  },
};

const Boards = () => {
  const [searchParams] = useSearchParams();
  const subjectKey = searchParams.get('subject');
  const year = searchParams.get('year');

  const boards = [
    { boardName: 'Dhaka Board', icon: <FaUniversity />, boardKey: 'dhaka' },
    { boardName: 'Rajshahi Board', icon: <FaGraduationCap />, boardKey: 'rajshahi' },
    { boardName: 'Comilla Board', icon: <FaBookOpen />, boardKey: 'comilla' },
    { boardName: 'Jessore Board', icon: <FaGlobe />, boardKey: 'jessore' },
    { boardName: 'Chittagong Board', icon: <FaUniversity />, boardKey: 'chittagong' },
    { boardName: 'Barisal Board', icon: <FaGraduationCap />, boardKey: 'barisal' },
    { boardName: 'Sylhet Board', icon: <FaBookOpen />, boardKey: 'sylhet' },
    { boardName: 'Dinajpur Board', icon: <FaGlobe />, boardKey: 'dinajpur' },
  ];

  const getSubjectTitle = (key) => {
    if (!key) return 'Selected Subject';
    return key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const subjectTitle = getSubjectTitle(subjectKey);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black transition-colors duration-500 p-8 flex flex-col items-center">
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-5xl text-center mb-12 relative z-10"
      >
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-gray-100 leading-tight">
          Choose a Board
        </h1>
        <p className="mt-4 text-base md:text-xl text-gray-400 max-w-2xl mx-auto">
          For <span className="font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 text-transparent bg-clip-text">{subjectTitle}</span> - Year <span className="font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 text-transparent bg-clip-text">{year}</span>
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl relative z-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {boards.map((board, index) => (
            <BoardCard
              key={board.boardKey}
              {...board}
              subjectKey={subjectKey}
              year={year}
              index={index}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Boards;