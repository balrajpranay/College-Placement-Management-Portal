import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../../components/Icon';
import { getStudentNotificationsApi } from '../../services/api';

export default function StudentNotifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const loadNotifs = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getStudentNotificationsApi();
      setItems(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifs();
  }, [loadNotifs]);

  const unreadCount = items.filter(n => !n.is_read && !n.isRead).length;
  const displayedItems = filter === 'unread'
    ? items.filter(n => !n.is_read && !n.isRead)
    : items;

  return (
    <div className="student-notifications-wrapper" style={{ width: '100%', maxWidth: '100%', margin: 0 }}>
      <div className="flex-between mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-1)', fontSize: '1.85rem', fontWeight: 800 }}>
            Candidate Notifications
          </h1>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.925rem' }}>
            Placement announcements, drive updates, and interview schedule alerts.
          </p>
        </div>

        <button
          onClick={loadNotifs}
          disabled={loading}
          className="btn btn-outline btn-sm"
          title="Refresh notifications"
          style={{ width: 36, height: 36, padding: 0, borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="rotate-cw" size={16} />
        </button>
      </div>

      {error && (
        <div className="alert-box alert-danger-box mb-6" style={{ marginBottom: 20 }}>
          <div className="alert-box-icon"><Icon name="alert-circle" size={18} /></div>
          <div className="alert-box-text">{error}</div>
        </div>
      )}

      {/* Filter Tabs as free-flowing pills */}
      <div className="filter-bar mb-6" style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => setFilter('all')}
          className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderRadius: 9999, padding: '6px 16px', fontWeight: 600, fontSize: '0.825rem' }}
        >
          All ({items.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`btn btn-sm ${filter === 'unread' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderRadius: 9999, padding: '6px 16px', fontWeight: 600, fontSize: '0.825rem' }}
        >
          Unread ({unreadCount})
        </button>
      </div>

      <div className="card card-flush" style={{ padding: 0, overflow: 'hidden', width: '100%', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
        {loading ? (
          <div className="text-center" style={{ padding: '60px 0' }}>
            <div className="spinner mb-3" style={{ width: 34, height: 34, border: '3px solid var(--border-subtle)', borderTopColor: 'var(--accent-cyan-500)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }}></div>
            <p className="text-muted text-sm" style={{ margin: 0 }}>Loading verified notifications...</p>
          </div>
        ) : displayedItems.length > 0 ? (
          displayedItems.map((n) => {
            const isUnread = !n.is_read && !n.isRead;
            return (
              <div
                key={n.id}
                style={{
                  padding: '18px 24px',
                  borderBottom: '1px solid var(--border-subtle)',
                  borderLeft: isUnread ? '4px solid #0096FF' : '4px solid transparent',
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                  background: isUnread ? 'rgba(0, 150, 255, 0.06)' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                    borderRadius: 10,
                    background: isUnread ? 'rgba(0, 150, 255, 0.15)' : 'var(--bg-surface-alt)',
                    color: isUnread ? '#0096FF' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon name={n.type === 'interview' ? 'video' : n.type === 'drive' ? 'briefcase' : 'bell'} size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <div style={{ fontSize: '0.925rem', fontWeight: isUnread ? 700 : 500, lineHeight: 1.5, color: 'var(--text-main)' }}>
                      {n.message}
                    </div>
                    {isUnread && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: 9999,
                          background: '#0096FF',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          flexShrink: 0,
                          letterSpacing: '0.02em'
                        }}
                      >
                        New
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    {n.created_at}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div className="empty-icon" style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(0, 150, 255, 0.1)', color: 'var(--accent-cyan-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Icon name="bell" size={26} />
            </div>
            <h4 style={{ margin: '0 0 6px', fontWeight: 700, fontSize: '1.1rem' }}>All caught up</h4>
            <p className="text-muted text-sm" style={{ margin: 0 }}>
              {filter === 'unread' ? 'You have read all your notifications.' : 'You have no notifications at this time.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
