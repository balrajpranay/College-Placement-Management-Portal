import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { getRecruiterApplicantsApi, updateApplicantStatusApi } from '../../services/api';

const STATUS_STAGES = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Selected',
  'Rejected'
];

export default function RecruiterApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);

  // Filters & Search
  const [filterDrive, setFilterDrive] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Track status update loading per candidate
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchApplicants = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (filterDrive) params.drive_id = filterDrive;
      if (filterStatus) params.status = filterStatus;
      if (searchQuery.trim()) params.q = searchQuery.trim();

      const res = await getRecruiterApplicantsApi(params);
      if (res.success) {
        setApplicants(res.applicants || []);
        if (res.drives) {
          setDrives(res.drives);
        }
      } else {
        setError(res.message || 'Failed to load applicants.');
      }
    } catch (err) {
      console.error('Error fetching applicants:', err);
      setError(err.message || 'An error occurred while loading applicants.');
    } finally {
      setLoading(false);
    }
  }, [filterDrive, filterStatus, searchQuery]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const handleClearFilters = () => {
    setFilterDrive('');
    setFilterStatus('');
    setSearchQuery('');
  };

  const handleStatusUpdate = async (appId, newStatus, studentName) => {
    if (newStatus === 'Rejected') {
      const confirmReject = window.confirm(`Reject application for ${studentName || 'this candidate'}?`);
      if (!confirmReject) return;
    }

    try {
      setActionLoadingId(appId);
      setNotification(null);
      const res = await updateApplicantStatusApi(appId, newStatus);
      if (res.success) {
        setNotification({
          type: 'success',
          message: `${studentName || 'Candidate'}'s status updated to ${newStatus}.`
        });
        // Optimistically update local list
        setApplicants(prev =>
          prev.map(app =>
            app.id === appId ? { ...app, status: newStatus, updated_at: new Date().toISOString() } : app
          )
        );
      } else {
        setNotification({
          type: 'danger',
          message: res.message || 'Failed to update applicant status.'
        });
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setNotification({
        type: 'danger',
        message: err.message || 'Failed to update status.'
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Helper for stage badge styling
  const getBadgeClass = (status) => {
    switch (status) {
      case 'Applied':
        return 'badge-info';
      case 'Under Review':
        return 'badge-warning';
      case 'Shortlisted':
        return 'badge-primary';
      case 'Interview Scheduled':
        return 'badge-accent';
      case 'Selected':
        return 'badge-success';
      case 'Rejected':
        return 'badge-danger';
      default:
        return 'badge-ghost';
    }
  };

  const hasActiveFilters = Boolean(filterDrive || filterStatus || searchQuery.trim());

  return (
    <div className="recruiter-applicants-page">
      {/* Header Bar */}
      <div className="flex-between mb-8" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-1)' }}>Candidate Pipeline</h1>
          <p className="text-muted" style={{ margin: 0 }}>
            Review applicants, evaluate qualifications, and progress hiring stages.
          </p>
        </div>

        {/* Live Search Input */}
        <div style={{ maxWidth: '280px', width: '100%', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
            <Icon name="search" size={16} />
          </div>
          <input
            type="text"
            id="applicant-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate..."
            className="table-search-input"
            style={{ width: '100%', paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Notification Toast/Banner */}
      {notification && (
        <div 
          className={`alert alert-${notification.type === 'danger' ? 'danger' : 'success'} mb-6`}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name={notification.type === 'danger' ? 'alert' : 'check'} size={18} />
            <span>{notification.message}</span>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="btn btn-ghost btn-sm" 
            style={{ padding: '2px 6px' }}
            aria-label="Close notification"
          >
            <Icon name="x" size={14} />
          </button>
        </div>
      )}

      {/* Filter Toolbar Card */}
      <div className="card mb-6" style={{ padding: 'var(--space-4)' }}>
        <div className="toolbar" style={{ marginBottom: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div className="toolbar-filters" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Drive Filter Dropdown */}
            <select
              value={filterDrive}
              onChange={(e) => setFilterDrive(e.target.value)}
              className="filter-select"
              aria-label="Filter by managed drive"
            >
              <option value="">All Managed Drives</option>
              {drives.map(d => (
                <option key={d.id} value={d.id}>{d.title}</option>
              ))}
            </select>

            {/* Stage Filter Dropdown */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
              aria-label="Filter by application stage"
            >
              <option value="">All Application Stages</option>
              {STATUS_STAGES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="btn btn-ghost btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Icon name="x" size={14} /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Applicants Table Card */}
      <div className="card card-flush">
        {loading && (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
            <p className="text-muted">Loading applicants pipeline...</p>
          </div>
        )}

        {!loading && error && (
          <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
            <div style={{ color: 'var(--danger-600, #dc2626)', marginBottom: '8px' }}>
              <Icon name="alert" size={28} />
            </div>
            <p className="text-danger font-semibold">{error}</p>
            <button onClick={fetchApplicants} className="btn btn-outline btn-sm mt-3">Try Again</button>
          </div>
        )}

        {!loading && !error && applicants.length > 0 && (
          <div className="table-wrap" style={{ overflowX: 'auto' }}>
            <table className="data-table" id="applicants-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Drive Role</th>
                  <th>Department</th>
                  <th>CGPA</th>
                  <th>Stage</th>
                  <th>Resume</th>
                  <th>Hiring Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map(app => {
                  const isRowUpdating = actionLoadingId === app.id;
                  const candName = app.student_name || app.name || 'Candidate';

                  return (
                    <tr key={app.id}>
                      {/* Candidate Column */}
                      <td className="cell-primary font-semibold">
                        {candName}
                        <span className="text-xs text-muted block" style={{ display: 'block', fontWeight: 'normal', marginTop: '2px' }}>
                          {app.student_no || 'STU'}
                        </span>
                      </td>

                      {/* Drive Role Column */}
                      <td>
                        <span className="font-medium">{app.drive_title || 'Software Engineer'}</span>
                      </td>

                      {/* Department Column */}
                      <td className="cell-muted">{app.department || 'Computer Science'}</td>

                      {/* CGPA Column */}
                      <td className="cell-muted font-semibold">
                        {typeof app.cgpa === 'number' ? app.cgpa.toFixed(2) : (app.cgpa || '8.0')}
                      </td>

                      {/* Stage Badge Column */}
                      <td>
                        <span className={`badge ${getBadgeClass(app.status)} status-${app.status?.replace(/\s+/g, '_')}`}>
                          {app.status}
                        </span>
                      </td>

                      {/* Resume Column */}
                      <td>
                        {app.resume_filename ? (
                          <a
                            href={`/static/uploads/resumes/${app.resume_filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px' }}
                            title="Download/View Resume PDF"
                          >
                            <Icon name="download" size={12} /> PDF
                          </a>
                        ) : (
                          <span className="text-xs text-faint">No file</span>
                        )}
                      </td>

                      {/* Hiring Actions Column */}
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                          {isRowUpdating ? (
                            <span className="text-xs text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              Updating...
                            </span>
                          ) : (
                            <>
                              {/* 1. Review button for 'Applied' */}
                              {app.status === 'Applied' && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusUpdate(app.id, 'Under Review', candName)}
                                  className="btn btn-sm btn-outline"
                                  title="Mark candidate as Under Review"
                                >
                                  Review
                                </button>
                              )}

                              {/* 2. Shortlist button for 'Applied' or 'Under Review' */}
                              {['Applied', 'Under Review'].includes(app.status) && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusUpdate(app.id, 'Shortlisted', candName)}
                                  className="btn btn-sm btn-primary"
                                  title="Shortlist candidate for interview round"
                                >
                                  Shortlist
                                </button>
                              )}

                              {/* 3. Schedule Interview link for 'Shortlisted' */}
                              {app.status === 'Shortlisted' && (
                                <Link
                                  to={`/recruiter/interviews`}
                                  className="btn btn-sm btn-accent"
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                  title="Schedule an interview session"
                                >
                                  <Icon name="video" size={12} /> Schedule Interview
                                </Link>
                              )}

                              {/* 4. Select button for 'Shortlisted' or 'Interview Scheduled' */}
                              {['Shortlisted', 'Interview Scheduled'].includes(app.status) && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusUpdate(app.id, 'Selected', candName)}
                                  className="btn btn-sm btn-accent"
                                  style={{ 
                                    background: 'var(--success-600, #16a34a)', 
                                    borderColor: 'var(--success-600, #16a34a)',
                                    color: '#ffffff'
                                  }}
                                  title="Mark candidate as Selected (Hired)"
                                >
                                  Select
                                </button>
                              )}

                              {/* 5. Reject button for any stage except 'Selected' and 'Rejected' */}
                              {!['Selected', 'Rejected'].includes(app.status) && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusUpdate(app.id, 'Rejected', candName)}
                                  className="btn btn-sm btn-danger-outline"
                                  title="Reject application"
                                >
                                  Reject
                                </button>
                              )}

                              {/* 6. Completed stages indicator */}
                              {app.status === 'Selected' && (
                                <span className="text-xs text-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                                  <Icon name="check" size={14} /> Selected
                                </span>
                              )}
                              {app.status === 'Rejected' && (
                                <span className="text-xs text-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <Icon name="x" size={14} /> Closed
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && applicants.length === 0 && (
          <div className="empty-state" style={{ padding: 'var(--space-12) var(--space-4)', textAlign: 'center' }}>
            <div 
              className="empty-icon" 
              style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '50%', 
                background: 'var(--bg-muted, #f1f5f9)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto var(--space-3)',
                color: 'var(--text-muted)'
              }}
            >
              <Icon name="users" size={28} />
            </div>
            <h4 style={{ margin: '0 0 var(--space-1)' }}>No applicants found</h4>
            <p className="text-muted" style={{ maxWidth: '420px', margin: '0 auto var(--space-4)' }}>
              {hasActiveFilters 
                ? 'No candidate applications match the selected drive, stage, or search query.' 
                : 'Students who apply to your managed placement drives will appear here in the hiring pipeline.'}
            </p>
            {hasActiveFilters && (
              <button onClick={handleClearFilters} className="btn btn-outline btn-sm">
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
