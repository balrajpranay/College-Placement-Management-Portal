import React, { useState, useEffect } from 'react';
import { checkServerHealth } from '../services/api';

export default function VerificationPage({ routeName = 'Root / Verification' }) {
  const [backendStatus, setBackendStatus] = useState('Checking...');

  useEffect(() => {
    checkServerHealth().then(res => {
      setBackendStatus(res.status === 'ok' ? 'Connected (200 OK)' : 'Standalone Ready');
    });
  }, []);

  return (
    <div className="verification-shell">
      <div className="verification-card">
        <div className="badge-pill">
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }}></span>
          React 18 + Vite Running
        </div>

        <h1 className="title">Campus Connect React Frontend</h1>
        <p className="subtitle">React frontend is running successfully.</p>

        <div className="status-grid">
          <div className="status-item">
            <div className="status-label">React Client Port</div>
            <div className="status-val">:5173 (Vite)</div>
          </div>
          <div className="status-item">
            <div className="status-label">Node/Express API</div>
            <div className="status-val">:5001 ({backendStatus})</div>
          </div>
          <div className="status-item">
            <div className="status-label">Flask Production</div>
            <div className="status-val">:5000 (Active)</div>
          </div>
        </div>

        <div style={{ textAlign: 'left', marginBottom: 8, fontSize: '0.85rem', fontWeight: 600 }}>
          Configured Route Hierarchy: <span style={{ color: '#0096FF' }}>{routeName}</span>
        </div>
        <div className="routes-preview">
          <div>[Public] / | /jobs | /ai | /about | /contact | /login | /register/*</div>
          <div>[Student] /student/dashboard | /student/profile | /student/drives | /student/applications | /student/interviews</div>
          <div>[Recruiter] /recruiter/dashboard | /recruiter/profile | /recruiter/drives | /recruiter/applicants | /recruiter/interviews</div>
          <div>[Admin] /admin/dashboard | /admin/students | /admin/companies | /admin/drives | /admin/reports</div>
        </div>

        <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
          Coexisting alongside the active Python/Flask app without disruption.
        </p>
      </div>
    </div>
  );
}
