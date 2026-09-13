import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import GoogleAuthButton from '../components/GoogleAuthButton';
import AuthLoadingScreen from '../components/AuthLoadingScreen';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();

  const [role, setRole] = useState(() => {
    const params = new URLSearchParams(location.search);
    const r = params.get('role');
    return ['student', 'recruiter', 'admin'].includes(r) ? r : 'student';
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Read message or targetJob from location state if redirected from Apply button
  useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message);
    }
  }, [location.state]);

  // If already authenticated, redirect to appropriate role portal or previous location
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = {
        student: location.state?.from || '/student/opportunities',
        recruiter: '/recruiter/dashboard',
        admin: '/admin/dashboard'
      }[user.role] || '/';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location.state]);

  // Sync role with query param if it changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const r = params.get('role');
    if (['student', 'recruiter', 'admin'].includes(r)) {
      setRole(r);
    }
  }, [location.search]);

  const fillCredentials = (selRole, selEmail, selPass) => {
    setRole(selRole);
    setEmail(selEmail);
    setPassword(selPass);
    setError('');
    setSuccess(`Loaded demo credentials for ${selRole}`);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const res = await login(email, password, role);
      setSuccess(res.message || 'Login successful! Redirecting...');
      
      const destination = {
        student: location.state?.from || '/student/opportunities',
        recruiter: '/recruiter/dashboard',
        admin: '/admin/dashboard'
      }[res.user.role] || '/';

      setTimeout(() => {
        navigate(destination, { replace: true, state: location.state });
      }, 500);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials and role.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <div className="auth-visual-top">
          <Link to="/" className="brand-lockup" style={{ alignSelf: 'flex-start' }}>
            <div className="brand-logo-wrap">
              <img src="/static/images/logo.png" alt="Campus Connect" className="brand-logo-img" />
            </div>
            <div className="brand-text-block">
              <span className="brand-name" style={{ color: '#FFFFFF' }}>Campus Connect</span>
              <span className="brand-sub">Placement Portal</span>
            </div>
          </Link>
          <div className="auth-visual-body">
            <h2>Your Career Path Starts Here</h2>
            <p>A unified placement portal connecting students, recruiters, and placement officers with automated eligibility and AI coaching.</p>
            
            <div className="auth-visual-features">
              <div className="auth-visual-feat">
                <Icon name="check" size={18} />
                <span>Real-time CGPA and backlog eligibility checking</span>
              </div>
              <div className="auth-visual-feat">
                <Icon name="check" size={18} />
                <span>Recruiter portal for drive creation &amp; candidate evaluation</span>
              </div>
              <div className="auth-visual-feat">
                <Icon name="check" size={18} />
                <span>Live Google Gemini AI Career &amp; Interview coaching</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-visual-footer">
          &copy; 2026 Campus Connect Placement Portal. All rights reserved.
        </div>
      </div>

      <div className="auth-form-col">
        <div className="auth-card" style={{ maxWidth: 440, width: '100%' }}>
          <Link to="/" className="text-sm text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-4)' }}>
            &larr; Back to Public Site
          </Link>
          
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 4 }}>Sign in to Campus Connect</h2>
          <p className="text-muted mb-6" style={{ marginBottom: 'var(--space-6)' }}>Select your portal role and enter your credentials.</p>

          {/* 3-Role Toggle Selector */}
          <div className="role-toggle mb-6" style={{ display: 'flex', background: 'var(--bg-surface-alt)', padding: 4, borderRadius: 8, border: '1px solid var(--border-subtle)', marginBottom: 'var(--space-6)' }}>
            <button
              type="button"
              className={`btn btn-sm ${role === 'student' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flex: 1, textAlign: 'center', borderRadius: 6 }}
              onClick={() => { setRole('student'); setError(''); }}
            >
              Student
            </button>
            <button
              type="button"
              className={`btn btn-sm ${role === 'recruiter' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flex: 1, textAlign: 'center', borderRadius: 6 }}
              onClick={() => { setRole('recruiter'); setError(''); }}
            >
              Recruiter
            </button>
            <button
              type="button"
              className={`btn btn-sm ${role === 'admin' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flex: 1, textAlign: 'center', borderRadius: 6 }}
              onClick={() => { setRole('admin'); setError(''); }}
            >
              Placement Admin
            </button>
          </div>

          {/* Google OAuth Fast Authentication */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <GoogleAuthButton 
              role={role} 
              actionText={role === 'student' ? 'Sign in with Google (Student)' : role === 'recruiter' ? 'Sign in with Google (Recruiter)' : 'Sign in with Google'} 
            />
          </div>

          <div className="auth-divider-wrap" style={{ display: 'flex', alignItems: 'center', margin: '18px 0', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              or sign in with credentials
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          </div>

          {/* Zero-Overflow Responsive Alert Notification */}
          {error && (
            <div className="alert-box alert-danger-box">
              <div className="alert-box-icon">
                <Icon name="alert-circle" size={18} />
              </div>
              <div className="alert-box-text">
                {error}
              </div>
            </div>
          )}

          {success && (
            <div className="alert-box alert-success-box">
              <div className="alert-box-icon">
                <Icon name="check-circle" size={18} />
              </div>
              <div className="alert-box-text">
                {success}
              </div>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group mb-4" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                {role === 'student' ? 'Student College Email' : role === 'recruiter' ? 'Corporate Email' : 'Admin Email'} <span className="required" style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'student' ? 'priya.sharma@student.edu' : role === 'recruiter' ? 'hr@technova.com' : 'admin@college.edu'}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
              />
            </div>

            <div className="form-group mb-6" style={{ marginBottom: 'var(--space-6)' }}>
              <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                Password <span className="required" style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={isSubmitting}
              style={{ width: '100%', padding: '11px 16px', fontSize: '1rem', fontWeight: 700 }}
            >
              {isSubmitting ? 'Authenticating...' : `Sign in as ${role === 'student' ? 'Student' : role === 'recruiter' ? 'Recruiter' : 'Admin'} →`}
            </button>
          </form>

          {/* 1-Click Demo Credentials Autofill */}
          <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
            <div className="text-xs text-muted font-semibold uppercase tracking-wider mb-2" style={{ marginBottom: 8, fontSize: '0.75rem' }}>
              Quick Demo Fill:
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                style={{ fontSize: '0.75rem', padding: '4px 8px', border: '1px solid var(--border-subtle)' }}
                onClick={() => fillCredentials('student', 'priya.sharma@student.edu', 'student123')}
              >
                👤 Student Demo
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                style={{ fontSize: '0.75rem', padding: '4px 8px', border: '1px solid var(--border-subtle)' }}
                onClick={() => fillCredentials('recruiter', 'hr@technova.com', 'recruiter123')}
              >
                💼 Recruiter Demo
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                style={{ fontSize: '0.75rem', padding: '4px 8px', border: '1px solid var(--border-subtle)' }}
                onClick={() => fillCredentials('admin', 'admin@college.edu', 'admin123')}
              >
                ⚙️ Admin Demo
              </button>
            </div>
          </div>

          {/* Registration Links: Admin Registration is STRICTLY OMITTED */}
          <div style={{ marginTop: 'var(--space-6)', textAlign: 'center', fontSize: '0.85rem' }} className="text-sm text-muted">
            {role === 'recruiter' ? (
              <span>
                New corporate partner? <Link to="/register/recruiter" className="text-brand font-semibold" style={{ color: 'var(--accent-cyan-600)' }}>Register Company</Link>
              </span>
            ) : role === 'student' ? (
              <span>
                Don't have an account? <Link to="/register/student" className="text-brand font-semibold" style={{ color: 'var(--accent-cyan-600)' }}>Register as Student</Link>
              </span>
            ) : (
              <span className="text-xs text-muted" style={{ color: 'var(--text-faint)' }}>
                Placement Admin accounts are issued strictly by institutional governance.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
