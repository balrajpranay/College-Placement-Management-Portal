import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { getJobsApi, applyForJobApi } from '../services/api';

// Dedicated isolated CompanyLogo component to guarantee ONLY 1 logo or 1 fallback is rendered
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

export default function JobsHub({ isStudentPortal }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  const isPortalView = isStudentPortal || location.pathname.startsWith('/student');

  const urlJobType = searchParams.get('job_type') || '';
  const urlQ = searchParams.get('q') || '';
  const urlCategory = searchParams.get('category') || '';
  const urlWorkMode = searchParams.get('work_mode') || '';
  const urlPage = parseInt(searchParams.get('page') || '1', 10);

  const [jobs, setJobs] = useState([]);
  const [featuredCompanies, setFeaturedCompanies] = useState([]);
  const [stats, setStats] = useState({ total_jobs: 520, total_all_count: 520, total_placements_count: 260, total_internships_count: 260, total_pages: 44 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(urlQ);
  const [applyStatus, setApplyStatus] = useState(null);
  const [applyingJobId, setApplyingJobId] = useState(null);

  useEffect(() => {
    setSearchQuery(urlQ);
  }, [urlQ]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await getJobsApi({
        q: urlQ,
        job_type: urlJobType,
        category: urlCategory,
        work_mode: urlWorkMode,
        page: urlPage,
        limit: 12
      });

      if (res && res.data) {
        setJobs(res.data);
        setStats({
          total_jobs: res.total_jobs || res.data.length,
          total_all_count: res.total_all_count || 520,
          total_placements_count: res.total_placements_count || 260,
          total_internships_count: res.total_internships_count || 260,
          total_pages: res.total_pages || 1
        });
        if (res.featured_companies) {
          setFeaturedCompanies(res.featured_companies);
        }
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [urlJobType, urlQ, urlCategory, urlWorkMode, urlPage]);

  const handleApplyClick = async (job) => {
    setApplyStatus(null);

    // Rule 1: Unauthenticated visitors redirected to Student Login preserving job
    if (!isAuthenticated || !user) {
      navigate('/login?role=student', {
        state: {
          from: location.pathname + location.search,
          targetJob: job,
          message: `Please sign in to your student account to apply for ${job.title} at ${job.company}.`
        }
      });
      return;
    }

    // Rule 2: Only students can apply
    if (user.role !== 'student') {
      setApplyStatus({
        type: 'error',
        message: `Access Restricted: Only registered student accounts may submit placement applications. Logged in as ${user.role}.`
      });
      return;
    }

    // Rule 3: Process secure student application
    try {
      setApplyingJobId(job.id);
      const res = await applyForJobApi(job.id);

      setApplyStatus({
        type: 'success',
        message: res.message || `Application submitted successfully for ${job.title} at ${job.company}!`
      });

      const targetUrl = (res.data && res.data.redirectUrl) || job.url;
      if (targetUrl) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      setApplyStatus({
        type: 'error',
        message: err.message || 'Failed to submit application.'
      });
    } finally {
      setApplyingJobId(null);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const setJobTypeFilter = (type) => {
    const params = new URLSearchParams(searchParams);
    if (type) {
      params.set('job_type', type);
    } else {
      params.delete('job_type');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const setSourceFilter = (sourceText) => {
    const params = new URLSearchParams(searchParams);
    params.set('q', sourceText);
    params.set('page', '1');
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setSearchQuery('');
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const isInternshipView = urlJobType === 'Internship' || urlJobType === 'PM Internship Scheme';
  const isPlacementView = urlJobType === 'Full-time';
  const isAllView = !urlJobType;

  return (
    <div className={`jobs-hub-container ${isPortalView ? 'student-portal-hub-view' : 'public-hub-view'}`}>
      {/* Top Hub Banner matching Flask _jobs_body.html */}
      <div className="card jobs-hub-header mb-6" style={{ padding: 'var(--space-6)' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
          <div>
            <div className="flex-align-center mb-2" style={{ gap: 8 }}>
              <span className="live-pulse-dot"></span>
              <span className="badge badge-accent" style={{ fontSize: '0.75rem' }}>
                {isInternshipView ? 'National Internship Tracks' : isPlacementView ? 'Graduate Placement Season' : 'Verified Opportunity Hub'}
              </span>
            </div>
            <h1 className="h2" style={{ margin: '0 0 6px', fontWeight: 800 }}>
              {isInternshipView ? 'Internships & PM Scheme' : isPlacementView ? 'Placements & Full-Time Jobs' : 'Jobs & Internships Hub'}
            </h1>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.95rem' }}>
              {isInternshipView
                ? 'Verified industry internships across Top 500 enterprises under the Prime Minister\'s Internship Scheme and AICTE portals.'
                : isPlacementView
                ? 'Official on-campus placement drives and graduate engineering opportunities with direct application links.'
                : 'Verified on-campus placement drives, national AICTE portals, PM Internship Scheme, and corporate career tracks.'}
            </p>
          </div>

          {/* Segmented Category Switcher matching Flask */}
          <div className="category-segmented-control" style={{ display: 'flex', gap: 4, background: 'var(--bg-surface-alt)', padding: 4, borderRadius: 8, border: '1px solid var(--border-color)' }}>
            <button
              className={`seg-btn ${isAllView ? 'active' : ''}`}
              onClick={() => setJobTypeFilter('')}
              style={{ padding: '6px 12px', fontSize: '0.85rem', fontWeight: 600, border: 'none', borderRadius: 6, cursor: 'pointer', background: isAllView ? 'var(--brand-500, #0096FF)' : 'transparent', color: isAllView ? '#FFFFFF' : 'var(--text-muted)' }}
            >
              🌟 All ({stats.total_all_count})
            </button>
            <button
              className={`seg-btn ${isPlacementView ? 'active' : ''}`}
              onClick={() => setJobTypeFilter('Full-time')}
              style={{ padding: '6px 12px', fontSize: '0.85rem', fontWeight: 600, border: 'none', borderRadius: 6, cursor: 'pointer', background: isPlacementView ? 'var(--brand-500, #0096FF)' : 'transparent', color: isPlacementView ? '#FFFFFF' : 'var(--text-muted)' }}
            >
              🎓 Placements &amp; Jobs ({stats.total_placements_count})
            </button>
            <button
              className={`seg-btn ${isInternshipView ? 'active' : ''}`}
              onClick={() => setJobTypeFilter('Internship')}
              style={{ padding: '6px 12px', fontSize: '0.85rem', fontWeight: 600, border: 'none', borderRadius: 6, cursor: 'pointer', background: isInternshipView ? 'var(--brand-500, #0096FF)' : 'transparent', color: isInternshipView ? '#FFFFFF' : 'var(--text-muted)' }}
            >
              💼 Internships &amp; PM Scheme ({stats.total_internships_count})
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card p-4 mb-6" style={{ padding: '16px 20px', marginBottom: 24 }}>
        <form onSubmit={handleSearchSubmit} className="jobs-search-form" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div className="search-input-wrap" style={{ flex: 1, minWidth: 240 }}>
            <input
              type="text"
              placeholder={isInternshipView ? "Search internships by role, company, or skills (e.g. PM Scheme, React, IoT)..." : "Search placements by role, company, or skills (e.g. SDE-1, Google, Python)..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control jobs-search-input"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}
            />
          </div>

          <div className="search-select-wrap">
            <select
              value={urlWorkMode}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams);
                if (e.target.value) params.set('work_mode', e.target.value);
                else params.delete('work_mode');
                params.set('page', '1');
                setSearchParams(params);
              }}
              className="form-control"
              style={{ padding: '10px 14px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}
            >
              <option value="">All Work Modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite / Campus</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="search" size={16} /> Search
          </button>

          {(urlQ || urlWorkMode || urlCategory || urlJobType) && (
            <button type="button" onClick={clearAllFilters} className="btn btn-outline" title="Reset Filters">
              Reset
            </button>
          )}
        </form>

        {/* Source Provider Quick Filter Chips */}
        <div className="source-chips-row mt-4 pt-3 flex-align-center" style={{ borderTop: '1px solid var(--border-subtle)', gap: 8, flexWrap: 'wrap', marginTop: 16, paddingTop: 12 }}>
          <span className="text-xs text-muted font-bold uppercase tracking-wider">Verified Sources:</span>
          <button className={`source-chip ${urlJobType === 'Internship' ? 'active' : ''}`} onClick={() => setJobTypeFilter('Internship')}>
            🏛️ PM Internship Scheme
          </button>
          <button className="source-chip" onClick={() => setSourceFilter('Google')}>
            Google
          </button>
          <button className="source-chip" onClick={() => setSourceFilter('Microsoft')}>
            Microsoft
          </button>
          <button className="source-chip" onClick={() => setSourceFilter('Infosys')}>
            Infosys
          </button>
          <button className="source-chip" onClick={() => setSourceFilter('AICTE')}>
            AICTE
          </button>
          <button className="source-chip" onClick={() => setSourceFilter('AccioJob')}>
            AccioJob
          </button>
        </div>
      </div>

      {/* Featured MNCs Section */}
      {featuredCompanies && featuredCompanies.length > 0 && !urlQ && urlPage === 1 && (
        <div className="card mb-6 p-4" style={{ padding: '20px 24px', marginBottom: 24, background: 'var(--bg-surface-alt)', border: '1px solid var(--border-color)' }}>
          <div className="flex-between mb-3" style={{ alignItems: 'center' }}>
            <div>
              <h3 className="h4" style={{ margin: 0, fontSize: '1.05rem' }}>Top Tier-1 Corporate Partners</h3>
              <p className="text-xs text-muted" style={{ margin: '2px 0 0' }}>Direct early-career recruitment &amp; internship tracks</p>
            </div>
            <span className="badge badge-accent">100% Direct Application</span>
          </div>

          <div className="grid-4" style={{ gap: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {featuredCompanies.slice(0, 8).map((mnc) => (
              <div key={mnc.id} className="card p-3" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 8 }}>
                <div className="flex-align-center mb-2" style={{ gap: 10 }}>
                  <CompanyLogo logo={mnc.logo} companyName={mnc.name} size={36} />
                  <div style={{ overflow: 'hidden' }}>
                    <div className="font-bold text-sm truncate" style={{ color: 'var(--text-main)' }}>{mnc.name}</div>
                    <div className="text-xs text-brand font-semibold">{mnc.tier}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleApplyClick({ id: mnc.id, title: mnc.hiring_tracks[0] || 'Direct Career Portal', company: mnc.name, url: mnc.url })}
                  className="btn btn-outline btn-sm w-100"
                  style={{ fontSize: '0.75rem', marginTop: 8 }}
                >
                  View Hiring Tracks &rarr;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Opportunities Grid */}
      <div>
        {/* Status Alert */}
        {applyStatus && (
          <div className={`alert-box ${applyStatus.type === 'error' ? 'alert-danger-box' : 'alert-success-box'} mb-4`}>
            <div className="alert-box-icon">
              <Icon name={applyStatus.type === 'error' ? 'alert-circle' : 'check'} size={18} />
            </div>
            <div className="alert-box-text">{applyStatus.message}</div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex-between mb-4" style={{ alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div className="font-semibold text-sm" style={{ color: 'var(--text-main)' }}>
            Showing {jobs.length} of {stats.total_jobs} opportunities
            {urlJobType && <span className="text-brand"> · Category: {urlJobType}</span>}
            {urlQ && <span className="text-brand"> · Matching &quot;{urlQ}&quot;</span>}
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="text-center py-6 text-muted font-semibold" style={{ padding: '60px 0' }}>
            Loading verified opportunities...
          </div>
        ) : jobs.length === 0 ? (
          <div className="card text-center py-6" style={{ padding: '40px 20px' }}>
            <Icon name="search" size={36} className="text-muted mb-2" />
            <h3 className="h4">No opportunities found matching your criteria</h3>
            <p className="text-sm text-muted">Try clearing filters or search terms.</p>
            <button onClick={clearAllFilters} className="btn btn-primary btn-sm mt-2">
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid-3" style={{ gap: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {jobs.map((job) => (
              <div key={job.id} className="card job-card p-4" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '18px 20px' }}>
                <div className="flex-between mb-3" style={{ alignItems: 'flex-start' }}>
                  <div className="flex-align-center" style={{ gap: 12 }}>
                    <CompanyLogo logo={job.logo} companyName={job.company} size={48} />
                    <div>
                      <div className="font-bold text-sm" style={{ color: 'var(--text-muted)' }}>{job.company}</div>
                      <span className={`badge ${job.job_type === 'Internship' ? 'badge-accent' : 'badge-brand'}`} style={{ fontSize: '0.7rem' }}>
                        {job.job_type}
                      </span>
                    </div>
                  </div>
                  {job.work_mode && (
                    <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                      {job.work_mode}
                    </span>
                  )}
                </div>

                <h3 className="h4 mb-2" style={{ fontSize: '1.05rem', fontWeight: 700, minHeight: 44, margin: '8px 0' }}>
                  {job.title}
                </h3>

                <div className="job-meta-row mb-3" style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.85rem' }}>
                  {job.location && (
                    <div className="flex-align-center text-muted" style={{ gap: 6 }}>
                      <Icon name="map-pin" size={14} /> <span>{job.location}</span>
                    </div>
                  )}
                  {job.salary && (
                    <div className="flex-align-center font-bold text-brand" style={{ gap: 6 }}>
                      <Icon name="briefcase" size={14} /> <span>{job.salary}</span>
                    </div>
                  )}
                </div>

                {job.tags && job.tags.length > 0 && (
                  <div className="skills-tags-row mb-4" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 10 }}>
                    {job.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="skill-tag" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="card-actions mt-3" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 12, marginTop: 12 }}>
                  <button
                    onClick={() => handleApplyClick(job)}
                    disabled={applyingJobId === job.id}
                    className="btn btn-primary w-100"
                    style={{ width: '100%' }}
                  >
                    {applyingJobId === job.id ? 'Submitting...' : 'View & Apply →'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Bar Component matching Flask structure */}
        {stats.total_pages > 1 && (
          <nav className="pagination-bar mt-8 flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, gap: 12, flexWrap: 'wrap' }} aria-label="Opportunities pagination">
            <div>
              <button
                disabled={urlPage <= 1}
                onClick={() => handlePageChange(urlPage - 1)}
                className="btn btn-outline btn-sm"
                style={{ opacity: urlPage <= 1 ? 0.4 : 1, cursor: urlPage <= 1 ? 'not-allowed' : 'pointer' }}
              >
                &larr; Previous
              </button>
            </div>

            <div className="pagination-pages-list" style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              {Array.from({ length: stats.total_pages }, (_, i) => i + 1).map((p) => {
                if (p === 1 || p === stats.total_pages || (p >= urlPage - 2 && p <= urlPage + 2)) {
                  return (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`btn btn-sm ${p === urlPage ? 'btn-primary' : 'btn-outline'}`}
                      style={{ minWidth: 36, height: 36, fontWeight: p === urlPage ? 700 : 500 }}
                    >
                      {p}
                    </button>
                  );
                } else if (p === urlPage - 3 || p === urlPage + 3) {
                  return (
                    <span key={p} className="text-muted px-1" style={{ userSelect: 'none' }}>
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <div>
              <button
                disabled={urlPage >= stats.total_pages}
                onClick={() => handlePageChange(urlPage + 1)}
                className="btn btn-outline btn-sm"
                style={{ opacity: urlPage >= stats.total_pages ? 0.4 : 1, cursor: urlPage >= stats.total_pages ? 'not-allowed' : 'pointer' }}
              >
                Next &rarr;
              </button>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
