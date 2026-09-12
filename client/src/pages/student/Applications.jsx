import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { getStudentApplicationsApi, withdrawStudentApplicationApi } from '../../services/api';

export default function StudentApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await getStudentApplicationsApi();
      setApps(res.data || []);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to load applications.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application? This cannot be undone.')) {
      return;
    }

    try {
      const res = await withdrawStudentApplicationApi(appId);
      setStatus({ type: 'success', message: res.message || 'Application successfully withdrawn.' });
      loadApplications();
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Withdrawal failed.' });
    }
  };

  return (
    <div className="student-applications-wrapper">
      <div className="page-header flex-between mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-1)', fontSize: '1.85rem', fontWeight: 800 }}>My Placement Applications</h1>
          <p className="text-muted" style={{ margin: 0 }}>Track status, interview milestones, and application progress.</p>
        </div>
        <Link to="/jobs" className="btn btn-primary btn-sm">
          <Icon name="briefcase" size={16} /> Browse More Opportunities
        </Link>
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

      {loading ? (
        <div className="text-center" style={{ padding: '60px 0' }}>Loading submitted applications...</div>
      ) : apps.length > 0 ? (
        <div className="card" style={{ padding: 'var(--space-4)', overflowX: 'auto' }}>
          <div className="table-wrap">
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '12px 14px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Company &amp; Role</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Drive Type</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Package / Stipend</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Applied Date</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Status</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app) => (
                  <tr key={app.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px' }}>
                      <div className="font-bold text-main" style={{ fontWeight: 700 }}>{app.drive_title}</div>
                      <div className="text-xs text-muted">{app.company_name}</div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span className="badge badge-accent" style={{ fontSize: '0.75rem' }}>Campus Drive</span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span className="text-sm font-semibold text-brand" style={{ color: 'var(--accent-cyan-600)', fontWeight: 700 }}>₹{app.package_lpa} LPA</span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span className="text-xs text-muted">{app.applied_at?.slice(0, 10) || 'Recent'}</span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span className={`badge ${
                        app.status === 'Selected' ? 'badge-success' :
                        app.status === 'Interview Scheduled' ? 'badge-brand' :
                        app.status === 'Under Review' ? 'badge-warning' :
                        app.status === 'Rejected' ? 'badge-danger' : 'badge-neutral'
                      }`} style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Link to={`/student/drives/${app.drive_id}`} className="btn btn-ghost btn-sm" title="View Drive Details">
                          <Icon name="eye" size={14} />
                        </Link>
                        {['Applied', 'Under Review'].includes(app.status) && (
                          <button
                            type="button"
                            onClick={() => handleWithdraw(app.id)}
                            className="btn btn-ghost btn-sm text-danger"
                            title="Withdraw Application"
                            style={{ color: '#EF4444' }}
                          >
                            <Icon name="trash" size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div className="empty-icon" style={{ margin: '0 auto 12px' }}><Icon name="clipboard" size={32} /></div>
          <h4>No applications submitted yet</h4>
          <p className="text-muted text-sm">Explore active campus placement drives and corporate openings to submit your first application.</p>
          <Link to="/jobs" className="btn btn-primary btn-sm mt-3" style={{ display: 'inline-flex', marginTop: 12 }}>Explore Opportunities</Link>
        </div>
      )}
    </div>
  );
}
