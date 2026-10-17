import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import {
  getAdminDrivesApi,
  getAdminDriveDetailApi,
  approveAdminDriveApi,
  rejectAdminDriveApi
} from '../../services/api';

export default function AdminDrives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [approvalFilter, setApprovalFilter] = useState('All');
  const [selectedDrive, setSelectedDrive] = useState(null);

  // Approval / Rejection action states
  const [actionMsg, setActionMsg] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [rejectModalDrive, setRejectModalDrive] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    loadDrives();
  }, [search, jobTypeFilter, statusFilter, approvalFilter]);

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

  const handleApprove = async (drive) => {
    const driveId = drive.id || drive._id;
    if (!window.confirm(`Approve placement drive "${drive.title}" by ${drive.companyName}? It will become immediately visible to all eligible students.`)) {
      return;
    }

    try {
      setProcessingId(driveId);
      const res = await approveAdminDriveApi(driveId);
      setActionMsg({
        type: 'success',
        text: res.message || `Drive "${drive.title}" has been approved and published to students.`
      });
      if (selectedDrive && (selectedDrive.id === driveId || selectedDrive._id === driveId)) {
        setSelectedDrive(prev => ({
          ...prev,
          approvalStatus: 'approved',
          approval_status: 'approved',
          rejectionReason: ''
        }));
      }
      loadDrives();
    } catch (err) {
      console.error('Failed to approve drive:', err);
      setActionMsg({ type: 'danger', text: err.message || 'Failed to approve drive' });
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
        text: res.message || `Drive "${rejectModalDrive.title}" has been rejected. Notification sent to recruiter.`
      });
      if (selectedDrive && (selectedDrive.id === driveId || selectedDrive._id === driveId)) {
        setSelectedDrive(prev => ({
          ...prev,
          approvalStatus: 'rejected',
          approval_status: 'rejected',
          rejectionReason: rejectReason.trim()
        }));
      }
      setRejectModalDrive(null);
      setRejectReason('');
      loadDrives();
    } catch (err) {
      console.error('Failed to reject drive:', err);
      setActionMsg({ type: 'danger', text: err.message || 'Failed to reject drive' });
    } finally {
      setProcessingId(null);
    }
  };

  const pendingDrivesCount = drives.filter(d => (d.approvalStatus || d.approval_status) === 'pending').length;

  return (
    <div className="admin-drives-page">
      <div className="flex-between mb-6" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-1)' }}>Placement Drives Central</h1>
          <p className="text-muted" style={{ margin: 0 }}>
            Audit recruiter submissions, enforce institutional criteria, approve legitimate hiring opportunities, and monitor candidate pools.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {pendingDrivesCount > 0 && (
            <button
              onClick={() => setApprovalFilter('pending')}
              className="badge badge-warning"
              style={{
                fontSize: '0.875rem',
                padding: '0.5rem 1rem',
                background: 'var(--warning-50, #FFFBEB)',
                color: 'var(--warning-700, #B45309)',
                border: '1px solid var(--warning-200, #FDE68A)',
                cursor: 'pointer'
              }}
            >
              <Icon name="alert-circle" size={14} style={{ marginRight: 6 }} />
              {pendingDrivesCount} Pending Approval
            </button>
          )}
          <div className="badge badge-brand" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
            {drives.length} Drives Registered
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

      {/* Filter and Tab Section */}
      <div className="card mb-6" style={{ padding: '1rem 1.25rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div className="topbar-search" style={{ flex: 1, minWidth: 260, maxWidth: 360 }}>
            <input
              type="text"
              placeholder="Search title, corporate partner, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex-align-center" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
            <label className="text-xs font-semibold text-muted">APPROVAL STATUS:</label>
            <select
              className="form-control"
              style={{ width: 'auto', minWidth: 150 }}
              value={approvalFilter}
              onChange={(e) => setApprovalFilter(e.target.value)}
            >
              <option value="All">All Postings</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved & Live</option>
              <option value="rejected">Rejected</option>
            </select>

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
                        <div className="text-xs text-muted">{d.jobType} · Min CGPA: {d.minCgpa}</div>
                      </td>
                      <td>
                        <span className="badge badge-brand">{d.companyName}</span>
                      </td>
                      <td className="font-bold text-brand">₹{d.ctc} LPA</td>
                      <td>{d.location}</td>
                      <td className="text-sm font-mono">{d.deadline}</td>
                      <td>
                        <span className="badge badge-neutral">{d.applicantCount || 0} Applied</span>
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
                          <span className="badge badge-danger font-semibold">
                            Rejected
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                          {isPending && (
                            <>
                              <button
                                className="btn btn-sm btn-primary"
                                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                                disabled={processingId === (d.id || d._id)}
                                onClick={() => handleApprove(d)}
                                title="Approve this drive"
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-sm btn-outline text-danger"
                                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                                disabled={processingId === (d.id || d._id)}
                                onClick={() => openRejectModal(d)}
                                title="Reject this drive"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                            onClick={() => handleViewDetail(d.id || d._id)}
                          >
                            <Icon name="briefcase" size={13} /> Review
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
      </div>

      {/* Detailed Drive Modal */}
      {selectedDrive && (
        <div className="modal-backdrop" onClick={() => setSelectedDrive(null)}>
          <div className="modal-dialog" style={{ maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="h3" style={{ margin: 0 }}>Placement Opportunity Specifications</h3>
              <button className="btn-close" onClick={() => setSelectedDrive(null)}>
                <Icon name="x" size={18} />
              </button>
            </div>
            <div className="modal-body">
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
                    Posting Rejected
                  </div>
                  <div className="text-xs text-muted">
                    Reason: <strong>{selectedDrive.rejectionReason || selectedDrive.rejection_reason || 'Does not meet criteria'}</strong>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h4 className="h4" style={{ margin: '0 0 0.25rem' }}>{selectedDrive.title}</h4>
                <div className="flex-align-center" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-brand">{selectedDrive.companyName}</span>
                  <span className="text-sm text-muted">{selectedDrive.location}</span>
                  {selectedDrive.companyEmail && (
                    <span className="text-xs text-muted">HR Email: {selectedDrive.companyEmail}</span>
                  )}
                  {selectedDrive.hrContact && (
                    <span className="text-xs text-muted">HR Contact: {selectedDrive.hrContact}</span>
                  )}
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
                <div className="text-xs text-muted mb-1">REQUIRED SKILLS</div>
                <div className="flex" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(selectedDrive.skills && selectedDrive.skills.length > 0 ? selectedDrive.skills : ['Problem Solving', 'Data Structures']).map(s => (
                    <span key={s} className="badge badge-brand" style={{ background: 'rgba(0,150,255,0.08)' }}>{s}</span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-muted mb-1">ROLE DESCRIPTION</div>
                <p className="text-sm text-muted" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {selectedDrive.description}
                </p>
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
            <div className="modal-footer flex-between">
              <div>
                {(selectedDrive.approvalStatus || selectedDrive.approval_status) === 'pending' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleApprove(selectedDrive)}
                      disabled={processingId === (selectedDrive.id || selectedDrive._id)}
                    >
                      <Icon name="check" size={16} /> Approve & Publish
                    </button>
                    <button
                      className="btn btn-outline text-danger"
                      onClick={() => openRejectModal(selectedDrive)}
                      disabled={processingId === (selectedDrive.id || selectedDrive._id)}
                    >
                      <Icon name="x" size={16} /> Reject Drive
                    </button>
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
        <div className="modal-backdrop" onClick={() => setRejectModalDrive(null)}>
          <div className="modal-dialog" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
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
