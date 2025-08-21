import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, FileText, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import './../../custom-styles.css';

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
  if (timeLeft <= 300) return 'text-red-600 bg-red-50 border-red-200';
  if (timeLeft <= 600) return 'text-orange-600 bg-orange-50 border-orange-200';
  return 'text-emerald-600 bg-emerald-50 border-emerald-200';
};

const LoadingState = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center p-4">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full border border-slate-200">
      <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-slate-700 font-medium text-lg">Loading questions...</p>
    </motion.div>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center p-4">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full border border-slate-200">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="w-8 h-8 text-red-600" />
      </div>
      <p className="text-red-600 font-semibold text-lg mb-2">Error Loading Questions</p>
      <p className="text-slate-600 text-sm">{message}</p>
    </motion.div>
  </div>
);

const Header = ({ subject, board, year, timeLeft, answeredCount, totalQuestions, completionPercentage }) => (
  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-4 lg:mb-6 overflow-hidden">
    <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold mb-2">{subject?.replace(/-/g, ' ').toUpperCase() || 'MCQ Test'}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm lg:text-base text-purple-100">
            <span className="bg-purple-500 bg-opacity-30 px-3 py-1 rounded-full">{board ? `${capitalizeWords(board)} Board` : 'General Board'}</span>
            <span className="bg-purple-500 bg-opacity-30 px-3 py-1 rounded-full">Year {year || '2024'}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <motion.div animate={{ scale: timeLeft <= 300 ? [1, 1.05, 1] : 1 }} transition={{ duration: 1, repeat: timeLeft <= 300 ? Infinity : 0 }} className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-medium ${getTimeColor(timeLeft)}`}>
            <Clock className="w-5 h-5" /><span className="text-lg font-mono">{formatTime(timeLeft)}</span>
          </motion.div>
          <div className="text-right">
            <div className="text-sm text-purple-100 mb-1">Progress: {answeredCount}/{totalQuestions}</div>
            <div className="w-32 h-2 bg-purple-500 bg-opacity-30 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${completionPercentage}%` }} className="h-full bg-white rounded-full" transition={{ duration: 0.5 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const Sidebar = ({ questions, currentQuestionIndex, answers, handleQuestionSelect }) => (
  <div className="hidden xl:block">
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sticky top-4">
      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><FileText className="w-5 h-5" />Questions</h3>
      <div className="grid grid-cols-5 gap-4">
        {questions.map((_, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuestionSelect(i)}
            className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center ${i === currentQuestionIndex ? 'bg-purple-600 text-white shadow-lg' : answers?.[i] ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-2 border-slate-200'}`}
          >
            {answers?.[i] ? <CheckCircle className="w-4 h-4" /> : i + 1}
          </motion.button>
        ))}
      </div>
    </motion.div>
  </div>
);

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
      return <span key={index} className="bangla-font">{part}</span>;
    }
  });
};

const MainContent = ({ currentQuestion, currentQuestionIndex, totalQuestions, answers, handleAnswerChange, navigateQuestion, handleSubmit, showGrid, setShowGrid, handleQuestionSelect, questions }) => (
  <div className="xl:col-span-3">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">{currentQuestionIndex + 1}</div>
            <div>
              <p className="font-semibold text-slate-800">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
              <p className="text-sm text-slate-500">{answers?.[currentQuestionIndex] ? 'Answered' : 'Not answered'}</p>
            </div>
          </div>
          <button onClick={() => setShowGrid(!showGrid)} className="xl:hidden bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">View All Questions</button>
        </div>
      </div>
      <AnimatePresence>
        {showGrid && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="xl:hidden bg-slate-50 border-b border-slate-200 p-4">
            <div className="grid grid-cols-5 sm:grid-cols-8 gap-4 sm:gap-6">
              {questions.map((_, i) => (
                <motion.button key={i} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => handleQuestionSelect(i)} className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center ${i === currentQuestionIndex ? 'bg-purple-600 text-white shadow-lg' : answers?.[i] ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200' : 'bg-white text-slate-600 hover:bg-slate-100 border-2 border-slate-200'}`}>
                  {answers?.[i] ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="p-4 lg:p-6">
        <AnimatePresence mode="wait">
          <motion.div key={currentQuestionIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <div className="bg-slate-50 rounded-xl p-4 lg:p-6 mb-6 border border-slate-200">
              <p className="text-lg lg:text-xl font-medium text-slate-800 leading-relaxed math-render-container">
                {renderTextWithMath(currentQuestion?.question)}
              </p>
              {currentQuestion?.image && <div className="mt-4 text-center"><img src={currentQuestion.image} alt="Question" className="max-w-full max-h-64 mx-auto rounded-lg border border-slate-200 shadow-sm" /></div>}
            </div>
            <div className="space-y-4 md:space-y-6">
              {currentQuestion?.options?.map((option, i) => (
                <label key={i} htmlFor={`option-${currentQuestionIndex}-${i}`} className={`relative flex items-start gap-4 p-4 lg:p-5 rounded-xl cursor-pointer transition-all duration-200 group border-2 ${answers?.[currentQuestionIndex] === option ? 'bg-purple-600 text-white border-purple-600 shadow-lg' : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'}`}>
                  <input type="radio" id={`option-${currentQuestionIndex}-${i}`} name={`question-${currentQuestionIndex}`} className="hidden" value={option} checked={answers?.[currentQuestionIndex] === option} onChange={() => handleAnswerChange(option)} disabled={!!answers?.[currentQuestionIndex]} />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5 ${answers?.[currentQuestionIndex] === option ? 'bg-white text-purple-600' : 'bg-purple-100 text-purple-700 group-hover:bg-purple-200'}`}>{String.fromCharCode(65 + i)}</div>
                  <span className="flex-1 font-medium text-base lg:text-lg leading-relaxed">{renderTextWithMath(option)}</span>
                  {answers?.[currentQuestionIndex] === option && <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />}
                </label>
              ))}
            </div>
            <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigateQuestion('prev')} disabled={currentQuestionIndex === 0} className="w-full sm:w-auto px-6 py-3 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-200 text-slate-700 hover:bg-slate-300 flex items-center justify-center gap-2">
                <ChevronLeft className="w-5 h-5" /> Previous
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={currentQuestionIndex === totalQuestions - 1 ? handleSubmit : () => navigateQuestion('next')} className="w-full sm:w-auto px-6 py-3 rounded-full font-semibold transition-all duration-200 bg-purple-600 text-white hover:bg-purple-700 flex items-center justify-center gap-2">
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
  const [timeLeft, setTimeLeft] = useState(1500);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGrid, setShowGrid] = useState(false);

  const timerRef = useRef(null);
  const backendUrl = 'https://hsc-mcq-backend.onrender.com';

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
          setTimeLeft(1500);
          setAnswers({});
          setCurrentQuestionIndex(0);
        } else {
          setError('No questions found for this selection.');
        }
      } catch (err) {
        setError('Error loading questions. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  }, [subject, year, board]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    if (loading || error || timeLeft <= 0) {
      if (timeLeft <= 0) handleSubmit();
      return;
    }
    timerRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft, loading, error]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

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
    navigate('/result', {
      state: {
        answers,
        totalQuestions: questions.length,
        subject,
        currentQuestions: questions,
      },
    });
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const completionPercentage = (answeredCount / totalQuestions) * 100;
  const currentQuestion = questions?.[currentQuestionIndex];

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        <Header
          subject={subject}
          board={board}
          year={year}
          timeLeft={timeLeft}
          answeredCount={answeredCount}
          totalQuestions={totalQuestions}
          completionPercentage={completionPercentage}
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
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
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