import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerStudentApi, registerRecruiterApi, getMeApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('campus_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('campus_jwt_token') || null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUserSession = async () => {
      const savedToken = localStorage.getItem('campus_jwt_token');
      if (savedToken) {
        try {
          const res = await getMeApi();
          if (res && res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('campus_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('[Auth] Session verify notice:', err.message);
        }
      }
      setLoading(false);
    };

    verifyUserSession();
  }, []);

  const login = async (email, password, role) => {
    const res = await loginApi({ email, password, role });
    if (res && res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('campus_jwt_token', res.token);
      localStorage.setItem('cc_token', res.token);
      localStorage.setItem('campus_user', JSON.stringify(res.user));
      return res;
    }
    throw new Error(res.message || 'Login failed.');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('campus_jwt_token');
    localStorage.removeItem('cc_token');
    localStorage.removeItem('campus_user');
  };


  const registerStudent = async (formData) => {
    return await registerStudentApi(formData);
  };

  const registerRecruiter = async (formData) => {
    return await registerRecruiterApi(formData);
  };

  const setAuthSession = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('campus_jwt_token', authToken);
    localStorage.setItem('cc_token', authToken);
    localStorage.setItem('campus_user', JSON.stringify(authUser));
  };

  const loginWithGitHub = async (code, state, role) => {
    const { githubAuthCallbackApi } = await import('../services/api');
    const res = await githubAuthCallbackApi({ code, state, role });
    if (res && res.success && res.token) {
      setAuthSession(res.token, res.user);
      return res;
    }
    throw new Error(res?.message || 'GitHub authentication failed.');
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    logout,
    registerStudent,
    registerRecruiter,
    setAuthSession,
    loginWithGitHub
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
