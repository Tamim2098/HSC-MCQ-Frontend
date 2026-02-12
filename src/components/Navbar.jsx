import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogIn } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom'; // useNavigate যোগ করা হয়েছে
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate(); // নেভিগেশনের জন্য

  // যে পেজগুলোতে Navbar হাইড থাকবে
  const hiddenPaths = ['/mcq', '/result', '/sign-in']; // সাইন-ইন পেজেও নেভবার হাইড রাখতে পারেন
  const shouldHide = hiddenPaths.includes(location.pathname);

  if (shouldHide) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex items-center gap-3">
      
      {/* --- Authentication Section --- */}
      <div className="flex items-center">
        <SignedOut>
          {/* এখানে SignInButton এর বদলে সরাসরি আপনার তৈরি করা পেজে পাঠানো হচ্ছে */}
          <button 
            onClick={() => navigate('/sign-in')}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
              bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md
              border border-gray-200 dark:border-zinc-700
              shadow-lg hover:shadow-cyan-500/20 hover:bg-gray-50 dark:hover:bg-zinc-700/80 
              transition-all duration-300 active:scale-95 text-gray-900 dark:text-gray-200"
          >
            <LogIn size={16} className="text-cyan-500" />
            Login
          </button>
        </SignedOut>

        <SignedIn>
          <div className="flex items-center justify-center p-0.5 rounded-full 
            bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md 
            border border-gray-200 dark:border-zinc-700 shadow-lg">
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-full border border-gray-100 dark:border-zinc-600",
                  userButtonAvatarImage: "rounded-full"
                }
              }}
            />
          </div>
        </SignedIn>
      </div>

      {/* --- Theme Toggle Section --- */}
      <button
        onClick={toggleTheme}
        className="relative flex items-center p-1 rounded-full h-9 w-[68px] transition-all duration-300
          bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md
          border border-gray-200 dark:border-zinc-700
          shadow-lg hover:shadow-cyan-500/10 active:scale-95"
        aria-label="Toggle Theme"
      >
        <div className={`absolute w-7 h-7 rounded-full shadow-sm transform transition-all duration-500 cubic-bezier(0.23, 1, 0.32, 1) flex items-center justify-center
          ${theme === 'dark' 
            ? 'translate-x-[30px] bg-zinc-700 text-cyan-400' 
            : 'translate-x-0 bg-white text-amber-500'}`}
        >
          {theme === 'dark' ? <Moon size={14} fill="currentColor" /> : <Sun size={14} fill="currentColor" />}
        </div>

        <div className="flex justify-between w-full px-2.5">
          <Sun size={12} className={theme === 'light' ? 'opacity-0' : 'text-gray-400'} />
          <Moon size={12} className={theme === 'dark' ? 'opacity-0' : 'text-gray-400'} />
        </div>
      </button>
    </div>
  );
};

export default Navbar;