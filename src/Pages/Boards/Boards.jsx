import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaUniversity, FaGraduationCap, FaBookOpen, FaGlobe } from 'react-icons/fa';
import { motion } from 'framer-motion';

const getBoardStyles = (index) => {
  const colors = [
    { bgColor: 'bg-indigo-100', iconColor: 'text-indigo-600' },
    { bgColor: 'bg-teal-100', iconColor: 'text-teal-600' },
    { bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
    { bgColor: 'bg-green-100', iconColor: 'text-green-600' },
    { bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
    { bgColor: 'bg-red-100', iconColor: 'text-red-600' },
    { bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    { bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
  ];
  return colors[index % colors.length];
};

const BoardCard = ({ boardName, icon, boardKey, subjectKey, year, index }) => {
  const navigate = useNavigate();
  const { bgColor, iconColor } = getBoardStyles(index);

  const handleClick = () => {
    navigate(`/mcq?subject=${subjectKey}&year=${year}&board=${boardKey}`);
  };

  return (
    <motion.div
      onClick={handleClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={`relative flex flex-col items-center justify-center p-4 min-h-[160px] rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group ${bgColor}`}
    >
      <div className={`p-4 rounded-full bg-white ${iconColor} mb-3`}>
        {React.cloneElement(icon, {
          className: `text-3xl`
        })}
      </div>
      <p className={`text-base md:text-lg font-semibold text-center leading-tight ${iconColor}`}>
        {boardName}
      </p>
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-purple-500"
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

const Boards = () => {
  const [searchParams] = useSearchParams();
  const subjectKey = searchParams.get('subject');
  const year = searchParams.get('year');

  const boards = [
    { boardName: 'Dhaka Education Board', icon: <FaUniversity />, boardKey: 'dhaka' },
    { boardName: 'Rajshahi Education Board', icon: <FaGraduationCap />, boardKey: 'rajshahi' },
    { boardName: 'Comilla Education Board', icon: <FaBookOpen />, boardKey: 'comilla' },
    { boardName: 'Jessore Education Board', icon: <FaGlobe />, boardKey: 'jessore' },
    { boardName: 'Chittagong Education Board', icon: <FaUniversity />, boardKey: 'chittagong' },
    { boardName: 'Barisal Education Board', icon: <FaGraduationCap />, boardKey: 'barisal' },
    { boardName: 'Sylhet Education Board', icon: <FaBookOpen />, boardKey: 'sylhet' },
    { boardName: 'Dinajpur Education Board', icon: <FaGlobe />, boardKey: 'dinajpur' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-8 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          HSC MCQ <span className="text-purple-600">TestZone</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Choose a board for <span className="font-semibold text-purple-700">{subjectKey ? subjectKey.replace('-', ' ').toUpperCase() : 'selected subject'}</span> in <span className="font-semibold text-purple-700">{year}</span>.
        </p>
        <div className="mt-2 text-sm text-gray-500">
          <p>
            Made by <span className="font-semibold text-purple-700">TAMIM TAJWAR</span>
          </p>
          <p className="mt-1 font-medium text-red-500">(Beta Version)</p>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        className="w-full max-w-5xl"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {boards.map((board, index) => (
            <BoardCard
              key={board.boardKey}
              boardName={board.boardName}
              icon={board.icon}
              boardKey={board.boardKey}
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