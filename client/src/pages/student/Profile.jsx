import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import ResumeBuilderStudio from '../../components/ResumeBuilderStudio';
import { getStudentProfileApi, updateStudentProfileApi } from '../../services/api';

export default function StudentProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Main profile form state
  const [form, setForm] = useState({
    name: '',
    studentNo: '',
    phone: '',
    email: '',
    department: '',
    gradYear: 2026,
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

        setForm({
          name: st.name || '',
          studentNo: st.studentNo || st.student_no || 'CS2023001',
          phone: st.phone || '',
          email: st.email || '',
          department: st.department || 'Computer Science',
          gradYear: st.gradYear || 2026,
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
  }, []);

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

  const saveProfile = async (overrideForm = null) => {
    if (saving) return;
    setStatus(null);
    setSaving(true);

    try {
      const activeForm = overrideForm || form;
      const payload = {
        ...activeForm,
        technical_skills: activeForm.technical_skills,
        skills: activeForm.technical_skills,
        softSkills: Array.isArray(activeForm.softSkills) ? activeForm.softSkills.join(', ') : activeForm.softSkills
      };

      const res = await updateStudentProfileApi(payload);
      setStatus({ type: 'success', message: 'Resume changes saved and updated successfully!' });
      setIsDirty(false);

      if (res.data) {
        setData(prev => ({
          ...prev,
          student: res.data.student || { ...prev?.student, ...payload }
        }));
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to update resume.' });
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
        <h3 className="h3" style={{ margin: '0 0 8px' }}>Loading Placement Resume Studio...</h3>
        <p className="text-muted" style={{ margin: 0 }}>Initializing LaTeX engine and verified candidate credentials.</p>
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
                  <Icon name="shield" size={12} /> Verified Student
                </span>
                <span className="profile-meta-chip">
                  <Icon name="graduation" size={12} /> Class of {form.gradYear}
                </span>
                <span className="profile-meta-chip chip-success">
                  <Icon name="file-text" size={12} /> Interactive Resume Studio
                </span>
              </div>
              <h1 className="profile-name-title">Placement Resume Builder</h1>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>
                {form.name ? <strong>{form.name}</strong> : 'Candidate'} &bull; {form.department} &bull; Roll No: <strong style={{ color: 'var(--text-main)' }}>{form.studentNo || 'Not Set'}</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => saveProfile()}
              className="btn btn-primary"
              disabled={saving}
              style={{ padding: '10px 22px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700 }}
            >
              <Icon name="check" size={16} />
              {saving ? 'Saving...' : 'Save Resume Changes'}
            </button>
          </div>
        </div>
      </div>

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

      {/* Resume.com-Inspired Interactive Resume Studio */}
      <div style={{ marginTop: 12 }}>
        <ResumeBuilderStudio
          initialData={form.resumeData}
          profileData={{
            name: form.name || data?.student?.name,
            email: form.email || data?.student?.email,
            phone: form.phone || data?.student?.phone,
            department: form.department || data?.student?.department,
            gradYear: form.gradYear || data?.student?.gradYear,
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
            {isDirty ? 'You have unsaved resume changes' : 'Resume is saved and up to date'}
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
            {saving ? 'Saving Resume...' : 'Save Resume Changes →'}
          </button>
        </div>
      </div>
    </div>
  );
}
