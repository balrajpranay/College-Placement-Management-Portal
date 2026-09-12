import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import { getAdminApplicationsApi } from '../../services/api';

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    loadApplications();
  }, [search, statusFilter]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.q = search.trim();
      if (statusFilter !== 'All') params.status = statusFilter;
      const res = await getAdminApplicationsApi(params);
      if (res && res.data) {
        setApplications(res.data);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = ['All', 'Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

  return (
    <div className="admin-applications-page">
      <div className="flex-between mb-6" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-1)' }}>Master Applications Ledger</h1>
          <p className="text-muted" style={{ margin: 0 }}>
            Cross-institutional view of all campus placement submissions, interviews, and offer outcomes.
          </p>
        </div>
        <div className="badge badge-brand" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
          {applications.length} Submissions Logged
        </div>
      </div>

      <div className="card mb-6" style={{ padding: '1rem 1.25rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div className="topbar-search" style={{ flex: 1, minWidth: 260, maxWidth: 400 }}>
            <input
              type="text"
              placeholder="Search by candidate, company, role title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex-align-center" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
            <label className="text-xs font-semibold text-muted">APPLICATION STAGE:</label>
            <select
              className="form-control"
              style={{ width: 'auto', minWidth: 180 }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted">Loading applications log...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="clipboard" size={36} className="text-muted mb-2" />
            <p className="text-muted">No applications found matching criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Department</th>
                  <th>CGPA</th>
                  <th>Drive / Opportunity</th>
                  <th>Company</th>
                  <th>CTC (LPA)</th>
                  <th>Applied At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div className="font-semibold">{app.studentName}</div>
                      <div className="text-xs text-muted">{app.studentEmail}</div>
                    </td>
                    <td>{app.department}</td>
                    <td className="font-medium text-brand">{app.cgpa}</td>
                    <td className="font-medium">{app.driveTitle}</td>
                    <td>
                      <span className="badge badge-brand">{app.companyName}</span>
                    </td>
                    <td className="font-medium">₹{app.ctc} LPA</td>
                    <td className="font-mono text-xs text-muted">{app.appliedAt}</td>
                    <td>
                      <span className={`badge ${
                        app.status === 'Selected' ? 'badge-success' :
                        app.status === 'Interview Scheduled' ? 'badge-brand' :
                        app.status === 'Shortlisted' ? 'badge-warning' : 'badge-neutral'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
