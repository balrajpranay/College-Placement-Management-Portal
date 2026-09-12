import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { getRecruiterDrivesApi, closeRecruiterDriveApi } from '../../services/api';

export default function RecruiterDrives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const res = await getRecruiterDrivesApi();
      setDrives(res?.drives || []);
    } catch (err) {
      console.error('Failed to load managed drives:', err);
      setError(err.message || 'Failed to load drives');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const handleCloseDrive = async (id, title) => {
    if (!window.confirm(`Are you sure you want to close the drive "${title}"?`)) return;
    try {
      await closeRecruiterDriveApi(id);
      setActionMsg({ type: 'success', text: `Placement drive "${title}" has been closed.` });
      fetchDrives();
    } catch (err) {
      console.error('Failed to close drive:', err);
      setActionMsg({ type: 'danger', text: err.message || 'Failed to close drive' });
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner mb-3" style={{ width: 36, height: 36, border: '3px solid var(--border-subtle)', borderTopColor: 'var(--accent-cyan-500)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
          <p className="text-muted text-sm">Loading managed placement drives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recruiter-drives">
      {/* Top Banner Header matching Flask my_drives.html */}
      <div className="flex-between mb-8" style={{ flexWrap: 'wrap', gap: 16, alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-1)' }}>
            Managed Placement Drives
          </h1>
          <p className="text-muted" style={{ margin: 0 }}>
            All recruitment postings created by your organization.
          </p>
        </div>
        <Link to="/recruiter/drives/create" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Icon name="plus" size={16} /> Post New Drive
        </Link>
      </div>

      {actionMsg && (
        <div className={`alert alert-${actionMsg.type} mb-6`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 8, marginBottom: 24, background: actionMsg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: actionMsg.type === 'success' ? 'var(--success-500)' : 'var(--danger-500)', border: `1px solid ${actionMsg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }}>
          <Icon name={actionMsg.type === 'success' ? 'check' : 'alert-circle'} size={18} />
          <span style={{ fontWeight: 500 }}>{actionMsg.text}</span>
        </div>
      )}

      {error && (
        <div className="card text-center p-6 mb-6" style={{ padding: 'var(--space-6)' }}>
          <h4 className="text-danger mb-2">Error Loading Drives</h4>
          <p className="text-muted">{error}</p>
        </div>
      )}

      <div className="card card-flush">
        {drives.length > 0 ? (
          <div className="table-wrap" style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '12px 16px' }}>Role Title</th>
                  <th style={{ padding: '12px 16px' }}>Package (CTC)</th>
                  <th style={{ padding: '12px 16px' }}>Openings</th>
                  <th style={{ padding: '12px 16px' }}>Deadline</th>
                  <th style={{ padding: '12px 16px' }}>Drive Date</th>
                  <th style={{ padding: '12px 16px' }}>Applicants</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {drives.map((d) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="cell-primary font-semibold" style={{ padding: '14px 16px', fontWeight: 600 }}>
                      <div>{d.title}</div>
                      <div className="text-xs text-muted" style={{ fontWeight: 400 }}>{d.job_type || 'Full-Time'} · {d.location || 'Bengaluru'}</div>
                    </td>
                    <td className="cell-muted font-medium" style={{ padding: '14px 16px' }}>
                      ₹{d.ctc} LPA
                    </td>
                    <td style={{ padding: '14px 16px' }}>{d.openings || 1}</td>
                    <td className="cell-muted" style={{ padding: '14px 16px' }}>{d.deadline}</td>
                    <td className="cell-muted" style={{ padding: '14px 16px' }}>{d.drive_date || '—'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <Link
                        to={`/recruiter/applicants?drive_id=${d.id}`}
                        className="badge badge-brand font-semibold"
                        style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 4, background: 'rgba(0, 150, 255, 0.12)', color: 'var(--brand-500)', textDecoration: 'none' }}
                      >
                        {d.applicant_count || 0} Candidates &rarr;
                      </Link>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${d.status === 'active' ? 'badge-success' : 'badge-gray'}`} style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: 4 }}>
                        {d.status ? d.status.charAt(0).toUpperCase() + d.status.slice(1) : 'Active'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap' }}>
                        <Link to={`/recruiter/applicants?drive_id=${d.id}`} className="btn btn-sm btn-outline" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                          Pipeline
                        </Link>
                        <Link to={`/recruiter/drives/${d.id}/edit`} className="btn btn-sm btn-ghost" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                          Edit
                        </Link>
                        {d.status === 'active' && (
                          <button
                            onClick={() => handleCloseDrive(d.id, d.title)}
                            className="btn btn-sm btn-ghost text-danger"
                            title="Close Drive"
                            style={{ padding: '4px 8px', fontSize: '0.8rem', color: 'var(--danger-500)' }}
                          >
                            Close
                          </button>
                        )}
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
            <h4 style={{ margin: '0 0 6px' }}>No placement drives posted yet</h4>
            <p className="text-muted mb-4" style={{ margin: '0 0 16px', fontSize: '0.9rem' }}>
              Create your first recruitment drive to publish open campus roles.
            </p>
            <Link to="/recruiter/drives/create" className="btn btn-primary btn-sm">
              Create Drive
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
