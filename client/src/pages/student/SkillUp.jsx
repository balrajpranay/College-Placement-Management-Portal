import React, { useState, useMemo } from 'react';
import Icon from '../../components/Icon';
import { SKILL_UP_OPPORTUNITIES } from '../../data/skillUpData';

export default function SkillUp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Extract unique categories for filter
  const categories = useMemo(() => {
    const cats = new Set();
    SKILL_UP_OPPORTUNITIES.forEach(item => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats).sort();
  }, []);

  // Extract unique providers for filter
  const providers = useMemo(() => {
    const provs = new Set();
    SKILL_UP_OPPORTUNITIES.forEach(item => {
      if (item.provider) provs.add(item.provider);
    });
    return Array.from(provs).sort();
  }, []);

  // Filtered dataset based on search, category, provider, and status
  const filteredOpportunities = useMemo(() => {
    return SKILL_UP_OPPORTUNITIES.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        item.providerProgramme.toLowerCase().includes(q) ||
        item.provider.toLowerCase().includes(q) ||
        item.programme.toLowerCase().includes(q) ||
        item.bestFor.toLowerCase().includes(q) ||
        item.eligibility.toLowerCase().includes(q) ||
        item.certificate.toLowerCase().includes(q) ||
        (item.category && item.category.toLowerCase().includes(q))
      );

      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesProvider = !selectedProvider || item.provider === selectedProvider;
      const matchesStatus = !selectedStatus || (
        selectedStatus === 'Open'
          ? (item.status.toLowerCase().includes('open') || item.status.toLowerCase().includes('available'))
          : item.status.toLowerCase().includes(selectedStatus.toLowerCase())
      );

      return matchesSearch && matchesCategory && matchesProvider && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedProvider, selectedStatus]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedProvider('');
    setSelectedStatus('');
  };

  const getProviderInitials = (name) => {
    if (!name) return 'S';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="skill-up-container student-portal-hub-view">
      {/* Top Banner Header */}
      <div className="card jobs-hub-header mb-6" style={{ padding: 'var(--space-6)' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
          <div>
            <div className="flex-align-center mb-2" style={{ gap: 8 }}>
              <span className="live-pulse-dot"></span>
              <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                ⭐ {SKILL_UP_OPPORTUNITIES.length} Verified Course Curricula
              </span>
              <span className="badge badge-accent" style={{ fontSize: '0.75rem' }}>
                10 Providers × 5 Specific Courses
              </span>
              <span className="badge badge-brand" style={{ fontSize: '0.75rem' }}>
                Direct Course Redirection
              </span>
            </div>
            <h1 className="h2" style={{ margin: '0 0 6px', fontWeight: 800 }}>
              Skill-Up Opportunities
            </h1>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.95rem' }}>
              Direct access to 50 accredited free courses across top industry leaders (ServiceNow, Microsoft, Google, AWS, IBM, Cisco, Infosys, IITs/NPTEL, Oracle, Fortinet). No generic homepages—every link leads directly to the specific course curriculum.
            </p>
          </div>

          <div className="header-stat-pill" style={{ background: 'var(--bg-surface-alt)', padding: '12px 20px', borderRadius: 10, border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div className="text-xs text-muted font-bold uppercase tracking-wider">Curated Courses</div>
            <div className="h3 text-brand" style={{ margin: 0, fontWeight: 800 }}>{SKILL_UP_OPPORTUNITIES.length} Free Programs</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card p-4 mb-6" style={{ padding: '16px 20px', marginBottom: 24 }}>
        <div className="jobs-search-form" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div className="search-input-wrap" style={{ flex: 1, minWidth: 240 }}>
            <input
              type="text"
              placeholder={`Search ${SKILL_UP_OPPORTUNITIES.length} courses by title, skill, provider (e.g. ServiceNow, Python, AWS, Azure, NPTEL)...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}
            />
          </div>

          <div className="search-select-wrap">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="form-control"
              style={{ padding: '10px 14px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}
            >
              <option value="">All Providers ({providers.length})</option>
              {providers.map((p) => (
                <option key={p} value={p}>{p} (5 courses)</option>
              ))}
            </select>
          </div>

          <div className="search-select-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-control"
              style={{ padding: '10px 14px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}
            >
              <option value="">All Domains ({categories.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="search-select-wrap">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-control"
              style={{ padding: '10px 14px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}
            >
              <option value="">All Statuses</option>
              <option value="Open">Open / Available</option>
              <option value="closed">Closed / Past Cohorts</option>
            </select>
          </div>

          {(searchQuery || selectedCategory || selectedProvider || selectedStatus) && (
            <button
              type="button"
              onClick={clearFilters}
              className="btn btn-outline"
              title="Reset Filters"
              style={{ padding: '10px 16px' }}
            >
              Reset
            </button>
          )}
        </div>

        {/* Quick Provider Chips */}
        <div className="source-chips-row mt-4 pt-3 flex-align-center" style={{ borderTop: '1px solid var(--border-subtle)', gap: 8, flexWrap: 'wrap', marginTop: 16, paddingTop: 12 }}>
          <span className="text-xs text-muted font-bold uppercase tracking-wider">Providers:</span>
          <button
            className={`source-chip ${!selectedProvider ? 'active' : ''}`}
            onClick={() => setSelectedProvider('')}
          >
            🌟 All Providers
          </button>
          {providers.map((prov) => (
            <button
              key={prov}
              className={`source-chip ${selectedProvider === prov ? 'active' : ''}`}
              onClick={() => setSelectedProvider(prov === selectedProvider ? '' : prov)}
            >
              {prov}
            </button>
          ))}
        </div>

        {/* Quick Category Chips */}
        <div className="source-chips-row mt-4 pt-3 flex-align-center" style={{ borderTop: '1px solid var(--border-subtle)', gap: 8, flexWrap: 'wrap', marginTop: 16, paddingTop: 12 }}>
          <span className="text-xs text-muted font-bold uppercase tracking-wider">Domains:</span>
          <button
            className={`source-chip ${!selectedCategory ? 'active' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            🌟 All ({SKILL_UP_OPPORTUNITIES.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`source-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex-between mb-4" style={{ alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div className="font-semibold text-sm" style={{ color: 'var(--text-main)' }}>
          Showing {filteredOpportunities.length} of {SKILL_UP_OPPORTUNITIES.length} free course curricula
          {selectedProvider && <span className="text-brand"> · Provider: {selectedProvider}</span>}
          {selectedCategory && <span className="text-brand"> · Domain: {selectedCategory}</span>}
          {searchQuery && <span className="text-brand"> · Matching &quot;{searchQuery}&quot;</span>}
        </div>
      </div>

      {/* Cards Grid */}
      {filteredOpportunities.length === 0 ? (
        <div className="card text-center py-6" style={{ padding: '40px 20px' }}>
          <Icon name="search" size={36} className="text-muted mb-2" />
          <h3 className="h4">No skill-up opportunities match your search</h3>
          <p className="text-sm text-muted">Try clearing your search query or selecting a different category filter.</p>
          <button onClick={clearFilters} className="btn btn-primary btn-sm mt-2">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid-3" style={{ gap: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {filteredOpportunities.map((item) => (
            <div
              key={item.id}
              className="card job-card p-4"
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: '20px 22px',
                border: '1px solid var(--border-color)',
                borderRadius: 10,
                background: 'var(--bg-surface)'
              }}
            >
              {/* Card Header */}
              <div className="flex-between mb-3" style={{ alignItems: 'flex-start', gap: 10 }}>
                <div className="flex-align-center" style={{ gap: 10 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: 'linear-gradient(135deg, var(--brand-500, #0096FF), #0056b3)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      flexShrink: 0
                    }}
                  >
                    {getProviderInitials(item.provider)}
                  </div>
                  <div>
                    <div className="font-bold text-sm" style={{ color: 'var(--text-main)', lineHeight: 1.2 }}>
                      {item.provider}
                    </div>
                    <span className="text-xs text-muted" style={{ fontWeight: 600 }}>
                      #{item.sn} · {item.category}
                    </span>
                  </div>
                </div>

                <span
                  className={`badge ${item.status.toLowerCase().includes('closed') ? 'badge-neutral' : 'badge-success'}`}
                  style={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}
                >
                  {item.status}
                </span>
              </div>

              {/* Programme Title */}
              <h3 className="h4 mb-3" style={{ fontSize: '1.05rem', fontWeight: 700, margin: '8px 0 12px', minHeight: 44, lineHeight: 1.35 }}>
                {item.programme || item.providerProgramme}
              </h3>

              {/* Detail Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span className="text-brand" style={{ flexShrink: 0, marginTop: 2 }}>🎯</span>
                  <div>
                    <strong style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>Best For:</strong>{' '}
                    <span style={{ color: 'var(--text-main)' }}>{item.bestFor}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span className="text-brand" style={{ flexShrink: 0, marginTop: 2 }}>👤</span>
                  <div>
                    <strong style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>Eligibility:</strong>{' '}
                    <span style={{ color: 'var(--text-main)' }}>{item.eligibility}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span className="text-brand" style={{ flexShrink: 0, marginTop: 2 }}>⏱️</span>
                  <div>
                    <strong style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>Duration:</strong>{' '}
                    <span style={{ color: 'var(--text-main)' }}>{item.duration}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span className="text-brand" style={{ flexShrink: 0, marginTop: 2 }}>📜</span>
                  <div>
                    <strong style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>Certificate:</strong>{' '}
                    <span style={{ color: 'var(--text-main)' }}>{item.certificate}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Direct Action Button */}
              <div className="card-actions mt-auto" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 14, marginTop: 'auto' }}>
                <a
                  href={item.directLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-100"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', width: '100%', fontWeight: 600 }}
                >
                  <span>{item.linkLabel || 'Open Resource'}</span>
                  <Icon name="external-link" size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
