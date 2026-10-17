import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '../../components/Icon';
import {
  getAdminDrivesApi,
  getAdminDriveDetailApi,
  approveAdminDriveApi,
  rejectAdminDriveApi
} from '../../services/api';

export default function AdminDrives({ defaultApprovalStatus }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlApproval = searchParams.get('approvalStatus') || defaultApprovalStatus || 'All';

  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [approvalFilter, setApprovalFilter] = useState(urlApproval);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Approval / Rejection action states
  const [actionMsg, setActionMsg] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [rejectModalDrive, setRejectModalDrive] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // Sync state if URL changes
  useEffect(() => {
    const param = searchParams.get('approvalStatus') || defaultApprovalStatus || 'All';
    setApprovalFilter(param);
  }, [searchParams, defaultApprovalStatus]);

  useEffect(() => {
    loadDrives();
  }, [search, jobTypeFilter, statusFilter, approvalFilter]);

  const handleApprovalFilterChange = (status) => {
    setApprovalFilter(status);
    const newParams = new URLSearchParams(searchParams);
    if (status === 'All') {
      newParams.delete('approvalStatus');
    } else {
      newParams.set('approvalStatus', status);
    }
    setSearchParams(newParams);
  };

  const loadDrives = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.q = search.trim();
      if (jobTypeFilter !== 'All') params.jobType = jobTypeFilter;
      if (statusFilter !== 'All') params.status = statusFilter;
      if (approvalFilter !== 'All') params.approvalStatus = approvalFilter;
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

  const handleViewDetail = async (driveOrId) => {
    const driveObj = typeof driveOrId === 'object' && driveOrId !== null
      ? driveOrId
      : drives.find(d => String(d.id || d._id) === String(driveOrId));
    const id = driveObj ? (driveObj.id || driveObj._id) : driveOrId;

    // Immediately open modal with clicked row data for zero-latency response
    if (driveObj) {
      setSelectedDrive(driveObj);
    }

    if (!id) return;

    try {
      setLoadingDetail(true);
      const res = await getAdminDriveDetailApi(id);
      const detail = res?.data || res?.drive || res;
      if (detail && typeof detail === 'object') {
        setSelectedDrive(detail);
      }
    } catch (err) {
      console.warn('Using existing drive details on API warning:', err.message);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleApprove = async (drive) => {
    const driveId = drive.id || drive._id;
    if (!window.confirm(`Approve opportunity "${drive.title}" by ${drive.companyName || 'Corporate Partner'}? It will become immediately visible to students and open for applications.`)) {
      return;
    }

    try {
      setProcessingId(driveId);
      const res = await approveAdminDriveApi(driveId);
      setActionMsg({
        type: 'success',
        text: res.message || `Opportunity "${drive.title}" has been approved and published to students.`
      });
      if (selectedDrive && (String(selectedDrive.id) === String(driveId) || String(selectedDrive._id) === String(driveId))) {
        setSelectedDrive(prev => ({
          ...prev,
          approvalStatus: 'approved',
          approval_status: 'approved',
          rejectionReason: ''
        }));
      }
      window.dispatchEvent(new Event('drivesUpdated'));
      loadDrives();
    } catch (err) {
      console.error('Failed to approve drive:', err);
      setActionMsg({ type: 'danger', text: err.message || 'Failed to approve opportunity' });
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectModal = (drive) => {
    setRejectModalDrive(drive);
    setRejectReason('Does not meet institutional placement guidelines or missing mandatory criteria.');
  };

  const handleConfirmReject = async () => {
    if (!rejectModalDrive) return;
    const driveId = rejectModalDrive.id || rejectModalDrive._id;
    if (!rejectReason.trim()) {
      alert('Please provide a specific rejection reason for the recruiter.');
      return;
    }

    try {
      setProcessingId(driveId);
      const res = await rejectAdminDriveApi(driveId, rejectReason.trim());
      setActionMsg({
        type: 'warning',
        text: res.message || `Opportunity "${rejectModalDrive.title}" has been rejected. Feedback sent to recruiter.`
      });
      if (selectedDrive && (String(selectedDrive.id) === String(driveId) || String(selectedDrive._id) === String(driveId))) {
        setSelectedDrive(prev => ({
          ...prev,
          approvalStatus: 'rejected',
          approval_status: 'rejected',
          rejectionReason: rejectReason.trim()
        }));
      }
      setRejectModalDrive(null);
      setRejectReason('');
      window.dispatchEvent(new Event('drivesUpdated'));
      loadDrives();
    } catch (err) {
      console.error('Failed to reject drive:', err);
      setActionMsg({ type: 'danger', text: err.message || 'Failed to reject opportunity' });
    } finally {
      setProcessingId(null);
    }
  };

  const pendingDrivesCount = drives.filter(d => (d.approvalStatus || d.approval_status) === 'pending').length;

  return (
    <div className="admin-drives-page">
      {/* Top Banner Header */}
      <div className="flex-between mb-6" style={{ flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-1)' }}>
            Placement Drives & Job Approvals
          </h1>
          <p className="text-muted" style={{ margin: 0 }}>
            Inspect recruiter submissions, verify job authenticity, approve opportunities for students, and enforce placement standards.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={() => handleApprovalFilterChange('pending')}
            className={`badge ${approvalFilter === 'pending' ? 'badge-warning font-bold' : 'badge-neutral'}`}
            style={{
              fontSize: '0.875rem',
              padding: '0.55rem 1.1rem',
              background: approvalFilter === 'pending' ? '#FEF3C7' : 'var(--warning-50, #FFFBEB)',
              color: 'var(--warning-700, #B45309)',
              border: '1px solid var(--warning-200, #FDE68A)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Icon name="alert-circle" size={15} />
            {pendingDrivesCount} Pending Approval
          </button>
          <div className="badge badge-brand" style={{ fontSize: '0.875rem', padding: '0.55rem 1.1rem' }}>
            {drives.length} Postings Loaded
          </div>
        </div>
      </div>

      {actionMsg && (
        <div
          className={`alert alert-${actionMsg.type} mb-6`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '12px 16px',
            borderRadius: 8,
            marginBottom: 20,
            background: actionMsg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: actionMsg.type === 'success' ? 'var(--success-500)' : 'var(--danger-500)',
            border: `1px solid ${actionMsg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name={actionMsg.type === 'success' ? 'check' : 'alert-circle'} size={18} />
            <span style={{ fontWeight: 500 }}>{actionMsg.text}</span>
          </div>
          <button
            onClick={() => setActionMsg(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
          >
            <Icon name="x" size={16} />
          </button>
        </div>
      )}

      {/* Filter and Approval Tab Switcher Bar */}
      <div className="card mb-6" style={{ padding: '1rem 1.25rem' }}>
        <div className="flex-between mb-4" style={{ flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
          <div className="font-semibold text-sm text-muted">FILTER BY REVIEW STATUS:</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn btn-sm ${approvalFilter === 'All' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '5px 14px', fontSize: '0.82rem' }}
              onClick={() => handleApprovalFilterChange('All')}
            >
              All Postings
            </button>
            <button
              type="button"
              className={`btn btn-sm ${approvalFilter === 'pending' ? 'btn-warning' : 'btn-outline'}`}
              style={{
                padding: '5px 14px',
                fontSize: '0.82rem',
                background: approvalFilter === 'pending' ? 'var(--warning-500, #F59E0B)' : 'transparent',
                color: approvalFilter === 'pending' ? '#FFFFFF' : 'var(--warning-700, #B45309)',
                borderColor: 'var(--warning-500, #F59E0B)',
                fontWeight: 600
              }}
              onClick={() => handleApprovalFilterChange('pending')}
            >
              <Icon name="alert-circle" size={14} style={{ marginRight: 4 }} />
              Pending Approval ({pendingDrivesCount})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${approvalFilter === 'approved' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '5px 14px', fontSize: '0.82rem' }}
              onClick={() => handleApprovalFilterChange('approved')}
            >
              Approved & Live
            </button>
            <button
              type="button"
              className={`btn btn-sm ${approvalFilter === 'rejected' ? 'btn-primary text-danger' : 'btn-outline'}`}
              style={{ padding: '5px 14px', fontSize: '0.82rem' }}
              onClick={() => handleApprovalFilterChange('rejected')}
            >
              Rejected
            </button>
          </div>
        </div>

        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div className="topbar-search" style={{ flex: 1, minWidth: 260, maxWidth: 380 }}>
            <input
              type="text"
              placeholder="Search title, recruiter, company, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex-align-center" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
            <label className="text-xs font-semibold text-muted">JOB TYPE:</label>
            <select
              className="form-control"
              style={{ width: 'auto', minWidth: 130 }}
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Internship">Internship</option>
            </select>

            <label className="text-xs font-semibold text-muted">DRIVE STATUS:</label>
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

      {/* Drives Master Table */}
      <div className="card">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted">Loading placement opportunities...</p>
          </div>
        ) : drives.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="briefcase" size={36} className="text-muted mb-2" />
            <p className="text-muted">No placement drives found matching criteria.</p>
            {approvalFilter === 'pending' && (
              <p className="text-xs text-muted" style={{ marginTop: 4 }}>
                All recruiter submissions have been reviewed and approved!
              </p>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Job Title & Type</th>
                  <th>Company</th>
                  <th>Recruiter Contact</th>
                  <th>Package (CTC)</th>
                  <th>Location</th>
                  <th>Submitted</th>
                  <th>Approval Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {drives.map((d) => {
                  const appr = (d.approvalStatus || d.approval_status || 'approved').toLowerCase();
                  const isPending = appr === 'pending';
                  const isApproved = appr === 'approved';
                  const isRejected = appr === 'rejected';

                  return (
                    <tr key={d.id || d._id}>
                      <td>
                        <div className="font-semibold">{d.title}</div>
                        <div className="text-xs text-muted">
                          {d.jobType || d.job_type || 'Full-Time'} · Min CGPA: {d.minCgpa ?? d.min_cgpa ?? 6.0}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-brand">{d.companyName}</span>
                      </td>
                      <td>
                        <div className="font-medium text-sm">
                          {d.recruiterName || d.hrContact || 'Recruiter Lead'}
                        </div>
                        <div className="text-xs text-muted font-mono">
                          {d.recruiterEmail || d.companyEmail || '—'}
                        </div>
                      </td>
                      <td className="font-bold text-brand">₹{d.ctc} LPA</td>
                      <td className="text-sm">{d.location}</td>
                      <td className="text-xs font-mono text-muted">
                        {d.submissionDate || d.createdAt || d.deadline}
                      </td>
                      <td>
                        {isPending && (
                          <span
                            className="badge badge-warning font-semibold"
                            style={{
                              background: 'var(--warning-50, #FFFBEB)',
                              color: 'var(--warning-700, #B45309)',
                              border: '1px solid var(--warning-200, #FDE68A)'
                            }}
                          >
                            Pending Review
                          </span>
                        )}
                        {isApproved && (
                          <span className="badge badge-success font-semibold">
                            Approved & Live
                          </span>
                        )}
                        {isRejected && (
                          <span className="badge badge-danger font-semibold" title={d.rejectionReason}>
                            Rejected
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                            onClick={() => handleViewDetail(d)}
                            title="Inspect full job description and requirements"
                          >
                            <Icon name="briefcase" size={13} /> View Details
                          </button>
                          {isPending && (
                            <>
                              <button
                                className="btn btn-sm btn-primary"
                                style={{ padding: '4px 10px', fontSize: '0.78rem', background: '#10B981', borderColor: '#10B981' }}
                                disabled={processingId === (d.id || d._id)}
                                onClick={() => handleApprove(d)}
                                title="Approve this drive immediately"
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-sm btn-outline text-danger"
                                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                                disabled={processingId === (d.id || d._id)}
                                onClick={() => openRejectModal(d)}
                                title="Reject this drive with reason"
                              >
                                Reject
                              </button>
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
      </div>

      {/* Detailed Drive Modal */}
      {selectedDrive && (
        <div
          className="modal-backdrop open"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(6, 19, 37, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050,
            padding: 'var(--space-4)'
          }}
          onClick={() => setSelectedDrive(null)}
        >
          <div
            className="modal modal-dialog"
            style={{
              maxWidth: 720,
              width: '100%',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-subtle)',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="h3" style={{ margin: 0 }}>Opportunity Inspection & Verification</h3>
              <button className="btn-close" onClick={() => setSelectedDrive(null)}>
                <Icon name="x" size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ overflowY: 'auto', flex: 1 }}>
              {/* Approval status banner inside modal */}
              {((selectedDrive.approvalStatus || selectedDrive.approval_status) === 'pending') && (
                <div
                  className="mb-4 p-3"
                  style={{
                    background: '#FFFBEB',
                    border: '1px solid #FDE68A',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}
                >
                  <Icon name="alert-circle" size={20} className="text-warning" />
                  <div>
                    <div className="font-semibold" style={{ color: '#92400E', fontSize: '0.9rem' }}>
                      Pending Institutional Verification
                    </div>
                    <div className="text-xs" style={{ color: '#B45309' }}>
                      This opportunity is hidden from student listings and cannot receive applications until approved.
                    </div>
                  </div>
                </div>
              )}

              {((selectedDrive.approvalStatus || selectedDrive.approval_status) === 'rejected') && (
                <div
                  className="mb-4 p-3"
                  style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 8
                  }}
                >
                  <div className="font-semibold text-danger mb-1" style={{ fontSize: '0.9rem' }}>
                    Opportunity Rejected
                  </div>
                  <div className="text-xs text-muted">
                    Reason communicated to recruiter: <strong>{selectedDrive.rejectionReason || selectedDrive.rejection_reason || 'Does not meet criteria'}</strong>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <div className="flex-between" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <h4 className="h4" style={{ margin: '0 0 0.35rem', fontSize: '1.25rem', fontWeight: 700 }}>
                      {selectedDrive.title}
                    </h4>
                    <div className="flex-align-center" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-brand">{selectedDrive.companyName}</span>
                      <span className="badge badge-neutral">{selectedDrive.opportunityType || selectedDrive.opportunity_type || selectedDrive.jobType || 'Placement'}</span>
                      <span className="badge badge-neutral">{selectedDrive.workMode || selectedDrive.work_mode || 'Hybrid'}</span>
                      <span className="text-sm text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Icon name="map-pin" size={13} />
                        {selectedDrive.location || selectedDrive.companyLocation || 'Campus'}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="text-xs text-muted">COMPENSATION</div>
                    <div className="font-bold text-brand" style={{ fontSize: '1.15rem' }}>
                      {selectedDrive.ctc > 0
                        ? (selectedDrive.jobType?.toLowerCase().includes('intern') || (selectedDrive.opportunityType || '').toLowerCase().includes('intern')
                          ? `₹${selectedDrive.ctc} LPA Stipend`
                          : `₹${selectedDrive.ctc} LPA`)
                        : 'Competitive Compensation'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recruiter & Company Details Card */}
              <div style={{ background: 'var(--bg-surface-secondary, rgba(0,0,0,0.02))', padding: '14px 16px', borderRadius: 8, marginBottom: 16, border: '1px solid var(--border-subtle)' }}>
                <div className="flex-between mb-2" style={{ alignItems: 'center' }}>
                  <div className="text-xs font-semibold text-muted uppercase tracking-wider">
                    CORPORATE IDENTITY & RECRUITER AUDIT
                  </div>
                  <div>
                    {selectedDrive.companyApproved ? (
                      <span className="badge badge-success" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                        <Icon name="check" size={12} style={{ marginRight: 4 }} /> Verified Corporate Partner
                      </span>
                    ) : (
                      <span className="badge badge-warning" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                        <Icon name="alert-circle" size={12} style={{ marginRight: 4 }} /> Pending Organization Verification
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-2 gap-3" style={{ fontSize: '0.85rem' }}>
                  <div>
                    <span className="text-xs text-muted">Organization Name: </span>
                    <span className="font-semibold">{selectedDrive.companyName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted">Industry Sector: </span>
                    <span className="font-medium">{selectedDrive.companyIndustry || 'Information Technology & Services'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted">Registered Recruiter: </span>
                    <span className="font-semibold">{selectedDrive.recruiterName || selectedDrive.hrContact || 'Corporate Talent Lead'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted">Recruiter Email: </span>
                    <span className="font-mono text-xs">{selectedDrive.recruiterEmail || selectedDrive.companyEmail || '—'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted">Submission Date: </span>
                    <span className="font-mono text-xs">{selectedDrive.submissionDate || selectedDrive.createdAt || 'Recent'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted">Application Deadline: </span>
                    <span className="font-mono text-xs font-semibold">{selectedDrive.deadline || 'Rolling'}</span>
                  </div>
                  {selectedDrive.companyWebsite && (
                    <div>
                      <span className="text-xs text-muted">Website: </span>
                      <a href={selectedDrive.companyWebsite} target="_blank" rel="noreferrer" className="text-xs text-brand font-mono">
                        {selectedDrive.companyWebsite} ↗
                      </a>
                    </div>
                  )}
                  {selectedDrive.companyPhone && (
                    <div>
                      <span className="text-xs text-muted">Contact Phone: </span>
                      <span className="text-xs font-mono">{selectedDrive.companyPhone}</span>
                    </div>
                  )}
                  {selectedDrive.approvedAt && (
                    <div style={{ gridColumn: 'span 2', paddingTop: 6, borderTop: '1px dashed var(--border-subtle)', marginTop: 4 }}>
                      <span className="text-xs text-muted">Institutional Approval Stamp: </span>
                      <span className="text-xs font-mono text-success">
                        Approved on {new Date(selectedDrive.approvedAt).toLocaleDateString()} by Placement Administration
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Opportunity Specifications & Eligibility Criteria */}
              <div className="grid grid-2 gap-4 mb-4">
                <div style={{ background: 'var(--bg-surface-secondary, #fafafa)', padding: '10px 14px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                  <div className="text-xs text-muted font-semibold mb-1">MINIMUM CGPA REQUIRED</div>
                  <div className="font-semibold text-sm">
                    {selectedDrive.minCgpa !== undefined && selectedDrive.minCgpa > 0 ? `${selectedDrive.minCgpa} CGPA` : 'No CGPA Cutoff'}
                  </div>
                  <div className="text-xs text-muted mt-1">
                    Backlogs Policy: {selectedDrive.maxBacklogs === 0 ? 'Strictly 0 Active Backlogs' : `Max ${selectedDrive.maxBacklogs || 0} Allowed`}
                  </div>
                </div>
                <div style={{ background: 'var(--bg-surface-secondary, #fafafa)', padding: '10px 14px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                  <div className="text-xs text-muted font-semibold mb-1">HIRING CAPACITY & BATCH</div>
                  <div className="font-semibold text-sm">
                    {selectedDrive.openings || 1} {selectedDrive.openings === 1 ? 'Open Position' : 'Open Positions'}
                  </div>
                  <div className="text-xs text-muted mt-1">
                    Graduation Eligibility: {selectedDrive.graduationYear || '2025–2026 Batch'}
                  </div>
                </div>
              </div>

              {/* Eligible Branches */}
              <div className="mb-4">
                <div className="text-xs text-muted mb-1 font-semibold uppercase tracking-wider">ELIGIBLE ACADEMIC DEPARTMENTS</div>
                <div className="flex" style={{ flexWrap: 'wrap', gap: '0.4rem' }}>
                  {selectedDrive.branches && selectedDrive.branches.length > 0 ? (
                    selectedDrive.branches.map(b => (
                      <span key={b} className="badge badge-neutral" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>{b}</span>
                    ))
                  ) : (
                    <span className="text-xs text-muted italic">Open to all university academic streams and engineering departments.</span>
                  )}
                </div>
              </div>

              {/* Required Skills */}
              <div className="mb-4">
                <div className="text-xs text-muted mb-1 font-semibold uppercase tracking-wider">REQUIRED SKILLS & COMPETENCIES</div>
                <div className="flex" style={{ flexWrap: 'wrap', gap: '0.4rem' }}>
                  {selectedDrive.skills && selectedDrive.skills.length > 0 ? (
                    selectedDrive.skills.map(s => (
                      <span key={s} className="badge badge-brand" style={{ background: 'rgba(0,150,255,0.08)', fontSize: '0.8rem', padding: '4px 10px' }}>{s}</span>
                    ))
                  ) : (
                    <span className="text-xs text-muted italic">Core domain fundamentals, technical aptitude, and problem solving.</span>
                  )}
                </div>
              </div>

              {/* Responsibilities */}
              {selectedDrive.responsibilities && selectedDrive.responsibilities.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs text-muted mb-1 font-semibold uppercase tracking-wider">KEY RESPONSIBILITIES</div>
                  <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.85rem', lineHeight: 1.5 }}>
                    {selectedDrive.responsibilities.map((r, idx) => (
                      <li key={idx} style={{ marginBottom: 4 }}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Role Description */}
              <div className="mb-4">
                <div className="text-xs text-muted mb-1 font-semibold uppercase tracking-wider">JOB DESCRIPTION & OVERVIEW</div>
                <div className="p-3" style={{ background: 'var(--bg-surface-secondary, #fafafa)', borderRadius: 6, border: '1px solid var(--border-subtle)', whiteSpace: 'pre-wrap', maxHeight: 180, overflowY: 'auto', fontSize: '0.875rem', lineHeight: 1.5 }}>
                  {selectedDrive.description || 'No detailed description provided by recruiter.'}
                </div>
              </div>
            </div>
            <div className="modal-footer flex-between">
              <div>
                {(selectedDrive.approvalStatus || selectedDrive.approval_status) === 'pending' ? (
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleApprove(selectedDrive)}
                      disabled={processingId === (selectedDrive.id || selectedDrive._id)}
                      style={{ background: '#10B981', borderColor: '#10B981' }}
                    >
                      <Icon name="check" size={16} /> Approve & Publish to Students
                    </button>
                    <button
                      className="btn btn-outline text-danger"
                      onClick={() => openRejectModal(selectedDrive)}
                      disabled={processingId === (selectedDrive.id || selectedDrive._id)}
                    >
                      <Icon name="x" size={16} /> Reject with Reason
                    </button>
                  </div>
                ) : (
                  <div>
                    {((selectedDrive.approvalStatus || selectedDrive.approval_status) === 'approved') && (
                      <span className="badge badge-success" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                        <Icon name="check" size={14} style={{ marginRight: 6 }} /> Approved & Live for Students
                      </span>
                    )}
                    {((selectedDrive.approvalStatus || selectedDrive.approval_status) === 'rejected') && (
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <span className="badge badge-danger" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                          Rejected Opportunity
                        </span>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleApprove(selectedDrive)}
                          disabled={processingId === (selectedDrive.id || selectedDrive._id)}
                        >
                          Re-Approve Opportunity
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button className="btn btn-outline" onClick={() => setSelectedDrive(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal Dialog */}
      {rejectModalDrive && (
        <div
          className="modal-backdrop open"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(6, 19, 37, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1060,
            padding: 'var(--space-4)'
          }}
          onClick={() => setRejectModalDrive(null)}
        >
          <div
            className="modal modal-dialog"
            style={{
              maxWidth: 520,
              width: '100%',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-subtle)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="h3" style={{ margin: 0 }}>Reject Job Opportunity</h3>
              <button className="btn-close" onClick={() => setRejectModalDrive(null)}>
                <Icon name="x" size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p className="text-muted text-sm mb-4">
                Please specify the reason for rejecting <strong>"{rejectModalDrive.title}"</strong> by <strong>{rejectModalDrive.companyName}</strong>. The recruiter will see this reason on their dashboard and can make corrections before resubmitting.
              </p>

              <div className="mb-3">
                <label className="form-label text-xs font-semibold">REJECTION REASON</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Provide explicit feedback for the corporate recruiter..."
                  style={{ width: '100%' }}
                />
              </div>

              <div className="mb-2">
                <span className="text-xs text-muted">Quick reason templates:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                  <button
                    type="button"
                    className="badge badge-neutral"
                    style={{ cursor: 'pointer', border: '1px solid var(--border-subtle)', background: 'transparent' }}
                    onClick={() => setRejectReason('Compensation (CTC) or stipend details lack mandatory breakdown.')}
                  >
                    CTC Unclear
                  </button>
                  <button
                    type="button"
                    className="badge badge-neutral"
                    style={{ cursor: 'pointer', border: '1px solid var(--border-subtle)', background: 'transparent' }}
                    onClick={() => setRejectReason('Eligibility criteria (CGPA / backlogs / branches) do not align with college placement policy.')}
                  >
                    Policy Mismatch
                  </button>
                  <button
                    type="button"
                    className="badge badge-neutral"
                    style={{ cursor: 'pointer', border: '1px solid var(--border-subtle)', background: 'transparent' }}
                    onClick={() => setRejectReason('Job description is insufficient or contains ambiguous role responsibilities.')}
                  >
                    Description Insufficient
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer flex-between">
              <button className="btn btn-outline" onClick={() => setRejectModalDrive(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ background: 'var(--danger-500)', borderColor: 'var(--danger-500)' }}
                onClick={handleConfirmReject}
                disabled={processingId === (rejectModalDrive.id || rejectModalDrive._id) || !rejectReason.trim()}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
