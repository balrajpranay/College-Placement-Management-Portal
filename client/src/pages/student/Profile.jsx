import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import ResumeBuilderStudio from '../../components/ResumeBuilderStudio';
import { getStudentProfileApi, updateStudentProfileApi } from '../../services/api';

export default function StudentProfile() {
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);

  // Main profile form state
  const [form, setForm] = useState({
    name: '',
    studentNo: '',
    collegeName: '',
    department: 'Computer Science',
    academicYear: '4th Year',
    gradYear: 2026,
    phone: '',
    city: '',
    gender: '',
    email: '',
    cgpa: 0,
    backlogs: 0,
    tenthPct: '',
    twelfthPct: '',
    technical_skills: [],
    softSkills: [],
    certifications: '',
    internships: '',
    projects: '',
    resumeLatex: '',
    resumeData: null
  });

  // Check if user came with ?complete=true
  const isCompletePrompt = new URLSearchParams(location.search).get('complete') === 'true';

  // Load candidate profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const res = await getStudentProfileApi();
        setData(res.data);
        const st = res.data?.student || {};

        // Normalize technical skills into an array
        let techArr = [];
        if (Array.isArray(st.technical_skills) && st.technical_skills.length > 0) {
          techArr = st.technical_skills;
        } else if (Array.isArray(st.skills) && st.skills.length > 0) {
          techArr = st.skills;
        } else if (typeof st.technical_skills === 'string' && st.technical_skills.trim()) {
          techArr = st.technical_skills.split(',').map(s => s.trim()).filter(Boolean);
        }

        // Normalize soft skills into an array
        let softArr = [];
        if (Array.isArray(st.softSkills)) {
          softArr = st.softSkills;
        } else if (typeof st.softSkills === 'string' && st.softSkills.trim()) {
          softArr = st.softSkills.split(',').map(s => s.trim()).filter(Boolean);
        }

        const isMissingFields = !st.collegeName || !st.phone || !st.city;
        if (isCompletePrompt || isMissingFields) {
          setShowProfileCard(true);
        }

        setForm({
          name: st.name || '',
          studentNo: st.studentNo || st.student_no || '',
          collegeName: st.collegeName || st.college_name || '',
          department: st.department || 'Computer Science',
          academicYear: st.academicYear || st.academic_year || '4th Year',
          gradYear: st.gradYear || 2026,
          phone: st.phone || '',
          city: st.city || '',
          gender: st.gender || '',
          email: st.email || '',
          cgpa: st.cgpa !== undefined ? st.cgpa : 8.5,
          backlogs: st.backlogs !== undefined ? st.backlogs : 0,
          tenthPct: st.tenthPct !== undefined && st.tenthPct !== null ? st.tenthPct : '',
          twelfthPct: st.twelfthPct !== undefined && st.twelfthPct !== null ? st.twelfthPct : '',
          technical_skills: techArr,
          softSkills: softArr,
          certifications: st.certifications || '',
          internships: st.internships || '',
          projects: st.projects || '',
          resumeLatex: st.resumeLatex || st.resume_latex || '',
          resumeData: st.resumeData || st.resume_data || null
        });
        setIsDirty(false);
      } catch (err) {
        setStatus({ type: 'error', message: err.message || 'Failed to load profile data.' });
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [location.search, isCompletePrompt]);

  // Keyboard shortcut: Ctrl+S or Cmd+S to save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveProfile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [form, saving]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const saveProfile = async (overrideForm = null, customSuccessMsg = null) => {
    if (saving) return;
    setStatus(null);
    setSaving(true);

    try {
      const activeForm = overrideForm || form;
      const payload = {
        ...activeForm,
        gradYear: Number(activeForm.gradYear || 2026),
        cgpa: Number(activeForm.cgpa || 0),
        technical_skills: activeForm.technical_skills,
        skills: activeForm.technical_skills,
        softSkills: Array.isArray(activeForm.softSkills) ? activeForm.softSkills.join(', ') : activeForm.softSkills
      };

      const res = await updateStudentProfileApi(payload);
      setStatus({
        type: 'success',
        message: customSuccessMsg || 'Profile and resume changes saved successfully!'
      });
      setIsDirty(false);

      if (isCompletePrompt) {
        navigate('/student/profile', { replace: true });
      }

      if (res.data) {
        setData(prev => ({
          ...prev,
          student: res.data.student || { ...prev?.student, ...payload }
        }));
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page-shell" style={{ textAlign: 'center', padding: '90px 0' }}>
        <div className="stat-icon brand" style={{ width: 48, height: 48, margin: '0 auto 16px', borderRadius: 12, background: 'rgba(0,150,255,0.1)', color: '#0096FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="user" size={24} />
        </div>
        <h3 className="h3" style={{ margin: '0 0 8px' }}>Loading Placement Profile &amp; Resume Studio...</h3>
        <p className="text-muted" style={{ margin: 0 }}>Initializing candidate credentials and resume layout.</p>
      </div>
    );
  }

  const candidateInitials = (form.name || 'Student')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="profile-page-shell">
      {/* 1. Header Banner */}
      <div className="profile-header-card">
        <div className="profile-header-inner">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{candidateInitials}</div>
            <div>
              <div className="profile-badges-row mb-1">
                <span className="profile-meta-chip chip-accent">
                  <Icon name="shield" size={12} /> Verified Student Profile
                </span>
                <span className="profile-meta-chip">
                  <Icon name="graduation" size={12} /> Class of {form.gradYear} ({form.academicYear || '4th Year'})
                </span>
                <span className="profile-meta-chip chip-success">
                  <Icon name="file-text" size={12} /> Live Placement Resume
                </span>
              </div>
              <h1 className="profile-name-title">{form.name || 'Student Profile'}</h1>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>
                {form.collegeName ? <strong>{form.collegeName}</strong> : 'Campus Connect'}&nbsp;&bull;&nbsp;
                {form.department}&nbsp;&bull;&nbsp;
                Roll No: <strong style={{ color: 'var(--text-main)' }}>{form.studentNo || 'Pending'}</strong>&nbsp;&bull;&nbsp;
                {form.city ? form.city : 'India'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setShowProfileCard(prev => !prev)}
              className="btn btn-outline"
              style={{ padding: '10px 18px', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600 }}
            >
              <Icon name="edit" size={15} />
              {showProfileCard ? 'Hide Profile Details' : 'Edit Profile Credentials'}
            </button>
            <button
              type="button"
              onClick={() => saveProfile()}
              className="btn btn-primary"
              disabled={saving}
              style={{ padding: '10px 22px', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700 }}
            >
              <Icon name="check" size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Google OAuth Profile Completion Banner */}
      {isCompletePrompt && (
        <div className="alert-box mb-4" style={{ background: 'rgba(2, 132, 199, 0.08)', border: '1px solid rgba(2, 132, 199, 0.3)', color: '#0369a1', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ fontSize: '1.25rem' }}>🎓</div>
          <div style={{ flex: 1, fontSize: '0.875rem' }}>
            <strong>Welcome to Campus Connect!</strong> Please verify and complete your college, department, roll number, and contact details below. This will automatically populate your live placement resume.
          </div>
        </div>
      )}

      {/* Alert Notifications */}
      {status && (
        <div className={`alert-box mb-4 ${status.type === 'success' ? 'alert-success-box' : 'alert-danger-box'}`} style={{ marginBottom: 16 }}>
          <div className="alert-box-icon">
            <Icon name={status.type === 'success' ? 'check-circle' : 'alert-circle'} size={18} />
          </div>
          <div className="alert-box-text">{status.message}</div>
          <button
            onClick={() => setStatus(null)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700, marginLeft: 'auto' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Expandable Student Academic & Contact Details Form */}
      {showProfileCard && (
        <div className="card mb-4" style={{ marginBottom: 20, border: '1px solid var(--border-subtle)', borderRadius: 12, background: 'var(--bg-surface)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Student Academic &amp; Contact Credentials
              </h3>
              <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '0.8125rem' }}>
                Updates made here are automatically synced to your Resume Builder contact and education blocks.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowProfileCard(false)}
              className="btn btn-sm btn-ghost"
              style={{ fontSize: '0.8rem' }}
            >
              Close
            </button>
          </div>

          <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                  Full Name <span className="required" style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFieldChange}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  readOnly
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.03)', color: 'var(--text-muted)', boxSizing: 'border-box', cursor: 'not-allowed' }}
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
                  onChange={handleFieldChange}
                  placeholder="+91 98765 43210"
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
                  onChange={handleFieldChange}
                  placeholder="e.g. Hyderabad"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                  College Name <span className="required" style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="collegeName"
                  value={form.collegeName}
                  onChange={handleFieldChange}
                  placeholder="e.g. Apex Institute of Engineering & Technology"
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
                  onChange={handleFieldChange}
                  placeholder="e.g. 21B91A0501"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                  Branch / Department <span className="required" style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleFieldChange}
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
                  onChange={handleFieldChange}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                  Graduation Year <span className="required" style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  name="gradYear"
                  value={form.gradYear}
                  onChange={handleFieldChange}
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

              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                  Gender <span className="text-muted" style={{ fontWeight: 400, fontSize: '0.75rem' }}>(Optional)</span>
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleFieldChange}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                  Cumulative CGPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  name="cgpa"
                  value={form.cgpa}
                  onChange={handleFieldChange}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                  Active Backlogs
                </label>
                <input
                  type="number"
                  min="0"
                  name="backlogs"
                  value={form.backlogs}
                  onChange={handleFieldChange}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                type="button"
                onClick={() => saveProfile(null, 'Academic credentials updated and synced to resume!')}
                className="btn btn-primary"
                disabled={saving}
                style={{ padding: '9px 20px', borderRadius: 8, fontWeight: 700 }}
              >
                {saving ? 'Saving...' : 'Save Profile & Sync Resume →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Interactive Resume Builder Studio */}
      <div style={{ marginTop: 12 }}>
        <ResumeBuilderStudio
          initialData={form.resumeData}
          profileData={{
            name: form.name || data?.student?.name,
            email: form.email || data?.student?.email,
            phone: form.phone || data?.student?.phone,
            collegeName: form.collegeName || data?.student?.collegeName,
            department: form.department || data?.student?.department,
            academicYear: form.academicYear || data?.student?.academicYear,
            gradYear: form.gradYear || data?.student?.gradYear,
            city: form.city || data?.student?.city,
            gender: form.gender || data?.student?.gender,
            studentNo: form.studentNo || data?.student?.studentNo,
            cgpa: form.cgpa || data?.student?.cgpa,
            technical_skills: form.technical_skills || data?.student?.technical_skills,
            internships: form.internships || data?.student?.internships,
            projects: form.projects || data?.student?.projects,
            certifications: form.certifications || data?.student?.certifications
          }}
          onChange={(newData) => {
            setForm(prev => ({ ...prev, resumeData: newData }));
            setIsDirty(true);
          }}
          onSave={(newData) => {
            const updated = { ...form, resumeData: newData };
            setForm(updated);
            saveProfile(updated);
          }}
          saving={saving}
        />
      </div>

      {/* Form Actions Footer */}
      <div className="profile-actions-footer" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: isDirty ? '#F59E0B' : '#10B981',
              boxShadow: isDirty ? '0 0 8px #F59E0B' : '0 0 8px #10B981'
            }}
          />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {isDirty ? 'You have unsaved changes' : 'Profile & Resume are saved and up to date'}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            &bull; Shortcut: <kbd style={{ padding: '2px 6px', background: 'var(--bg-surface-alt)', border: '1px solid var(--border-subtle)', borderRadius: 4 }}>Ctrl+S</kbd> Save &bull; Click any section or header to edit inline
          </span>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => saveProfile()}
            className="btn btn-primary btn-lg"
            disabled={saving}
            style={{ padding: '12px 28px', fontWeight: 700, borderRadius: 10 }}
          >
            {saving ? 'Saving...' : 'Save Resume Changes →'}
          </button>
        </div>
      </div>
    </div>
  );
}
