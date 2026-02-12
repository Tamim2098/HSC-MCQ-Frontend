import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // লোকাল স্টোরেজ থেকে থিম চেক করা, না থাকলে ডিফল্ট 'dark'
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // আগের ক্লাস রিমুভ করা
    root.classList.remove('light', 'dark');
    
    // বর্তমান থিম ক্লাস অ্যাড করা
    root.classList.add(theme);
    
    // লোকাল স্টোরেজে সেভ করা
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);