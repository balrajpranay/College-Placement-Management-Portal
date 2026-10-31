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
    hr_position: '',
    gov_id: '',
    phone: '',
    email: '',
    location: '',
    gender: '',
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

    // Validations
    if (!form.hr_contact.trim()) {
      setError('Please enter the Recruiter Full Name.');
      return;
    }
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid corporate work email address.');
      return;
    }
    const cleanPhone = form.phone.replace(/[\s-]/g, '');
    if (!form.phone.trim() || !/^[+]?\d{10,15}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-15 digit mobile number.');
      return;
    }
    if (!form.location.trim()) {
      setError('Please enter your City / Location.');
      return;
    }
    if (!form.name.trim()) {
      setError('Please enter your Company Name.');
      return;
    }
    if (!form.gov_id.trim()) {
      setError('Please enter your Company ID / Recruiter ID.');
      return;
    }
    if (!form.hr_position.trim()) {
      setError('Please enter your Job Designation (e.g. Lead Campus Recruiter).');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerRecruiter({
        ...form,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        hrContact: form.hr_contact.trim(),
        hr_contact: form.hr_contact.trim(),
        hrPosition: form.hr_position.trim(),
        hr_position: form.hr_position.trim(),
        govId: form.gov_id.trim(),
        gov_id: form.gov_id.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        gender: form.gender.trim(),
        industry: form.industry.trim(),
        website: form.website.trim()
      });
      setSuccess('Registration submitted! Your corporate account is pending placement office verification. Redirecting to sign in...');
      setTimeout(() => {
        navigate('/login?role=recruiter');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your corporate credentials and try again.');
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
                <span>Access verified student profiles across all engineering departments</span>
              </div>
              <div className="auth-visual-feat">
                <Icon name="briefcase" size={18} />
                <span>Customizable eligibility filters &amp; multi-round selection processes</span>
              </div>
              <div className="auth-visual-feat">
                <Icon name="video" size={18} />
                <span>Direct interview scheduling and instant offer dispatches</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-visual-footer">
          &copy; 2026 Campus Connect Placement Portal. All rights reserved.
        </div>
      </div>

      <div className="auth-form-col" style={{ padding: '32px 24px', overflowY: 'auto' }}>
        <div className="auth-card" style={{ maxWidth: 620, width: '100%', margin: '0 auto' }}>
          <Link to="/" className="text-sm text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-4)' }}>
            &larr; Back to Home
          </Link>
          
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 4 }}>Register Corporate Account</h2>
          <p className="text-muted mb-6" style={{ marginBottom: 'var(--space-5)' }}>
            New recruiter accounts are verified by the placement cell prior to drive publication.
          </p>
          
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
              or fill out complete corporate registration
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
            {/* Section 1: Recruiter Personal Details */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan-600, #0284c7)', marginBottom: 12 }}>
                1. Recruiter Information
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 12 }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                    Recruiter Full Name <span className="required" style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="hr_contact"
                    value={form.hr_contact}
                    onChange={handleChange}
                    placeholder="e.g. Priya Nair"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                    Work Email Address <span className="required" style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="priya.nair@technova.com"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                    Job Designation <span className="required" style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="hr_position"
                    value={form.hr_position}
                    onChange={handleChange}
                    placeholder="e.g. Lead Talent Acquisition"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                    Mobile Number <span className="required" style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                    Gender <span className="text-muted" style={{ fontWeight: 400, fontSize: '0.75rem' }}>(Optional)</span>
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Company Details */}
            <div style={{ marginBottom: 20, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan-600, #0284c7)', marginBottom: 12 }}>
                2. Corporate Organization Details
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 12 }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                    Company / Organization Name <span className="required" style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. TechNova Solutions Pvt Ltd"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                    Company ID / Recruiter ID <span className="required" style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="gov_id"
                    value={form.gov_id}
                    onChange={handleChange}
                    placeholder="e.g. CIN / GSTIN / EMP-REC-2026"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                    City / Location <span className="required" style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Bengaluru, India"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                    Industry Domain <span className="text-muted" style={{ fontWeight: 400, fontSize: '0.75rem' }}>(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    placeholder="e.g. Software &amp; Cloud"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                    Website <span className="text-muted" style={{ fontWeight: 400, fontSize: '0.75rem' }}>(Optional)</span>
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://technova.io"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Password & Security */}
            <div style={{ marginBottom: 24, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan-600, #0284c7)', marginBottom: 12 }}>
                3. Security Credentials
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                    Password <span className="required" style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
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
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={isSubmitting}
              style={{ width: '100%', padding: '12px 16px', fontSize: '1rem', fontWeight: 700, borderRadius: 8, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
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
