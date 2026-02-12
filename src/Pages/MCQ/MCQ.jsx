import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, FileText, CheckCircle, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import './../../custom-styles.css';

// Constant for Timer
const INITIAL_TIME = 1500; 

const capitalizeWords = (str) => {
  if (!str) return '';
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const getTimeColor = (timeLeft) => {
  if (timeLeft <= 300) return 'text-red-500 dark:text-red-400';
  if (timeLeft <= 600) return 'text-amber-500 dark:text-amber-400';
  return 'text-cyan-600 dark:text-cyan-400';
};

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-black">
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="rounded-lg shadow-2xl p-8 text-center max-w-md w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800"
    >
      <div className="animate-spin w-12 h-12 border-4 border-t-transparent rounded-full mx-auto mb-4 border-cyan-500 dark:border-cyan-400"></div>
      <p className="font-medium text-lg text-gray-700 dark:text-gray-300">Loading questions...</p>
    </motion.div>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-black">
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="rounded-lg shadow-2xl p-8 text-center max-w-md w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800"
    >
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800">
        <XCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
      </div>
      <p className="font-semibold text-lg mb-2 text-red-600 dark:text-red-400">Error Loading Questions</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
    </motion.div>
  </div>
);

const Header = ({ subject, board, year, timeLeft, answeredCount, totalQuestions, completionPercentage }) => (
  <motion.div 
    initial={{ opacity: 0, y: -20 }} 
    animate={{ opacity: 1, y: 0 }} 
    className="rounded-lg shadow-lg mb-4 lg:mb-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800"
  >
    <div className="p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            {subject?.replace(/-/g, ' ').toUpperCase() || 'MCQ Test'}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm lg:text-base text-gray-500 dark:text-gray-400">
            <span className="px-3 py-1 rounded border bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
              {board ? `${capitalizeWords(board)} Board` : 'General Board'}
            </span>
            <span className="px-3 py-1 rounded border bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
              Year {year || '2024'}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <motion.div 
            animate={{ scale: timeLeft <= 300 ? [1, 1.05, 1] : 1 }} 
            transition={{ duration: 1, repeat: timeLeft <= 300 ? Infinity : 0 }} 
            className="flex items-center gap-2 px-4 py-2 rounded border bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
          >
            <Clock className={`w-5 h-5 ${getTimeColor(timeLeft)}`} />
            <span className={`text-lg font-mono font-semibold ${getTimeColor(timeLeft)}`}>
              {formatTime(timeLeft)}
            </span>
          </motion.div>
          <div className="text-right">
            <div className="text-sm mb-1 text-gray-500 dark:text-gray-400">
              Progress: {answeredCount}/{totalQuestions}
            </div>
            <div className="w-32 h-2 rounded-full overflow-hidden border bg-gray-200 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${completionPercentage}%` }} 
                className="h-full rounded-full bg-cyan-500 dark:bg-cyan-400" 
                transition={{ duration: 0.5 }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const Sidebar = ({ questions, currentQuestionIndex, answers, handleQuestionSelect }) => (
  <div className="hidden xl:block">
    <motion.div 
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="rounded-lg shadow-lg p-4 sticky top-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800"
    >
      <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
        <FileText className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
        Questions
      </h3>
      <div className="grid grid-cols-5 gap-3">
        {questions.map((_, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuestionSelect(i)}
            className={`w-10 h-10 rounded text-sm font-semibold transition-all duration-200 flex items-center justify-center border
              ${i === currentQuestionIndex 
                ? 'bg-cyan-500 text-white dark:text-black border-cyan-600 dark:border-cyan-400 shadow-lg shadow-cyan-500/50' 
                : answers?.[i] 
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700' 
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700 border-gray-200 dark:border-zinc-700'}`}
          >
            {answers?.[i] ? <CheckCircle className="w-4 h-4" /> : i + 1}
          </motion.button>
        ))}
      </div>
    </motion.div>
  </div>
);

const renderTextWithBreaks = (text) => {
  if (!text) return null;
  return text.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index < text.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));
};

const renderTextWithMath = (text) => {
  if (!text) return null;
  const mathRegex = /(\$\$[^$]+\$\$|\$[^$]+\$|\\begin\{.*?\}.*?\\end\{.*?\})/g;
  const parts = text.split(mathRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    if (part.startsWith('$$') && part.endsWith('$$')) {
      const mathContent = part.slice(2, -2);
      return <BlockMath key={index} math={mathContent} />;
    } else if (part.startsWith('\\begin{')) {
      return <BlockMath key={index} math={part} />;
    } else if (part.startsWith('$') && part.endsWith('$')) {
      const mathContent = part.slice(1, -1);
      return <InlineMath key={index} math={mathContent} />;
    } else {
      return <span key={index} className="bangla-font">{renderTextWithBreaks(part)}</span>;
    }
  });
};

