import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleStartMCQ = () => {
    navigate('/subjects');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-8 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-5xl"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
          Welcome to the HSC MCQ <span className="text-purple-600">TestZone</span>
        </h1>
        <p className="mt-6 text-lg md:text-2xl text-gray-700 max-w-3xl mx-auto">
          Prepare for your exams by taking our comprehensive Multiple Choice Question tests for Physics, Chemistry, Math, and Biology.
        </p>

        <motion.button
          onClick={handleStartMCQ}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 px-8 py-4 bg-purple-600 text-white font-bold rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-300 transform hover:-translate-y-1"
        >
          Start MCQ
        </motion.button>

        <div className="mt-6 text-sm text-gray-500">
          <p>
            Made by <span className="font-semibold text-purple-700">TAMIM TAJWAR</span>
          </p>
          <p className="mt-1 font-medium text-red-500">(Beta Version)</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-16 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
      >
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Comprehensive Tests
          </h3>
          <p className="mt-3 text-gray-600">
            Our tests cover the entire syllabus, ensuring you are well-prepared for all topics in Physics, Chemistry, Math, and Biology.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Instant Feedback
          </h3>
          <p className="mt-3 text-gray-600">
            Get instant results and detailed explanations for each question to help you understand your mistakes and improve.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Time Management
          </h3>
          <p className="mt-3 text-gray-600">
            Practice under timed conditions to improve your speed and accuracy, which is crucial for exam success.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;