import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { BrandLockup } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import GoogleAuthButton from '../components/GoogleAuthButton';

export default function RegisterStudent() {
  const navigate = useNavigate();
  const { registerStudent } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirm_password: ''
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.email || !form.email.includes('@')) {
      setError('Please enter a valid college email address.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerStudent(form);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login?role=student'), 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <div className="auth-visual-top">
          <BrandLockup textLight={true} size={40} style={{ alignSelf: 'flex-start' }} />
          <div className="auth-visual-body">
            <h2>Your Career Starts With One Profile</h2>
            <p>Register with your student email, set your password, and immediately unlock matched campus recruitment opportunities.</p>
            
            <div className="auth-visual-features">
              <div className="auth-visual-feat">
                <Icon name="award" size={18} />
                <span>Automated CGPA and branch qualification matching</span>
              </div>
              <div className="auth-visual-feat">
                <Icon name="file" size={18} />
                <span>Centralized resume management and skill tagging</span>
              </div>
              <div className="auth-visual-feat">
                <Icon name="bell" size={18} />
                <span>Instant shortlist and interview schedule notifications</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-visual-footer">
          &copy; 2026 Campus Connect Placement Portal. All rights reserved.
        </div>
      </div>

      <div className="auth-form-col">
        <div className="auth-card" style={{ maxWidth: 460, width: '100%' }}>
          <Link to="/" className="text-sm text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-4)' }}>
            &larr; Back to Home
          </Link>
          
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 4 }}>Create Student Account</h2>
          <p className="text-muted mb-6" style={{ marginBottom: 'var(--space-6)' }}>Enter your email and password to register for campus placements.</p>
          
          {/* Google Student OAuth Fast Registration */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <GoogleAuthButton 
              role="student" 
              actionText="Sign up with Google (1-Click Student Profile)" 
            />
          </div>

          <div className="auth-divider-wrap" style={{ display: 'flex', alignItems: 'center', margin: '18px 0', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              or register with email credentials
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          </div>

          {error && (
            <div className="alert-box alert-danger-box mb-4" style={{ marginBottom: 'var(--space-4)' }}>
              <div className="alert-box-icon"><Icon name="alert-circle" size={18} /></div>
              <div className="alert-box-text">{error}</div>
            </div>
          )}

          {success && (
            <div className="alert-box alert-success-box mb-4" style={{ marginBottom: 'var(--space-4)' }}>
              <div className="alert-box-icon"><Icon name="check-circle" size={18} /></div>
              <div className="alert-box-text">{success}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* 1. College Email Address */}
            <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                College Email Address <span className="required" style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="student@college.edu"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
              />
              <div className="form-hint" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Used for drive updates and official placement alerts.
              </div>
            </div>

            {/* 2. Create Password */}
            <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                Create Password <span className="required" style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
              />
            </div>

            {/* 3. Confirm Password */}
            <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
              <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                Confirm Password <span className="required" style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                placeholder="Repeat password"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={isSubmitting}
              style={{ width: '100%', padding: '11px 16px', fontSize: '1rem', fontWeight: 700, borderRadius: 8, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              {isSubmitting ? 'Registering Account...' : 'Complete Registration →'}
            </button>
          </form>

          <p className="text-sm text-muted text-center" style={{ marginTop: 'var(--space-6)', textAlign: 'center', fontSize: '0.85rem' }}>
            Already registered? <Link to="/login?role=student" className="text-brand font-semibold" style={{ color: 'var(--accent-cyan-600)' }}>Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