const MainContent = ({ 
  currentQuestion, 
  currentQuestionIndex, 
  totalQuestions, 
  answers, 
  handleAnswerChange, 
  navigateQuestion, 
  handleSubmit, 
  showGrid, 
  setShowGrid, 
  handleQuestionSelect, 
  questions 
}) => (
  <div className="xl:col-span-3">
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="rounded-lg shadow-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800"
    >
      <div className="p-4 lg:p-6 border-b bg-gray-50/50 dark:bg-zinc-900/80 border-gray-200 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg bg-cyan-500 text-white dark:text-black shadow-cyan-500/30">
              {currentQuestionIndex + 1}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {answers?.[currentQuestionIndex] ? 'Answered' : 'Not answered'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowGrid(!showGrid)} 
            className="xl:hidden bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded font-medium transition-colors"
          >
            View All Questions
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showGrid && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }} 
            className="xl:hidden p-4 border-b bg-gray-50 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800"
          >
            <div className="grid grid-cols-5 sm:grid-cols-8 gap-3">
              {questions.map((_, i) => (
                <motion.button 
                  key={i} 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={() => handleQuestionSelect(i)} 
                  className={`w-10 h-10 rounded text-sm font-semibold transition-all duration-200 flex items-center justify-center border
                    ${i === currentQuestionIndex 
                      ? 'bg-cyan-500 text-white dark:text-black border-cyan-600 dark:border-cyan-400 shadow-lg shadow-cyan-500/50' 
                      : answers?.[i] 
                      ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700' 
                      : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700 border-gray-200 dark:border-zinc-700'}`}
                >
                  {answers?.[i] ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 lg:p-6">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQuestionIndex} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-lg p-4 lg:p-6 mb-6 border bg-gray-50 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700">
              <p className="text-lg lg:text-xl font-medium leading-relaxed math-render-container text-gray-800 dark:text-gray-200">
                {renderTextWithMath(currentQuestion?.question)}
              </p>
              {currentQuestion?.image && (
                <div className="mt-4 text-center">
                  <img 
                    src={currentQuestion.image} 
                    alt="Question" 
                    className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700" 
                  />
                </div>
              )}
            </div>

            <div className="space-y-3">
              {currentQuestion?.options?.map((option, i) => (
                <label 
                  key={i} 
                  htmlFor={`option-${currentQuestionIndex}-${i}`} 
                  className={`relative flex items-center gap-4 p-4 lg:p-5 rounded-lg cursor-pointer transition-all duration-200 group border
                    ${answers?.[currentQuestionIndex] === option 
                      ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-600/30' 
                      : 'bg-gray-50 dark:bg-zinc-800/70 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'}`}
                >
                  <input 
                    type="radio" 
                    id={`option-${currentQuestionIndex}-${i}`} 
                    name={`question-${currentQuestionIndex}`} 
                    className="hidden" 
                    value={option} 
                    checked={answers?.[currentQuestionIndex] === option} 
                    onChange={() => handleAnswerChange(option)} 
                    disabled={!!answers?.[currentQuestionIndex]} 
                  />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0
                    ${answers?.[currentQuestionIndex] === option 
                      ? 'bg-white dark:bg-black text-cyan-600 dark:text-cyan-400' 
                      : 'bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-cyan-400 group-hover:bg-gray-300 dark:group-hover:bg-zinc-600'}`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div className="flex-1 font-medium text-base lg:text-lg leading-relaxed bangla-font text-left">
                    {renderTextWithMath(option)}
                  </div>
                  {answers?.[currentQuestionIndex] === option && (
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                  )}
                </label>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                onClick={() => navigateQuestion('prev')} 
                disabled={currentQuestionIndex === 0} 
                className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 border-gray-200 dark:border-zinc-700"
              >
                <ChevronLeft className="w-5 h-5" /> Previous
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                onClick={currentQuestionIndex === totalQuestions - 1 ? handleSubmit : () => navigateQuestion('next')} 
                className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg bg-cyan-600 text-white hover:bg-cyan-700 shadow-cyan-600/30"
              >
                {currentQuestionIndex === totalQuestions - 1 ? 'Submit' : 'Next Question'}
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  </div>
);

const MCQ = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const subject = searchParams.get('subject');
  const year = searchParams.get('year');
  const board = searchParams.get('board');

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGrid, setShowGrid] = useState(false);

  const timerRef = useRef(null);
  const backendUrl = 'http://localhost:5000';

  const fetchQuestions = useMemo(() => {
    return async () => {
      if (!subject || !year || !board) {
        setError('Please select a subject, year, and board.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${backendUrl}/api/questions?subject=${subject}&year=${year}&board=${board}`);
        if (!res.ok) throw new Error('Failed to fetch questions');
        const data = await res.json();
        if (data && data.length > 0) {
          setQuestions(data);
          setTimeLeft(INITIAL_TIME);
          setAnswers({});
          setCurrentQuestionIndex(0);
        } else {
          setError('No questions found for this selection.');
        }
      } catch (err) {
        setError('Error loading questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  }, [subject, year, board]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  useEffect(() => {
    if (loading || error || timeLeft <= 0) {
      if (timeLeft <= 0) handleSubmit();
      return;
    }
    timerRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft, loading, error]);

  const handleAnswerChange = (option) => {
    if (!answers?.[currentQuestionIndex]) {
      setAnswers(prev => ({ ...prev, [currentQuestionIndex]: option }));
    }
  };

  const navigateQuestion = (direction) => {
    if (direction === 'next' && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
    setShowGrid(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    clearInterval(timerRef.current);
    const timeSpentInSeconds = INITIAL_TIME - timeLeft;
    
    navigate('/result', {
      state: {
        answers,
        totalQuestions: questions.length,
        subject,
        currentQuestions: questions,
        timeTaken: timeSpentInSeconds 
      },
    });
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen p-2 sm:p-4 lg:p-6 bg-gray-100 dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <Header
          subject={subject} board={board} year={year} timeLeft={timeLeft}
          answeredCount={Object.keys(answers).length}
          totalQuestions={questions.length}
          completionPercentage={(Object.keys(answers).length / questions.length) * 100}
        />
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
          <Sidebar
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            handleQuestionSelect={handleQuestionSelect}
          />
          <MainContent
            questions={questions}
            currentQuestion={questions?.[currentQuestionIndex]}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            answers={answers}
            handleAnswerChange={handleAnswerChange}
            navigateQuestion={navigateQuestion}
            handleSubmit={handleSubmit}
            showGrid={showGrid}
            setShowGrid={setShowGrid}
            handleQuestionSelect={handleQuestionSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default MCQ;