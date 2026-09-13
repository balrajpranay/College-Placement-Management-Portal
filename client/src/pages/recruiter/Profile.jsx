import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import { getRecruiterProfileApi, updateRecruiterProfileApi } from '../../services/api';

export default function RecruiterProfile() {
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    location: '',
    domain: '',
    email: '',
    hr_contact: '',
    hr_position: '',
    gov_id: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await getRecruiterProfileApi();
        if (res?.company) {
          setFormData({
            name: res.company.name || '',
            website: res.company.website || '',
            location: res.company.location || '',
            domain: res.company.domain || res.company.industry || '',
            email: res.company.email || '',
            hr_contact: res.company.hr_contact || res.company.hrContact || '',
            hr_position: res.company.hr_position || res.company.hrPosition || '',
            gov_id: res.company.gov_id || res.company.govId || '',
            phone: res.company.phone || res.company.mobile || ''
          });
        }
      } catch (err) {
        console.error('Failed to load corporate profile:', err);
        setAlert({ type: 'danger', message: err.message || 'Failed to load profile data.' });
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert(null);
    try {
      const res = await updateRecruiterProfileApi({
        ...formData,
        industry: formData.domain,
        mobile: formData.phone
      });
      setAlert({ type: 'success', message: res.message || 'Company profile updated successfully.' });
    } catch (err) {
      console.error('Failed to update corporate profile:', err);
      setAlert({ type: 'danger', message: err.message || 'Failed to update company profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            className="spinner mb-3"
            style={{
              width: 36,
              height: 36,
              border: '3px solid var(--border-subtle)',
              borderTopColor: 'var(--brand-500, #3b82f6)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto'
            }}
          />
          <p className="text-muted text-sm">Loading company profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recruiter-profile" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Top Banner Header */}
      <div className="mb-6" style={{ marginBottom: 'var(--space-6, 24px)' }}>
        <h1 className="h2" style={{ margin: '0 0 var(--space-1, 4px)', fontWeight: 700 }}>
          Company Profile
        </h1>
        <p className="text-muted" style={{ margin: 0 }}>
          Manage your organization details and primary recruiter verification information.
        </p>
      </div>

      {alert && (
        <div
          className={`alert alert-${alert.type} mb-6`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            borderRadius: 8,
            marginBottom: 24,
            background: alert.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: alert.type === 'success' ? 'var(--success-500, #10b981)' : 'var(--danger-500, #ef4444)',
            border: `1px solid ${alert.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}
        >
          <Icon name={alert.type === 'success' ? 'check' : 'alert-circle'} size={18} />
          <span style={{ fontWeight: 500 }}>{alert.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Section 1: Company Details */}
        <div
          className="card mb-6"
          style={{
            padding: 'var(--space-6, 24px)',
            marginBottom: 'var(--space-6, 24px)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg, 12px)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--space-5, 20px)' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: 'rgba(59, 130, 246, 0.1)',
                color: 'var(--brand-500, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon name="briefcase" size={18} />
            </div>
            <div>
              <h3 className="h4" style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem' }}>
                Company Information
              </h3>
              <p className="text-muted text-xs" style={{ margin: 0, fontSize: '0.8rem' }}>
                Key institutional data visible to students and placement coordinators.
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px'
            }}
          >
            {/* 1. Company Name */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                Company Name <span style={{ color: 'var(--danger, #ef4444)' }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Acme Technologies Inc."
                required
                className="form-control"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md, 8px)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* 2. Website */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://company.com"
                className="form-control"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md, 8px)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* 3. Company Location */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                Company Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Bengaluru, Karnataka, India"
                className="form-control"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md, 8px)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* 4. Company Domain */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                Company Domain
              </label>
              <input
                type="text"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                placeholder="e.g. Information Technology / Fintech / E-Commerce"
                className="form-control"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md, 8px)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </div>

        {/* Section 2: HR / Recruiter Details & Government Verification */}
        <div
          className="card mb-6"
          style={{
            padding: 'var(--space-6, 24px)',
            marginBottom: 'var(--space-6, 24px)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg, 12px)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--space-5, 20px)' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--success-500, #10b981)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon name="user-check" size={18} />
            </div>
            <div>
              <h3 className="h4" style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem' }}>
                HR / Recruiter &amp; Verification
              </h3>
              <p className="text-muted text-xs" style={{ margin: 0, fontSize: '0.8rem' }}>
                Contact representative and identity compliance records.
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px'
            }}
          >
            {/* 5. Email */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                Email <span style={{ color: 'var(--danger, #ef4444)' }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="hr@company.com"
                required
                className="form-control"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md, 8px)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* 6. HR / Recruiter Contact Name */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                HR / Recruiter Contact Name
              </label>
              <input
                type="text"
                name="hr_contact"
                value={formData.hr_contact}
                onChange={handleChange}
                placeholder="e.g. Priya Sharma"
                className="form-control"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md, 8px)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* 7. HR / Recruiter Contact Position */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                HR / Recruiter Contact Position
              </label>
              <input
                type="text"
                name="hr_position"
                value={formData.hr_position}
                onChange={handleChange}
                placeholder="e.g. Head of University Relations / Senior Recruiter"
                className="form-control"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md, 8px)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* 8. Government Identification Number (Aadhaar or PAN) */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                Government Identification Number (Aadhaar or PAN)
              </label>
              <input
                type="text"
                name="gov_id"
                value={formData.gov_id}
                onChange={handleChange}
                placeholder="e.g. ABCDE1234F or 1234 5678 9012"
                className="form-control"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md, 8px)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* 9. Mobile Number */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                Mobile Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 98765 43210"
                className="form-control"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md, 8px)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 'var(--space-4, 16px)' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '11px 24px',
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md, 8px)',
              cursor: saving ? 'not-allowed' : 'pointer'
            }}
          >
            <Icon name="check" size={16} />
            {saving ? 'Saving...' : 'Save Company Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
