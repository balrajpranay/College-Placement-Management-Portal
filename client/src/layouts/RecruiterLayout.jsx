import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';

export default function RecruiterLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
    navigate('/login?role=recruiter');
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const companyDisplayName = user?.name || user?.email?.split('@')[0] || 'TechNova Solutions';
  const companyInitial = (companyDisplayName[0] || 'T').toUpperCase();

  return (
    <div className="app-shell app-layout">
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation Shell matching Flask recruiter/_sidebar.html */}
      <aside className={`sidebar app-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <NavLink to="/" className="brand-lockup">
            <div className="brand-logo-wrap">
              <img
                src="/static/images/logo.png"
                alt="Campus Connect"
                className="brand-logo-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/static/images/companies/infosys.svg';
                }}
              />
            </div>
            <div className="brand-text-block">
              <span className="brand-name">Campus Connect</span>
              <span className="brand-sub">Recruiter Portal</span>
            </div>
          </NavLink>
        </div>

        <nav className="sidebar-nav">
          {/* Section 1: Overview */}
          <div className="sidebar-section-label">Overview</div>
          <NavLink
            to="/recruiter/dashboard"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="home" size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/recruiter/profile"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="briefcase" size={18} />
            <span>Corporate Profile</span>
          </NavLink>

          {/* Section 2: Recruitment */}
          <div className="sidebar-section-label">Recruitment</div>
          <NavLink
            to="/recruiter/drives/create"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="plus" size={18} />
            <span>Post Placement Drive</span>
          </NavLink>

          <NavLink
            to="/recruiter/drives"
            end
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="briefcase" size={18} />
            <span>Managed Drives</span>
          </NavLink>

          <NavLink
            to="/recruiter/applicants"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="users" size={18} />
            <span>Candidate Pipeline</span>
          </NavLink>

          <NavLink
            to="/recruiter/interviews"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="video" size={18} />
            <span>Interview Schedule</span>
          </NavLink>

          <NavLink
            to="/recruiter/results"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="award" size={18} />
            <span>Placement Results</span>
          </NavLink>

          {/* Section 3: Communication */}
          <div className="sidebar-section-label">Communication</div>
          <NavLink
            to="/recruiter/notifications"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="bell" size={18} />
            <span>Notifications</span>
          </NavLink>

          {/* Section 4: General */}
          <div className="sidebar-section-label">General</div>
          <NavLink to="/" className="sidebar-link">
            <Icon name="home" size={18} />
            <span>Public Site</span>
          </NavLink>
        </nav>

        {/* Sidebar Footer Company Badge */}
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
              {companyInitial}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div className="font-semibold text-sm truncate" style={{ color: '#FFFFFF' }}>
                {companyDisplayName}
              </div>
              <div className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Recruiter · Verified
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
            <div className="topbar-search">
              <input
                type="text"
                placeholder="Search candidates, drives, interviews... (Ctrl+K)"
                readOnly
              />
            </div>
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
                to="/recruiter/notifications"
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
              <Icon name="log-out" size={14} /> <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Content Slot */}
        <main className="page-content app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
