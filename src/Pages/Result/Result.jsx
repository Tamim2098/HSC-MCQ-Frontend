import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ChevronLeft } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import './../../custom-styles.css';

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

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { answers, totalQuestions, subject, currentQuestions } = location.state || {};

    if (!answers || !subject || !currentQuestions || currentQuestions.length === 0) {
        return (
            <div className="min-h-screen bg-gray-950 transition-colors duration-500 p-8 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 max-w-3xl mx-auto bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center border border-gray-700/50"
                >
                    <p className="text-red-400 font-semibold text-lg mb-4">No result data found. Please take a quiz first.</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/subjects')}
                        className="mt-4 px-6 py-3 bg-purple-700 text-white rounded-full hover:bg-purple-800 transition font-semibold"
                    >
                        Go to Subjects
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    let correctAnswers = 0;
    currentQuestions.forEach((q, index) => {
        if (answers?.[index] === q.answer) {
            correctAnswers++;
        }
    });

    const scorePercentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);
    const passed = scorePercentage >= 60;

    return (
        <div className="min-h-screen p-4 bg-gray-950 transition-colors duration-500 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden w-full border border-gray-700/50"
            >
                {/* Header */}
                <div className="bg-gray-800 text-white p-6 text-center">
                    <h2 className="text-3xl font-bold capitalize">
                        {subject?.replace(/-/g, ' ')} Result
                    </h2>
                    <p className="text-sm mt-1 text-gray-300">Analysis of your performance</p>
                </div>

                {/* Summary */}
                <div className="p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gray-900/50 rounded-xl p-6 shadow-inner mb-8 text-center border border-gray-700"
                    >
                        <h3 className="text-xl font-bold text-purple-400 mb-2">Quiz Summary</h3>
                        <p className="text-lg text-gray-300">
                            You scored <span className="font-bold text-purple-400">{correctAnswers}</span> out of <span className="font-bold text-purple-400">{totalQuestions}</span> questions.
                        </p>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
                            className={`text-4xl font-extrabold mt-4 ${passed ? 'text-green-400' : 'text-red-400'}`}
                        >
                            Your Score: {scorePercentage}%
                        </motion.div>
                        <p className="text-lg mt-2 font-medium text-gray-200">
                            {passed ? "Congratulations! You passed the quiz." : "Better luck next time"}
                        </p>
                    </motion.div>

                    {/* Detailed Review */}
                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
                            Detailed Review
                        </h3>
                        <div className="space-y-4">
                            {currentQuestions?.map((q, index) => {
                                const userAnswer = answers?.[index];
                                const isCorrect = userAnswer === q.answer;
                                const notAnswered = !answers?.[index];

                                return (
                                    <div
                                        key={index}
                                        className={`bg-gray-800/50 backdrop-blur-md rounded-lg p-5 shadow-sm text-left border-2 transition-colors duration-200 ${
                                            isCorrect ? 'border-green-700' : 'border-red-700'
                                        }`}
                                    >
                                        <div className="flex items-start mb-2">
                                            <span className="font-bold text-lg mr-2 text-gray-200 flex-shrink-0">{index + 1}.</span>
                                            <div className="flex-1 overflow-x-auto">
                                                <p className="font-medium text-gray-200 leading-relaxed">
                                                    {renderTextWithMath(q.question)}
                                                </p>
                                                {q.image && (
                                                    <div className="mt-4 text-center">
                                                        <img
                                                            src={q.image}
                                                            alt="Question"
                                                            className="max-w-full max-h-64 mx-auto rounded-lg border border-gray-700 shadow-sm"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 mt-4">
                                            <p className="text-sm font-semibold flex items-center gap-2 text-gray-400">
                                                Your Answer:
                                                <span className={`${isCorrect ? 'text-green-400' : 'text-red-400 font-bold'}`}>
                                                    {notAnswered ? "Not Answered" : renderTextWithMath(userAnswer)}
                                                </span>
                                                {isCorrect ? (
                                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 text-red-400" />
                                                )}
                                            </p>
                                            {(!isCorrect && !notAnswered) && (
                                                <p className="text-sm font-semibold flex items-center gap-2 text-gray-400">
                                                    Correct Answer:
                                                    <span className="text-green-400 font-bold">
                                                        {renderTextWithMath(q.answer)}
                                                    </span>
                                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="flex justify-center mt-4 mb-6">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/subjects')}
                        className="px-8 py-4 bg-purple-700 text-white rounded-full font-semibold hover:bg-purple-800 transition shadow-lg flex items-center gap-2"
                    >
                        <ChevronLeft className="w-5 h-5" /> Back To Home
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default Result;
