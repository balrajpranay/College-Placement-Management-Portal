import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import { getStudentProfileApi, updateStudentProfileApi, uploadStudentResumeApi } from '../../services/api';

export default function StudentProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    department: '',
    gradYear: 2026,
    cgpa: 0,
    backlogs: 0,
    tenthPct: '',
    twelfthPct: '',
    technical_skills: '',
    softSkills: '',
    certifications: '',
    internships: '',
    projects: ''
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const res = await getStudentProfileApi();
        setData(res.data);
        const st = res.data.student;
        setForm({
          name: st.name || '',
          phone: st.phone || '',
          department: st.department || '',
          gradYear: st.gradYear || 2026,
          cgpa: st.cgpa || 0,
          backlogs: st.backlogs || 0,
          tenthPct: st.tenthPct || '',
          twelfthPct: st.twelfthPct || '',
          technical_skills: Array.isArray(st.technical_skills) ? st.technical_skills.join(', ') : (st.technical_skills || ''),
          softSkills: st.softSkills || '',
          certifications: st.certifications || '',
          internships: st.internships || '',
          projects: st.projects || ''
        });
      } catch (err) {
        setStatus({ type: 'error', message: err.message || 'Failed to load profile data.' });
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setSaving(true);

    try {
      const res = await updateStudentProfileApi(form);
      setStatus({ type: 'success', message: 'Profile credentials updated successfully!' });
      if (res.data) {
        setData(prev => ({ ...prev, student: res.data.student, completion: res.data.completion }));
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadStudentResumeApi(file.name);
      setStatus({ type: 'success', message: `Resume '${file.name}' attached successfully!` });
      setData(prev => ({
        ...prev,
        student: {
          ...prev.student,
          resume_filename: res.data.resume_filename,
          resume_original_name: res.data.resume_original_name
        }
      }));
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Resume upload failed.' });
    }
  };

  if (loading) {
    return <div className="text-center" style={{ padding: '60px 0' }}>Loading candidate credentials...</div>;
  }

  const completion = data?.completion || 85;
  const departments = data?.departments || ['Computer Science', 'Information Technology', 'Electronics & Communication', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering'];

  return (
    <div className="profile-page-wrapper">
      <div className="flex-between mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-1)', fontSize: '1.85rem', fontWeight: 800 }}>Candidate Profile &amp; Credentials</h1>
          <p className="text-muted" style={{ margin: 0 }}>Ensure your academic metrics and resume are verified and up to date.</p>
        </div>
        <div className="card" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div>
            <div className="text-xs font-semibold text-muted">PROFILE SCORE</div>
            <div className="font-bold text-brand" style={{ fontSize: '1.1rem', color: 'var(--accent-cyan-600)' }}>{completion}%</div>
          </div>
          <div style={{ width: 90 }}>
            <div className="progress" style={{ height: 6, background: 'var(--border-subtle)', borderRadius: 4, overflow: 'hidden' }}>
              <div className="progress-bar" style={{ width: `${completion}%`, height: '100%', background: 'linear-gradient(90deg, #0096FF, #38BDF8)' }}></div>
            </div>
          </div>
        </div>
      </div>

      {status && (
        <div className={`alert-box ${status.type === 'success' ? 'alert-success-box' : 'alert-danger-box'}`}>
          <div className="alert-box-icon">
            <Icon name={status.type === 'success' ? 'check-circle' : 'alert-circle'} size={18} />
          </div>
          <div className="alert-box-text">
            {status.message}
          </div>
          <button
            onClick={() => setStatus(null)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700, marginLeft: 'auto' }}
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid-2 mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          {/* Basic Details Card */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h3 className="h4 mb-4" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Personal Information</h3>
            
            <div className="form-group mb-4" style={{ marginBottom: 16 }}>
              <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Full Name <span className="required" style={{ color: '#EF4444' }}>*</span></label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', boxSizing: 'border-box' }} />
            </div>

            <div className="form-group mb-4" style={{ marginBottom: 16 }}>
              <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Student ID / Roll No</label>
              <input type="text" value={data?.student?.studentNo || 'CS2023001'} disabled style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-alt)', color: 'var(--text-faint)', boxSizing: 'border-box' }} />
              <div className="form-hint text-xs text-muted" style={{ marginTop: 4 }}>Student ID is tied to your institutional record and cannot be changed.</div>
            </div>

            <div className="form-group mb-4" style={{ marginBottom: 16 }}>
              <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Phone Number</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', boxSizing: 'border-box' }} />
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Department / Branch</label>
                <select name="department" value={form.department} onChange={handleChange} style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', boxSizing: 'border-box' }}>
                  {departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Graduation Year</label>
                <input type="number" name="gradYear" value={form.gradYear} onChange={handleChange} required style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>

          {/* Academic Records Card */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h3 className="h4 mb-4" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Academic Qualifications</h3>
            
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>College CGPA (out of 10) <span className="required" style={{ color: '#EF4444' }}>*</span></label>
                <input type="number" step="0.01" min="0" max="10" name="cgpa" value={form.cgpa} onChange={handleChange} required style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', boxSizing: 'border-box' }} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Active Backlogs <span className="required" style={{ color: '#EF4444' }}>*</span></label>
                <input type="number" min="0" name="backlogs" value={form.backlogs} onChange={handleChange} required style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>10th Grade Percentage (%)</label>
                <input type="number" step="0.01" min="0" max="100" name="tenthPct" value={form.tenthPct} onChange={handleChange} placeholder="e.g. 88.5" style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', boxSizing: 'border-box' }} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>12th / Diploma Percentage (%)</label>
                <input type="number" step="0.01" min="0" max="100" name="twelfthPct" value={form.twelfthPct} onChange={handleChange} placeholder="e.g. 84.0" style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div className="card" style={{ background: 'var(--bg-surface-alt)', borderColor: 'var(--border-subtle)', padding: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
              <div className="text-xs text-muted" style={{ lineHeight: 1.5 }}>
                <strong>Eligibility Engine Note:</strong> Drive qualification evaluates your CGPA, active backlogs, and branch parameters automatically. Keep these accurate to avoid rejection during verification.
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Experience */}
        <div className="card mb-6" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <h3 className="h4 mb-4" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Skills, Projects &amp; Experience</h3>
          
          <div className="form-group mb-4" style={{ marginBottom: 16 }}>
            <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Technical Skills (Comma separated)</label>
            <input type="text" name="technical_skills" value={form.technical_skills} onChange={handleChange} placeholder="e.g. Python, SQL, React, Node.js, AWS, Git" style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', boxSizing: 'border-box' }} />
            <div className="form-hint text-xs text-muted" style={{ marginTop: 4 }}>These tags appear on your candidate profile when recruiters review applications.</div>
          </div>

          <div className="form-group mb-4" style={{ marginBottom: 16 }}>
            <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Soft Skills</label>
            <input type="text" name="softSkills" value={form.softSkills} onChange={handleChange} placeholder="e.g. Problem Solving, Team Leadership, Agile Collaboration" style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', boxSizing: 'border-box' }} />
          </div>

          <div className="form-row mb-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Certifications</label>
              <textarea name="certifications" value={form.certifications} onChange={handleChange} placeholder="e.g. AWS Certified Cloud Practitioner, Coursera Specialization" style={{ width: '100%', minHeight: 80, padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', boxSizing: 'border-box' }} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Internships / Experience</label>
              <textarea name="internships" value={form.internships} onChange={handleChange} placeholder="e.g. Software Engineering Intern at XYZ Corp (May-Jul 2025)" style={{ width: '100%', minHeight: 80, padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>Key Academic / Personal Projects</label>
            <textarea name="projects" value={form.projects} onChange={handleChange} placeholder="Summarize your primary projects, tech stacks, and GitHub links." style={{ width: '100%', minHeight: 90, padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', boxSizing: 'border-box' }} />
          </div>
        </div>

        {/* Resume Management */}
        <div className="card mb-6" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <h3 className="h4 mb-4" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Official Resume File</h3>
          
          {data?.student?.resume_filename && (
            <div className="flex-between mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'var(--bg-surface-alt)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
              <div className="flex-align-center" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icon name="file" size={24} />
                <div>
                  <div className="font-semibold text-sm">{data.student.resume_original_name || 'Uploaded_Resume.pdf'}</div>
                  <div className="text-xs text-muted">Active verified resume attached to applications</div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => alert(`Active Resume: ${data.student.resume_original_name || 'Resume.pdf'}`)}
              >
                <Icon name="download" size={14} /> Download / View
              </button>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
              {data?.student?.resume_filename ? 'Upload Updated Resume File' : 'Upload Resume File'} (PDF, DOC, DOCX — Max 5MB)
            </label>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} style={{ width: '100%', padding: '8px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)' }} />
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? 'Saving Changes...' : 'Save Profile Changes →'}
          </button>
        </div>
      </form>
    </div>
  );
}
