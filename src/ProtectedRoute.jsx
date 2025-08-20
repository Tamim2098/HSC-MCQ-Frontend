import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const backendUrl = 'https://hsc-mcq-backend.onrender.com';

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
  }, []); 

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return isAuthenticated ? children : <Navigate to="/admin-login" replace />;
};

export default ProtectedRoute;
