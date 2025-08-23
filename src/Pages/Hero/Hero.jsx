import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import HeroIllustration from '../../assets/hero-illustration.png';

const mainContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const textWordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 150,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 100,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8, x: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 100,
      delay: 0.5,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 100,
    },
  },
};


const HeroSection = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const handleStartMCQ = () => {
    navigate('/subjects');
  };

  const mainTitle = "Welcome to the HSC MCQ";

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-black transition-colors duration-500 p-8 flex flex-col items-center justify-center text-center overflow-hidden relative">
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 dark:opacity-10"></div>
      
      <div className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400/20 dark:bg-purple-700/10 blur-3xl animate-pulse-slow"></div>

      <div className="relative z-10 w-full max-w-7xl flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-24">
        <motion.div
          variants={mainContainerVariants}
          initial="hidden"
          animate="visible"
          className="w-full lg:w-1/2 text-center lg:text-left"
        >
          <motion.h1 
            className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold text-gray-900 dark:text-gray-100 leading-tight"
          >
            {mainTitle.split(" ").map((word, index) => (
              <motion.span
                key={index}
                variants={textWordVariants}
                className="inline-block mr-3" 
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              variants={textWordVariants}
              className="inline-block bg-gradient-to-r from-purple-500 to-indigo-600 text-transparent bg-clip-text animate-text-gradient"
            >
              TestZone
            </motion.span>
          </motion.h1>
          
          <motion.p variants={fadeUpVariants} className="mt-4 text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto lg:mx-0">
            Prepare for your exams by taking our comprehensive Multiple Choice Question tests for Physics, Chemistry, Math, and Biology.
          </motion.p>

          <motion.div variants={fadeUpVariants}>
            <motion.button
              onClick={handleStartMCQ}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 px-8 py-4 bg-purple-600 text-white font-bold rounded-full shadow-lg transition-all duration-300 flex items-center justify-center mx-auto lg:mx-0 relative overflow-hidden group"
            >
              <span className="relative z-10">Start MCQ</span>
              <span className="absolute inset-0 rounded-full bg-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></span>
            </motion.button>
          </motion.div>

        </motion.div>

        <motion.div
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          className="w-full lg:w-1/2 flex justify-center lg:justify-end"
        >
          <motion.img 
            src={HeroIllustration} 
            alt="An illustration of a student studying at a desk with books and a laptop, symbolizing exam preparation." 
            className="w-full max-w-md h-auto rounded-xl"
            animate={{ y: [0, -12, 0] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            loading="lazy"
          />
        </motion.div>
      </div>

      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
        }}
        className="relative z-10 mt-20 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left"
      >
        <motion.div
          variants={cardItemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl hover:ring-2 hover:ring-purple-400 hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-offset-gray-950"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Comprehensive Tests
          </h3>
          <p className="mt-3 text-gray-700 dark:text-gray-300">
            Our tests cover the entire syllabus, ensuring you are well-prepared for all topics in Physics, Chemistry, Math, and Biology.
          </p>
        </motion.div>

        <motion.div
          variants={cardItemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl hover:ring-2 hover:ring-purple-400 hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-offset-gray-950"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Instant Feedback
          </h3>
          <p className="mt-3 text-gray-700 dark:text-gray-300">
            Get instant results and detailed explanations for each question to help you understand your mistakes and improve.
          </p>
        </motion.div>

        <motion.div
          variants={cardItemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl hover:ring-2 hover:ring-purple-400 hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-offset-gray-950"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Time Management
          </h3>
          <p className="mt-3 text-gray-700 dark:text-gray-300">
            Practice under timed conditions to improve your speed and accuracy, which is crucial for exam success.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;