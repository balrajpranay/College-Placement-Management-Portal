import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../../components/Icon';

export default function AdminPlaceholder({ title, stepNote }) {
  return (
    <div className="placeholder-module-view" style={{ maxWidth: 800, margin: '2rem auto', padding: '2rem' }}>
      <div className="card text-center" style={{ padding: '3rem 2rem' }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'var(--brand-50, #EBF5FF)',
          color: 'var(--brand-600, #0096FF)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <Icon name="shield" size={32} />
        </div>
        <h2 className="h2 mb-2">{title || 'Admin Sub-Module'}</h2>
        <p className="text-muted mb-4" style={{ maxWidth: 500, margin: '0 auto 1.5rem' }}>
          {stepNote || 'This administrative module is slated for migration in subsequent Step 8 increments.'}
        </p>
        <div className="flex-center" style={{ gap: '1rem' }}>
          <NavLink to="/admin/dashboard" className="btn btn-primary">
            <Icon name="home" size={16} /> Return to Dashboard
          </NavLink>
        </div>
      </div>
    </div>
  );
}
