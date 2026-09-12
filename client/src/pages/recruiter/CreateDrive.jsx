import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Icon from '../../components/Icon';
import { createRecruiterDriveApi, getRecruiterDriveDetailApi, updateRecruiterDriveApi } from '../../services/api';

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Biotechnology'
];

const JOB_TYPES = ['Full-Time', 'Internship', 'Internship + PPO', 'Part-Time'];

export default function CreateDrive() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    job_type: 'Full-Time',
    ctc: '',
    location: '',
    openings: 5,
    deadline: '',
    drive_date: '',
    description: '',
    min_cgpa: 6.0,
    max_backlogs: 0,
    branches: [...DEPARTMENTS],
    skills: '',
    status: 'active'
  });

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      async function fetchDrive() {
        try {
          setLoading(true);
          const res = await getRecruiterDriveDetailApi(id);
          if (res?.drive) {
            const d = res.drive;
            setFormData({
              title: d.title || '',
              job_type: d.job_type || 'Full-Time',
              ctc: d.ctc || '',
              location: d.location || '',
              openings: d.openings || 5,
              deadline: d.deadline || '',
              drive_date: d.drive_date || '',
              description: d.description || '',
              min_cgpa: d.min_cgpa ?? 6.0,
              max_backlogs: d.max_backlogs ?? 0,
              branches: Array.isArray(d.branches) ? d.branches : DEPARTMENTS,
              skills: Array.isArray(d.skills) ? d.skills.join(', ') : (d.skills || ''),
              status: d.status || 'active'
            });
          }
        } catch (err) {
          console.error('Failed to load drive detail:', err);
          setAlert({ type: 'danger', message: err.message || 'Failed to load drive for editing.' });
        } finally {
          setLoading(false);
        }
      }
      fetchDrive();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBranchToggle = (dept) => {
    setFormData(prev => {
      const exists = prev.branches.includes(dept);
      const updated = exists
        ? prev.branches.filter(b => b !== dept)
        : [...prev.branches, dept];
      return { ...prev, branches: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAlert(null);

    // Client-side Validation
    if (!formData.title.trim()) {
      setAlert({ type: 'danger', message: 'Job title is required.' });
      setSubmitting(false);
      return;
    }
    if (!formData.deadline) {
      setAlert({ type: 'danger', message: 'Application deadline date is required.' });
      setSubmitting(false);
      return;
    }
    if (!formData.ctc || parseFloat(formData.ctc) <= 0) {
      setAlert({ type: 'danger', message: 'Annual package CTC must be a positive number.' });
      setSubmitting(false);
      return;
    }

    try {
      if (isEditMode) {
        await updateRecruiterDriveApi(id, formData);
      } else {
        await createRecruiterDriveApi(formData);
      }
      navigate('/recruiter/drives');
    } catch (err) {
      console.error('Failed to save drive:', err);
      setAlert({ type: 'danger', message: err.message || 'Failed to save drive.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner mb-3" style={{ width: 36, height: 36, border: '3px solid var(--border-subtle)', borderTopColor: 'var(--accent-cyan-500)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
          <p className="text-muted text-sm">Loading drive data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recruiter-create-drive">
      {/* Back Link matching Flask create_drive.html */}
      <Link
        to="/recruiter/drives"
        className="text-sm font-semibold text-muted"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-4)', textDecoration: 'none' }}
      >
        &larr; Back to Managed Drives
      </Link>

      <div className="mb-8" style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="h2" style={{ margin: '0 0 var(--space-1)' }}>
          {isEditMode ? 'Edit Placement Drive' : 'Post New Placement Drive'}
        </h1>
        <p className="text-muted" style={{ margin: 0 }}>
          Define role details, package CTC, and eligibility thresholds for candidates.
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
          {/* Card 1: Job Role & Compensation */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h3 className="h4 mb-4" style={{ margin: '0 0 var(--space-4)', fontWeight: 700 }}>
              Job Role &amp; Compensation
            </h3>

            <div className="form-group mb-4" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                Job Title / Designation <span className="required" style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Associate Software Engineer"
                required
                className="form-control"
                style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
              />
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                  Job Type <span className="required" style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <select
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleChange}
                  required
                  className="form-control"
                  style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                >
                  {JOB_TYPES.map(jt => (
                    <option key={jt} value={jt}>{jt}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                  Annual CTC (in LPA) <span className="required" style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="ctc"
                  value={formData.ctc}
                  onChange={handleChange}
                  placeholder="e.g. 12.5"
                  required
                  className="form-control"
                  style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                  Work Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Hyderabad / Hybrid / Remote"
                  className="form-control"
                  style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                  Number of Openings <span className="required" style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  name="openings"
                  value={formData.openings}
                  onChange={handleChange}
                  required
                  className="form-control"
                  style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                  Application Deadline <span className="required" style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  className="form-control"
                  style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                  Tentative Drive Date
                </label>
                <input
                  type="date"
                  name="drive_date"
                  value={formData.drive_date}
                  onChange={handleChange}
                  className="form-control"
                  style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                Job Description &amp; Responsibilities
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Outline the primary duties, tech stack expectations, and qualifications."
                className="form-control"
                style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Card 2: Eligibility Thresholds */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h3 className="h4 mb-4" style={{ margin: '0 0 var(--space-4)', fontWeight: 700 }}>
              Eligibility Thresholds
            </h3>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                  Minimum CGPA (out of 10) <span className="required" style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  name="min_cgpa"
                  value={formData.min_cgpa}
                  onChange={handleChange}
                  required
                  className="form-control"
                  style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                  Max Active Backlogs Allowed <span className="required" style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  name="max_backlogs"
                  value={formData.max_backlogs}
                  onChange={handleChange}
                  required
                  className="form-control"
                  style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div className="form-group mb-4" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '0.875rem' }}>
                Eligible Departments / Branches
              </label>
              <div
                className="checkbox-grid"
                style={{
                  background: 'var(--bg-surface-alt)',
                  padding: 14,
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: 10
                }}
              >
                {DEPARTMENTS.map(dept => {
                  const checked = formData.branches.includes(dept);
                  return (
                    <label
                      key={dept}
                      className="checkbox-row"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleBranchToggle(dept)}
                      />
                      <span>{dept}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="form-group mb-4" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                Required Skills (Comma separated)
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. Python, SQL, REST APIs, Problem Solving"
                className="form-control"
                style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
              />
              <div className="form-hint text-xs text-muted mt-1" style={{ fontSize: '0.75rem', marginTop: 4, color: 'var(--text-muted)' }}>
                Displayed to students as target skill badges.
              </div>
            </div>

            {isEditMode && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem' }}>
                  Drive Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-control"
                  style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                >
                  <option value="active">Active (Open for Applications)</option>
                  <option value="closed">Closed</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-lg"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', fontSize: '0.95rem', fontWeight: 600 }}
          >
            <Icon name="check" size={16} /> {submitting ? 'Saving...' : (isEditMode ? 'Update Placement Drive' : 'Publish Placement Drive')}
          </button>
        </div>
      </form>
    </div>
  );
}
