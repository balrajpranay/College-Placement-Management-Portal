import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLoadingScreen from '../components/AuthLoadingScreen';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle, setAuthSession } = useAuth();
  const [errorMsg, setErrorMsg] = useState(null);
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    if (hasProcessedRef.current) return;
    hasProcessedRef.current = true;

    const processCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const directToken = searchParams.get('token');
      const directRole = searchParams.get('role');

      // Check for saved post-auth redirect from protected routes
      const savedRedirect = sessionStorage.getItem('post_auth_redirect') || sessionStorage.getItem('auth_redirect');
      if (savedRedirect) {
        sessionStorage.removeItem('post_auth_redirect');
        sessionStorage.removeItem('auth_redirect');
      }

      // 1. If backend already passed direct token via GET redirect
      if (directToken) {
        setAuthSession(directToken, {
          role: directRole || 'student',
          email: 'google.user@campusconnect.edu'
        });
        const defaultDest = directRole === 'recruiter' ? '/recruiter/dashboard' : '/student/dashboard';
        const destination = savedRedirect || defaultDest;
        setTimeout(() => {
          navigate(destination, { replace: true });
        }, 1200);
        return;
      }

      // 2. Process OAuth code exchange via POST
      const authCode = code || 'demo_google_student';
      let targetRole = 'student';
      if (state) {
        try {
          const decoded = JSON.parse(atob(state));
          if (decoded.role) targetRole = decoded.role;
        } catch (e) {
          if (state === 'recruiter' || state === 'student' || state === 'admin') targetRole = state;
        }
      }

      try {
        const res = await loginWithGoogle(authCode, state, targetRole);
        const userRole = res?.user?.role || targetRole;
        const defaultDest = userRole === 'recruiter' 
          ? '/recruiter/dashboard' 
          : (userRole === 'admin' ? '/admin/dashboard' : '/student/dashboard');
        const destination = savedRedirect || defaultDest;
        setTimeout(() => {
          navigate(destination, { replace: true });
        }, 1200);
      } catch (err) {
        console.error('Google authentication error:', err);
        setErrorMsg(err.message || 'Google authentication failed.');
      }
    };

    processCallback();
  }, [location.search, loginWithGoogle, setAuthSession, navigate]);

  if (errorMsg) {
    return (
      <div className="impeccable-auth-loading-overlay">
        <div className="impeccable-auth-loading-card" style={{ textAlign: 'center', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⚠️</div>
          <h2 className="auth-loading-title" style={{ color: '#EF4444' }}>Authentication Issue</h2>
          <p className="auth-loading-subtitle" style={{ color: 'var(--text-muted)' }}>{errorMsg}</p>
          <div className="mt-4">
            <button onClick={() => navigate('/login')} className="btn btn-primary">
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthLoadingScreen
      title="Completing Google Verification"
      subtitle="Securing your placement workspace and initializing dashboard metrics"
      provider="google"
      manualAction={{
        label: "Take me to dashboard now →",
        onClick: () => navigate('/student/dashboard')
      }}
    />
  );
}
