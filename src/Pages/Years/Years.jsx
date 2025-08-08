import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCalendarAlt, FaCalendarDay, FaCalendarWeek } from 'react-icons/fa';
import { motion } from 'framer-motion';

const getYearStyles = (index) => {
  const colors = [
    { bgColor: 'bg-indigo-100', iconColor: 'text-indigo-600' },
    { bgColor: 'bg-teal-100', iconColor: 'text-teal-600' },
    { bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
    { bgColor: 'bg-green-100', iconColor: 'text-green-600' },
    { bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
  ];
  return colors[index % colors.length];
};

const YearCard = ({ year, icon, subjectKey, index }) => {
  const navigate = useNavigate();
  const { bgColor, iconColor } = getYearStyles(index);

  const handleClick = () => {
    navigate(`/boards?subject=${subjectKey}&year=${year}`);
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
        {year}
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
          Choose a year for <span className="font-semibold text-purple-700">{subjectKey ? subjectKey.replace('-', ' ').toUpperCase() : 'selected subject'}</span>.
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