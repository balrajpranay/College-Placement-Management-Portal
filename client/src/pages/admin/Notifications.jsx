import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import { getAdminNotificationsApi, markAdminNotificationReadApi } from '../../services/api';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await getAdminNotificationsApi();
      if (res && res.data) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markAdminNotificationReadApi(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  return (
    <div className="admin-notifications-page" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="flex-between mb-6" style={{ alignItems: 'center' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-1)' }}>Broadcast Notices & System Alerts</h1>
          <p className="text-muted" style={{ margin: 0 }}>
            Important administrative notices, verification requests, and placement milestones.
          </p>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted">Loading system notices...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="bell" size={36} className="text-muted mb-2" />
            <p className="text-muted">No notices at this time.</p>
          </div>
        ) : (
          <div className="notif-list">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="notif-item flex-between"
                style={{
                  padding: '1.25rem',
                  borderBottom: '1px solid var(--border-color)',
                  background: notif.isRead ? 'transparent' : 'var(--brand-50, rgba(0,150,255,0.05))',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}
              >
                <div className="flex-align-center" style={{ gap: '1rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: notif.isRead ? 'var(--neutral-100, #F1F5F9)' : 'var(--brand-100, #DBEAFE)',
                      color: notif.isRead ? 'var(--neutral-600, #64748B)' : 'var(--brand-600, #0096FF)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2
                    }}
                  >
                    <Icon name={notif.type === 'company_approval' ? 'building' : notif.type === 'placement_success' ? 'award' : 'bell'} size={18} />
                  </div>
                  <div>
                    <div className="flex-align-center" style={{ gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span className="font-semibold text-sm">{notif.title}</span>
                      {!notif.isRead && (
                        <span className="badge badge-brand" style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem' }}>
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted" style={{ margin: '0 0 0.25rem' }}>
                      {notif.message}
                    </p>
                    <span className="text-xs font-mono text-muted">{notif.createdAt}</span>
                  </div>
                </div>

                {!notif.isRead && (
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleMarkRead(notif.id)}
                    title="Mark as read"
                  >
                    <Icon name="check" size={14} /> <span>Mark Read</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
