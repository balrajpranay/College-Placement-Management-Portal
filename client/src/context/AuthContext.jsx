import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerStudentApi, registerRecruiterApi, getMeApi, googleAuthCallbackApi, githubAuthCallbackApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const sessionUser = sessionStorage.getItem('campus_user');
      if (sessionUser) return JSON.parse(sessionUser);
      const savedUser = localStorage.getItem('campus_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return (
      sessionStorage.getItem('campus_jwt_token') ||
      sessionStorage.getItem('cc_token') ||
      localStorage.getItem('campus_jwt_token') ||
      localStorage.getItem('cc_token') ||
      null
    );
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUserSession = async () => {
      const activeToken =
        sessionStorage.getItem('campus_jwt_token') ||
        sessionStorage.getItem('cc_token') ||
        localStorage.getItem('campus_jwt_token') ||
        localStorage.getItem('cc_token');
      if (activeToken) {
        try {
          const res = await getMeApi();
          if (res && res.success && res.user) {
            setUser(res.user);
            try {
              sessionStorage.setItem('campus_user', JSON.stringify(res.user));
              sessionStorage.setItem('campus_jwt_token', activeToken);
              localStorage.setItem('campus_user', JSON.stringify(res.user));
            } catch (e) {}
          }
        } catch (err) {
          console.warn('[Auth] Session verify notice:', err.message);
          if (err.status === 401) {
            logout();
          }
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
      try {
        sessionStorage.setItem('campus_jwt_token', res.token);
        sessionStorage.setItem('cc_token', res.token);
        sessionStorage.setItem('campus_user', JSON.stringify(res.user));
        localStorage.setItem('campus_jwt_token', res.token);
        localStorage.setItem('cc_token', res.token);
        localStorage.setItem('campus_user', JSON.stringify(res.user));
      } catch (e) {}
      return res;
    }
    throw new Error(res.message || 'Login failed.');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    try {
      sessionStorage.removeItem('campus_jwt_token');
      sessionStorage.removeItem('cc_token');
      sessionStorage.removeItem('campus_user');
      localStorage.removeItem('campus_jwt_token');
      localStorage.removeItem('cc_token');
      localStorage.removeItem('campus_user');
    } catch (e) {}
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
    try {
      sessionStorage.setItem('campus_jwt_token', authToken);
      sessionStorage.setItem('cc_token', authToken);
      sessionStorage.setItem('campus_user', JSON.stringify(authUser));
      localStorage.setItem('campus_jwt_token', authToken);
      localStorage.setItem('cc_token', authToken);
      localStorage.setItem('campus_user', JSON.stringify(authUser));
    } catch (e) {}
  };

  const loginWithGoogle = async (code, state, role) => {
    const res = await googleAuthCallbackApi({ code, state, role });
    if (res && res.success && res.token) {
      setAuthSession(res.token, res.user);
      return res;
    }
    throw new Error(res?.message || 'Google authentication failed.');
  };

  const loginWithGitHub = async (code, state, role) => {
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
    loginWithGoogle,
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
