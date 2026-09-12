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
    <div className="recruiter-notifications-page" style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* Header Section matching Flask templates/recruiter/notifications.html */}
      <div className="flex-between mb-6" style={{ flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-1)', fontSize: '1.85rem', fontWeight: 800 }}>
            Recruiter Notifications
          </h1>
          <p className="text-muted" style={{ margin: 0 }}>
            Drive submissions, applicant alerts, and placement office notices.
          </p>
        </div>

        <div className="flex-align-center" style={{ gap: '0.75rem' }}>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={actionLoading}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
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
            style={{ padding: '6px 10px' }}
          >
            <Icon name="rotate-cw" size={14} />
          </button>
        </div>
      </div>

      {error && (
        <div className="alert-box alert-danger-box mb-4" style={{ marginBottom: '1.5rem' }}>
          <div className="alert-box-icon"><Icon name="alert-circle" size={18} /></div>
          <div className="alert-box-text">{error}</div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="filter-bar mb-4" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setFilter('all')}
          className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderRadius: 20 }}
        >
          All ({items.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`btn btn-sm ${filter === 'unread' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderRadius: 20 }}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications Card Container */}
      <div className="card card-flush" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="text-center" style={{ padding: '60px 0' }}>
            <div className="spinner mb-3" style={{ width: 32, height: 32, border: '3px solid var(--border-subtle)', borderTopColor: 'var(--brand-primary, #0096FF)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
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
                  padding: '16px 24px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                  background: isUnread ? 'var(--brand-50, rgba(0, 150, 255, 0.04))' : 'transparent',
                  transition: 'background 0.2s ease'
                }}
              >
                {/* Icon Circle */}
                <div
                  className="stat-icon brand"
                  style={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    borderRadius: 8,
                    background: isUnread ? 'var(--brand-navy-100, #E0F2FE)' : 'var(--brand-navy-50, #F0F9FF)',
                    color: isUnread ? 'var(--brand-navy-800, #0369A1)' : 'var(--brand-navy-600, #0284C7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon name={iconName} size={16} />
                </div>

                {/* Content Block */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex-align-center" style={{ gap: '0.5rem', marginBottom: 4 }}>
                    <div className="text-sm font-medium" style={{ lineHeight: 1.5, color: 'var(--text-main)' }}>
                      {n.message}
                    </div>
                    {isUnread && (
                      <span
                        className="badge badge-brand"
                        style={{
                          fontSize: '0.68rem',
                          padding: '0.15rem 0.45rem',
                          borderRadius: 12,
                          background: 'var(--brand-600, #0096FF)',
                          color: '#FFFFFF',
                          fontWeight: 600,
                          flexShrink: 0
                        }}
                      >
                        New
                      </span>
                    )}
                  </div>

                  <div className="flex-align-center" style={{ gap: '1rem', marginTop: 4 }}>
                    <span className="text-xs text-faint" style={{ color: 'var(--text-faint)' }}>
                      {n.created_at}
                    </span>

                    {n.link && (
                      <Link
                        to={n.link}
                        className="text-xs text-primary"
                        style={{ fontWeight: 600, textDecoration: 'none' }}
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
                    style={{ padding: '4px 8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}
                  >
                    <Icon name="check" size={14} />
                  </button>
                )}
              </div>
            );
          })
        ) : (
          /* Empty State matching Flask template */
          <div className="empty-state" style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div className="empty-icon" style={{ margin: '0 auto 12px', color: 'var(--text-muted)' }}>
              <Icon name="bell" size={28} />
            </div>
            <h4 style={{ margin: '0 0 6px', fontWeight: 700 }}>No new notifications</h4>
            <p className="text-muted text-sm" style={{ margin: 0 }}>
              {filter === 'unread' ? 'You have read all your notifications.' : 'You are completely caught up.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
