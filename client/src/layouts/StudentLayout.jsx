import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import Icon from '../components/Icon';
import AIAdvisor from '../components/AIAdvisor';
import ErrorBoundary from '../components/ErrorBoundary';
import { useAuth } from '../context/AuthContext';

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('campus_theme') || document.documentElement.getAttribute('data-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('campus_theme', theme);
  }, [theme]);

  const handleSignOut = () => {
    logout();
    navigate('/login?role=student');
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const queryParams = new URLSearchParams(location.search);
  const jobTypeQuery = queryParams.get('job_type') || queryParams.get('type') || '';
  const isOpportunitiesRoute = location.pathname.startsWith('/student/opportunities') || location.pathname.startsWith('/student/jobs');

  const isAllActive = isOpportunitiesRoute && !jobTypeQuery;
  const isPlacementsActive = isOpportunitiesRoute && (jobTypeQuery === 'Full-time');
  const isInternshipsActive = isOpportunitiesRoute && (jobTypeQuery === 'Internship' || jobTypeQuery === 'PM Internship Scheme');

  const [topSearch, setTopSearch] = useState(() => {
    return queryParams.get('q') || '';
  });
  const searchInputRef = useRef(null);

  // Sync topSearch with URL changes
  useEffect(() => {
    const currentQ = new URLSearchParams(location.search).get('q') || '';
    setTopSearch(currentQ);
  }, [location.search]);

  // Ctrl+K keyboard shortcut to focus topbar search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTopSearchSubmit = (e) => {
    e.preventDefault();
    const query = topSearch.trim();
    if (query) {
      // Search from ALL opportunities (clearing job_type filter to search entire 520+ pool)
      navigate(`/student/opportunities?q=${encodeURIComponent(query)}&page=1`);
    } else {
      navigate(`/student/opportunities?page=1`);
    }
  };

  return (
    <div className="app-shell app-layout">
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation Shell matching Flask student/_sidebar.html */}
      <aside className={`sidebar app-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <NavLink to="/student/opportunities" className="brand-lockup">
            <div className="brand-logo-wrap">
              <img
                src="/static/images/logo.png"
                alt="Campus Connect"
                className="brand-logo-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/static/images/companies/pmi.svg';
                }}
              />
            </div>
            <div className="brand-text-block">
              <span className="brand-name">Campus Connect</span>
              <span className="brand-sub">Student Portal</span>
            </div>
          </NavLink>
        </div>

        <nav className="sidebar-nav">
          {/* Section 1: Overview */}
          <div className="sidebar-section-label">Overview</div>
          <NavLink
            to="/student/dashboard"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="home" size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/student/profile"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="user" size={18} />
            <span>Profile & Resume</span>
          </NavLink>

          {/* Section 2: Opportunities Hub matching Flask */}
          <div className="sidebar-section-label">Opportunities Hub</div>
          <NavLink
            to="/student/opportunities"
            className={() => `sidebar-link ${isAllActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="briefcase" size={18} />
            <span>All Opportunities</span>
            <span className="badge badge-brand" style={{ fontSize: '0.65rem', padding: '2px 5px', marginLeft: 'auto' }}>
              520+
            </span>
          </NavLink>

          <NavLink
            to="/student/opportunities?job_type=Full-time"
            className={() => `sidebar-link ${isPlacementsActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="briefcase" size={18} />
            <span>Placements & Jobs</span>
          </NavLink>

          <NavLink
            to="/student/opportunities?job_type=Internship"
            className={() => `sidebar-link ${isInternshipsActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="award" size={18} />
            <span>Internships & PM Scheme</span>
            <span className="badge badge-accent" style={{ fontSize: '0.65rem', padding: '2px 5px', marginLeft: 'auto' }}>
              Live
            </span>
          </NavLink>

          <NavLink
            to="/student/skill-up"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="award" size={18} />
            <span>Skill-Up Opportunities</span>
            <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '2px 5px', marginLeft: 'auto' }}>
              50 Free
            </span>
          </NavLink>

          {/* Section 3: AI Career Suite */}
          <div className="sidebar-section-label">AI Career Suite</div>
          <NavLink
            to="/student/ai-suite"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="award" size={18} />
            <span>AI Advisor & Tutor</span>
            <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '2px 5px', marginLeft: 'auto' }}>
              Gemini
            </span>
          </NavLink>

          {/* Section 4: Communication */}
          <div className="sidebar-section-label">Communication</div>
          <NavLink
            to="/student/notifications"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="bell" size={18} />
            <span>Announcements</span>
          </NavLink>

          {/* Section 5: General */}
          <div className="sidebar-section-label">General</div>
          <NavLink to="/" className="sidebar-link">
            <Icon name="home" size={18} />
            <span>Public Site</span>
          </NavLink>
        </nav>

        {/* Sidebar Footer User Badge */}
        <div className="sidebar-footer">
          <div className="flex-align-center" style={{ gap: 10 }}>
            <div
              className="avatar"
              style={{
                width: 36,
                height: 36,
                fontSize: '0.875rem',
                background: 'linear-gradient(135deg, #0096FF, #0056b3)',
                color: '#FFFFFF',
                flexShrink: 0
              }}
            >
              {(user?.email?.[0] || 'P').toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div className="font-semibold text-sm truncate" style={{ color: '#FFFFFF' }}>
                {user?.name || user?.email?.split('@')[0] || 'Priya Sharma'}
              </div>
              <div className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Student · Verified
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="main-col app-main">
        {/* Topbar Navigation matching Flask base_dashboard.html */}
        <header className="topbar app-topbar">
          <div className="topbar-left">
            <button
              className="hamburger topbar-menu-toggle"
              aria-label="Toggle Sidebar Menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Icon name="menu" size={20} />
            </button>
            <form onSubmit={handleTopSearchSubmit} className="topbar-search" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                ref={searchInputRef}
                type="text"
                value={topSearch}
                onChange={(e) => setTopSearch(e.target.value)}
                placeholder="Search across all opportunities (Ctrl+K)..."
                style={{ width: '100%', paddingRight: topSearch ? '28px' : '14px' }}
              />
              {topSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setTopSearch('');
                    navigate('/student/opportunities?page=1');
                  }}
                  style={{
                    position: 'absolute',
                    right: 8,
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Clear search"
                >
                  <Icon name="x" size={14} />
                </button>
              )}
            </form>
          </div>

          <div className="topbar-right">
            <button
              className="theme-toggle-btn"
              aria-label="Toggle Theme"
              title="Switch Theme"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Icon name="sun" size={17} /> : <Icon name="moon" size={17} />}
            </button>

            <div className="topbar-notifications">
              <NavLink
                to="/student/notifications"
                className="topbar-notif-btn"
                aria-label="Notifications"
                title="Notifications"
              >
                <Icon name="bell" size={17} />
              </NavLink>
            </div>

            <button
              onClick={handleSignOut}
              className="btn btn-outline btn-sm header-signout-btn"
              title="Sign Out"
            >
              <Icon name="logout" size={14} /> <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Content Slot */}
        <main className="page-content app-content">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

      {/* Floating AI Advisor Widget */}
      <ErrorBoundary>
        <AIAdvisor />
      </ErrorBoundary>
    </div>
  );
}
