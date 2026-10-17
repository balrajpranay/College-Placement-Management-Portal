import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../../components/Icon';
import { getAdminDashboardApi } from '../../services/api';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    stats: {
      totalStudents: 0,
      totalCompanies: 0,
      activeDrives: 0,
      totalApplications: 0,
      placedStudents: 0,
      placementRate: '0%',
      avgPackage: '0.00',
      highestPackage: '0.00',
      pendingCompanies: 0,
      recentDrives: []
    }
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboardApi();
      if (res && res.data) {
        setData(res.data);
      }
      setError(null);
    } catch (err) {
      console.warn('Using default admin stats on error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const stats = data?.stats || {};

  return (
    <div className="admin-dashboard-page">
      {/* Top Header */}
      <div className="flex-between mb-8" style={{ flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-1)' }}>
            Placement Cell Executive Overview
          </h1>
          <p className="text-muted" style={{ margin: 0 }}>
            Real-time season statistics, institutional hiring pipeline health, and departmental outcomes.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {Number(stats.pendingDrives || 0) > 0 && (
            <NavLink
              to="/admin/drives?approvalStatus=pending"
              className="btn btn-warning"
              style={{
                background: 'var(--warning-50, #FFFBEB)',
                color: 'var(--warning-700, #B45309)',
                borderColor: 'var(--warning-200, #FDE68A)'
              }}
            >
              <Icon name="briefcase" size={16} />{' '}
              {stats.pendingDrives} {stats.pendingDrives === 1 ? 'Job Post' : 'Job Posts'} Pending Approval
            </NavLink>
          )}
          {Number(stats.pendingCompanies || 0) > 0 && (
            <NavLink
              to="/admin/recruiters"
              className="btn btn-warning"
              style={{
                background: 'var(--warning-50, #FFFBEB)',
                color: 'var(--warning-700, #B45309)',
                borderColor: 'var(--warning-200, #FDE68A)'
              }}
            >
              <Icon name="alert" size={16} />{' '}
              {stats.pendingCompanies} {stats.pendingCompanies === 1 ? 'Company' : 'Companies'} Awaiting Verification
            </NavLink>
          )}
        </div>
      </div>

      {/* Primary Key Metric Cards */}
      <div className="stats-grid mb-6">
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon brand">
              <Icon name="graduation" size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.totalStudents ?? 0}</div>
          <div className="stat-label">Enrolled Candidates</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon accent">
              <Icon name="building" size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.totalCompanies ?? 0}</div>
          <div className="stat-label">Verified Recruiters</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon warning">
              <Icon name="briefcase" size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.activeDrives ?? 0}</div>
          <div className="stat-label">Active Campus Drives</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon success">
              <Icon name="clipboard" size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.totalApplications ?? 0}</div>
          <div className="stat-label">Total Applications</div>
        </div>
      </div>

      {/* Secondary Outcome Metrics */}
      <div className="stats-grid mb-8">
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon success">
              <Icon name="award" size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.placedStudents ?? 0}</div>
          <div className="stat-label">Unique Students Placed</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon brand">
              <Icon name="trending-up" size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.placementRate || '0%'}</div>
          <div className="stat-label">Placement Conversion Rate</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon accent">
              <Icon name="dollar" size={20} />
            </div>
          </div>
          <div className="stat-value">₹{stats.avgPackage ?? '0.00'}L</div>
          <div className="stat-label">Average Annual CTC</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon warning">
              <Icon name="award" size={20} />
            </div>
          </div>
          <div className="stat-value">₹{stats.highestPackage ?? '0.00'}L</div>
          <div className="stat-label">Highest Package Offered</div>
        </div>
      </div>

      {/* Recent Placement Drives Overview */}
      <div className="card mb-8">
        <div className="flex-between mb-4" style={{ alignItems: 'center' }}>
          <div>
            <h3 className="h3" style={{ margin: '0 0 var(--space-1)' }}>Active Campus Drives</h3>
            <p className="text-muted text-sm" style={{ margin: 0 }}>
              Live hiring opportunities managed across partner organizations.
            </p>
          </div>
          <NavLink to="/admin/drives" className="btn btn-outline btn-sm">
            <span>View All Drives</span> <Icon name="chevron-right" size={14} />
          </NavLink>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Drive / Role</th>
                <th>Corporate Partner</th>
                <th>CTC (LPA)</th>
                <th>Location</th>
                <th>Applicants</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentDrives && stats.recentDrives.length > 0 ? (
                stats.recentDrives.map((drive) => (
                  <tr key={drive.id}>
                    <td className="font-semibold">{drive.title}</td>
                    <td>
                      <span className="badge badge-brand" style={{ fontWeight: 500 }}>
                        {drive.companyName}
                      </span>
                    </td>
                    <td className="font-medium text-brand">₹{drive.ctc} LPA</td>
                    <td className="text-muted">{drive.location}</td>
                    <td>
                      <span className="badge badge-neutral">
                        {drive.applicantsCount || drive.applicantCount || 0} Applied
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-success">
                        {drive.status === 'active' ? 'Active' : drive.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-muted">
                    No campus placement drives created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
