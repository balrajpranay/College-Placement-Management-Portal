import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import { getAdminRecruitersApi, getAdminRecruiterDetailApi, approveRecruiterApi, rejectRecruiterApi } from '../../services/api';

export default function AdminRecruiters() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    loadCompanies();
  }, [search, statusFilter]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedCompany(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.q = search.trim();
      if (statusFilter === 'Pending') params.status = 'pending';
      if (statusFilter === 'Approved') params.status = 'approved';
      const res = await getAdminRecruitersApi(params);
      if (res && res.data) {
        setCompanies(res.data);
      }
    } catch (err) {
      console.error('Failed to load recruiters:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setActionLoading(true);
      const res = await approveRecruiterApi(id);
      setMsg({ type: 'success', text: res.message || 'Corporate partner approved.' });
      loadCompanies();
      if (selectedCompany && (selectedCompany.id === id || selectedCompany._id === id)) {
        setSelectedCompany(prev => ({ ...prev, approved: true }));
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Action failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(true);
      const res = await rejectRecruiterApi(id);
      setMsg({ type: 'info', text: res.message || 'Corporate partner verification revoked.' });
      loadCompanies();
      if (selectedCompany && (selectedCompany.id === id || selectedCompany._id === id)) {
        setSelectedCompany(prev => ({ ...prev, approved: false }));
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Action failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDetail = async (idOrCompany) => {
    const compObj = typeof idOrCompany === 'object' && idOrCompany !== null
      ? idOrCompany
      : companies.find(c => String(c.id || c._id) === String(idOrCompany));
    const id = compObj ? (compObj.id || compObj._id) : idOrCompany;

    if (compObj) {
      setSelectedCompany(compObj);
    }

    if (!id) return;

    try {
      const res = await getAdminRecruiterDetailApi(id);
      if (res && res.data) {
        setSelectedCompany(prev => ({ ...(prev || {}), ...res.data }));
      }
    } catch (err) {
      console.error('Failed to load company details:', err);
    }
  };

  return (
    <div className="admin-recruiters-page">
      <div className="flex-between mb-6" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-1)' }}>Corporate Partners & Recruiters</h1>
          <p className="text-muted" style={{ margin: 0 }}>
            Manage verified industry partners, employer registrations, and placement access.
          </p>
        </div>
        <div className="badge badge-brand" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
          {companies.length} Partners Registered
        </div>
      </div>

      {msg && (
        <div className={`alert alert-${msg.type} mb-4 flex-between`} style={{ alignItems: 'center' }}>
          <span>{msg.text}</span>
          <button className="btn-close" onClick={() => setMsg(null)}><Icon name="x" size={14} /></button>
        </div>
      )}

      <div className="card mb-6" style={{ padding: '1rem 1.25rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div className="topbar-search" style={{ flex: 1, minWidth: 260, maxWidth: 400 }}>
            <input
              type="text"
              placeholder="Search by company, HR contact, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex-align-center" style={{ gap: '0.75rem' }}>
            <label className="text-xs font-semibold text-muted">VERIFICATION STATUS:</label>
            <select
              className="form-control"
              style={{ width: 'auto', minWidth: 160 }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Partners</option>
              <option value="Approved">Verified / Approved</option>
              <option value="Pending">Pending Verification</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted">Loading recruiter directory...</p>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="building" size={36} className="text-muted mb-2" />
            <p className="text-muted">No corporate partners found matching your search.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Industry</th>
                  <th>HR Contact</th>
                  <th>Location</th>
                  <th>Active Drives</th>
                  <th>Verification</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-xs text-muted">{c.email}</div>
                    </td>
                    <td>{c.industry}</td>
                    <td>
                      <div className="font-medium">{c.hrContact || 'Talent Acquisition'}</div>
                      <div className="text-xs text-muted">{c.phone}</div>
                    </td>
                    <td>{c.location}</td>
                    <td>
                      <span className="badge badge-neutral">{c.activeDrives || 0} Drives</span>
                    </td>
                    <td>
                      {c.approved ? (
                        <span className="badge badge-success">
                          <Icon name="check" size={12} /> Verified
                        </span>
                      ) : (
                        <span className="badge badge-warning" style={{ background: 'var(--warning-50)', color: 'var(--warning-700)' }}>
                          <Icon name="alert" size={12} /> Pending Review
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="flex-center" style={{ justifyContent: 'flex-end', gap: '0.5rem' }}>
                        {!c.approved && (
                          <button
                            className="btn btn-success btn-sm"
                            disabled={actionLoading}
                            onClick={() => handleApprove(c.id)}
                            title="Approve Recruiter"
                          >
                            <Icon name="check" size={14} /> Approve
                          </button>
                        )}
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleViewDetail(c)}
                        >
                          <Icon name="building" size={14} /> Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Corporate Partner Profile Modal - Matching Student Details Modal Layout */}
      {selectedCompany && (
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
          onClick={() => setSelectedCompany(null)}
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
              <h3 className="h3" style={{ margin: 0 }}>Corporate Partner Profile Overview</h3>
              <button className="btn-close" onClick={() => setSelectedCompany(null)}>
                <Icon name="x" size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ overflowY: 'auto', flex: 1 }}>
              {/* Recruiter Top Hero Bar */}
              <div className="mb-4">
                <div className="flex-between" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div className="flex-align-center" style={{ gap: '0.85rem' }}>
                    <div
                      className="avatar"
                      style={{
                        width: 48,
                        height: 48,
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #0096FF, #0056b3)',
                        color: '#FFF',
                        boxShadow: '0 2px 8px rgba(0, 150, 255, 0.25)',
                        flexShrink: 0
                      }}
                    >
                      {(selectedCompany.name?.[0] || 'C').toUpperCase()}
                    </div>
                    <div>
                      <h4 className="h4" style={{ margin: '0 0 0.35rem', fontSize: '1.25rem', fontWeight: 700 }}>
                        {selectedCompany.name}
                      </h4>
                      <div className="flex-align-center" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span className="badge badge-brand font-mono" style={{ fontSize: '0.75rem' }}>
                          {selectedCompany.industry || 'Technology'}
                        </span>
                        <span className="badge badge-neutral">
                          {selectedCompany.location || 'Bengaluru'}
                        </span>
                        <span className="badge badge-neutral">
                          {selectedCompany.activeDrives !== undefined ? `${selectedCompany.activeDrives} Active Drives` : (selectedCompany.drives ? `${selectedCompany.drives.length} Managed Drives` : 'Corporate Recruiter')}
                        </span>
                        <span className={`badge ${selectedCompany.approved ? 'badge-success' : 'badge-warning'}`}>
                          {selectedCompany.approved ? 'Verified Partner' : 'Pending Verification'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="text-xs text-muted font-semibold uppercase tracking-wider">VERIFICATION STATUS</div>
                    <div className={`font-bold ${selectedCompany.approved ? 'text-success' : 'text-warning'}`} style={{ fontSize: '1.15rem' }}>
                      {selectedCompany.approved ? 'Verified Partner' : 'Pending Review'}
                    </div>
                    <div className="text-xs text-muted">
                      {selectedCompany.approved ? 'Authorized for hiring & selection' : 'Posting & selection restricted'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Corporate Identity & Contact Audit Card */}
              <div style={{ background: 'var(--bg-surface-secondary, rgba(0,0,0,0.02))', padding: '14px 16px', borderRadius: 8, marginBottom: 16, border: '1px solid var(--border-subtle)' }}>
                <div className="flex-between mb-2" style={{ alignItems: 'center' }}>
                  <div className="text-xs font-semibold text-muted uppercase tracking-wider">
                    CORPORATE IDENTITY & CONTACT AUDIT
                  </div>
                  <div>
                    {selectedCompany.approved ? (
                      <span className="badge badge-success" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                        <Icon name="check" size={12} style={{ marginRight: 4 }} /> Verified Corporate Partner
                      </span>
                    ) : (
                      <span className="badge badge-warning" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                        <Icon name="alert-circle" size={12} style={{ marginRight: 4 }} /> Pending Institutional Verification
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-2 gap-3" style={{ fontSize: '0.85rem' }}>
                  <div>
                    <span className="text-xs text-muted">Organization Name: </span>
                    <span className="font-semibold">{selectedCompany.name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted">Industry Sector: </span>
                    <span className="font-medium">{selectedCompany.industry || 'Technology & Services'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted">Primary HR Contact: </span>
                    <span className="font-semibold">{selectedCompany.hrContact || selectedCompany.hr_contact || 'Talent Acquisition Lead'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted">Official Corporate Email: </span>
                    <span className="font-mono text-xs">{selectedCompany.email}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted">Contact Phone: </span>
                    <span className="font-mono text-xs">{selectedCompany.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted">Corporate Location / City: </span>
                    <span className="font-medium">{selectedCompany.location || 'Bengaluru, India'}</span>
                  </div>
                  {selectedCompany.website && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <span className="text-xs text-muted">Official Website: </span>
                      <a
                        href={selectedCompany.website.startsWith('http') ? selectedCompany.website : `https://${selectedCompany.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand font-mono"
                      >
                        {selectedCompany.website} ↗
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Engagement & HR Specifications Cards */}
              <div className="grid grid-2 gap-4 mb-4">
                <div style={{ background: 'var(--bg-surface-secondary, #fafafa)', padding: '10px 14px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                  <div className="text-xs text-muted font-semibold mb-1 uppercase tracking-wider">TALENT ACQUISITION LEAD</div>
                  <div className="font-semibold text-sm">
                    {selectedCompany.hrContact || selectedCompany.hr_contact || 'Talent Acquisition Lead'}
                  </div>
                  <div className="text-xs text-muted mt-1">
                    Designation: {selectedCompany.hrPosition || selectedCompany.hr_position || 'Hiring Lead'}
                  </div>
                </div>
                <div style={{ background: 'var(--bg-surface-secondary, #fafafa)', padding: '10px 14px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                  <div className="text-xs text-muted font-semibold mb-1 uppercase tracking-wider">CAMPUS HIRING ENGAGEMENT</div>
                  <div className="font-semibold text-sm">
                    {(selectedCompany.drives?.length ?? selectedCompany.activeDrives) || 0} {((selectedCompany.drives?.length ?? selectedCompany.activeDrives) === 1) ? 'Managed Placement Drive' : 'Managed Placement Drives'}
                  </div>
                  <div className="text-xs text-muted mt-1">
                    Corporate ID: <span className="font-mono">{selectedCompany.govId || selectedCompany.gov_id || selectedCompany.id || 'PARTNER-RECORD'}</span>
                  </div>
                </div>
              </div>

              {/* Organization Overview / Description */}
              <div className="mb-4">
                <div className="text-xs text-muted mb-1 font-semibold uppercase tracking-wider">ORGANIZATION OVERVIEW</div>
                <div className="p-3 text-sm" style={{ background: 'var(--bg-surface-secondary, #fafafa)', borderRadius: 6, border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {selectedCompany.description || 'Enterprise recruiting partner registered with the Campus Connect placement management system.'}
                </div>
              </div>

              {/* Managed Placement Drives Table */}
              <div className="mb-4">
                <div className="text-xs text-muted mb-2 font-semibold uppercase tracking-wider">MANAGED PLACEMENT DRIVES</div>
                {selectedCompany.drives && selectedCompany.drives.length > 0 ? (
                  <div className="table-responsive" style={{ border: '1px solid var(--border-subtle)', borderRadius: 6, overflow: 'hidden' }}>
                    <table className="table text-sm" style={{ margin: 0 }}>
                      <thead>
                        <tr>
                          <th>Drive / Role</th>
                          <th>Opportunity Type</th>
                          <th>Package (CTC)</th>
                          <th>Applicants</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCompany.drives.map(d => (
                          <tr key={d.id || d._id}>
                            <td className="font-semibold">{d.title}</td>
                            <td>
                              <span className="badge badge-brand" style={{ fontWeight: 500 }}>
                                {d.jobType || d.job_type || 'Full-Time'}
                              </span>
                            </td>
                            <td className="text-brand font-medium">
                              {d.ctc ? `₹${d.ctc} LPA` : '—'}
                            </td>
                            <td className="font-mono text-xs">
                              {d.applicantCount ?? d.applicant_count ?? 0} Applied
                            </td>
                            <td>
                              <span className={`badge ${
                                (d.approvalStatus || d.approval_status) === 'approved' ? 'badge-success' :
                                (d.approvalStatus || d.approval_status) === 'rejected' ? 'badge-danger' : 'badge-warning'
                              }`}>
                                {(d.approvalStatus || d.approval_status || d.status || 'Active')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-3 text-center text-muted text-xs" style={{ background: 'var(--bg-surface-secondary, #fafafa)', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                    No campus placement drives recorded for this corporate partner yet.
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer flex-between">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                {!selectedCompany.approved ? (
                  <button
                    className="btn btn-success"
                    disabled={actionLoading}
                    onClick={() => handleApprove(selectedCompany.id || selectedCompany._id)}
                  >
                    <Icon name="check" size={16} /> Approve & Verify Partner
                  </button>
                ) : (
                  <button
                    className="btn btn-outline text-danger"
                    disabled={actionLoading}
                    onClick={() => handleReject(selectedCompany.id || selectedCompany._id)}
                  >
                    <Icon name="x" size={16} /> Revoke Verification
                  </button>
                )}
                <span className="text-xs text-muted" style={{ marginLeft: 4 }}>
                  Partner ID: <span className="font-mono">{selectedCompany.id || selectedCompany._id}</span>
                </span>
              </div>
              <button className="btn btn-outline" onClick={() => setSelectedCompany(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
