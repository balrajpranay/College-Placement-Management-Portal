import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import { getRecruiterProfileApi, updateRecruiterProfileApi } from '../../services/api';

export default function RecruiterProfile() {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website: '',
    hr_contact: '',
    phone: '',
    email: '',
    location: '',
    description: '',
    logo_filename: null
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
            industry: res.company.industry || '',
            website: res.company.website || '',
            hr_contact: res.company.hr_contact || res.company.hrContact || '',
            phone: res.company.phone || '',
            email: res.company.email || '',
            location: res.company.location || '',
            description: res.company.description || '',
            logo_filename: res.company.logo_filename || null
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
      const res = await updateRecruiterProfileApi(formData);
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
          <div className="spinner mb-3" style={{ width: 36, height: 36, border: '3px solid var(--border-subtle)', borderTopColor: 'var(--accent-cyan-500)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
          <p className="text-muted text-sm">Loading corporate profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recruiter-profile">
      {/* Top Banner Header matching Flask profile.html */}
      <div className="mb-8" style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="h2" style={{ margin: '0 0 var(--space-1)' }}>
          Corporate Profile &amp; Branding
        </h1>
        <p className="text-muted" style={{ margin: 0 }}>
          Manage company details visible to students and placement officers.
        </p>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} mb-6`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 8, marginBottom: 24, background: alert.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: alert.type === 'success' ? 'var(--success-500)' : 'var(--danger-500)', border: `1px solid ${alert.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }}>
          <Icon name={alert.type === 'success' ? 'check' : 'alert-circle'} size={18} />
          <span style={{ fontWeight: 500 }}>{alert.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid-2 mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          {/* Card 1: Company Overview */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h3 className="h4 mb-4" style={{ margin: '0 0 var(--space-4)', fontWeight: 700 }}>
              Company Overview
            </h3>

            <div className="form-group mb-4" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                Company Name <span className="required" style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-control"
                style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
              />
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                  Industry Domain
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="e.g. Software / Fintech / Manufacturing"
                  className="form-control"
                  style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                  Website URL
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://company.com"
                  className="form-control"
                  style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div className="form-group mb-4" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                Headquarters / Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Bengaluru, India"
                className="form-control"
                style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                Company Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Brief summary of company products, culture, and career opportunities."
                className="form-control"
                style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Card 2: Contact & Branding */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h3 className="h4 mb-4" style={{ margin: '0 0 var(--space-4)', fontWeight: 700 }}>
              Contact &amp; Branding
            </h3>

            <div className="form-group mb-4" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                HR / Recruiter Contact Name
              </label>
              <input
                type="text"
                name="hr_contact"
                value={formData.hr_contact}
                onChange={handleChange}
                placeholder="HR Lead / Recruiter Name"
                className="form-control"
                style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
              />
            </div>

            <div className="form-group mb-4" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                Contact Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="form-control"
                style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
              />
            </div>

            <div className="form-group mb-4" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                Account Work Email
              </label>
              <input
                type="email"
                value={formData.email || 'hr@technova.com'}
                disabled
                className="form-control"
                style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-alt)', color: 'var(--text-faint)', boxSizing: 'border-box', cursor: 'not-allowed' }}
              />
              <div className="form-hint text-xs text-muted mt-1" style={{ fontSize: '0.75rem', marginTop: 4, color: 'var(--text-muted)' }}>
                Corporate email is used for official system authentication.
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                Company Logo
              </label>
              <div className="flex-align-center mb-3" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div
                  className="drive-logo"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-alt)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    color: 'var(--brand-500)'
                  }}
                >
                  {(formData.name[0] || 'T').toUpperCase()}
                </div>
                <div>
                  <span className="text-sm font-semibold" style={{ display: 'block' }}>{formData.name || 'Company'} Logo</span>
                  <span className="text-xs text-muted">Active verified corporate badge</span>
                </div>
              </div>
              <div className="form-hint text-xs text-muted" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Recommended: Square PNG / SVG, max 2MB.
              </div>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary btn-lg"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontSize: '0.95rem', fontWeight: 600 }}
          >
            <Icon name="check" size={16} /> {saving ? 'Saving...' : 'Save Corporate Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
