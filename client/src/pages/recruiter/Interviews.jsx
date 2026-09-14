import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Icon from '../../components/Icon';
import { 
  getRecruiterInterviewsApi, 
  getRecruiterApplicantsApi,
  scheduleRecruiterInterviewApi, 
  updateRecruiterInterviewApi, 
  cancelRecruiterInterviewApi,
  deleteRecruiterInterviewApi 
} from '../../services/api';

const INTERVIEW_FORMATS = [
  { value: 'Online', label: 'Online Video Conference' },
  { value: 'In-Person', label: 'In-Person Campus Interview' },
  { value: 'Coding Assessment', label: 'Online Coding Assessment' }
];

const STATUS_FILTERS = ['Scheduled', 'Completed', 'Cancelled'];

export default function RecruiterInterviews() {
  const [searchParams] = useSearchParams();
  const preselectedAppId = searchParams.get('app_id');

  const [interviews, setInterviews] = useState([]);
  const [drives, setDrives] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);

  // Filters & Search
  const [filterDrive, setFilterDrive] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Inline Google Meet Link Editing
  const [editingMeetId, setEditingMeetId] = useState(null);
  const [meetInputValue, setMeetInputValue] = useState('');
  const [savingMeetId, setSavingMeetId] = useState(null);

  // Modal State for Schedule / Reschedule
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingInterview, setEditingInterview] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Modal Form State
  const [formAppId, setFormAppId] = useState('');
  const [formRoundName, setFormRoundName] = useState('Technical Round 1');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('10:00 AM');
  const [formFormat, setFormFormat] = useState('Online');
  const [formVenue, setFormVenue] = useState('https://meet.google.com/abc-xyz-pqr');
  const [formStatus, setFormStatus] = useState('Scheduled');

  // Fetch interviews
  const fetchInterviews = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (filterDrive) params.drive_id = filterDrive;
      if (filterStatus) params.status = filterStatus;
      if (searchQuery.trim()) params.q = searchQuery.trim();

      const res = await getRecruiterInterviewsApi(params);
      if (res.success) {
        setInterviews(res.interviews || []);
        if (res.drives) setDrives(res.drives);
      } else {
        setError(res.message || 'Failed to load interviews.');
      }
    } catch (err) {
      console.error('Error loading interviews:', err);
      setError(err.message || 'An error occurred while loading interviews.');
    } finally {
      setLoading(false);
    }
  }, [filterDrive, filterStatus, searchQuery]);

  // Fetch available applicants for scheduling dropdown
  const fetchApplicants = useCallback(async () => {
    try {
      const res = await getRecruiterApplicantsApi();
      if (res.success) {
        setApplicants(res.applicants || []);
      }
    } catch (err) {
      console.error('Error loading applicants for interview modal:', err);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
    fetchApplicants();
  }, [fetchInterviews, fetchApplicants]);

  // Auto-open modal if app_id is passed in query string (from Candidate Pipeline "Schedule Interview" button)
  useEffect(() => {
    if (preselectedAppId && applicants.length > 0) {
      const targetApp = applicants.find(a => String(a.id) === String(preselectedAppId));
      if (targetApp) {
        handleOpenCreateModal(targetApp.id);
      }
    }
  }, [preselectedAppId, applicants]);

  const handleClearFilters = () => {
    setFilterDrive('');
    setFilterStatus('');
    setSearchQuery('');
  };

  const handleOpenCreateModal = (appId = '') => {
    setModalMode('create');
    setEditingInterview(null);
    setFormAppId(appId || (applicants[0] ? applicants[0].id : ''));
    setFormRoundName('Technical Round 1');
    // Default to tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormDate(tomorrow.toISOString().split('T')[0]);
    setFormTime('11:00 AM');
    setFormFormat('Online');
    setFormVenue('https://meet.google.com/abc-xyz-pqr');
    setFormStatus('Scheduled');
    setModalError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (interview) => {
    setModalMode('edit');
    setEditingInterview(interview);
    setFormAppId(interview.application_id);
    setFormRoundName(interview.round_name || 'Technical Round 1');
    setFormDate(interview.scheduled_date || '');
    setFormTime(interview.scheduled_time || '10:00 AM');
    setFormFormat(interview.interview_type || 'Online');
    setFormVenue(interview.venue || '');
    setFormStatus(interview.status || 'Scheduled');
    setModalError('');
    setShowModal(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!formRoundName.trim()) {
      setModalError('Round name / stage is required.');
      return;
    }
    if (!formDate) {
      setModalError('Scheduled date is required.');
      return;
    }
    if (!formTime.trim()) {
      setModalError('Scheduled time is required.');
      return;
    }

    try {
      setModalLoading(true);

      if (modalMode === 'create') {
        if (!formAppId) {
          setModalError('Please select a candidate application.');
          setModalLoading(false);
          return;
        }

        const payload = {
          application_id: formAppId,
          round_name: formRoundName.trim(),
          scheduled_date: formDate,
          scheduled_time: formTime.trim(),
          interview_type: formFormat,
          venue: formVenue.trim()
        };

        const res = await scheduleRecruiterInterviewApi(payload);
        if (res.success) {
          setNotification({
            type: 'success',
            message: res.message || 'Interview scheduled successfully and candidate notified.'
          });
          setShowModal(false);
          fetchInterviews();
        } else {
          setModalError(res.message || 'Failed to schedule interview.');
        }
      } else {
        // Edit / Reschedule mode
        const payload = {
          round_name: formRoundName.trim(),
          scheduled_date: formDate,
          scheduled_time: formTime.trim(),
          interview_type: formFormat,
          venue: formVenue.trim(),
          status: formStatus
        };

        const res = await updateRecruiterInterviewApi(editingInterview.id, payload);
        if (res.success) {
          setNotification({
            type: 'success',
            message: res.message || 'Interview updated successfully.'
          });
          setShowModal(false);
          fetchInterviews();
        } else {
          setModalError(res.message || 'Failed to update interview.');
        }
      }
    } catch (err) {
      console.error('Error submitting interview modal:', err);
      setModalError(err.message || 'An error occurred while saving.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleMarkCompleted = async (interview) => {
    try {
      const res = await updateRecruiterInterviewApi(interview.id, { status: 'Completed' });
      if (res.success) {
        setNotification({
          type: 'success',
          message: `Interview round '${interview.round_name}' marked as Completed.`
        });
        fetchInterviews();
      } else {
        setNotification({
          type: 'danger',
          message: res.message || 'Failed to update status.'
        });
      }
    } catch (err) {
      console.error('Error marking completed:', err);
      setNotification({
        type: 'danger',
        message: err.message || 'Failed to update status.'
      });
    }
  };

  const handleCancelInterview = async (interview) => {
    const confirmCancel = window.confirm(
      `Cancel interview round '${interview.round_name}' for ${interview.student_name || 'this candidate'}?`
    );
    if (!confirmCancel) return;

    try {
      const res = await cancelRecruiterInterviewApi(interview.id);
      if (res.success) {
        setNotification({
          type: 'success',
          message: `Interview round for ${interview.student_name || 'candidate'} has been cancelled.`
        });
        fetchInterviews();
      } else {
        setNotification({
          type: 'danger',
          message: res.message || 'Failed to cancel interview.'
        });
      }
    } catch (err) {
      console.error('Error cancelling interview:', err);
      setNotification({
        type: 'danger',
        message: err.message || 'Failed to cancel interview.'
      });
    }
  };

  const handleDeleteInterview = async (interview) => {
    const confirmDelete = window.confirm(
      `Permanently delete interview round '${interview.round_name}' for ${interview.student_name || 'this candidate'}? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      const res = await deleteRecruiterInterviewApi(interview.id);
      if (res.success) {
        setNotification({
          type: 'success',
          message: `Interview round '${interview.round_name}' has been permanently deleted.`
        });
        setInterviews(prev => prev.filter(item => item.id !== interview.id));
      } else {
        setNotification({
          type: 'danger',
          message: res.message || 'Failed to delete interview.'
        });
      }
    } catch (err) {
      console.error('Error deleting interview:', err);
      setNotification({
        type: 'danger',
        message: err.message || 'Failed to delete interview.'
      });
    }
  };

  const handleGenerateMeetCode = () => {
    const part1 = Math.random().toString(36).substring(2, 5);
    const part2 = Math.random().toString(36).substring(2, 6);
    const part3 = Math.random().toString(36).substring(2, 5);
    return `https://meet.google.com/${part1}-${part2}-${part3}`;
  };

  const handleCopyLink = (link) => {
    if (!link) return;
    navigator.clipboard?.writeText(link);
    setNotification({
      type: 'success',
      message: 'Google Meet link copied to clipboard!'
    });
  };

  const handleStartEditMeet = (interview) => {
    setEditingMeetId(interview.id);
    setMeetInputValue(interview.venue || '');
  };

  const handleSaveMeetLink = async (interviewId) => {
    try {
      setSavingMeetId(interviewId);
      const res = await updateRecruiterInterviewApi(interviewId, {
        venue: meetInputValue.trim(),
        interview_type: 'Online'
      });
      if (res.success) {
        setInterviews(prev => prev.map(item => item.id === interviewId ? { ...item, venue: meetInputValue.trim(), interview_type: 'Online' } : item));
        setNotification({
          type: 'success',
          message: 'Meeting link saved successfully.'
        });
        setEditingMeetId(null);
      } else {
        setNotification({
          type: 'danger',
          message: res.message || 'Failed to update meeting link.'
        });
      }
    } catch (err) {
      console.error('Error updating meeting link:', err);
      setNotification({
        type: 'danger',
        message: err.message || 'Error updating meeting link.'
      });
    } finally {
      setSavingMeetId(null);
    }
  };

  const hasActiveFilters = Boolean(filterDrive || filterStatus || searchQuery.trim());

  return (
    <div className="recruiter-interviews-page">
      {/* Header Bar */}
      <div className="flex-between mb-8" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-1)' }}>Scheduled Candidate Interviews</h1>
          <p className="text-muted" style={{ margin: 0 }}>
            Track upcoming and completed interview rounds across all active drives.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenCreateModal()}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Icon name="plus" size={16} /> Schedule Interview
        </button>
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

            {/* Status Filter Dropdown */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
              aria-label="Filter by interview status"
            >
              <option value="">All Statuses</option>
              {STATUS_FILTERS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '220px' }}>
              <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
                <Icon name="search" size={14} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidate, venue..."
                className="table-search-input"
                style={{ width: '100%', paddingLeft: '32px', height: '36px' }}
              />
            </div>
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

      {/* Main Interviews Table Card */}
      <div className="card card-flush">
        {loading && (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
            <p className="text-muted">Loading scheduled interviews...</p>
          </div>
        )}

        {!loading && error && (
          <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
            <div style={{ color: 'var(--danger-600, #dc2626)', marginBottom: '8px' }}>
              <Icon name="alert" size={28} />
            </div>
            <p className="text-danger font-semibold">{error}</p>
            <button onClick={fetchInterviews} className="btn btn-outline btn-sm mt-3">Try Again</button>
          </div>
        )}

        {!loading && !error && interviews.length > 0 && (
          <div className="table-wrap" style={{ overflowX: 'auto' }}>
            <table className="data-table" id="interviews-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Drive Role</th>
                  <th>Round Name</th>
                  <th>Date & Time</th>
                  <th>Interview Format</th>
                  <th>Google Meet Link (Editable)</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map(i => {
                  const isScheduled = i.status === 'Scheduled';
                  const isCompleted = i.status === 'Completed';
                  const isCancelled = i.status === 'Cancelled';

                  return (
                    <tr key={i.id}>
                      {/* Candidate Column */}
                      <td className="cell-primary font-semibold">
                        {i.student_name || 'Candidate'}
                        <span className="text-xs text-muted block" style={{ display: 'block', fontWeight: 'normal', marginTop: '2px' }}>
                          {i.student_no || 'STU'}
                        </span>
                      </td>

                      {/* Drive Role Column */}
                      <td>
                        <span className="font-medium">{i.drive_title || 'Placement Drive'}</span>
                      </td>

                      {/* Round Name Column */}
                      <td>
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{i.round_name}</span>
                      </td>

                      {/* Date & Time Column */}
                      <td className="cell-muted font-medium">
                        {i.scheduled_date} <span className="text-xs text-muted">at</span> {i.scheduled_time}
                      </td>

                      {/* Format Column */}
                      <td>
                        <span className="badge badge-gray" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Icon name="video" size={12} /> {i.interview_type || 'Online'}
                        </span>
                      </td>

                      {/* Google Meet Link Column (Directly Editable by Recruiter) */}
                      <td style={{ minWidth: '240px', maxWidth: '340px' }}>
                        {editingMeetId === i.id ? (
                          <div style={{ background: 'var(--bg-surface)', padding: '6px 8px', borderRadius: '8px', border: '1px solid var(--brand-500, #3b82f6)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                              <input
                                type="text"
                                className="table-search-input"
                                style={{ padding: '4px 8px', fontSize: '0.8rem', height: '30px', flex: 1, borderRadius: '6px' }}
                                placeholder="https://meet.google.com/..."
                                value={meetInputValue}
                                onChange={(e) => setMeetInputValue(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveMeetLink(i.id);
                                  if (e.key === 'Escape') setEditingMeetId(null);
                                }}
                              />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                              <button
                                type="button"
                                className="btn btn-sm btn-ghost"
                                style={{ padding: '2px 6px', fontSize: '0.72rem', color: 'var(--accent-cyan-600, #0284c7)', height: '26px' }}
                                onClick={() => setMeetInputValue(handleGenerateMeetCode())}
                                title="Generate random Google Meet room"
                              >
                                + Generate
                              </button>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-primary"
                                  style={{ padding: '2px 10px', fontSize: '0.75rem', height: '26px', fontWeight: 600 }}
                                  disabled={savingMeetId === i.id}
                                  onClick={() => handleSaveMeetLink(i.id)}
                                  title="Save Google Meet link"
                                >
                                  {savingMeetId === i.id ? '...' : 'Save'}
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-ghost"
                                  style={{ padding: '2px 8px', fontSize: '0.75rem', height: '26px' }}
                                  onClick={() => setEditingMeetId(null)}
                                  title="Cancel"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {i.venue ? (
                                i.venue.startsWith('http') ? (
                                  <a 
                                    href={i.venue} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    style={{ color: 'var(--accent-cyan-600, #0284c7)', display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}
                                    title={i.venue}
                                  >
                                    <Icon name="external-link" size={13} /> Join Call
                                  </a>
                                ) : (
                                  <span title={i.venue}>{i.venue}</span>
                                )
                              ) : (
                                <span className="cell-muted" style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>No link set</span>
                              )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {i.venue && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-ghost"
                                  style={{ padding: '2px 6px', fontSize: '0.72rem', height: '26px' }}
                                  onClick={() => handleCopyLink(i.venue)}
                                  title="Copy Google Meet Link"
                                >
                                  Copy
                                </button>
                              )}
                              <button
                                type="button"
                                className="btn btn-sm"
                                style={{
                                  padding: '2px 8px',
                                  fontSize: '0.75rem',
                                  height: '26px',
                                  borderRadius: 6,
                                  border: '1px solid var(--border-subtle)',
                                  background: 'var(--bg-surface-alt, rgba(59, 130, 246, 0.08))',
                                  color: 'var(--brand-500, #3b82f6)',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                                onClick={() => handleStartEditMeet(i)}
                                title="Change or set Google Meet Link"
                              >
                                <Icon name="edit" size={12} /> {i.venue ? 'Change Link' : 'Add Link'}
                              </button>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Status Column */}
                      <td>
                        <span className={`badge ${isCompleted ? 'badge-success' : isScheduled ? 'badge-accent' : 'badge-danger'}`}>
                          {i.status}
                        </span>
                      </td>

                      {/* Actions Column */}
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                          {isScheduled && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleMarkCompleted(i)}
                                className="btn btn-sm btn-outline"
                                style={{ padding: '3px 8px', fontSize: '0.78rem' }}
                                title="Mark round as Completed"
                              >
                                Complete
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(i)}
                                className="btn btn-sm btn-ghost"
                                style={{ padding: '3px 8px', fontSize: '0.78rem' }}
                                title="Reschedule & Change Google Meet link"
                              >
                                Edit / Meet Link
                              </button>

                              <button
                                type="button"
                                onClick={() => handleCancelInterview(i)}
                                className="btn btn-sm btn-outline"
                                style={{ padding: '3px 8px', fontSize: '0.78rem', color: 'var(--warning-600)' }}
                                title="Cancel interview session"
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          {!isScheduled && (
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(i)}
                              className="btn btn-sm btn-ghost"
                              style={{ padding: '3px 8px', fontSize: '0.78rem' }}
                              title="View / Edit details"
                            >
                              Edit
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteInterview(i)}
                            className="btn btn-sm"
                            style={{
                              padding: '3px 10px',
                              fontSize: '0.78rem',
                              borderRadius: '6px',
                              border: '1px solid rgba(239, 68, 68, 0.4)',
                              background: 'rgba(239, 68, 68, 0.1)',
                              color: '#ef4444',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                            title="Permanently delete interview round"
                          >
                            <Icon name="trash" size={13} /> Delete
                          </button>
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
        {!loading && !error && interviews.length === 0 && (
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
              <Icon name="video" size={28} />
            </div>
            <h4 style={{ margin: '0 0 var(--space-1)' }}>No interviews scheduled</h4>
            <p className="text-muted" style={{ maxWidth: '420px', margin: '0 auto var(--space-4)' }}>
              {hasActiveFilters
                ? 'No interview records match the selected drive, status, or search query.'
                : 'Schedule interview rounds for shortlisted candidates directly from the applicant pipeline.'}
            </p>
            {hasActiveFilters ? (
              <button onClick={handleClearFilters} className="btn btn-outline btn-sm">
                Clear Filters
              </button>
            ) : (
              <Link to="/recruiter/applicants" className="btn btn-primary btn-sm">
                View Applicant Pipeline
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Schedule / Reschedule Modal */}
      {showModal && (
        <div 
          className="modal-backdrop" 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}
        >
          <div 
            className="card" 
            style={{ 
              maxWidth: '540px', 
              width: '100%', 
              maxHeight: '90vh', 
              overflowY: 'auto',
              padding: 'var(--space-6)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div className="flex-between mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                {modalMode === 'create' ? 'Schedule Interview Round' : 'Edit Interview Details'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '4px' }}
                aria-label="Close modal"
              >
                <Icon name="x" size={18} />
              </button>
            </div>

            {modalError && (
              <div className="alert alert-danger mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="alert" size={16} />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleModalSubmit}>
              {/* Candidate Selection (in create mode) */}
              {modalMode === 'create' ? (
                <div className="form-group mb-4">
                  <label className="form-label font-semibold">Candidate Application <span className="required" style={{ color: 'var(--danger-600)' }}>*</span></label>
                  <select
                    value={formAppId}
                    onChange={(e) => setFormAppId(e.target.value)}
                    className="filter-select"
                    style={{ width: '100%', height: '40px' }}
                    required
                  >
                    <option value="">Select Candidate...</option>
                    {applicants.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.student_name || a.name} ({a.student_no}) &ndash; {a.drive_title} [{a.status}]
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="form-group mb-4">
                  <p className="text-muted" style={{ margin: 0 }}>
                    Candidate: <strong>{editingInterview?.student_name}</strong> ({editingInterview?.student_no}) &ndash; {editingInterview?.drive_title}
                  </p>
                </div>
              )}

              {/* Round Name */}
              <div className="form-group mb-4">
                <label className="form-label font-semibold">Round Name / Stage <span className="required" style={{ color: 'var(--danger-600)' }}>*</span></label>
                <input
                  type="text"
                  value={formRoundName}
                  onChange={(e) => setFormRoundName(e.target.value)}
                  placeholder="e.g. Technical Round 1 / System Design / HR Discussion"
                  className="table-search-input"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              {/* Date & Time Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label font-semibold">Scheduled Date <span className="required" style={{ color: 'var(--danger-600)' }}>*</span></label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="table-search-input"
                    style={{ width: '100%' }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label font-semibold">Scheduled Time <span className="required" style={{ color: 'var(--danger-600)' }}>*</span></label>
                  <input
                    type="text"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="e.g. 10:30 AM / 11:00 AM - 12:00 PM"
                    className="table-search-input"
                    style={{ width: '100%' }}
                    required
                  />
                </div>
              </div>

              {/* Format */}
              <div className="form-group mb-4">
                <label className="form-label font-semibold">Interview Format <span className="required" style={{ color: 'var(--danger-600)' }}>*</span></label>
                <select
                  value={formFormat}
                  onChange={(e) => setFormFormat(e.target.value)}
                  className="filter-select"
                  style={{ width: '100%', height: '40px' }}
                  required
                >
                  {INTERVIEW_FORMATS.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>

              {/* Venue / Meeting Link */}
              <div className="form-group mb-4">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: 4 }}>
                  <label className="form-label font-semibold" style={{ margin: 0 }}>Google Meet / Meeting Link (Recruiter Editable)</label>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {formVenue && formVenue.trim() && (
                      <a
                        href={formVenue.startsWith('http') ? formVenue : `https://${formVenue}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.75rem', color: 'var(--accent-cyan-600, #0284c7)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}
                      >
                        <Icon name="external-link" size={12} /> Test Link
                      </a>
                    )}
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost"
                      style={{ fontSize: '0.75rem', padding: '1px 6px', color: 'var(--accent-cyan-600, #0284c7)' }}
                      onClick={() => {
                        setFormVenue(handleGenerateMeetCode());
                      }}
                    >
                      + Generate New Meet Link
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={formVenue}
                  onChange={(e) => setFormVenue(e.target.value)}
                  placeholder="e.g. https://meet.google.com/abc-defg-hij"
                  className="table-search-input"
                  style={{ width: '100%' }}
                />
                <small className="text-muted text-xs" style={{ display: 'block', marginTop: '4px' }}>
                  Recruiters can customize, change, or paste their own Google Meet link. Candidates will see this link in their interview schedule.
                </small>
              </div>

              {/* Status in Edit Mode */}
              {modalMode === 'edit' && (
                <div className="form-group mb-6">
                  <label className="form-label font-semibold">Interview Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="filter-select"
                    style={{ width: '100%', height: '40px' }}
                  >
                    {STATUS_FILTERS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex-between mt-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  {modalMode === 'edit' && editingInterview && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        handleDeleteInterview(editingInterview);
                      }}
                      className="btn btn-sm"
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.8rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 600
                      }}
                      title="Permanently delete this interview round"
                    >
                      <Icon name="trash" size={13} /> Delete Round
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Icon name="check" size={16} />
                    {modalLoading ? 'Saving...' : (modalMode === 'create' ? 'Confirm & Notify Candidate' : 'Save Changes')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
