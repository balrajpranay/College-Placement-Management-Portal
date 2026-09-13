import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { getRecruiterDashboardApi } from '../../services/api';

export default function RecruiterDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const res = await getRecruiterDashboardApi();
        setData(res);
      } catch (err) {
        console.error('Failed to load recruiter dashboard:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner mb-3" style={{ width: 36, height: 36, border: '3px solid var(--border-subtle)', borderTopColor: 'var(--accent-cyan-500)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
          <p className="text-muted text-sm">Loading hiring dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center p-6" style={{ padding: 'var(--space-8)' }}>
        <Icon name="alert-circle" size={32} style={{ color: 'var(--danger)', margin: '0 auto 12px' }} />
        <h3 className="h4 text-danger mb-2">Error Loading Dashboard</h3>
        <p className="text-muted mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-outline btn-sm">
          Retry
        </button>
      </div>
    );
  }

  const company = data?.company || { name: 'TechNova Solutions', approved: true };
  const stats = data?.stats || { active_drives: 0, total_applicants: 0, shortlisted: 0, selected: 0 };
  const recentDrives = data?.recent_drives || [];

  // Account Under Review matching Flask pending_approval.html
  if (data?.approved === false || company.approved === false) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card text-center" style={{ maxWidth: 540, padding: 'var(--space-10)' }}>
          <div className="empty-icon" style={{ width: 64, height: 64, borderRadius: 'var(--radius-full)', background: 'var(--warning-50)', color: 'var(--warning-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
            <Icon name="clock" size={28} />
          </div>
          <h2 style={{ marginBottom: 'var(--space-2)' }}>Corporate Account Under Review</h2>
          <p className="text-muted mb-6" style={{ lineHeight: 1.6 }}>
            Thank you for registering <strong>{company.name}</strong> with Campus Connect. The College Placement Office is verifying your corporate credentials. You will gain full access to post drives and view candidates once approved.
          </p>
          <div className="flex-between" style={{ justifyContent: 'center', gap: 'var(--space-3)' }}>
            <Link to="/contact" className="btn btn-primary">Contact Placement Cell</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="recruiter-dashboard">
      {/* Top Banner Header matching Flask dashboard.html */}
      <div className="flex-between mb-8" style={{ flexWrap: 'wrap', gap: 16, alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-1)' }}>
            {company.name} – Hiring Dashboard
          </h1>
          <p className="text-muted" style={{ margin: 0 }}>
            Overview of active recruitment drives, applications, and selection stages.
          </p>
        </div>
        <Link to="/recruiter/drives/create" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Icon name="plus" size={16} /> Post New Placement Drive
        </Link>
      </div>

      {/* KPI Stats Grid matching Flask dashboard.html */}
      <div className="stats-grid mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        <div className="stat-card card" style={{ padding: 'var(--space-6)' }}>
          <div className="stat-card-top mb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-icon brand" style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(0, 150, 255, 0.12)', color: 'var(--brand-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="briefcase" size={20} />
            </div>
          </div>
          <div className="stat-value h2" style={{ margin: '0 0 4px', fontWeight: 800 }}>
            {stats.active_drives}
          </div>
          <div className="stat-label text-sm text-muted font-medium">Active Job Drives</div>
        </div>

        <div className="stat-card card" style={{ padding: 'var(--space-6)' }}>
          <div className="stat-card-top mb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-icon accent" style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(0, 150, 255, 0.12)', color: 'var(--accent-cyan-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="users" size={20} />
            </div>
          </div>
          <div className="stat-value h2" style={{ margin: '0 0 4px', fontWeight: 800 }}>
            {stats.total_applicants}
          </div>
          <div className="stat-label text-sm text-muted font-medium">Total Applicants</div>
        </div>

        <div className="stat-card card" style={{ padding: 'var(--space-6)' }}>
          <div className="stat-card-top mb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-icon warning" style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(245, 158, 11, 0.12)', color: 'var(--warning-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="award" size={20} />
            </div>
          </div>
          <div className="stat-value h2" style={{ margin: '0 0 4px', fontWeight: 800 }}>
            {stats.shortlisted}
          </div>
          <div className="stat-label text-sm text-muted font-medium">Shortlisted Candidates</div>
        </div>

        <div className="stat-card card" style={{ padding: 'var(--space-6)' }}>
          <div className="stat-card-top mb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="stat-icon success" style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="award" size={20} />
            </div>
          </div>
          <div className="stat-value h2" style={{ margin: '0 0 4px', fontWeight: 800 }}>
            {stats.selected}
          </div>
          <div className="stat-label text-sm text-muted font-medium">Final Selects (Placed)</div>
        </div>
      </div>

      {/* Recent Placement Drives Section */}
      <div className="card card-flush mb-6">
        <div className="card-header flex-between" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="h4" style={{ margin: 0 }}>Active &amp; Recent Placement Drives</h3>
          <Link to="/recruiter/drives" className="text-sm font-semibold text-brand" style={{ color: 'var(--brand-500)', textDecoration: 'none' }}>
            View All Drives &rarr;
          </Link>
        </div>

        {recentDrives.length > 0 ? (
          <div className="table-wrap" style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '12px 16px' }}>Drive Title</th>
                  <th style={{ padding: '12px 16px' }}>Role Type</th>
                  <th style={{ padding: '12px 16px' }}>Package (CTC)</th>
                  <th style={{ padding: '12px 16px' }}>Application Deadline</th>
                  <th style={{ padding: '12px 16px' }}>Applicant Count</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentDrives.map((d) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="cell-primary font-semibold" style={{ padding: '14px 16px', fontWeight: 600 }}>
                      {d.title}
                    </td>
                    <td style={{ padding: '14px 16px' }}>{d.job_type || 'Full-Time'}</td>
                    <td className="cell-muted font-medium" style={{ padding: '14px 16px' }}>
                      ₹{d.ctc} LPA
                    </td>
                    <td className="cell-muted" style={{ padding: '14px 16px' }}>{d.deadline}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge badge-brand" style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: 9999, background: 'rgba(0, 150, 255, 0.12)', color: 'var(--accent-cyan-600)', border: '1px solid rgba(0, 150, 255, 0.25)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                        {d.applicant_count || 0} candidates
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${d.status === 'active' ? 'badge-success' : 'badge-gray'}`} style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: 9999, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                        {d.status ? d.status.charAt(0).toUpperCase() + d.status.slice(1) : 'Active'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Link to={`/recruiter/applicants?drive_id=${d.id}`} className="btn btn-outline btn-sm" style={{ padding: '5px 12px', fontSize: '0.8rem', borderRadius: 8 }}>
                          Applicants
                        </Link>
                        <Link to="/recruiter/drives" className="btn btn-ghost btn-sm" style={{ padding: '5px 10px', fontSize: '0.8rem', borderRadius: 8 }}>
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state text-center p-8" style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div className="empty-icon mb-3" style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(0, 150, 255, 0.12)', color: 'var(--brand-500)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="briefcase" size={24} />
            </div>
            <h4 style={{ margin: '0 0 6px' }}>No recruitment drives posted yet</h4>
            <p className="text-muted mb-4" style={{ margin: '0 0 16px', fontSize: '0.9rem' }}>
              Post your first job opening to begin accepting applications from qualified campus students.
            </p>
            <Link to="/recruiter/drives/create" className="btn btn-primary btn-sm">
              Post a Placement Drive
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
