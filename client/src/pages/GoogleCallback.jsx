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
        const verifiedRole = ['student', 'recruiter', 'admin'].includes(directRole) ? directRole : 'student';
        setAuthSession(directToken, {
          role: verifiedRole,
          email: 'google.user@campusconnect.edu'
        });
        const defaultDest = verifiedRole === 'recruiter'
          ? '/recruiter/dashboard'
          : (verifiedRole === 'admin' ? '/admin/dashboard' : '/student/dashboard');

        let destination = defaultDest;
        if (savedRedirect) {
          const isSafeForRole =
            (verifiedRole === 'student' && (savedRedirect.startsWith('/student') || savedRedirect.startsWith('/jobs') || savedRedirect.startsWith('/opportunities') || savedRedirect.startsWith('/skill-up') || savedRedirect.startsWith('/ai'))) ||
            (verifiedRole === 'recruiter' && savedRedirect.startsWith('/recruiter')) ||
            (verifiedRole === 'admin' && savedRedirect.startsWith('/admin'));
          if (isSafeForRole) {
            destination = savedRedirect;
          }
        }

        setTimeout(() => {
          navigate(destination, { replace: true });
        }, 1200);
        return;
      }

      // 2. Process OAuth code exchange via POST
      const googleError = searchParams.get('error');
      if (googleError) {
        setErrorMsg(`Google authentication error: ${searchParams.get('error_description') || googleError}`);
        return;
      }

      if (!code) {
        setErrorMsg('Authorization code was not received from Google.');
        return;
      }

      const authCode = code;
      const savedRole = sessionStorage.getItem('oauth_target_role');
      if (savedRole) {
        sessionStorage.removeItem('oauth_target_role');
      }

      let targetRole = searchParams.get('role') || savedRole || 'student';
      if (state) {
        try {
          const rawState = decodeURIComponent(state);
          const base64Str = rawState.replace(/-/g, '+').replace(/_/g, '/');
          const decoded = JSON.parse(atob(base64Str));
          if (decoded.role && ['student', 'recruiter', 'admin'].includes(decoded.role)) {
            targetRole = decoded.role;
          }
        } catch (_) {
          try {
            const decoded = JSON.parse(atob(state));
            if (decoded.role && ['student', 'recruiter', 'admin'].includes(decoded.role)) {
              targetRole = decoded.role;
            }
          } catch (__) {
            if (['student', 'recruiter', 'admin'].includes(state)) {
              targetRole = state;
            }
          }
        }
      }

      if (!['student', 'recruiter', 'admin'].includes(targetRole)) {
        setErrorMsg('Invalid or tampered role in Google authentication state.');
        return;
      }

      try {
        const res = await loginWithGoogle(authCode, state, targetRole);
        const userRole = res?.user?.role || targetRole;
        const profileComplete = res?.user?.profileComplete;
        const defaultDest = userRole === 'recruiter'
          ? (profileComplete === false ? '/recruiter/profile?complete=true' : '/recruiter/dashboard')
          : (userRole === 'admin'
              ? '/admin/dashboard'
              : (profileComplete === false ? '/student/profile?complete=true' : '/student/dashboard')
            );

        let destination = defaultDest;
        if (savedRedirect) {
          const isSafeForRole =
            (userRole === 'student' && (savedRedirect.startsWith('/student') || savedRedirect.startsWith('/jobs') || savedRedirect.startsWith('/opportunities') || savedRedirect.startsWith('/skill-up') || savedRedirect.startsWith('/ai'))) ||
            (userRole === 'recruiter' && savedRedirect.startsWith('/recruiter')) ||
            (userRole === 'admin' && savedRedirect.startsWith('/admin'));
          if (isSafeForRole) {
            destination = savedRedirect;
          }
        }

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
        onClick: () => {
          const searchParams = new URLSearchParams(location.search);
          const state = searchParams.get('state');
          const savedRole = sessionStorage.getItem('oauth_target_role');
          let targetRole = searchParams.get('role') || savedRole || 'student';
          if (state) {
            try {
              const rawState = decodeURIComponent(state);
              const base64Str = rawState.replace(/-/g, '+').replace(/_/g, '/');
              const decoded = JSON.parse(atob(base64Str));
              if (decoded.role && ['student', 'recruiter', 'admin'].includes(decoded.role)) {
                targetRole = decoded.role;
              }
            } catch (_) {
              try {
                const decoded = JSON.parse(atob(state));
                if (decoded.role && ['student', 'recruiter', 'admin'].includes(decoded.role)) {
                  targetRole = decoded.role;
                }
              } catch (__) {
                if (['student', 'recruiter', 'admin'].includes(state)) {
                  targetRole = state;
                }
              }
            }
          }
          const dest = targetRole === 'recruiter' ? '/recruiter/dashboard' : (targetRole === 'admin' ? '/admin/dashboard' : '/student/dashboard');
          navigate(dest);
        }
      }}
    />
  );
}
