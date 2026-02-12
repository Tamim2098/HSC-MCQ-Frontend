import React from 'react';
import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Zap } from 'lucide-react';

const SignInPage = () => {
  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center bg-white dark:bg-[#050505] overflow-hidden p-4">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-cyan-500/10 blur-[80px] md:blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-emerald-500/10 blur-[80px] md:blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-[420px] z-10 flex flex-col items-center"
      >
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-semibold bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100/50 dark:border-cyan-900/30 text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-10">
          <Zap size={14} className="fill-current" />
          HSC MCQ Platform
        </div>

        {/* SignIn Form - Removing the Card container */}
        <div className="w-full">
          <SignIn 
            appearance={{
              elements: {
                // কার্ড এবং বর্ডার রিমুভ করার মূল অংশ
                rootBox: "w-full flex justify-center",
                cardBox: "w-full shadow-none", 
                card: "bg-transparent shadow-none border-none p-0 w-full",
                
                // Typography
                headerTitle: "text-gray-900 dark:text-white font-black text-3xl tracking-tight text-center",
                headerSubtitle: "text-gray-500 dark:text-gray-400 text-center text-sm md:text-base mb-8",
                
                // Social Buttons - Glassmorphism touch
                socialButtonsBlockButton: "bg-gray-100/50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-800 dark:text-white rounded-2xl h-12 transition-all duration-300",
                socialButtonsBlockButtonText: "font-bold tracking-tight",
                
                // Divider
                dividerLine: "bg-gray-200 dark:bg-zinc-800/60",
                dividerText: "text-gray-400 dark:text-zinc-600 font-bold uppercase text-[10px]",
                
                // Inputs
                formFieldLabel: "text-gray-600 dark:text-zinc-400 font-bold ml-1 text-xs uppercase tracking-wider mb-2",
                formFieldInput: "bg-gray-100/30 dark:bg-zinc-900/30 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 rounded-2xl h-12 px-4 transition-all duration-300",
                
                // Submit Button - Matches Hero Section
                formButtonPrimary: "bg-cyan-600 hover:bg-cyan-500 text-white border-none shadow-xl shadow-cyan-600/20 py-3.5 rounded-2xl text-sm font-black uppercase tracking-[0.1em] transition-all active:scale-95 mt-2",
                
                // Footer
                footer: "bg-transparent",
                footerActionLink: "text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 font-black",
                footerActionText: "text-gray-500 dark:text-zinc-500 font-medium",
                identityPreviewText: "text-gray-900 dark:text-white",
                
                // Removes the "Secured by Clerk" border/divider at bottom
                footerBox: "hidden", 
              }
            }}
            routing="path" 
            path="/sign-in" 
          />
        </div>

        {/* Minimal Footer */}
        <p className="text-center mt-12 text-gray-400 dark:text-zinc-600 text-xs tracking-wide">
          Elevate your journey with <br />
          <span className="font-bold text-gray-600 dark:text-zinc-400">HSC MCQ TestZone</span>
        </p>
      </motion.div>
    </div>
  );
};

export default SignInPage;