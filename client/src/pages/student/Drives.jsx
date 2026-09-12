import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { getStudentDrivesApi } from '../../services/api';

function CompanyLogo({ logo, companyName, size = 48 }) {
  const [hasError, setHasError] = useState(false);

  if (logo && !hasError) {
    return (
      <div className="card-company-logo-badge" style={{ width: size, height: size, minWidth: size }}>
        <img
          src={logo}
          alt={companyName}
          className="card-company-logo-img"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div className="card-company-logo-badge" style={{ width: size, height: size, minWidth: size }}>
      <div className="card-logo-fallback">
        {(companyName || 'C')[0]}
      </div>
    </div>
  );
}

export default function StudentDrives() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [eligibleOnly, setEligibleOnly] = useState(false);
  const [error, setError] = useState('');

  const loadDrives = async () => {
    try {
      setLoading(true);
      const res = await getStudentDrivesApi({ q: search, eligible: eligibleOnly ? '1' : '' });
      setItems(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load placement drives.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrives();
  }, [eligibleOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadDrives();
  };

  return (
    <div className="student-drives-wrapper">
      <div className="flex-between mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-1)', fontSize: '1.85rem', fontWeight: 800 }}>
            {eligibleOnly ? 'Eligible Placement Drives' : 'Active Placement Drives'}
          </h1>
          <p className="text-muted" style={{ margin: 0 }}>Explore opportunities and review your live eligibility status.</p>
        </div>
      </div>

      <div className="card mb-6" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <form onSubmit={handleSearchSubmit} className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', margin: 0 }}>
          <div className="toolbar-filters" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
            <div style={{ flex: '1 1 280px', maxWidth: 420 }}>
              <input
                type="text"
                placeholder="Filter by company, job title, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '9px 13px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', boxSizing: 'border-box' }}
              />
            </div>
            <label className="checkbox-row" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem' }}>
              <input
                type="checkbox"
                checked={eligibleOnly}
                onChange={(e) => setEligibleOnly(e.target.checked)}
              />
              <span className="font-medium text-sm">Show only eligible drives</span>
            </label>
          </div>
          <button className="btn btn-primary btn-sm" type="submit">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="text-center" style={{ padding: '60px 0' }}>Evaluating live eligibility metrics...</div>
      ) : items.length > 0 ? (
        <div className="drive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
          {items.map((item) => {
            const d = item.drive;
            return (
              <div key={d.id} className="card drive-card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="drive-card-top flex-between mb-3" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <CompanyLogo logo={d.logo} companyName={d.company_name} size={48} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.3, color: 'var(--text-main)' }}>{d.title}</div>
                        <div className="text-sm text-muted">{d.company_name}</div>
                      </div>
                    </div>
                  </div>

                  <div className="drive-meta mb-3" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '12px 0' }}>
                    <span className="drive-meta-chip" style={{ fontSize: '0.75rem', background: 'var(--bg-surface-alt)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border-subtle)' }}><Icon name="dollar" size={13} /> ₹{d.ctc} LPA</span>
                    <span className="drive-meta-chip" style={{ fontSize: '0.75rem', background: 'var(--bg-surface-alt)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border-subtle)' }}><Icon name="map-pin" size={13} /> {d.location || 'Various'}</span>
                    <span className="drive-meta-chip" style={{ fontSize: '0.75rem', background: 'var(--bg-surface-alt)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border-subtle)' }}><Icon name="calendar" size={13} /> Due: {d.deadline}</span>
                  </div>

                  <div className="mt-3" style={{ marginTop: 12 }}>
                    {item.applied_status ? (
                      <span className="badge badge-accent" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                        Applied: {item.applied_status}
                      </span>
                    ) : item.eligible ? (
                      <span className="badge badge-success badge-dot" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                        ● Eligible to Apply
                      </span>
                    ) : (
                      <div>
                        <span className="badge badge-danger badge-dot" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                          ● Not Eligible
                        </span>
                        {item.reasons && item.reasons.length > 0 && (
                          <ul className="reason-list text-xs text-danger" style={{ margin: '6px 0 0', paddingLeft: 16, color: '#DC2626', fontSize: '0.75rem' }}>
                            {item.reasons.slice(0, 2).map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 16, paddingTop: 12 }}>
                  <Link to={`/student/drives/${d.id}`} className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    View Requirements &amp; Apply &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <div className="empty-icon" style={{ margin: '0 auto 12px' }}><Icon name="briefcase" size={32} /></div>
          <h4>No drives matching your search</h4>
          <p className="text-muted text-sm">Try broadening your query or unticking the eligibility filter.</p>
          <button onClick={() => { setSearch(''); setEligibleOnly(false); }} className="btn btn-outline btn-sm mt-3">Reset Filters</button>
        </div>
      )}
    </div>
  );
}
