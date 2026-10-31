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
    name: '',
    email: '',
    phone: '',
    city: '',
    gender: '',
    collegeName: '',
    studentNo: '',
    department: 'Computer Science',
    academicYear: '4th Year',
    gradYear: 2026,
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

    // 1. Personal & Contact Validations
    if (!form.name.trim()) {
      setError('Please enter your Full Name.');
      return;
    }
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid college email address.');
      return;
    }
    const cleanPhone = form.phone.replace(/[\s-]/g, '');
    if (!form.phone.trim() || !/^[+]?\d{10,15}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-15 digit mobile number.');
      return;
    }
    if (!form.city.trim()) {
      setError('Please enter your City.');
      return;
    }

    // 2. Academic Validations
    if (!form.collegeName.trim()) {
      setError('Please enter your College / University Name.');
      return;
    }
    if (!form.studentNo.trim()) {
      setError('Please enter your Hall Ticket No. / Roll No.');
      return;
    }
    if (!form.department.trim()) {
      setError('Please select your Branch / Department.');
      return;
    }
    if (!form.academicYear.trim()) {
      setError('Please select your Current Academic Year.');
      return;
    }
    if (!form.gradYear) {
      setError('Please select your Graduation Year.');
      return;
    }

    // 3. Security Validations
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
      await registerStudent({
        ...form,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        collegeName: form.collegeName.trim(),
        studentNo: form.studentNo.trim(),
        department: form.department.trim(),
        academicYear: form.academicYear.trim(),
        gradYear: Number(form.gradYear),
        gender: form.gender.trim()
      });
      setSuccess('Registration successful! Your profile and resume builder have been automatically initialized. Redirecting to sign in...');
      setTimeout(() => navigate('/login?role=student'), 1800);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details and try again.');
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
            <h2>Your Placement Career Starts Here</h2>
            <p>Register once with verified academic and contact details to unlock matched recruitment drives, automatic resume auto-population, and direct interview scheduling.</p>

            <div className="auth-visual-features">
              <div className="auth-visual-feat">
                <Icon name="award" size={18} />
                <span>Automated CGPA, department &amp; graduation eligibility matching</span>
              </div>
              <div className="auth-visual-feat">
                <Icon name="file-text" size={18} />
                <span>Instant Resume Builder auto-population from your registered credentials</span>
              </div>
              <div className="auth-visual-feat">
                <Icon name="bell" size={18} />
                <span>Direct interview alerts, test links, and corporate offer dispatches</span>
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

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 4 }}>Student Registration</h2>
          <p className="text-muted mb-6" style={{ marginBottom: 'var(--space-5)' }}>
            Complete your placement credentials. Your Resume Builder and Profile will be automatically populated.
          </p>

          {/* Google Student OAuth Fast Registration */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <GoogleAuthButton
              role="student"
              actionText="Sign up with Google (Fast Registration)"
            />
          </div>

          <div className="auth-divider-wrap" style={{ display: 'flex', alignItems: 'center', margin: '18px 0', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              or fill out complete registration form
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
            {/* Section 1: Personal Details */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan-600, #0284c7)', marginBottom: 12 }}>
                1. Personal &amp; Contact Details
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 12 }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                    Full Name <span className="required" style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Balraj Pranay"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                    College Email Address <span className="required" style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="pranay@college.edu"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
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
                    City <span className="required" style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="e.g. Hyderabad"
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

            {/* Section 2: Academic Details */}
            <div style={{ marginBottom: 20, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan-600, #0284c7)', marginBottom: 12 }}>
                2. Academic Credentials
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 12 }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                    College Name <span className="required" style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="collegeName"
                    value={form.collegeName}
                    onChange={handleChange}
                    placeholder="e.g. Apex Institute of Engineering & Technology"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                    Hall Ticket No. / Roll No. <span className="required" style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="studentNo"
                    value={form.studentNo}
                    onChange={handleChange}
                    placeholder="e.g. 21B91A0501"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                    Branch / Department <span className="required" style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Communication">Electronics &amp; Communication</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Data Science & AI">Data Science &amp; AI</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                    Current Academic Year <span className="required" style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <select
                    name="academicYear"
                    value={form.academicYear}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                    Graduation Year <span className="required" style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <select
                    name="gradYear"
                    value={form.gradYear}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  >
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                    <option value={2027}>2027</option>
                    <option value={2028}>2028</option>
                    <option value={2029}>2029</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Password & Security */}
            <div style={{ marginBottom: 24, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan-600, #0284c7)', marginBottom: 12 }}>
                3. Account Password
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
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
              {isSubmitting ? 'Registering Account...' : 'Complete Registration & Initialize Resume Builder →'}
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
