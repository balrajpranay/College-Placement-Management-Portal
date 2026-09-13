import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import GitHubAuthButton from '../components/GitHubAuthButton';
import AuthLoadingScreen from '../components/AuthLoadingScreen';

const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biotechnology"
];

export default function RegisterStudent() {
  const navigate = useNavigate();
  const { registerStudent } = useAuth();

  const [form, setForm] = useState({
    name: '',
    student_no: '',
    email: '',
    department: 'Computer Science',
    grad_year: 2026,
    cgpa: '',
    password: '',
    confirm_password: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await registerStudent(form);
      setSuccess('Registration successful! Please log in to complete your profile.');
      setTimeout(() => {
        navigate('/login?role=student');
      }, 1500);
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
            <h2>Your Career Starts With One Profile</h2>
            <p>Register with your student ID, complete your verified credentials, and instantly unlock matched campus recruitment drives.</p>
            
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
        <div className="auth-card" style={{ maxWidth: 480, width: '100%' }}>
          <Link to="/" className="text-sm text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-4)' }}>
            &larr; Back to Home
          </Link>
          
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 4 }}>Create Student Account</h2>
          <p className="text-muted mb-6" style={{ marginBottom: 'var(--space-6)' }}>Enter your academic details to register for campus placements.</p>
          {/* GitHub Student OAuth Fast Registration */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <GitHubAuthButton 
              role="student" 
              actionText="Sign up with GitHub (1-Click Student Profile)" 
            />
          </div>

          <div className="auth-divider-wrap" style={{ display: 'flex', alignItems: 'center', margin: '18px 0', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              or register with academic credentials
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          </div>


          {error && (
            <div className="alert-box alert-danger-box">
              <div className="alert-box-icon"><Icon name="alert-circle" size={18} /></div>
              <div className="alert-box-text">{error}</div>
            </div>
          )}

          {success && (
            <div className="alert-box alert-success-box">
              <div className="alert-box-icon"><Icon name="check-circle" size={18} /></div>
              <div className="alert-box-text">{success}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                  Full Name <span className="required" style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Priya Sharma"
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                  Student ID / Roll No <span className="required" style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="student_no"
                  value={form.student_no}
                  onChange={handleChange}
                  placeholder="e.g. CS2023001"
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)' }}
                />
              </div>
            </div>

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
                style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)' }}
              />
              <div className="form-hint" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Used for drive updates and official placement alerts.</div>
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12, marginBottom: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                  Department / Branch <span className="required" style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)' }}
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                  Graduation Year <span className="required" style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="number"
                  name="grad_year"
                  min="2024"
                  max="2030"
                  value={form.grad_year}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                Current CGPA (out of 10.0) <span className="required" style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                name="cgpa"
                value={form.cgpa}
                onChange={handleChange}
                placeholder="e.g. 8.75"
                required
                style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)' }}
              />
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 'var(--space-6)' }}>
              <div className="form-group">
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
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)' }}
                />
              </div>
              <div className="form-group">
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
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={isSubmitting}
              style={{ width: '100%', padding: '11px 16px', fontSize: '1rem', fontWeight: 700 }}
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
