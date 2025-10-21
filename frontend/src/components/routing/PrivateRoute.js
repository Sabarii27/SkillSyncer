import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('token');
      
      console.log('PrivateRoute - checking token:', token ? 'Token exists' : 'No token');
      
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      
      try {
        // Set token in header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        console.log('PrivateRoute - making request to /api/auth/me');
        // Make request to verify token
        const response = await axios.get('/api/auth/me');
        console.log('PrivateRoute - auth successful:', response.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('PrivateRoute - auth failed:', err);
        
        // If it's a 405 or network error (backend not available), allow access in demo mode
        if (err.code === 'ERR_NETWORK' || err.response?.status === 405) {
          console.log('Backend not available - using demo mode');
          setIsAuthenticated(true);
          return;
        }
        
        // Only clear token on real auth errors (401, 403)
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
        setIsAuthenticated(false);
      }
    };
    
    checkAuthentication();
  }, []);
  
  // If still checking authentication, show loading
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If authenticated, render children
  return children;
};

export default PrivateRoute;
