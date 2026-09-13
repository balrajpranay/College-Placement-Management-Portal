import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGoogleAuthUrlApi } from '../services/api';

export default function GoogleAuthButton({
  role = 'student',
  actionText = 'Continue with Google',
  onInitiate
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleClick = async () => {
    try {
      setLoading(true);
      if (onInitiate) onInitiate();

      // Retrieve Google OAuth endpoint config from backend
      const res = await getGoogleAuthUrlApi(role);

      if (res && res.isConfigured && res.url) {
        // Redirect directly to official Google OAuth consent screen
        window.location.href = res.url;
      } else {
        // Fast development fallback route
        setTimeout(() => {
          navigate(`/auth/google/callback?code=demo_google_${role}&role=${role}`);
        }, 300);
      }
    } catch (err) {
      console.warn('Could not fetch Google Auth URL, initiating local fallback:', err);
      navigate(`/auth/google/callback?code=demo_google_${role}&role=${role}`);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      disabled={loading}
      className="btn-google"
      title="Authenticate securely with Google"
    >
      <svg className="google-icon-svg" viewBox="0 0 24 24" width="20" height="20">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        />
      </svg>
      <span>{loading ? 'Connecting to Google...' : actionText}</span>
    </button>
  );
}
