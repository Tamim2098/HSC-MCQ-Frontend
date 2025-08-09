import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MCQ = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const subject = searchParams.get('subject');
  const year = searchParams.get('year');
  const board = searchParams.get('board');

  const initialTime = 1500;

  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = 'https://hsc-mcq-backend.onrender.com';

  useEffect(() => {
    if (!subject || !year || !board) {
      setError('Please select a subject, year, and board to view questions.');
      setLoading(false);
      return;
    }

    localStorage.removeItem('quizQuestions');
    localStorage.removeItem('quizAnswers');
    localStorage.removeItem('quizTimeLeft');
    localStorage.removeItem('quizCurrentIndex');
    localStorage.removeItem('quizParams');

    fetchNewQuestions();
  }, [subject, year, board]);

  const fetchNewQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${backendUrl}/api/questions?subject=${subject}&year=${year}&board=${board}`
      );
      if (!res.ok) throw new Error('Failed to fetch questions from server');

      const data = await res.json();
      if (data && data.length > 0) {
        setCurrentQuestions(data);
        setTimeLeft(initialTime);
        setAnswers({});
        setCurrentQuestionIndex(0);
        setIsSubmitted(false);
      } else {
        setError('No questions found for this subject, year, and board.');
      }
    } catch (err) {
      setError('Error loading questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading || error || isSubmitted || timeLeft <= 0) {
      if (timeLeft <= 0 && !isSubmitted) {
        handleSubmit();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, loading, error]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isSubmitted) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isSubmitted]);

  const handleAnswerChange = (event) => {
    const questionId = currentQuestionIndex;
    if (!answers[questionId]) {
      const newAnswers = { ...answers, [questionId]: event.target.value };
      setAnswers(newAnswers);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleQuestionButtonClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      localStorage.removeItem('quizQuestions');
      localStorage.removeItem('quizAnswers');
      localStorage.removeItem('quizTimeLeft');
      localStorage.removeItem('quizCurrentIndex');
      localStorage.removeItem('quizParams');

      navigate('/result', {
        state: {
          answers,
          totalQuestions: currentQuestions.length,
          subject,
          currentQuestions,
        },
      });
    }, 800);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-8 flex items-center justify-center">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
          <p className="text-gray-700 font-semibold text-lg">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-8 flex flex-col items-center justify-center text-center">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
          <p className="text-red-600 font-semibold text-lg mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!currentQuestions || currentQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-8 flex items-center justify-center">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
          <p className="text-red-600 font-semibold text-lg">
            No questions available for the selected criteria.
          </p>
        </div>
      </div>
    );
  }

  const allQuestions = Array.from({ length: currentQuestions.length }, (_, i) => i);
  const currentQuestion = currentQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-4 sm:p-8 flex items-center justify-center">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden w-full border border-gray-200">
        <div className="bg-purple-700 text-white p-4 sm:p-6 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold capitalize flex flex-col items-center sm:flex-row sm:items-baseline">
            {subject?.replace(/-/g, ' ')} MCQ Test
            <span className="text-sm sm:text-base font-normal text-purple-200 ml-0 sm:ml-4 mt-1 sm:mt-0">
              ({board?.replace(/-/g, ' ')} Board {year})
            </span>
          </h2>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="flex items-center space-x-2 bg-white text-purple-700 rounded-full px-3 py-1 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-lg font-semibold">{formatTime(timeLeft)}</span>
          </motion.div>
        </div>

        <div className="p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="mb-6"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-base font-semibold text-gray-600">
                  Question {currentQuestionIndex + 1} of {currentQuestions.length}
                </span>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 sm:p-6 border border-gray-200">
                <p className="text-lg font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {currentQuestion.question}
                </p>
                {currentQuestion.image && (
                  <div className="my-4 text-center">
                    <img
                      src={currentQuestion.image}
                      alt="উদ্দীপকের চিত্র"
                      className="max-w-full mx-auto rounded-lg border border-gray-300"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {currentQuestion.options.map((option, i) => (
                  <motion.label
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`relative flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 shadow-sm
                      ${answers[currentQuestionIndex] === option
                        ? 'bg-purple-600 text-white shadow-md transform scale-105'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200'
                      }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      className="hidden"
                      value={option}
                      checked={answers[currentQuestionIndex] === option}
                      onChange={handleAnswerChange}
                      disabled={!!answers[currentQuestionIndex] || isSubmitted}
                    />
                    <span className={`w-8 h-8 mr-4 rounded-full flex items-center justify-center font-bold text-sm
                      ${answers[currentQuestionIndex] === option
                        ? 'bg-white text-purple-600'
                        : 'bg-purple-200 text-purple-700'
                      }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1 font-medium text-base sm:text-lg">{option}</span>
                  </motion.label>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="bg-gray-100 p-4 sm:p-6 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4">
            {allQuestions.map((i) => (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                key={i}
                onClick={() => handleQuestionButtonClick(i)}
                className={`w-12 h-10 rounded-lg text-sm font-bold transition-all duration-200
                  ${i === currentQuestionIndex
                    ? 'bg-purple-700 text-white'
                    : answers[i]
                      ? 'bg-purple-300 text-purple-800'
                      : 'bg-white text-gray-500 border border-gray-300'
                  }`}
                title={`Question ${i + 1}`}
                disabled={isSubmitted}
              >
                {i + 1}
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
            whileTap={{ scale: 0.97 }}
            onClick={
              currentQuestionIndex === currentQuestions.length - 1
                ? handleSubmit
                : handleNextQuestion
            }
            disabled={isSubmitted}
            animate={isSubmitted ? { scale: [1, 0.9, 1.1, 0], opacity: [1, 0.5, 0], transition: { duration: 0.8 } } : {}}
            className="px-6 py-3 w-full bg-purple-700 text-white rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-800"
          >
            {currentQuestionIndex === currentQuestions.length - 1 ? 'Submit' : 'Next'}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default MCQ;