import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { getStudentDashboardApi } from '../../services/api';

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const res = await getStudentDashboardApi();
        setData(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page-wrapper text-center" style={{ padding: '60px 0' }}>
        <div className="font-bold text-muted" style={{ fontSize: '1.1rem' }}>Loading verified student profile...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="alert-box alert-danger-box">
        <div className="alert-box-icon"><Icon name="alert-circle" size={18} /></div>
        <div className="alert-box-text">{error || 'Could not load student dashboard.'}</div>
      </div>
    );
  }

  const { student, completion, app_count, shortlisted, selected, upcoming_interviews, recent_notifications, skills } = data;

  return (
    <div className="dashboard-page-wrapper">
      {/* Welcome Banner */}
      <div className="card dashboard-welcome-banner mb-6" style={{ padding: 'var(--space-6)' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
          <div className="welcome-text-col">
            <div className="flex-align-center mb-2" style={{ gap: 8 }}>
              <span className="live-pulse-dot"></span>
              <span className="badge badge-accent" style={{ fontSize: '0.75rem' }}>Placement Season 2025–2026</span>
            </div>
            <h1 className="h2" style={{ margin: '0 0 6px', fontSize: '1.85rem', fontWeight: 800 }}>
              Welcome back, {student.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.95rem' }}>
              {student.department} · Class of {student.gradYear} · Verified Candidate
            </p>
          </div>

          <div className="welcome-actions-col" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/student/drives" className="btn btn-primary">
              <Icon name="briefcase" size={16} /> Browse Opportunities
            </Link>
            <Link to="/student/ai-suite" className="btn btn-outline">
              <Icon name="award" size={16} /> AI Career Advisor
            </Link>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="stats-grid mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="card stat-card" style={{ padding: 'var(--space-5)' }}>
          <div className="stat-card-top flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-icon brand" style={{ width: 38, height: 38, borderRadius: 8, background: 'var(--brand-navy-50)', color: 'var(--brand-navy-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="clipboard" size={20} />
            </div>
            <span className="text-xs text-muted font-semibold">Total</span>
          </div>
          <div className="stat-value mt-2" style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 8 }}>{app_count}</div>
          <div className="stat-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Applications Submitted</div>
          <div className="text-xs text-faint mt-1">Across institutional drives</div>
        </div>

        <div className="card stat-card" style={{ padding: 'var(--space-5)' }}>
          <div className="stat-card-top flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-icon warning" style={{ width: 38, height: 38, borderRadius: 8, background: 'var(--warning-50)', color: 'var(--warning-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="trending-up" size={20} />
            </div>
            <span className="text-xs text-warning font-semibold">Active</span>
          </div>
          <div className="stat-value mt-2" style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--warning-600)', marginTop: 8 }}>{shortlisted}</div>
          <div className="stat-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Shortlisted &amp; In Review</div>
          <div className="text-xs text-faint mt-1">Pending next rounds</div>
        </div>

        <div className="card stat-card" style={{ padding: 'var(--space-5)' }}>
          <div className="stat-card-top flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-icon success" style={{ width: 38, height: 38, borderRadius: 8, background: 'var(--success-50)', color: 'var(--success-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="award" size={20} />
            </div>
            <span className="text-xs text-success font-semibold">Confirmed</span>
          </div>
          <div className="stat-value mt-2" style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--success-600)', marginTop: 8 }}>{selected?.length || 0}</div>
          <div className="stat-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Offers Secured</div>
          <div className="text-xs text-faint mt-1">Institutional placements</div>
        </div>

        <div className="card stat-card" style={{ padding: 'var(--space-5)' }}>
          <div className="stat-card-top flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-icon accent" style={{ width: 38, height: 38, borderRadius: 8, background: 'var(--accent-cyan-50)', color: 'var(--accent-cyan-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="user" size={20} />
            </div>
            <span className="text-xs text-accent font-semibold">{completion}%</span>
          </div>
          <div className="stat-value mt-2" style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--accent-cyan-600)', marginTop: 8 }}>{completion}%</div>
          <div className="stat-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Profile Strength</div>
          <div className="progress mt-2" style={{ height: 6, borderRadius: 4, background: 'var(--border-subtle)', marginTop: 8, overflow: 'hidden' }}>
            <div className="progress-bar" style={{ width: `${completion}%`, height: '100%', background: 'linear-gradient(90deg, #0096FF, #38BDF8)' }}></div>
          </div>
        </div>
      </div>

      {/* Placed Confirmation Banner (if selected) */}
      {selected && selected.length > 0 && (
        <div className="card mb-6" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)', padding: 'var(--space-6)' }}>
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: 14 }}>
            <div>
              <div className="badge badge-success mb-2">Offer Confirmed</div>
              <h3 style={{ color: 'var(--success-700)', margin: '0 0 var(--space-1)' }}>Congratulations! Placement Offer Confirmed 🎉</h3>
              <p className="text-sm text-muted" style={{ margin: 0 }}>You have received verified placement offers through Campus Connect.</p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              {selected.map((s, idx) => (
                <div key={idx} className="badge badge-success" style={{ fontSize: '0.875rem', padding: '8px 16px' }}>
                  <strong>{s.company_name}</strong> &ndash; {s.title} (₹{s.package} LPA)
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2-Column Main Dashboard Grid */}
      <div className="dashboard-split-grid mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Left Column: Academic Credentials & AI Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Academic & Profile Snapshot */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <div className="flex-between mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="flex-align-center" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="stat-icon brand" style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--brand-navy-50)', color: 'var(--brand-navy-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="graduation" size={18} />
                </div>
                <h3 className="h4" style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Academic &amp; Profile Snapshot</h3>
              </div>
              <Link to="/student/profile" className="text-sm font-semibold text-brand" style={{ color: 'var(--accent-cyan-600)' }}>Edit Profile &rarr;</Link>
            </div>
            
            <div className="grid-2 mb-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 16 }}>
              <div className="card" style={{ padding: '12px 14px', background: 'var(--bg-surface-alt)', border: '1px solid var(--border-subtle)' }}>
                <div className="text-xs text-muted font-semibold">DEPARTMENT &amp; BATCH</div>
                <div className="font-bold text-sm mt-1" style={{ color: 'var(--text-main)', marginTop: 4 }}>{student.department}</div>
                <div className="text-xs text-faint">Class of {student.gradYear}</div>
              </div>
              <div className="card" style={{ padding: '12px 14px', background: 'var(--bg-surface-alt)', border: '1px solid var(--border-subtle)' }}>
                <div className="text-xs text-muted font-semibold">CURRENT CGPA</div>
                <div className="font-bold text-sm mt-1 text-brand" style={{ color: 'var(--accent-cyan-600)', marginTop: 4 }}>{student.cgpa} / 10.0</div>
                <div className="text-xs text-success font-semibold" style={{ color: 'var(--success-600)' }}>{student.backlogs} Active Backlogs</div>
              </div>
            </div>

            <div className="mb-4" style={{ marginBottom: 16 }}>
              <div className="text-xs text-muted font-semibold mb-2" style={{ marginBottom: 8 }}>VERIFIED TECHNICAL SKILLS</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {skills && skills.length > 0 ? (
                  skills.map(s => (
                    <span key={s} className="skill-tag" style={{ fontSize: '0.8125rem', padding: '4px 10px', background: 'var(--bg-surface-alt)', borderRadius: 4, border: '1px solid var(--border-subtle)' }}>
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted">No skills listed yet. <Link to="/student/profile" className="text-brand">Add skills</Link></span>
                )}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-sm text-muted">Verified Resume:</span>
              {student.resume_filename ? (
                <span className="badge badge-success" style={{ padding: '4px 10px' }}>{student.resume_original_name || 'Resume.pdf'}</span>
              ) : (
                <Link to="/student/profile" className="btn btn-outline btn-sm">Upload Resume</Link>
              )}
            </div>
          </div>

          {/* AI Career Advisor Smart Widget */}
          <div className="card" style={{ padding: 'var(--space-6)', background: 'radial-gradient(circle at top right, rgba(0, 150, 255, 0.1), var(--bg-surface))' }}>
            <div className="flex-between mb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="flex-align-center" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="stat-icon brand" style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--brand-navy-50)', color: 'var(--brand-navy-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="award" size={18} />
                </div>
                <div>
                  <h3 className="h4" style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>AI Career Advisor</h3>
                  <div className="text-xs text-muted">Google Gemini Placement Intelligence</div>
                </div>
              </div>
              <Link to="/ai" className="btn btn-primary btn-sm">Open Workspace</Link>
            </div>

            <div className="card" style={{ padding: 14, background: 'var(--bg-surface-alt)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-3)' }}>
              <div className="text-xs text-muted" style={{ lineHeight: 1.5 }}>
                💡 <strong>Placement Tip for {student.name.split(' ')[0]}:</strong> Your <strong>{student.cgpa} CGPA</strong> qualifies you for all Tier-1 drives. Practice Binary Trees and System Design before Friday's technical assessments.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Link to="/ai" className="skill-tag" style={{ textDecoration: 'none', cursor: 'pointer', background: 'var(--bg-surface)', padding: '4px 8px', borderRadius: 4, border: '1px solid var(--border-subtle)', fontSize: '0.75rem' }}>
                🎯 Check TechNova Prep
              </Link>
              <Link to="/ai" className="skill-tag" style={{ textDecoration: 'none', cursor: 'pointer', background: 'var(--bg-surface)', padding: '4px 8px', borderRadius: 4, border: '1px solid var(--border-subtle)', fontSize: '0.75rem' }}>
                🏛️ PM Internship Guide
              </Link>
              <Link to="/ai" className="skill-tag" style={{ textDecoration: 'none', cursor: 'pointer', background: 'var(--bg-surface)', padding: '4px 8px', borderRadius: 4, border: '1px solid var(--border-subtle)', fontSize: '0.75rem' }}>
                💻 Practice Binary Trees
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Interviews & Live Notifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Upcoming Interviews */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <div className="flex-between mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="flex-align-center" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="stat-icon accent" style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent-cyan-50)', color: 'var(--accent-cyan-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="video" size={18} />
                </div>
                <h3 className="h4" style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Interview Schedule</h3>
              </div>
              <Link to="/student/interviews" className="text-sm font-semibold text-brand" style={{ color: 'var(--accent-cyan-600)' }}>All Interviews &rarr;</Link>
            </div>

            {upcoming_interviews && upcoming_interviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {upcoming_interviews.map((i) => (
                  <div key={i.id} style={{ padding: '14px 16px', background: 'var(--bg-surface-alt)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>{i.company_name} &ndash; {i.drive_title}</div>
                      <div className="text-xs text-muted mt-1">{i.round_name} · {i.interview_type}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="badge badge-accent" style={{ fontSize: '0.75rem' }}>{i.scheduled_date}</div>
                      <div className="text-xs text-muted mt-1">{i.scheduled_time}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: 'var(--space-8) var(--space-4)', textAlign: 'center' }}>
                <div className="empty-icon" style={{ margin: '0 auto 8px' }}><Icon name="calendar" size={24} /></div>
                <h4 className="text-sm font-semibold" style={{ margin: '8px 0 4px' }}>No interviews currently scheduled</h4>
                <p className="text-xs text-muted" style={{ margin: 0 }}>You will be notified once a recruiter schedules your interview slots.</p>
              </div>
            )}
          </div>

          {/* Recent Notifications Feed */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <div className="flex-between mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="flex-align-center" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="stat-icon warning" style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--warning-50)', color: 'var(--warning-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="bell" size={18} />
                </div>
                <h3 className="h4" style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Placement Updates &amp; Notices</h3>
              </div>
              <Link to="/student/notifications" className="text-sm font-semibold text-brand" style={{ color: 'var(--accent-cyan-600)' }}>View All &rarr;</Link>
            </div>

            {recent_notifications && recent_notifications.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recent_notifications.map((n) => (
                  <div key={n.id} style={{ padding: '10px 12px', background: 'var(--bg-surface-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div className="stat-icon brand" style={{ width: 28, height: 28, fontSize: '0.75rem', flexShrink: 0, borderRadius: 6, background: 'var(--brand-navy-50)', color: 'var(--brand-navy-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="bell" size={13} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="text-sm" style={{ color: 'var(--text-main)', lineHeight: 1.4 }}>{n.message}</div>
                      <div className="text-xs text-faint mt-1">{n.created_at}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted" style={{ margin: 0 }}>No new notices. You are completely up to date with institutional announcements.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
