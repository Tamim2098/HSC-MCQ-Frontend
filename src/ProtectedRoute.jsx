import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ব্যাকএন্ড URL - এটি আপনার প্রোডাকশন সার্ভারের সাথে আপডেট করে নিবেন
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://hsc-mcq-backend.onrender.com';

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`${backendUrl}/api/admin/verify-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('adminToken');
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        setIsAuthenticated(false);
        localStorage.removeItem('adminToken');
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [backendUrl]); 

  // লোডিং স্টেটে আপনার থিমের সাথে মিল রেখে একটি সুন্দর মেসেজ বা স্পিনার দিতে পারেন
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-gray-500">
        <div className="animate-pulse">Verifying Admin Access...</div>
      </div>
    ); 
  }

  return isAuthenticated ? children : <Navigate to="/admin-login" replace />;
};

export default ProtectedRoute;
