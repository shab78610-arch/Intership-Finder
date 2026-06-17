import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        loadUser();
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const loadUser = async () => {
    try {
      const res = await API.get('/auth/me');
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      setError(null);
    } catch (err) {
      console.error('Load user error:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const register = async (name, email, password, role = 'user') => {
    try {
      setError(null);
      console.log('Attempting to register:', { name, email, role });
      
      const res = await API.post('/auth/register', { 
        name, 
        email, 
        password, 
        role 
      });
      
      console.log('Registration response:', res.data);
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
      
      return { success: false, error: 'Registration failed: No token received' };
    } catch (err) {
      console.error('Registration error:', err);
      
      let errorMsg = 'Registration failed. Please try again.';
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        errorMsg = err.response.data?.msg || `Server error: ${err.response.status}`;
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        errorMsg = 'Cannot connect to server. Please check if backend is running.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', err.message);
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      console.log('Attempting to login:', { email });
      
      const res = await API.post('/auth/login', { email, password });
      
      console.log('Login response:', res.data);
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
      
      return { success: false, error: 'Login failed: No token received' };
    } catch (err) {
      console.error('Login error:', err);
      
      let errorMsg = 'Login failed. Please try again.';
      
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        errorMsg = err.response.data?.msg || `Server error: ${err.response.status}`;
      } else if (err.request) {
        console.error('No response received:', err.request);
        errorMsg = 'Cannot connect to server. Please check if backend is running.';
      } else {
        console.error('Request setup error:', err.message);
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    setError,
    register,
    login,
    logout,
    loadUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};