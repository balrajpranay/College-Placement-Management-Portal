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
      if (selectedCompany && selectedCompany.id === id) {
        setSelectedCompany({ ...selectedCompany, approved: true });
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
      setMsg({ type: 'info', text: res.message || 'Corporate partner rejected.' });
      loadCompanies();
      if (selectedCompany && selectedCompany.id === id) {
        setSelectedCompany({ ...selectedCompany, approved: false });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Action failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const res = await getAdminRecruiterDetailApi(id);
      if (res && res.data) {
        setSelectedCompany(res.data);
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
                          onClick={() => handleViewDetail(c.id)}
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

      {selectedCompany && (
        <div className="modal-backdrop" onClick={() => setSelectedCompany(null)}>
          <div className="modal-dialog" style={{ maxWidth: 650 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="h3" style={{ margin: 0 }}>Corporate Partner Profile</h3>
              <button className="btn-close" onClick={() => setSelectedCompany(null)}>
                <Icon name="x" size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="flex-align-center mb-4" style={{ gap: '1rem' }}>
                <div
                  className="avatar"
                  style={{
                    width: 48,
                    height: 48,
                    fontSize: '1.25rem',
                    background: 'linear-gradient(135deg, #0B2545, #0096FF)',
                    color: '#FFF'
                  }}
                >
                  {(selectedCompany.name[0] || 'C').toUpperCase()}
                </div>
                <div>
                  <h4 className="h4" style={{ margin: 0 }}>{selectedCompany.name}</h4>
                  <p className="text-muted text-sm" style={{ margin: 0 }}>
                    {selectedCompany.industry} · {selectedCompany.location}
                  </p>
                </div>
              </div>

              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                {selectedCompany.description || 'Enterprise recruiting partner.'}
              </p>

              <div className="grid grid-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-muted">PRIMARY HR CONTACT</div>
                  <div className="font-medium">{selectedCompany.hrContact}</div>
                </div>
                <div>
                  <div className="text-xs text-muted">OFFICIAL EMAIL</div>
                  <div className="font-medium">{selectedCompany.email}</div>
                </div>
                <div>
                  <div className="text-xs text-muted">PHONE NUMBER</div>
                  <div className="font-medium">{selectedCompany.phone || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted">WEBSITE</div>
                  <div className="font-medium">
                    <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="text-brand">
                      {selectedCompany.website || 'Visit Portal'}
                    </a>
                  </div>
                </div>
              </div>

              {selectedCompany.drives && selectedCompany.drives.length > 0 && (
                <div>
                  <div className="text-xs text-muted mb-2">MANAGED PLACEMENT DRIVES</div>
                  <div className="table-responsive">
                    <table className="table text-sm">
                      <thead>
                        <tr>
                          <th>Drive Title</th>
                          <th>CTC (LPA)</th>
                          <th>Applicants</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCompany.drives.map(d => (
                          <tr key={d.id}>
                            <td className="font-medium">{d.title}</td>
                            <td className="text-brand font-medium">₹{d.ctc} LPA</td>
                            <td>{d.applicantCount} Applied</td>
                            <td>
                              <span className="badge badge-success">{d.status}</span>
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
                {!selectedCompany.approved ? (
                  <button
                    className="btn btn-success"
                    disabled={actionLoading}
                    onClick={() => handleApprove(selectedCompany.id)}
                  >
                    <Icon name="check" size={16} /> Approve Account
                  </button>
                ) : (
                  <button
                    className="btn btn-outline"
                    disabled={actionLoading}
                    onClick={() => handleReject(selectedCompany.id)}
                  >
                    Revoke Verification
                  </button>
                )}
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
