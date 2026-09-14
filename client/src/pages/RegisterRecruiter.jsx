import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { BrandLockup } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import GoogleAuthButton from '../components/GoogleAuthButton';

export default function RegisterRecruiter() {
  const navigate = useNavigate();
  const { registerRecruiter } = useAuth();

  const [form, setForm] = useState({
    name: '',
    industry: '',
    website: '',
    hr_contact: '',
    phone: '',
    email: '',
    location: '',
    description: '',
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
      const res = await registerRecruiter(form);
      setSuccess('Registration submitted! Your account is pending approval from the placement office.');
      setTimeout(() => {
        navigate('/login?role=recruiter');
      }, 2000);
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
            <h2>Hire Exceptional Campus Talent</h2>
            <p>Publish recruitment drives, review verified candidate portfolios, and manage your entire hiring funnel in one modern dashboard.</p>
            
            <div className="auth-visual-features">
              <div className="auth-visual-feat">
                <Icon name="users" size={18} />
                <span>Access verified student profiles across all departments</span>
              </div>
              <div className="auth-visual-feat">
                <Icon name="briefcase" size={18} />
                <span>Customizable eligibility filters &amp; selection process rounds</span>
              </div>
              <div className="auth-visual-feat">
                <Icon name="video" size={18} />
                <span>Direct interview scheduling and instant offer dispatch</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-visual-footer">
          &copy; 2026 Campus Connect Placement Portal. All rights reserved.
        </div>
      </div>

      <div className="auth-form-col">
        <div className="auth-card" style={{ maxWidth: 500, width: '100%' }}>
          <Link to="/" className="text-sm text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-4)' }}>
            &larr; Back to Home
          </Link>
          
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 4 }}>Register Corporate Account</h2>
          <p className="text-muted mb-6" style={{ marginBottom: 'var(--space-6)' }}>New company accounts are verified by the placement cell prior to drive publication.</p>
          
          {/* Google Recruiter OAuth Fast Registration */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <GoogleAuthButton 
              role="recruiter" 
              actionText="Register with Google (Corporate Partner)" 
            />
          </div>

          <div className="auth-divider-wrap" style={{ display: 'flex', alignItems: 'center', margin: '18px 0', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              or register with corporate email
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
            <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                Company / Organization Name <span className="required" style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. TechNova Solutions"
                required
                style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)' }}
              />
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Industry Domain</label>
                <input
                  type="text"
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  placeholder="e.g. Enterprise Software"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Headquarters Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Bengaluru, India"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)' }}
                />
              </div>
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>HR Contact Name</label>
                <input
                  type="text"
                  name="hr_contact"
                  value={form.hr_contact}
                  onChange={handleChange}
                  placeholder="e.g. Priya Nair"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Contact Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                Corporate Email Address <span className="required" style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="recruitment@technova.com"
                required
                style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)' }}
              />
              <div className="form-hint" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Please use your official company work email address.
              </div>
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 'var(--space-6)' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                  Password <span className="required" style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 6 chars"
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
              style={{ width: '100%', padding: '11px 16px', fontSize: '1rem', fontWeight: 700, borderRadius: 8, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              {isSubmitting ? 'Submitting Application...' : 'Register Corporate Account →'}
            </button>
          </form>

          <p className="text-sm text-muted text-center" style={{ marginTop: 'var(--space-6)', textAlign: 'center', fontSize: '0.85rem' }}>
            Already registered? <Link to="/login?role=recruiter" className="text-brand font-semibold" style={{ color: 'var(--accent-cyan-600)' }}>Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
