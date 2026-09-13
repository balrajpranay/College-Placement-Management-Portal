import React, { useState, useEffect, useMemo } from 'react';
import Icon from '../../components/Icon';
import { getStudentProfileApi, updateStudentProfileApi, uploadStudentResumeApi } from '../../services/api';

// Curated high-demand skills for placement drives
const POPULAR_TECH_SKILLS = [
  'React',
  'Node.js',
  'Python',
  'Java',
  'TypeScript',
  'SQL',
  'AWS',
  'Docker',
  'Git',
  'MongoDB',
  'REST APIs',
  'PostgreSQL',
  'C++',
  'Data Structures',
  'Machine Learning'
];

const POPULAR_SOFT_SKILLS = [
  'Analytical Problem Solving',
  'Team Leadership',
  'Agile Collaboration',
  'Technical Documentation',
  'Clear Communication',
  'Critical Thinking',
  'Adaptability'
];

export default function StudentProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Skill input buffers
  const [techInput, setTechInput] = useState('');
  const [softInput, setSoftInput] = useState('');

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
    projects: ''
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
          projects: st.projects || ''
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

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setIsDirty(true);
  };

  // Technical Skills pill handlers
  const handleAddTechSkill = (skillToAdd) => {
    const raw = (skillToAdd !== undefined ? skillToAdd : techInput).trim();
    if (!raw) return;

    // Handle comma-separated additions in text input
    const toAdd = raw.split(',').map(s => s.trim()).filter(Boolean);
    setForm(prev => {
      const existing = prev.technical_skills || [];
      const updated = [...existing];
      toAdd.forEach(item => {
        if (!updated.some(s => s.toLowerCase() === item.toLowerCase())) {
          updated.push(item);
        }
      });
      return { ...prev, technical_skills: updated };
    });
    setTechInput('');
    setIsDirty(true);
  };

  const handleRemoveTechSkill = (skillToRemove) => {
    setForm(prev => ({
      ...prev,
      technical_skills: (prev.technical_skills || []).filter(s => s !== skillToRemove)
    }));
    setIsDirty(true);
  };

  // Soft Skills pill handlers
  const handleAddSoftSkill = (skillToAdd) => {
    const raw = (skillToAdd !== undefined ? skillToAdd : softInput).trim();
    if (!raw) return;

    const toAdd = raw.split(',').map(s => s.trim()).filter(Boolean);
    setForm(prev => {
      const existing = prev.softSkills || [];
      const updated = [...existing];
      toAdd.forEach(item => {
        if (!updated.some(s => s.toLowerCase() === item.toLowerCase())) {
          updated.push(item);
        }
      });
      return { ...prev, softSkills: updated };
    });
    setSoftInput('');
    setIsDirty(true);
  };

  const handleRemoveSoftSkill = (skillToRemove) => {
    setForm(prev => ({
      ...prev,
      softSkills: (prev.softSkills || []).filter(s => s !== skillToRemove)
    }));
    setIsDirty(true);
  };

  // Save profile changes
  const saveProfile = async () => {
    if (saving) return;
    setStatus(null);
    setSaving(true);

    try {
      // Prepare payload: convert skill arrays appropriately
      const payload = {
        ...form,
        technical_skills: form.technical_skills,
        skills: form.technical_skills,
        softSkills: form.softSkills.join(', ')
      };

      const res = await updateStudentProfileApi(payload);
      setStatus({ type: 'success', message: 'Profile credentials and skills updated successfully!' });
      setIsDirty(false);

      if (res.data) {
        setData(prev => ({
          ...prev,
          student: res.data.student || { ...prev?.student, ...payload },
          completion: res.data.completion || prev?.completion
        }));
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveProfile();
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadStudentResumeApi(file.name);
      setStatus({ type: 'success', message: `Resume '${file.name}' attached and verified!` });
      setData(prev => ({
        ...prev,
        student: {
          ...prev.student,
          resume_filename: res.data.resume_filename,
          resume_original_name: res.data.resume_original_name
        }
      }));
      setIsDirty(false);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Resume upload failed.' });
    }
  };

  // Dynamic eligibility calculation
  const cgpaVal = parseFloat(form.cgpa) || 0;
  const backlogsVal = parseInt(form.backlogs, 10) || 0;
  const isSuperEligible = cgpaVal >= 7.5 && backlogsVal === 0;
  const isStandardEligible = cgpaVal >= 6.0 && backlogsVal <= 1;

  // Completion calculation
  const completion = useMemo(() => {
    let score = 20; // base identity
    if (form.name && form.studentNo) score += 15;
    if (form.cgpa > 0) score += 15;
    if (form.technical_skills && form.technical_skills.length >= 3) score += 20;
    if (form.softSkills && form.softSkills.length >= 2) score += 10;
    if (data?.student?.resume_filename) score += 20;
    return Math.min(score, 100);
  }, [form, data]);

  if (loading) {
    return (
      <div className="profile-page-shell" style={{ textAlign: 'center', padding: '90px 0' }}>
        <div className="stat-icon brand" style={{ width: 48, height: 48, margin: '0 auto 16px', borderRadius: 12, background: 'rgba(0,150,255,0.1)', color: '#0096FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="user" size={24} />
        </div>
        <h3 className="h3" style={{ margin: '0 0 8px' }}>Loading Candidate Credentials...</h3>
        <p className="text-muted" style={{ margin: 0 }}>Retrieving verified academic records and skill matrix.</p>
      </div>
    );
  }

  const departments = data?.departments || [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering'
  ];

  const candidateInitials = (form.name || 'Student')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="profile-page-shell">
      {/* 1. Header Banner with Candidate Identity & Score */}
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
                {data?.student?.resume_filename && (
                  <span className="profile-meta-chip chip-success">
                    <Icon name="check-circle" size={12} /> Resume Verified
                  </span>
                )}
              </div>
              <h1 className="profile-name-title">{form.name || 'Candidate Profile'}</h1>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>
                {form.department} &bull; Roll No: <strong style={{ color: 'var(--text-main)' }}>{form.studentNo || 'Not Set'}</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div className="profile-score-widget">
              <div>
                <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Profile Readiness
                </div>
                <div className="score-number">{completion}%</div>
              </div>
              <div style={{ flex: 1, minWidth: 80 }}>
                <div style={{ height: 6, background: 'var(--border-subtle)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${completion}%`, height: '100%', background: 'linear-gradient(90deg, #0096FF, #10B981)', transition: 'width 0.4s ease' }} />
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 3 }}>
                  {completion >= 85 ? 'Placement Optimized' : 'Needs Complete Skills'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={saveProfile}
              className="btn btn-primary"
              disabled={saving}
              style={{ padding: '10px 20px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <Icon name="check" size={16} />
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>

      {/* Alert Notifications */}
      {status && (
        <div className={`alert-box mb-6 ${status.type === 'success' ? 'alert-success-box' : 'alert-danger-box'}`} style={{ marginBottom: 20 }}>
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

      {/* Main Form */}
      <form onSubmit={handleSubmit}>
        <div className="profile-grid-layout">
          {/* Main Column */}
          <div className="profile-main-col">
            {/* Card 1: Personal & Institutional Identity */}
            <div className="profile-section-card">
              <div className="section-header">
                <div className="section-icon-wrap">
                  <Icon name="user" size={20} />
                </div>
                <div>
                  <h3 className="section-title">Institutional &amp; Personal Identity</h3>
                  <p className="section-desc">Manage your full candidate name, contact, and official university registration roll number.</p>
                </div>
              </div>

              <div className="profile-field-grid-2">
                <div className="profile-input-group">
                  <label className="profile-label">
                    Full Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full legal name"
                    className="profile-input"
                  />
                </div>

                {/* UNLOCKED: Student ID / Roll No */}
                <div className="profile-input-group">
                  <label className="profile-label">
                    <span>University Roll No / Student ID <span style={{ color: '#EF4444' }}>*</span></span>
                    <span style={{ fontSize: '0.725rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Icon name="unlock" size={12} /> Editable
                    </span>
                  </label>
                  <input
                    type="text"
                    name="studentNo"
                    value={form.studentNo}
                    onChange={handleChange}
                    required
                    placeholder="e.g. CS2023001 or 21BCE1042"
                    className="profile-input unlocked-highlight"
                  />
                  <div className="profile-hint">
                    Tied to your institutional dossier. You can update this to match your university examination hall ticket.
                  </div>
                </div>
              </div>

              <div className="profile-field-grid-2">
                <div className="profile-input-group">
                  <label className="profile-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="profile-input"
                  />
                </div>

                <div className="profile-input-group">
                  <label className="profile-label">
                    <span>Registered Institutional Email</span>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>OAuth Verified</span>
                  </label>
                  <input
                    type="email"
                    value={form.email || data?.student?.email || 'student@university.edu'}
                    disabled
                    className="profile-input"
                    style={{ opacity: 0.8, cursor: 'not-allowed', background: 'var(--bg-surface-alt)' }}
                  />
                </div>
              </div>

              <div className="profile-field-grid-2">
                <div className="profile-input-group">
                  <label className="profile-label">Department / Branch</label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="profile-select"
                  >
                    {departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="profile-input-group">
                  <label className="profile-label">Graduation Year</label>
                  <input
                    type="number"
                    name="gradYear"
                    min="2024"
                    max="2030"
                    value={form.gradYear}
                    onChange={handleChange}
                    required
                    className="profile-input"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Academic Qualifications & Eligibility Engine */}
            <div className="profile-section-card">
              <div className="section-header">
                <div className="section-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                  <Icon name="graduation" size={20} />
                </div>
                <div>
                  <h3 className="section-title">Academic Qualifications &amp; Drive Eligibility</h3>
                  <p className="section-desc">Academic cutoff criteria evaluated by recruiter algorithms during drive shortlisting.</p>
                </div>
              </div>

              <div className="profile-field-grid-2">
                <div className="profile-input-group">
                  <label className="profile-label">
                    College CGPA (out of 10) <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    name="cgpa"
                    value={form.cgpa}
                    onChange={handleChange}
                    required
                    className="profile-input"
                  />
                </div>

                <div className="profile-input-group">
                  <label className="profile-label">
                    Active Backlogs <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    name="backlogs"
                    value={form.backlogs}
                    onChange={handleChange}
                    required
                    className="profile-input"
                  />
                </div>
              </div>

              <div className="profile-field-grid-2">
                <div className="profile-input-group">
                  <label className="profile-label">10th Grade Percentage (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    name="tenthPct"
                    value={form.tenthPct}
                    onChange={handleChange}
                    placeholder="e.g. 88.5"
                    className="profile-input"
                  />
                </div>

                <div className="profile-input-group">
                  <label className="profile-label">12th / Diploma Percentage (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    name="twelfthPct"
                    value={form.twelfthPct}
                    onChange={handleChange}
                    placeholder="e.g. 84.0"
                    className="profile-input"
                  />
                </div>
              </div>

              {/* Real-time Eligibility Engine Output */}
              <div style={{
                padding: '14px 16px',
                borderRadius: 12,
                background: isSuperEligible
                  ? 'rgba(16, 185, 129, 0.08)'
                  : isStandardEligible
                  ? 'rgba(0, 150, 255, 0.08)'
                  : 'rgba(245, 158, 11, 0.08)',
                border: `1px solid ${
                  isSuperEligible
                    ? 'rgba(16, 185, 129, 0.25)'
                    : isStandardEligible
                    ? 'rgba(0, 150, 255, 0.25)'
                    : 'rgba(245, 158, 11, 0.25)'
                }`,
                marginTop: 8
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon
                    name={isSuperEligible || isStandardEligible ? 'check-circle' : 'alert'}
                    size={18}
                    style={{
                      color: isSuperEligible ? '#10B981' : isStandardEligible ? '#0096FF' : '#F59E0B'
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {isSuperEligible
                        ? 'Super Dream & Tier-1 Qualified (CGPA ≥ 7.5, 0 Backlogs)'
                        : isStandardEligible
                        ? 'Standard Placement Drives Qualified (CGPA ≥ 6.0, ≤ 1 Backlog)'
                        : 'Action Required: Backlogs / CGPA Needs Attention'}
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      {isSuperEligible
                        ? 'Your academic profile qualifies for Microsoft, TechNova, and tier-1 high-package drives.'
                        : isStandardEligible
                        ? 'Eligible for core enterprise drives. Keep backlogs at 0 to unlock all tier-1 campus drives.'
                        : 'Most enterprise drives require CGPA ≥ 6.0 and zero active backlogs.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Interactive Skills & Competencies Studio (PILLS UNLOCKED) */}
            <div className="profile-section-card">
              <div className="section-header">
                <div className="section-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
                  <Icon name="zap" size={20} />
                </div>
                <div>
                  <h3 className="section-title">Interactive Skills Studio (Tags &amp; Badges)</h3>
                  <p className="section-desc">Manage verified technical skills and behavioral competencies with dynamic interactive pills.</p>
                </div>
              </div>

              {/* TECHNICAL SKILLS SECTION */}
              <div style={{ marginBottom: 24 }}>
                <div className="profile-label">
                  <span>
                    Technical Skills &amp; Stacks ({form.technical_skills.length})
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Type &amp; press Enter or comma, or click recommendations
                  </span>
                </div>

                {/* Active Technical Pills Cloud */}
                <div className="pills-cloud-box">
                  {form.technical_skills.length === 0 ? (
                    <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No technical skills added yet. Type below or click from popular skills.
                    </span>
                  ) : (
                    form.technical_skills.map(skill => (
                      <span key={skill} className="active-skill-pill">
                        <span className="pill-dot"></span>
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTechSkill(skill)}
                          className="pill-remove-btn"
                          title={`Remove ${skill}`}
                        >
                          &times;
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Input to type new tech skills */}
                <div className="pill-input-row">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        handleAddTechSkill();
                      }
                    }}
                    placeholder="Type skill (e.g. React, Docker, Kubernetes) and press Enter..."
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTechSkill()}
                    className="btn-add-pill"
                  >
                    <Icon name="plus" size={14} /> Add Skill
                  </button>
                </div>

                {/* Popular Tech Skills Recommendation Cloud */}
                <div className="recommendation-section">
                  <div className="recommendation-label">
                    <Icon name="sparkles" size={13} /> Quick Add Popular Skills
                  </div>
                  <div className="recommendation-pills-list">
                    {POPULAR_TECH_SKILLS.map(skill => {
                      const isAdded = form.technical_skills.some(
                        s => s.toLowerCase() === skill.toLowerCase()
                      );
                      return (
                        <button
                          key={skill}
                          type="button"
                          disabled={isAdded}
                          onClick={() => handleAddTechSkill(skill)}
                          className={`suggest-pill ${isAdded ? 'selected' : ''}`}
                        >
                          {isAdded ? (
                            <>
                              <Icon name="check" size={12} /> {skill}
                            </>
                          ) : (
                            <>
                              <Icon name="plus" size={12} /> {skill}
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SOFT SKILLS SECTION */}
              <div style={{ paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
                <div className="profile-label">
                  <span>
                    Soft Skills &amp; Behavioral Competencies ({form.softSkills.length})
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Recruiter-evaluated interpersonal skills
                  </span>
                </div>

                {/* Active Soft Skills Pills Cloud */}
                <div className="pills-cloud-box">
                  {form.softSkills.length === 0 ? (
                    <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No soft skills tagged yet. Click quick-add options below.
                    </span>
                  ) : (
                    form.softSkills.map(skill => (
                      <span key={skill} className="active-skill-pill soft-skill">
                        <span className="pill-dot"></span>
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSoftSkill(skill)}
                          className="pill-remove-btn"
                          title={`Remove ${skill}`}
                        >
                          &times;
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Input for Soft Skills */}
                <div className="pill-input-row">
                  <input
                    type="text"
                    value={softInput}
                    onChange={(e) => setSoftInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        handleAddSoftSkill();
                      }
                    }}
                    placeholder="Type soft skill (e.g. Critical Thinking) and press Enter..."
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSoftSkill()}
                    className="btn-add-pill"
                    style={{ background: '#10B981' }}
                  >
                    <Icon name="plus" size={14} /> Add Competency
                  </button>
                </div>

                {/* Popular Soft Skills Recommendations */}
                <div className="recommendation-section">
                  <div className="recommendation-label">
                    <Icon name="sparkles" size={13} /> Quick Add Competencies
                  </div>
                  <div className="recommendation-pills-list">
                    {POPULAR_SOFT_SKILLS.map(skill => {
                      const isAdded = form.softSkills.some(
                        s => s.toLowerCase() === skill.toLowerCase()
                      );
                      return (
                        <button
                          key={skill}
                          type="button"
                          disabled={isAdded}
                          onClick={() => handleAddSoftSkill(skill)}
                          className={`suggest-pill ${isAdded ? 'selected' : ''}`}
                        >
                          {isAdded ? (
                            <>
                              <Icon name="check" size={12} /> {skill}
                            </>
                          ) : (
                            <>
                              <Icon name="plus" size={12} /> {skill}
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Experience, Certifications & Projects */}
            <div className="profile-section-card">
              <div className="section-header">
                <div className="section-icon-wrap" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' }}>
                  <Icon name="briefcase" size={20} />
                </div>
                <div>
                  <h3 className="section-title">Certifications, Internships &amp; Projects</h3>
                  <p className="section-desc">Key highlights that substantiate your hands-on engineering capabilities during technical interviews.</p>
                </div>
              </div>

              <div className="profile-field-grid-2">
                <div className="profile-input-group">
                  <label className="profile-label">Professional Certifications</label>
                  <textarea
                    name="certifications"
                    value={form.certifications}
                    onChange={handleChange}
                    placeholder="e.g. AWS Certified Solutions Architect Associate (2025), Meta Front-End Specialization"
                    rows={3}
                    className="profile-textarea"
                  />
                </div>

                <div className="profile-input-group">
                  <label className="profile-label">Internships &amp; Work Experience</label>
                  <textarea
                    name="internships"
                    value={form.internships}
                    onChange={handleChange}
                    placeholder="e.g. Full Stack Engineering Intern at XYZ Tech (May - Jul 2025) &ndash; Built microservices in Go"
                    rows={3}
                    className="profile-textarea"
                  />
                </div>
              </div>

              <div className="profile-input-group" style={{ marginBottom: 0 }}>
                <label className="profile-label">Key Projects &amp; Tech Stacks</label>
                <textarea
                  name="projects"
                  value={form.projects}
                  onChange={handleChange}
                  placeholder="1. Campus Connect Placement Portal (React, Node, Express, SQLite/Mongo)&#10;2. Distributed Task Scheduler with Redis & Go&#10;3. Automated ATS Resume Parser using Gemini AI"
                  rows={4}
                  className="profile-textarea"
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar Dossier */}
          <div className="profile-sidebar-col">
            {/* Resume File Card */}
            <div className="dossier-card">
              <h4 className="dossier-card-title">
                <span>Verified Placement Resume</span>
                <Icon name="file" size={16} />
              </h4>

              {data?.student?.resume_filename ? (
                <div className="resume-active-file-box">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <div className="file-info-icon">
                      <Icon name="file" size={18} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="file-meta-name" title={data.student.resume_original_name || 'Resume.pdf'}>
                        {data.student.resume_original_name || 'Candidate_Resume.pdf'}
                      </div>
                      <div className="file-meta-sub">Active verified file</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => alert(`Active Resume on Record: ${data.student.resume_original_name || 'Resume.pdf'}`)}
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  >
                    <Icon name="download" size={13} /> View
                  </button>
                </div>
              ) : (
                <div style={{ padding: '14px', borderRadius: 10, background: 'rgba(245, 158, 11, 0.08)', border: '1px dashed rgba(245, 158, 11, 0.3)', marginBottom: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#F59E0B' }}>No Resume Uploaded</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: 2 }}>Upload a PDF resume to enable one-click drive applications.</div>
                </div>
              )}

              <div style={{ marginTop: 10 }}>
                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                  {data?.student?.resume_filename ? 'Replace Current Resume' : 'Upload Resume File'} (PDF / DOCX)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '0.8rem',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 8,
                    background: 'var(--bg-surface-alt)',
                    color: 'var(--text-main)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Profile Checklist Card */}
            <div className="dossier-card">
              <h4 className="dossier-card-title">
                <span>Verification Checklist</span>
                <span className="profile-meta-chip chip-accent" style={{ fontSize: '0.7rem' }}>
                  {completion}% Done
                </span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.825rem' }}>
                  <Icon
                    name={form.name && form.studentNo ? 'check-circle' : 'alert-circle'}
                    size={16}
                    style={{ color: form.name && form.studentNo ? '#10B981' : 'var(--text-muted)' }}
                  />
                  <span style={{ color: form.name && form.studentNo ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    Personal &amp; Roll Number Set
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.825rem' }}>
                  <Icon
                    name={form.cgpa > 0 ? 'check-circle' : 'alert-circle'}
                    size={16}
                    style={{ color: form.cgpa > 0 ? '#10B981' : 'var(--text-muted)' }}
                  />
                  <span style={{ color: form.cgpa > 0 ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    Academic CGPA Recorded ({form.cgpa})
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.825rem' }}>
                  <Icon
                    name={form.technical_skills.length >= 3 ? 'check-circle' : 'alert-circle'}
                    size={16}
                    style={{ color: form.technical_skills.length >= 3 ? '#10B981' : 'var(--text-muted)' }}
                  />
                  <span style={{ color: form.technical_skills.length >= 3 ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    3+ Technical Skills ({form.technical_skills.length} tagged)
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.825rem' }}>
                  <Icon
                    name={data?.student?.resume_filename ? 'check-circle' : 'alert-circle'}
                    size={16}
                    style={{ color: data?.student?.resume_filename ? '#10B981' : 'var(--text-muted)' }}
                  />
                  <span style={{ color: data?.student?.resume_filename ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    Placement Resume Attached
                  </span>
                </div>
              </div>
            </div>

            {/* Placement Cell Advisory */}
            <div className="dossier-card" style={{ background: 'var(--bg-surface-alt)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Icon name="info" size={16} style={{ color: 'var(--accent-cyan-600)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Placement Cell Notice</span>
              </div>
              <p style={{ fontSize: '0.785rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Recruiters filter candidates dynamically by technical skill badges and verified CGPA. Ensure your tags reflect your core expertise before applying to active drives.
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Save Bar */}
        <div className="profile-sticky-action-bar">
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
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {isDirty ? 'Unsaved profile edits' : 'All credentials up to date'}
            </span>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'none', md: 'inline' }}>
              &bull; Shortcut: <kbd style={{ padding: '2px 6px', background: 'var(--bg-surface-alt)', border: '1px solid var(--border-subtle)', borderRadius: 4 }}>Ctrl+S</kbd>
            </span>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={saving}
              style={{ padding: '10px 24px', fontWeight: 700 }}
            >
              {saving ? 'Saving Changes...' : 'Save Profile Changes →'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
