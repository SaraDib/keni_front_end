import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Configure axios interceptor for 401 responses
  // useEffect(() => {
  //   const interceptor = axios.interceptors.response.use(
  //     (response) => response,
  //     (error) => {
  //       if (error.response?.status === 401) {
  //         logout();
  //       }
  //       return Promise.reject(error);
  //     }
  //   );

  //   return () => {
  //     axios.interceptors.response.eject(interceptor);
  //   };
  // }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token');
      // if (!token) {
      //   setLoading(false);
      //   // If we're not on the login page, redirect to it
      //   if (!location.pathname.includes('/login')) {
      //     navigate('/admin/dashboard');
      //   }
      //   return;
      // }

      // Configure axios to use the token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Verify token with backend
      // const response = await axios.get('http://127.0.0.1:8000/api/me');
      // setUser(response.data);
      setIsAuthenticated(true);

      // If we're on login page and we're authenticated, redirect to dashboard
      if ('/login' === '/login') {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        password
      });

      const access_token = response.data.access_token;
      localStorage.setItem('access_token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      // Get user data
      const userResponse = await axios.get('http://127.0.0.1:8000/api/me');
      setUser(userResponse.data);
      setIsAuthenticated(true);

      // Navigate to the intended page or dashboard
      const from = location.state?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Une erreur est survenue lors de la connexion'
      };
    }
  };

  const logout = async () => {
    try {
      // Try to call logout endpoint if we have a token
      const token = localStorage.getItem('access_token');
      if (token) {
        await axios.post('http://127.0.0.1:8000/api/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clean up regardless of logout API success
      localStorage.removeItem('access_token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 