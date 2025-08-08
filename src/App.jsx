import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HeroSection from './Pages/Hero/Hero';
import Subjects from './Pages/Subjects/Subjects';
import Years from './Pages/Years/Years';
import Boards from './Pages/Boards/Boards';
import MCQ from './Pages/MCQ/MCQ';
import Result from './Pages/Result/Result';
import AdminPanel from './Pages/AdminPanel/AdminPanel.jsx';
import AdminLogin from './Pages/AdminLogin/AdminLogin.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/years" element={<Years />} />
        <Route path="/boards" element={<Boards />} />
        <Route path="/mcq" element={<MCQ />} />
        <Route path="/result" element={<Result />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        {/*
          ProtectedRoute কে একটি র্যাপার কম্পোনেন্ট হিসেবে ব্যবহার করা হয়েছে।
          এখন ProtectedRoute-এর ভিতরে থাকা AdminPanel-কে children prop হিসেবে পাঠানো হবে।
        */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;