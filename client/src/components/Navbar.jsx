import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('campus_theme') || 'light';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('campus_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand-lockup">
          <div className="brand-logo-wrap">
            <img src="/static/images/logo.png" alt="Campus Connect" className="brand-logo-img" />
          </div>
          <div className="brand-text-block">
            <span className="brand-name">Campus Connect</span>
            <span className="brand-sub">Placement Portal</span>
          </div>
        </Link>

        <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`} id="main-nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/jobs" className={`nav-link ${isActive('/jobs') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            Jobs &amp; Internships
            <span className="badge badge-accent" style={{ fontSize: '0.65rem', padding: '2px 6px', marginLeft: '4px' }}>
              Live
            </span>
          </Link>
          <Link to="/ai" className={`nav-link ${isActive('/ai') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            AI Career Suite
            <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '2px 6px', marginLeft: '4px' }}>
              Gemini
            </span>
          </Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            About
          </Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            Contact Cell
          </Link>
        </nav>

        <div className="nav-actions">
          {/* Theme Switcher */}
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle dark/light mode" title="Switch Theme">
            {theme === 'dark' ? (
              <span className="theme-icon-sun"><Icon name="sun" size={17} /></span>
            ) : (
              <span className="theme-icon-moon"><Icon name="moon" size={17} /></span>
            )}
          </button>

          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {user.role === 'student' && (
                <Link to="/student/dashboard" className="btn btn-primary btn-sm">
                  <Icon name="user" size={14} /> Student Portal
                </Link>
              )}
              {user.role === 'recruiter' && (
                <Link to="/recruiter/dashboard" className="btn btn-primary btn-sm">
                  <Icon name="briefcase" size={14} /> Recruiter Portal
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="btn btn-primary btn-sm">
                  <Icon name="settings" size={14} /> Admin Cell
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link to="/login" className="btn btn-outline btn-sm">Sign In</Link>
              <Link to="/register/student" className="btn btn-primary btn-sm">Student Register</Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button className="mobile-nav-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Open Navigation Menu">
            <Icon name="menu" size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
