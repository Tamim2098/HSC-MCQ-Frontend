import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

// Context Import
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/Navbar'; 

// Pages
import HeroSection from './Pages/Hero/Hero';
import Subjects from './Pages/Subjects/Subjects';
import Years from './Pages/Years/Years';
import Boards from './Pages/Boards/Boards';
import MCQ from './Pages/MCQ/MCQ';
import Result from './Pages/Result/Result';
import AdminPanel from './Pages/AdminPanel/AdminPanel.jsx';
import AdminLogin from './Pages/AdminLogin/AdminLogin.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import SignInPage from './Pages/SignInPage'; 

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-200 transition-colors duration-300">
          
          <Navbar />

          <Routes>
            {/* ১. পাবলিক রাউটস */}
            <Route path="/" element={<HeroSection />} />
            <Route path="/sign-in/*" element={<SignInPage />} />

            {/* ২. প্রোটেক্টেড রাউটস লজিক */}
            {/* আমরা একটি কমন রুট ব্যবহার করছি যা লগইন না থাকলে /sign-in এ পাঠাবে */}
            <Route
              path="/subjects"
              element={
                <>
                  <SignedIn><Subjects /></SignedIn>
                  <SignedOut><Navigate to="/sign-in" replace /></SignedOut>
                </>
              }
            />
            <Route
              path="/years"
              element={
                <>
                  <SignedIn><Years /></SignedIn>
                  <SignedOut><Navigate to="/sign-in" replace /></SignedOut>
                </>
              }
            />
            <Route
              path="/boards"
              element={
                <>
                  <SignedIn><Boards /></SignedIn>
                  <SignedOut><Navigate to="/sign-in" replace /></SignedOut>
                </>
              }
            />
            <Route
              path="/mcq"
              element={
                <>
                  <SignedIn><MCQ /></SignedIn>
                  <SignedOut><Navigate to="/sign-in" replace /></SignedOut>
                </>
              }
            />
            <Route
              path="/result"
              element={
                <>
                  <SignedIn><Result /></SignedIn>
                  <SignedOut><Navigate to="/sign-in" replace /></SignedOut>
                </>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<HeroSection />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;