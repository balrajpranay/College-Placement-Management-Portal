import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import { getStudentNotificationsApi } from '../../services/api';

export default function StudentNotifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadNotifs = async () => {
      try {
        setLoading(true);
        const res = await getStudentNotificationsApi();
        setItems(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load notifications.');
      } finally {
        setLoading(false);
      }
    };
    loadNotifs();
  }, []);

  return (
    <div className="student-notifications-wrapper">
      <div className="mb-8" style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="h2" style={{ margin: '0 0 var(--space-1)', fontSize: '1.85rem', fontWeight: 800 }}>Candidate Notifications</h1>
        <p className="text-muted" style={{ margin: 0 }}>Placement announcements, drive updates, and interview notifications.</p>
      </div>

      {error && (
        <div className="alert-box alert-danger-box">
          <div className="alert-box-icon"><Icon name="alert-circle" size={18} /></div>
          <div className="alert-box-text">{error}</div>
        </div>
      )}

      <div className="card card-flush" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="text-center" style={{ padding: '60px 0' }}>Loading notifications...</div>
        ) : items.length > 0 ? (
          items.map((n) => (
            <div key={n.id} style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div className="stat-icon brand" style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 8, background: 'var(--brand-navy-50)', color: 'var(--brand-navy-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="bell" size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="text-sm font-medium" style={{ lineHeight: 1.5, color: 'var(--text-main)' }}>{n.message}</div>
                <div className="text-xs text-faint mt-1" style={{ color: 'var(--text-faint)', marginTop: 4 }}>{n.created_at}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state" style={{ padding: 40, textAlign: 'center' }}>
            <div className="empty-icon" style={{ margin: '0 auto 12px' }}><Icon name="bell" size={32} /></div>
            <h4>All caught up</h4>
            <p className="text-muted text-sm">You have no unread notifications at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
