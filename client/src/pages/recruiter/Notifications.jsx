import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { 
  getRecruiterNotificationsApi, 
  markRecruiterNotificationReadApi, 
  markAllRecruiterNotificationsReadApi 
} from '../../services/api';

export default function RecruiterNotifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getRecruiterNotificationsApi();
      if (res && res.success) {
        setItems(res.data || []);
      } else {
        setError(res.message || 'Failed to load recruiter notifications.');
      }
    } catch (err) {
      console.error('[Recruiter Notifications Error]:', err);
      setError(err.message || 'An error occurred while loading notifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await markRecruiterNotificationReadApi(id);
      setItems(prev => prev.map(n => String(n.id) === String(id) ? { ...n, is_read: true, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setActionLoading(true);
      await markAllRecruiterNotificationsReadApi();
      setItems(prev => prev.map(n => ({ ...n, is_read: true, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const unreadCount = items.filter(n => !n.is_read && !n.isRead).length;
  const displayedItems = filter === 'unread' 
    ? items.filter(n => !n.is_read && !n.isRead)
    : items;

  const getNotifIcon = (message = '') => {
    const m = message.toLowerCase();
    if (m.includes('applied') || m.includes('applicant')) return 'user';
    if (m.includes('drive') || m.includes('hiring')) return 'briefcase';
    if (m.includes('interview')) return 'video';
    if (m.includes('verified') || m.includes('approved')) return 'check-circle';
    return 'bell';
  };

  return (
    <div className="recruiter-notifications-page" style={{ width: '100%', maxWidth: '100%', margin: 0 }}>
      {/* Header Section */}
      <div className="flex-between mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-1)', fontSize: '1.85rem', fontWeight: 800 }}>
            Recruiter Notifications
          </h1>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.925rem' }}>
            Drive submissions, applicant alerts, and placement office notices.
          </p>
        </div>

        <div className="flex-align-center" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={actionLoading}
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 9999, padding: '7px 16px', fontWeight: 600 }}
            >
              <Icon name="check" size={14} />
              <span>Mark All as Read ({unreadCount})</span>
            </button>
          )}

          <button
            onClick={loadNotifications}
            disabled={loading}
            className="btn btn-outline btn-sm"
            title="Refresh notifications"
            style={{ width: 36, height: 36, padding: 0, borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="rotate-cw" size={16} />
          </button>
        </div>
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

      {/* Notifications Card Container - Full Width */}
      <div className="card card-flush" style={{ padding: 0, overflow: 'hidden', width: '100%', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
        {loading ? (
          <div className="text-center" style={{ padding: '60px 0' }}>
            <div className="spinner mb-3" style={{ width: 34, height: 34, border: '3px solid var(--border-subtle)', borderTopColor: 'var(--accent-cyan-500)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }}></div>
            <p className="text-muted text-sm" style={{ margin: 0 }}>Loading notifications...</p>
          </div>
        ) : displayedItems.length > 0 ? (
          displayedItems.map((n) => {
            const isUnread = !n.is_read && !n.isRead;
            const iconName = getNotifIcon(n.message);

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
                {/* Icon Circle */}
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
                  <Icon name={iconName} size={18} />
                </div>

                {/* Content Block */}
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

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6 }}>
                    <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                      {n.created_at}
                    </span>

                    {n.link && (
                      <Link
                        to={n.link}
                        className="text-brand font-semibold"
                        style={{ fontSize: '0.775rem', color: 'var(--accent-cyan-600)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        View Details &rarr;
                      </Link>
                    )}
                  </div>
                </div>

                {/* Mark As Read Button */}
                {isUnread && (
                  <button
                    onClick={(e) => handleMarkRead(n.id, e)}
                    className="btn btn-ghost btn-sm"
                    title="Mark as read"
                    style={{ padding: '6px 10px', fontSize: '0.75rem', color: 'var(--text-muted)', borderRadius: 8 }}
                  >
                    <Icon name="check" size={16} />
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="empty-state" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div className="empty-icon" style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(0, 150, 255, 0.1)', color: 'var(--accent-cyan-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Icon name="bell" size={26} />
            </div>
            <h4 style={{ margin: '0 0 6px', fontWeight: 700, fontSize: '1.1rem' }}>No notifications found</h4>
            <p className="text-muted text-sm" style={{ margin: 0 }}>
              {filter === 'unread' ? 'You have caught up with all your unread notifications.' : 'No notification records available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
