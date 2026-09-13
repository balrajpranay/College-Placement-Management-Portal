import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLoadingScreen from '../components/AuthLoadingScreen';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle, setAuthSession } = useAuth();
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const processCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const directToken = searchParams.get('token');
      const directRole = searchParams.get('role');

      // 1. If backend already passed direct token via GET redirect
      if (directToken) {
        setAuthSession(directToken, {
          role: directRole || 'student',
          email: 'google.user@campusconnect.edu'
        });
        setTimeout(() => {
          navigate(directRole === 'recruiter' ? '/recruiter/dashboard' : '/student/opportunities', { replace: true });
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
        const destination = res?.user?.role === 'recruiter' ? '/recruiter/dashboard' : '/student/opportunities';
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
      subtitle="Securing your placement session and fetching active recruitment drives"
      provider="google"
      manualAction={{
        label: "Take me to opportunities now →",
        onClick: () => navigate('/student/opportunities')
      }}
    />
  );
}
