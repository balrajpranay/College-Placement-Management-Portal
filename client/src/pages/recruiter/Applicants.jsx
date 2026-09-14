import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { getRecruiterApplicantsApi, updateApplicantStatusApi, getRecruiterProfileApi } from '../../services/api';

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
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);

  // Filters & Search
  const [filterDrive, setFilterDrive] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Track status update loading per candidate
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Candidate Selection & Google Meet Modal State
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectRoundName, setSelectRoundName] = useState('Final Technical & Selection Round');
  const [selectDate, setSelectDate] = useState('');
  const [selectTime, setSelectTime] = useState('10:00 AM');
  const [selectMeetUrl, setSelectMeetUrl] = useState('');
  const [selectInstructions, setSelectInstructions] = useState('Please join 5 minutes prior to the scheduled time with your official college ID, updated resume, and video camera enabled for the selection evaluation.');
  const [selectSubmitting, setSelectSubmitting] = useState(false);

  // Helper: Auto-generate Google Meet URL
  const generateMeetUrl = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const gen = (len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `https://meet.google.com/${gen(3)}-${gen(4)}-${gen(3)}`;
  };

  const openSelectionModal = (app) => {
    if (!isApproved) {
      setNotification({
        type: 'danger',
        message: 'Candidate Selection Restricted: Your organization profile is pending administrator verification. Only verified partner companies can select or update candidate stages.'
      });
      return;
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedCandidate(app);
    setSelectRoundName('Final Technical & Selection Round');
    setSelectDate(tomorrow.toISOString().split('T')[0]);
    setSelectTime('10:00 AM');
    setSelectMeetUrl(generateMeetUrl());
    setSelectInstructions('Please join 5 minutes prior to the scheduled time with your official college ID, updated resume, and video camera enabled for the selection evaluation.');
    setShowSelectModal(true);
  };

  const handleConfirmSelection = async (e) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    try {
      setSelectSubmitting(true);
      setActionLoadingId(selectedCandidate.id);
      const res = await updateApplicantStatusApi(selectedCandidate.id, {
        status: 'Selected',
        round_name: selectRoundName,
        scheduled_date: selectDate,
        scheduled_time: selectTime,
        venue: selectMeetUrl,
        instructions: selectInstructions
      });

      if (res.success) {
        setNotification({
          type: 'success',
          message: `Candidate ${selectedCandidate.student_name || 'Candidate'} successfully Selected! Google Meet link (${selectMeetUrl}) and selection round details were sent to candidate notifications.`
        });
        setApplicants(prev =>
          prev.map(a =>
            a.id === selectedCandidate.id ? { ...a, status: 'Selected', venue: selectMeetUrl, updated_at: new Date().toISOString() } : a
          )
        );
        setShowSelectModal(false);
      } else {
        setNotification({
          type: 'danger',
          message: res.message || 'Failed to select candidate.'
        });
      }
    } catch (err) {
      console.error('Error selecting candidate:', err);
      setNotification({
        type: 'danger',
        message: err.message || 'Error selecting candidate.'
      });
    } finally {
      setSelectSubmitting(false);
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await getRecruiterProfileApi();
        if (res?.company) setCompany(res.company);
      } catch (e) {
        console.warn('Could not load company profile:', e.message);
      }
    }
    loadProfile();
  }, []);

  const isApproved = company?.approved === true || company?.approved === 'true';

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
    if (!isApproved) {
      setNotification({
        type: 'danger',
        message: 'Candidate Selection Restricted: Your organization profile is pending administrator verification. Only verified partner companies can select or update candidate stages.'
      });
      return;
    }

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

      {/* Verification Status Warning Banner */}
      {!isApproved && company && (
        <div className="card mb-6" style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 12, padding: '14px 18px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon name="alert-circle" size={22} style={{ color: 'var(--danger-500)', flexShrink: 0 }} />
            <div>
              <strong style={{ color: 'var(--danger-500)', fontSize: '0.95rem' }}>Candidate Selection Restricted (Pending Administrator Verification)</strong>
              <p style={{ margin: '2px 0 0', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Your organization account is awaiting verification by the Placement Administrator. Only verified corporate partners can advance, shortlist, interview, or select candidates.
              </p>
            </div>
          </div>
        </div>
      )}

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

                              {/* 4. Select button for candidates not yet Selected or Rejected */}
                              {!['Selected', 'Rejected'].includes(app.status) && (
                                <button
                                  type="button"
                                  onClick={() => openSelectionModal(app)}
                                  className="btn btn-sm btn-accent"
                                  style={{ 
                                    background: 'var(--success-600, #16a34a)', 
                                    borderColor: 'var(--success-600, #16a34a)',
                                    color: '#ffffff',
                                    fontWeight: 600
                                  }}
                                  title="Select candidate and schedule round with Google Meet"
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
                                <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 2 }}>
                                  <span className="text-xs text-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                                    <Icon name="check" size={14} /> Selected
                                  </span>
                                  {app.venue && (
                                    <a
                                      href={app.venue}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ fontSize: '0.725rem', color: 'var(--accent-cyan-600)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 3 }}
                                      title="Open Google Meet link"
                                    >
                                      <Icon name="video" size={11} /> Meet Link
                                    </a>
                                  )}
                                </div>
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

      {/* Candidate Selection & Google Meet Scheduling Modal */}
      {showSelectModal && selectedCandidate && (
        <div 
          className="modal-overlay" 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0, 0, 0, 0.7)', 
            backdropFilter: 'blur(4px)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 9999,
            padding: 16
          }}
        >
          <div 
            className="modal-card card" 
            style={{ 
              maxWidth: 560, 
              width: '100%', 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: '24px',
              borderRadius: 16,
              boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
              background: 'var(--bg-surface)'
            }}
          >
            <div className="flex-between mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(22, 163, 74, 0.15)', color: 'var(--success-600, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="award" size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Select Candidate &amp; Schedule Round</h3>
                  <p className="text-xs text-muted" style={{ margin: '2px 0 0' }}>Generate Google Meet link &amp; notify candidate immediately</p>
                </div>
              </div>
              <button 
                type="button" 
                className="btn btn-ghost btn-sm" 
                onClick={() => setShowSelectModal(false)}
                style={{ padding: '4px 8px' }}
                aria-label="Close modal"
              >
                <Icon name="x" size={16} />
              </button>
            </div>

            {/* Candidate Summary Box */}
            <div style={{ padding: '12px 16px', background: 'var(--bg-surface-alt)', borderRadius: 10, border: '1px solid var(--border-subtle)', marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{selectedCandidate.student_name || 'Candidate'}</strong>
                  <span className="text-xs text-muted" style={{ display: 'block', marginTop: 3 }}>
                    Roll: {selectedCandidate.student_no || 'STU'} · {selectedCandidate.department || 'Computer Science'} · CGPA {selectedCandidate.cgpa || '8.0'}
                  </span>
                </div>
                <span className="badge badge-accent" style={{ fontSize: '0.75rem' }}>
                  {selectedCandidate.drive_title || 'Role'}
                </span>
              </div>
            </div>

            <form onSubmit={handleConfirmSelection}>
              <div className="form-group mb-3" style={{ marginBottom: 14 }}>
                <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                  Selection / Interview Round Name <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={selectRoundName}
                  onChange={(e) => setSelectRoundName(e.target.value)}
                  placeholder="e.g. Final Technical & Selection Round"
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                    Scheduled Date <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={selectDate}
                    onChange={(e) => setSelectDate(e.target.value)}
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                    Scheduled Time <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={selectTime}
                    onChange={(e) => setSelectTime(e.target.value)}
                    placeholder="10:00 AM"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Google Meet Link Generator */}
              <div className="form-group mb-3" style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label className="form-label" style={{ fontSize: '0.8125rem', fontWeight: 600, margin: 0 }}>
                    Google Meet Meeting Link <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setSelectMeetUrl(generateMeetUrl())}
                    className="btn btn-ghost btn-xs"
                    style={{ fontSize: '0.75rem', color: 'var(--accent-cyan-600)', padding: '2px 6px' }}
                  >
                    🔄 Generate New Link
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    type="url"
                    value={selectMeetUrl}
                    onChange={(e) => setSelectMeetUrl(e.target.value)}
                    placeholder="https://meet.google.com/abc-wxyz-def"
                    required
                    style={{ flex: 1, padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  />
                  {selectMeetUrl && (
                    <a
                      href={selectMeetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '8px 12px' }}
                      title="Test open meeting link in new tab"
                    >
                      <Icon name="video" size={14} /> Test
                    </a>
                  )}
                </div>
                <span className="text-xs text-muted" style={{ display: 'block', marginTop: 4 }}>
                  This Google Meet link will be immediately shared with the candidate in their notifications.
                </span>
              </div>

              {/* Candidate Instructions */}
              <div className="form-group mb-4" style={{ marginBottom: 18 }}>
                <label className="form-label" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                  Instructions for Candidate
                </label>
                <textarea
                  rows={3}
                  value={selectInstructions}
                  onChange={(e) => setSelectInstructions(e.target.value)}
                  placeholder="Instructions for the round (ID required, dress code, portfolio, camera on)..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-main)', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
                <button
                  type="button"
                  onClick={() => setShowSelectModal(false)}
                  className="btn btn-outline"
                  disabled={selectSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={selectSubmitting}
                  style={{ 
                    background: 'var(--success-600, #16a34a)', 
                    borderColor: 'var(--success-600, #16a34a)',
                    color: '#ffffff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontWeight: 700
                  }}
                >
                  {selectSubmitting ? 'Selecting & Notifying...' : '✓ Confirm Selection & Notify Candidate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
