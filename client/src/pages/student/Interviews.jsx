import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import { getStudentInterviewsApi } from '../../services/api';

export default function StudentInterviews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        setLoading(true);
        const res = await getStudentInterviewsApi();
        setItems(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load interviews.');
      } finally {
        setLoading(false);
      }
    };
    loadInterviews();
  }, []);

  return (
    <div className="student-interviews-wrapper">
      <div className="mb-8" style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="h2" style={{ margin: '0 0 var(--space-1)', fontSize: '1.85rem', fontWeight: 800 }}>Interview Schedule</h1>
        <p className="text-muted" style={{ margin: 0 }}>Scheduled technical rounds, coding tests, and HR discussions.</p>
      </div>

      {error && (
        <div className="alert-box alert-danger-box">
          <div className="alert-box-icon"><Icon name="alert-circle" size={18} /></div>
          <div className="alert-box-text">{error}</div>
        </div>
      )}

      {loading ? (
        <div className="text-center" style={{ padding: '60px 0' }}>Loading interview calendar...</div>
      ) : items.length > 0 ? (
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
          {items.map((i) => (
            <div key={i.id} className="card" style={{ padding: 'var(--space-6)' }}>
              <div className="flex-between mb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{i.company_name}</h4>
                <span className={`badge ${i.status === 'Completed' ? 'badge-success' : i.status === 'Scheduled' ? 'badge-accent' : 'badge-danger'}`} style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                  {i.status}
                </span>
              </div>

              <div className="text-sm font-semibold text-muted mb-3" style={{ marginBottom: 12 }}>{i.drive_title} · {i.round_name}</div>

              <div className="drive-meta mb-4" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                <span className="drive-meta-chip" style={{ fontSize: '0.75rem', background: 'var(--bg-surface-alt)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border-subtle)' }}><Icon name="calendar" size={13} /> {i.scheduled_date}</span>
                <span className="drive-meta-chip" style={{ fontSize: '0.75rem', background: 'var(--bg-surface-alt)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border-subtle)' }}><Icon name="clock" size={13} /> {i.scheduled_time}</span>
                <span className="drive-meta-chip" style={{ fontSize: '0.75rem', background: 'var(--bg-surface-alt)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border-subtle)' }}><Icon name="video" size={13} /> {i.interview_type}</span>
              </div>

              {i.venue && (
                <div className="text-sm text-muted pt-3" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
                  <strong>Venue / Link:</strong> <a href={i.venue.startsWith('http') ? i.venue : '#'} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan-600)' }}>{i.venue}</a>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div className="empty-icon" style={{ margin: '0 auto 12px' }}><Icon name="video" size={32} /></div>
          <h4>No interview rounds scheduled</h4>
          <p className="text-muted text-sm">When recruiters shortlist your application and allocate an interview slot, details will appear here.</p>
        </div>
      )}
    </div>
  );
}
