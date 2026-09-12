import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { getStudentDriveDetailApi, applyStudentDriveApi } from '../../services/api';

function CompanyLogo({ logo, companyName, size = 64 }) {
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
      <div className="card-logo-fallback" style={{ fontSize: '1.4rem' }}>
        {(companyName || 'C')[0]}
      </div>
    </div>
  );
}

export default function StudentDriveDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        const res = await getStudentDriveDetailApi(id);
        setData(res.data);
      } catch (err) {
        setStatus({ type: 'error', message: err.message || 'Failed to load drive details.' });
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id]);

  const handleApply = async () => {
    if (!window.confirm(`Are you sure you want to submit your application for ${data?.drive?.title} at ${data?.drive?.company_name}?`)) {
      return;
    }

    setApplying(true);
    setStatus(null);
    try {
      const res = await applyStudentDriveApi(id);
      setStatus({ type: 'success', message: res.message || 'Application submitted successfully!' });
      setData(prev => ({
        ...prev,
        applied: res.data
      }));
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Application submission failed.' });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="text-center" style={{ padding: '60px 0' }}>Loading drive specification...</div>;
  }

  if (!data?.drive) {
    return (
      <div className="alert-box alert-danger-box">
        <div className="alert-box-icon"><Icon name="alert-circle" size={18} /></div>
        <div className="alert-box-text">{status?.message || 'Placement drive not found.'}</div>
      </div>
    );
  }

  const { drive, eligible, reasons, applied } = data;

  return (
    <div className="drive-detail-wrapper">
      <Link to="/student/drives" className="text-sm font-semibold text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-4)' }}>
        &larr; Back to Placement Drives
      </Link>

      {status && (
        <div className={`alert-box ${status.type === 'success' ? 'alert-success-box' : 'alert-danger-box'}`}>
          <div className="alert-box-icon">
            <Icon name={status.type === 'success' ? 'check-circle' : 'alert-circle'} size={18} />
          </div>
          <div className="alert-box-text">
            {status.message}
          </div>
          <button
            onClick={() => setStatus(null)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700, marginLeft: 'auto' }}
          >
            ✕
          </button>
        </div>
      )}

      <div className="card mb-6" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div className="flex-align-center" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <CompanyLogo logo={drive.logo} companyName={drive.company_name} size={64} />
            <div>
              <h1 className="h2" style={{ margin: '0 0 var(--space-1)', fontSize: '1.85rem', fontWeight: 800 }}>{drive.title}</h1>
              <div className="text-muted font-medium">{drive.company_name}</div>
            </div>
          </div>

          <div>
            {applied ? (
              <span className="badge badge-accent" style={{ fontSize: '0.875rem', padding: '8px 16px' }}>
                Applied &ndash; {applied.status}
              </span>
            ) : eligible ? (
              <span className="badge badge-success badge-dot" style={{ fontSize: '0.875rem', padding: '8px 16px' }}>
                ● You are Eligible to Apply
              </span>
            ) : (
              <span className="badge badge-danger badge-dot" style={{ fontSize: '0.875rem', padding: '8px 16px' }}>
                ● Not Eligible
              </span>
            )}
          </div>
        </div>

        <div className="divider" style={{ height: 1, background: 'var(--border-subtle)', margin: 'var(--space-5) 0' }}></div>

        <div className="drive-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <span className="drive-meta-chip" style={{ fontSize: '0.8rem', background: 'var(--bg-surface-alt)', padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}><Icon name="dollar" size={13} /> CTC: ₹{drive.ctc} LPA</span>
          <span className="drive-meta-chip" style={{ fontSize: '0.8rem', background: 'var(--bg-surface-alt)', padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}><Icon name="map-pin" size={13} /> Location: {drive.location || 'Various'}</span>
          <span className="drive-meta-chip" style={{ fontSize: '0.8rem', background: 'var(--bg-surface-alt)', padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}><Icon name="briefcase" size={13} /> Role Type: {drive.job_type}</span>
          <span className="drive-meta-chip" style={{ fontSize: '0.8rem', background: 'var(--bg-surface-alt)', padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}><Icon name="users" size={13} /> {drive.openings} Total Openings</span>
          <span className="drive-meta-chip" style={{ fontSize: '0.8rem', background: 'var(--bg-surface-alt)', padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}><Icon name="calendar" size={13} /> Apply Before: {drive.deadline}</span>
          {drive.drive_date && (
            <span className="drive-meta-chip" style={{ fontSize: '0.8rem', background: 'var(--bg-surface-alt)', padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}><Icon name="clock" size={13} /> Drive Date: {drive.drive_date}</span>
          )}
        </div>

        {!eligible && !applied && reasons && reasons.length > 0 && (
          <div className="card mt-4" style={{ background: '#FEE2E2', borderColor: '#FCA5A5', padding: 'var(--space-4)', marginTop: 16 }}>
            <div style={{ fontWeight: 700, color: '#B91C1C', marginBottom: 6 }}>
              <Icon name="alert-circle" size={16} /> Eligibility Mismatch Criteria:
            </div>
            <ul className="reason-list" style={{ margin: 0, paddingLeft: 20, color: '#B91C1C', fontSize: '0.85rem' }}>
              {reasons.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6" style={{ marginTop: 20 }}>
          {applied ? (
            <button className="btn btn-outline" disabled>
              <Icon name="check" size={16} /> Already Applied (Status: {applied.status})
            </button>
          ) : eligible ? (
            <button type="button" onClick={handleApply} disabled={applying} className="btn btn-primary btn-lg">
              <Icon name="check" size={16} /> {applying ? 'Submitting Application...' : 'Submit Application Now'}
            </button>
          ) : (
            <button className="btn btn-outline" disabled>Application Ineligible</button>
          )}
        </div>
      </div>

      <div className="grid-2 mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h3 className="h4 mb-4" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Job Description &amp; Responsibilities</h3>
          <div className="text-muted" style={{ lineHeight: 1.65, fontSize: '0.9375rem', whiteSpace: 'pre-line' }}>
            {drive.description || 'No specific job description provided.'}
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h3 className="h4 mb-4" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Eligibility Requirements</h3>
          <div className="text-sm mb-3" style={{ marginBottom: 12 }}><strong>Minimum CGPA:</strong> {drive.min_cgpa} / 10.0</div>
          <div className="text-sm mb-3" style={{ marginBottom: 12 }}><strong>Maximum Active Backlogs:</strong> {drive.max_backlogs}</div>
          <div className="text-sm mb-4" style={{ marginBottom: 16 }}><strong>Eligible Branches:</strong> {drive.branches?.join(', ') || 'All departments eligible'}</div>
          
          <h4 className="text-sm mb-2" style={{ fontWeight: 700, marginBottom: 8 }}>Required Skills</h4>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {drive.skills && drive.skills.length > 0 ? (
              drive.skills.map((s) => (
                <span key={s} className="skill-tag" style={{ fontSize: '0.75rem', background: 'var(--bg-surface-alt)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border-subtle)' }}>{s}</span>
              ))
            ) : (
              <span className="text-sm text-faint">General candidate profile</span>
            )}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <h3 className="h4 mb-3" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>About {drive.company_name}</h3>
        <p className="text-muted mb-0" style={{ lineHeight: 1.6, margin: 0 }}>
          {drive.company_desc || 'Recruiter profile verified by the College Placement Office.'}
        </p>
      </div>
    </div>
  );
}
