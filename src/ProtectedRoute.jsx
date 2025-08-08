import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Loading state while checking token validity
  const [isLoading, setIsLoading] = useState(true);

  // The backend URL is now hardcoded to resolve the 'process is not defined' error.
  // For a permanent solution, ensure your front-end build system correctly handles environment variables.
  const backendUrl = 'http://localhost:5000';

  useEffect(() => {
    const verifyToken = async () => {
      // Get the token from localStorage
      const token = localStorage.getItem('adminToken');
      
      // If no token exists, the user is not authenticated
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      try {
        // Send a request to the backend to verify the token
        const response = await fetch(`${backendUrl}/api/admin/verify-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Attach the token to the Authorization header
            'Authorization': `Bearer ${token}` 
          }
        });

        if (response.ok) {
          // If the server confirms the token is valid, set authenticated state to true
          setIsAuthenticated(true);
        } else {
          // If the token is invalid, set authenticated state to false
          setIsAuthenticated(false);
          // Remove the invalid token from localStorage
          localStorage.removeItem('adminToken');
        }
      } catch (error) {
        // Handle any network or server errors
        console.error("Token verification failed:", error);
        setIsAuthenticated(false);
        localStorage.removeItem('adminToken');
      } finally {
        // Set loading to false once the check is complete
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []); 

  // Show a loading state while checking the token
  if (isLoading) {
    return <div>Loading...</div>; 
  }

  // If authenticated, render the nested routes (children), otherwise navigate to the login page
  return isAuthenticated ? children : <Navigate to="/admin-login" replace />;
};

export default ProtectedRoute;
