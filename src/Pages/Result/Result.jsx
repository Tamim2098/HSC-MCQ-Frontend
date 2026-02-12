import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Target, Info, Clock, CheckCircle2 } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// --- Animations ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
};

const formatTimeTaken = (totalSeconds) => {
    if (!totalSeconds || totalSeconds <= 0) return "০০:০০";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// --- Updated Text Formatter ---
const renderTextWithMath = (text) => {
    if (!text) return null;

    const mathRegex = /(\$\$[^$]+\$\$|\$[^$]+\$|\\begin\{.*?\}.*?\\end\{.*?\})/g;
    const parts = text.split(mathRegex);

    return parts.map((part, index) => {
        if (!part) return null;

        if (part.startsWith('$$') && part.endsWith('$$')) {
            return <BlockMath key={index} math={part.slice(2, -2)} />;
        } else if (part.startsWith('\\begin{')) {
            return <BlockMath key={index} math={part} />;
        } else if (part.startsWith('$') && part.endsWith('$')) {
            return <InlineMath key={index} math={part.slice(1, -1)} />;
        } else {
            return (
                <span key={index} className="bangla-font whitespace-pre-line">
                    {part}
                </span>
            );
        }
    });
};

const ExplanationSection = ({ explanation }) => {
    // FIXED: Changed default state to false so it stays closed initially
    const [isOpen, setIsOpen] = useState(false); 
    
    if (!explanation || explanation.trim() === "") return null;
    
    const cleanExplanation = explanation.trim();

    return (
        <div className="mt-3 border-t border-zinc-800/50 pt-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-500 hover:opacity-80 transition-all focus:outline-none mb-1"
            >
                <Info size={12} />
                {isOpen ? "ব্যাখ্যা বন্ধ করুন" : "ব্যাখ্যা দেখুন"}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-1 p-2.5 rounded-xl bg-cyan-500/5 text-[13px] text-zinc-400 border border-cyan-500/10 leading-normal whitespace-pre-line">
                            {renderTextWithMath(cleanExplanation)}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { answers, subject, currentQuestions, timeTaken } = location.state || {};

    const totalQuestions = currentQuestions?.length || 0;
    const correctCount = currentQuestions?.reduce((acc, q, i) => (answers[i] === q.answer ? acc + 1 : acc), 0) || 0;
    const wrongCount = currentQuestions?.reduce((acc, q, i) => (answers[i] && answers[i] !== q.answer ? acc + 1 : acc), 0) || 0;
    const skippedCount = totalQuestions - (correctCount + wrongCount);

    if (!answers || !subject || !currentQuestions) {
        return <div className="min-h-screen flex items-center justify-center bg-black text-white">তথ্য পাওয়া যায়নি!</div>;
    }

    return (
        <div className="min-h-screen bg-[#080808] py-8 px-4 font-['Hind_Siliguri'] text-zinc-300">
            <div className="max-w-2xl mx-auto">
                
                <header className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 mb-4">
                        <Target size={14} className="text-cyan-500" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">SOLUTION ANALYSIS</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight capitalize mb-6">
                        {subject.replace(/-/g, ' ')}
                    </h1>
                </header>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#0A0A0A] border border-emerald-500/30 rounded-2xl overflow-hidden shadow-lg">
                        <div className="bg-emerald-600/10 py-1.5 text-center border-b border-emerald-500/10">
                            <span className="text-white font-bold text-[12px]">মার্কস</span>
                        </div>
                        <div className="py-4 flex items-center justify-center gap-2">
                            <CheckCircle2 className="text-emerald-500" size={18} />
                            <span className="text-xl font-black text-white">{correctCount} / {totalQuestions}</span>
                        </div>
                    </div>

                    <div className="bg-[#0A0A0A] border border-sky-500/30 rounded-2xl overflow-hidden shadow-lg">
                        <div className="bg-sky-600/10 py-1.5 text-center border-b border-sky-500/10">
                            <span className="text-white font-bold text-[12px]">সময় নিয়েছো</span>
                        </div>
                        <div className="py-4 flex items-center justify-center gap-2">
                            <Clock className="text-sky-500" size={18} />
                            <span className="text-xl font-black text-white">
                                {formatTimeTaken(timeTaken)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-2 mb-10">
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[12px] font-bold text-zinc-200">{correctCount} সঠিক</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-[12px] font-bold text-zinc-200">{skippedCount} স্কিপ</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-[12px] font-bold text-zinc-200">{wrongCount} ভুল</span>
                    </div>
                </div>

                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                    {currentQuestions.map((q, i) => {
                        const userAnswer = answers[i];
                        const isCorrect = userAnswer === q.answer;
                        const notAnswered = !userAnswer;

                        return (
                            <motion.div 
                                key={i}
                                variants={cardVariants}
                                className="p-5 rounded-[1.2rem] bg-zinc-900/40 border border-zinc-800/60"
                            >
                                <div className="flex gap-4">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0
                                        ${notAnswered ? 'bg-zinc-800 text-zinc-500' : isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                                        {i + 1}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="text-[15px] font-bold text-zinc-200 mb-4 leading-relaxed whitespace-pre-line">
                                            {renderTextWithMath(q.question)}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <div className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/20">
                                                <p className="text-[9px] font-bold uppercase text-zinc-500 mb-1">আপনার উত্তর</p>
                                                <div className={`text-[13px] font-bold ${notAnswered ? 'text-zinc-600' : isCorrect ? 'text-emerald-500' : 'text-red-400'}`}>
                                                    {notAnswered ? "দেওয়া হয়নি" : renderTextWithMath(userAnswer)}
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                                <p className="text-[9px] font-bold uppercase text-emerald-500/40 mb-1">সঠিক উত্তর</p>
                                                <div className="text-[13px] font-bold text-emerald-500">
                                                    {renderTextWithMath(q.answer)}
                                                </div>
                                            </div>
                                        </div>
                                        <ExplanationSection explanation={q.explanation} />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                <div className="mt-12 text-center pb-10">
                    <button onClick={() => navigate('/subjects')} className="inline-flex items-center gap-2 px-10 py-3 bg-zinc-100 text-black rounded-full font-black text-sm hover:bg-white transition-all active:scale-95 shadow-xl">
                        <Home size={16} /> হোম পেজে ফিরে যান
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Result;