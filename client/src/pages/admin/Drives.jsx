import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import { getAdminDrivesApi, getAdminDriveDetailApi } from '../../services/api';

export default function AdminDrives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedDrive, setSelectedDrive] = useState(null);

  useEffect(() => {
    loadDrives();
  }, [search, jobTypeFilter, statusFilter]);

  const loadDrives = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.q = search.trim();
      if (jobTypeFilter !== 'All') params.jobType = jobTypeFilter;
      if (statusFilter !== 'All') params.status = statusFilter;
      const res = await getAdminDrivesApi(params);
      if (res && res.data) {
        setDrives(res.data);
      }
    } catch (err) {
      console.error('Failed to load drives:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const res = await getAdminDriveDetailApi(id);
      if (res && res.data) {
        setSelectedDrive(res.data);
      }
    } catch (err) {
      console.error('Failed to load drive details:', err);
    }
  };

  return (
    <div className="admin-drives-page">
      <div className="flex-between mb-6" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-1)' }}>Placement Drives Central</h1>
          <p className="text-muted" style={{ margin: 0 }}>
            Monitor active campus hiring drives, target eligibility criteria, and candidate applications.
          </p>
        </div>
        <div className="badge badge-brand" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
          {drives.length} Drives Registered
        </div>
      </div>

      <div className="card mb-6" style={{ padding: '1rem 1.25rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div className="topbar-search" style={{ flex: 1, minWidth: 260, maxWidth: 380 }}>
            <input
              type="text"
              placeholder="Search by drive title, company, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex-align-center" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
            <label className="text-xs font-semibold text-muted">JOB TYPE:</label>
            <select
              className="form-control"
              style={{ width: 'auto', minWidth: 140 }}
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Internship">Internship</option>
            </select>

            <label className="text-xs font-semibold text-muted">STATUS:</label>
            <select
              className="form-control"
              style={{ width: 'auto', minWidth: 120 }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted">Loading placement drives...</p>
          </div>
        ) : drives.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="briefcase" size={36} className="text-muted mb-2" />
            <p className="text-muted">No placement drives found matching criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Drive Title</th>
                  <th>Corporate Partner</th>
                  <th>Package (CTC)</th>
                  <th>Location</th>
                  <th>Deadline</th>
                  <th>Applicants</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {drives.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <div className="font-semibold">{d.title}</div>
                      <div className="text-xs text-muted">{d.jobType} · Min CGPA: {d.minCgpa}</div>
                    </td>
                    <td>
                      <span className="badge badge-brand">{d.companyName}</span>
                    </td>
                    <td className="font-bold text-brand">₹{d.ctc} LPA</td>
                    <td>{d.location}</td>
                    <td className="text-sm font-mono">{d.deadline}</td>
                    <td>
                      <span className="badge badge-neutral">{d.applicantCount} Applied</span>
                    </td>
                    <td>
                      <span className={`badge ${d.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                        {d.status === 'active' ? 'Active' : d.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleViewDetail(d.id)}
                      >
                        <Icon name="briefcase" size={14} /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedDrive && (
        <div className="modal-backdrop" onClick={() => setSelectedDrive(null)}>
          <div className="modal-dialog" style={{ maxWidth: 650 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="h3" style={{ margin: 0 }}>Placement Drive Details</h3>
              <button className="btn-close" onClick={() => setSelectedDrive(null)}>
                <Icon name="x" size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="mb-4">
                <h4 className="h4" style={{ margin: '0 0 0.25rem' }}>{selectedDrive.title}</h4>
                <div className="flex-align-center" style={{ gap: '0.75rem' }}>
                  <span className="badge badge-brand">{selectedDrive.companyName}</span>
                  <span className="text-sm text-muted">{selectedDrive.location}</span>
                </div>
              </div>

              <div className="grid grid-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-muted">COMPENSATION (CTC)</div>
                  <div className="font-bold text-brand">₹{selectedDrive.ctc} LPA</div>
                </div>
                <div>
                  <div className="text-xs text-muted">ESTIMATED OPENINGS</div>
                  <div className="font-medium">{selectedDrive.openings} positions</div>
                </div>
                <div>
                  <div className="text-xs text-muted">MINIMUM CGPA</div>
                  <div className="font-medium">{selectedDrive.minCgpa} CGPA (Max Backlogs: {selectedDrive.maxBacklogs})</div>
                </div>
                <div>
                  <div className="text-xs text-muted">APPLICATION DEADLINE</div>
                  <div className="font-mono">{selectedDrive.deadline}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-muted mb-1">ELIGIBLE BRANCHES</div>
                <div className="flex" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(selectedDrive.branches || ['Computer Science', 'Information Technology']).map(b => (
                    <span key={b} className="badge badge-neutral">{b}</span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-muted mb-1">ROLE DESCRIPTION</div>
                <p className="text-sm text-muted" style={{ margin: 0 }}>{selectedDrive.description}</p>
              </div>

              {selectedDrive.applications && selectedDrive.applications.length > 0 && (
                <div>
                  <div className="text-xs text-muted mb-2">APPLICANT SUBMISSIONS ({selectedDrive.applications.length})</div>
                  <div className="table-responsive">
                    <table className="table text-sm">
                      <thead>
                        <tr>
                          <th>Candidate</th>
                          <th>Department</th>
                          <th>CGPA</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDrive.applications.map(a => (
                          <tr key={a.id}>
                            <td className="font-medium">{a.studentName}</td>
                            <td>{a.department}</td>
                            <td>{a.cgpa}</td>
                            <td>
                              <span className={`badge ${
                                a.status === 'Selected' ? 'badge-success' : 'badge-neutral'
                              }`}>{a.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelectedDrive(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
