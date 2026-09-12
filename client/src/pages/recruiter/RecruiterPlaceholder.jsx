import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../../components/Icon';

export default function RecruiterPlaceholder({ title, stepNote }) {
  const location = useLocation();

  const getPageTitle = () => {
    if (title) return title;
    const path = location.pathname;
    if (path.includes('create')) return 'Post Placement Drive';
    if (path.includes('drives')) return 'Managed Drives';
    if (path.includes('applicants')) return 'Candidate Pipeline';
    if (path.includes('interviews')) return 'Interview Schedule';
    if (path.includes('results')) return 'Placement Results';
    if (path.includes('notifications')) return 'Recruiter Notifications';
    return 'Recruiter Portal';
  };

  const pageTitle = getPageTitle();

  return (
    <div className="recruiter-placeholder" style={{ padding: 'var(--space-6) 0' }}>
      <div className="card text-center" style={{ maxWidth: 640, margin: '0 auto', padding: '40px 28px' }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: 'rgba(0, 150, 255, 0.12)',
            color: 'var(--brand-500)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16
          }}
        >
          <Icon name="briefcase" size={28} />
        </div>

        <div className="badge-pill mb-3" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(0, 150, 255, 0.1)', color: 'var(--brand-500)', borderRadius: 9999, fontSize: '0.8rem', fontWeight: 600, marginBottom: 16 }}>
          <span>🔄 Step 7 Recruiter Migration</span>
        </div>

        <h2 className="h3" style={{ margin: '0 0 8px', fontWeight: 800 }}>
          {pageTitle}
        </h2>

        <p className="text-muted" style={{ margin: '0 0 24px', fontSize: '0.95rem', lineHeight: 1.6 }}>
          {stepNote || `This recruiter workflow will be fully migrated in subsequent Step 7 workflows. Core Recruiter Portal Foundation, Authentication, Dashboard, and Corporate Profile are live in Step 7A.`}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <Link to="/recruiter/dashboard" className="btn btn-primary btn-sm">
            <Icon name="home" size={14} /> Recruiter Dashboard
          </Link>
          <Link to="/recruiter/profile" className="btn btn-outline btn-sm">
            <Icon name="briefcase" size={14} /> Corporate Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
