import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { 
  getRecruiterResultsApi, 
  getRecruiterApplicantsApi,
  createRecruiterResultApi, 
  updateRecruiterResultApi,
  deleteRecruiterResultApi 
} from '../../services/api';

const STATUS_FILTERS = ['Selected', 'Rejected', 'Waiting'];

export default function RecruiterResults() {
  const [results, setResults] = useState([]);
  const [drives, setDrives] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);

  // Filters & Search
  const [filterDrive, setFilterDrive] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingResult, setEditingResult] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Modal Form State
  const [formAppId, setFormAppId] = useState('');
  const [formPackage, setFormPackage] = useState('12.0');
  const [formDate, setFormDate] = useState('');
  const [formStatus, setFormStatus] = useState('Selected');

  // Fetch results
  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (filterDrive) params.drive_id = filterDrive;
      if (filterStatus) params.status = filterStatus;
      if (searchQuery.trim()) params.q = searchQuery.trim();

      const res = await getRecruiterResultsApi(params);
      if (res.success) {
        setResults(res.results || []);
        if (res.drives) setDrives(res.drives);
      } else {
        setError(res.message || 'Failed to load placement results.');
      }
    } catch (err) {
      console.error('Error loading placement results:', err);
      setError(err.message || 'An error occurred while loading placement results.');
    } finally {
      setLoading(false);
    }
  }, [filterDrive, filterStatus, searchQuery]);

  // Fetch applicants for modal
  const fetchApplicants = useCallback(async () => {
    try {
      const res = await getRecruiterApplicantsApi();
      if (res.success) {
        setApplicants(res.applicants || []);
      }
    } catch (err) {
      console.error('Error loading applicants for results modal:', err);
    }
  }, []);

  useEffect(() => {
    fetchResults();
    fetchApplicants();
  }, [fetchResults, fetchApplicants]);

  const handleClearFilters = () => {
    setFilterDrive('');
    setFilterStatus('');
    setSearchQuery('');
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingResult(null);
    setFormAppId(applicants[0] ? applicants[0].id : '');
    setFormPackage('12.0');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormStatus('Selected');
    setModalError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (result) => {
    setModalMode('edit');
    setEditingResult(result);
    setFormAppId(result.application_id);
    setFormPackage(String(result.package || 0));
    setFormDate(result.placement_date || new Date().toISOString().split('T')[0]);
    setFormStatus(result.status || 'Selected');
    setModalError('');
    setShowModal(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    const parsedPkg = parseFloat(formPackage);
    if (isNaN(parsedPkg) || parsedPkg <= 0) {
      setModalError('Please enter a valid positive compensation package amount (in LPA).');
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
          package: parsedPkg,
          placement_date: formDate,
          status: formStatus
        };

        const res = await createRecruiterResultApi(payload);
        if (res.success) {
          setNotification({
            type: 'success',
            message: res.message || 'Placement offer details saved successfully.'
          });
          setShowModal(false);
          fetchResults();
        } else {
          setModalError(res.message || 'Failed to save offer details.');
        }
      } else {
        // Edit mode
        const payload = {
          package: parsedPkg,
          placement_date: formDate,
          status: formStatus
        };

        const res = await updateRecruiterResultApi(editingResult.id, payload);
        if (res.success) {
          setNotification({
            type: 'success',
            message: res.message || 'Placement outcome updated successfully.'
          });
          setShowModal(false);
          fetchResults();
        } else {
          setModalError(res.message || 'Failed to update result.');
        }
      }
    } catch (err) {
      console.error('Error submitting results modal:', err);
      setModalError(err.message || 'An error occurred while saving.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteResult = async (resultId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to permanently delete this placement result? This action cannot be undone.'
    );
    if (!confirmDelete) return;

    try {
      const res = await deleteRecruiterResultApi(resultId);
      if (res.success) {
        setResults(prev => prev.filter(r => String(r.id) !== String(resultId) && String(r._id || '') !== String(resultId)));
        setNotification({
          type: 'success',
          message: 'Placement result deleted successfully.'
        });
      } else {
        setNotification({
          type: 'danger',
          message: res.message || 'Failed to delete placement result.'
        });
      }
    } catch (err) {
      console.error('Error deleting result:', err);
      setNotification({
        type: 'danger',
        message: err.message || 'Failed to delete placement result.'
      });
    }
  };

  const hasActiveFilters = Boolean(filterDrive || filterStatus || searchQuery.trim());

  return (
    <div className="recruiter-results-page">
      {/* Header Bar */}
      <div className="flex-between mb-8" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-1)' }}>Placement Outcomes & Offers</h1>
          <p className="text-muted" style={{ margin: 0 }}>
            Finalize candidate compensation offers and official selection decisions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Icon name="plus" size={16} /> Finalize Offer
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
            {/* Drive Filter */}
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

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
              aria-label="Filter by result status"
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
                placeholder="Search candidate, role..."
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

      {/* Main Results Table Card */}
      <div className="card card-flush">
        {loading && (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
            <p className="text-muted">Loading placement outcomes...</p>
          </div>
        )}

        {!loading && error && (
          <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
            <div style={{ color: 'var(--danger-600, #dc2626)', marginBottom: '8px' }}>
              <Icon name="alert" size={28} />
            </div>
            <p className="text-danger font-semibold">{error}</p>
            <button onClick={fetchResults} className="btn btn-outline btn-sm mt-3">Try Again</button>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="table-wrap" style={{ overflowX: 'auto' }}>
            <table className="data-table" id="results-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Department</th>
                  <th>Role Title</th>
                  <th>Offered Package (LPA)</th>
                  <th>Outcome Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => {
                  const isSelected = r.status === 'Selected';
                  const isRejected = r.status === 'Rejected';

                  return (
                    <tr key={r.id}>
                      {/* Candidate Column */}
                      <td className="cell-primary font-semibold">
                        {r.student_name || 'Candidate'}
                        <span className="text-xs text-muted block" style={{ display: 'block', fontWeight: 'normal', marginTop: '2px' }}>
                          {r.student_no || 'STU'}
                        </span>
                      </td>

                      {/* Department Column */}
                      <td className="cell-muted">{r.department || 'Computer Science'}</td>

                      {/* Role Title Column */}
                      <td>
                        <span className="font-medium">{r.drive_title || 'Software Engineer'}</span>
                      </td>

                      {/* Offered Package Column */}
                      <td className="font-bold text-success" style={{ color: 'var(--success-600, #16a34a)' }}>
                        ₹{typeof r.package === 'number' ? r.package.toFixed(1) : r.package} LPA
                      </td>

                      {/* Outcome Date Column */}
                      <td className="cell-muted">{r.placement_date || '—'}</td>

                      {/* Status Badge Column */}
                      <td>
                        <span className={`badge ${isSelected ? 'badge-success' : isRejected ? 'badge-danger' : 'badge-warning'} status-${r.status}`}>
                          {r.status}
                        </span>
                      </td>

                      {/* Actions Column */}
                      <td>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(r)}
                            className="btn btn-sm btn-ghost"
                            style={{ padding: '3px 8px', fontSize: '0.78rem' }}
                            title="Edit Package or Decision Date"
                          >
                            Edit Details
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteResult(r.id)}
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
                            title="Permanently delete this placement outcome"
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

        {/* Empty State matching Flask */}
        {!loading && !error && results.length === 0 && (
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
              <Icon name="award" size={28} />
            </div>
            <h4 style={{ margin: '0 0 var(--space-1)' }}>No finalized placement offers yet</h4>
            <p className="text-muted" style={{ maxWidth: '420px', margin: '0 auto var(--space-4)' }}>
              {hasActiveFilters
                ? 'No placement records match the selected filters or search query.'
                : 'Selected candidates will appear here with verified compensation records once finalized.'}
            </p>
            {hasActiveFilters ? (
              <button onClick={handleClearFilters} className="btn btn-outline btn-sm">
                Clear Filters
              </button>
            ) : (
              <Link to="/recruiter/applicants" className="btn btn-primary btn-sm">
                View Candidate Pipeline
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Finalize / Edit Offer Modal */}
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
              maxWidth: '520px', 
              width: '100%', 
              padding: 'var(--space-6)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="flex-between mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                {modalMode === 'create' ? 'Finalize Candidate Offer' : 'Edit Placement Offer'}
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
              {/* Candidate Selection in create mode */}
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
                    Candidate: <strong>{editingResult?.student_name}</strong> ({editingResult?.student_no}) &ndash; {editingResult?.drive_title}
                  </p>
                </div>
              )}

              {/* Package (LPA) */}
              <div className="form-group mb-4">
                <label className="form-label font-semibold">Offered Package (CTC in ₹ LPA) <span className="required" style={{ color: 'var(--danger-600)' }}>*</span></label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="150"
                  value={formPackage}
                  onChange={(e) => setFormPackage(e.target.value)}
                  placeholder="e.g. 12.0"
                  className="table-search-input"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              {/* Placement Date */}
              <div className="form-group mb-4">
                <label className="form-label font-semibold">Offer / Decision Date <span className="required" style={{ color: 'var(--danger-600)' }}>*</span></label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="table-search-input"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              {/* Status */}
              <div className="form-group mb-6">
                <label className="form-label font-semibold">Decision Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="filter-select"
                  style={{ width: '100%', height: '40px' }}
                >
                  <option value="Selected">Selected (Offer Released)</option>
                  <option value="Waiting">Waiting / Under Consideration</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex-between mt-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  {modalMode === 'edit' && editingResult && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        handleDeleteResult(editingResult.id);
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
                      title="Permanently delete this placement outcome"
                    >
                      <Icon name="trash" size={13} /> Delete Outcome
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
                    {modalLoading ? 'Saving...' : 'Save & Confirm Offer'}
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
