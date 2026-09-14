import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { BrandLockup } from './Logo';

export default function Footer() {
  return (
    <footer className="institutional-footer">
      <div className="container footer-grid">
        {/* Col 1: Brand & Institutional Identity */}
        <div className="footer-col-main">
          <BrandLockup textLight={true} size={36} className="mb-3" />
          <p className="footer-desc">
            Empowering university students, top corporate recruiters, and the college placement cell in a unified, verified career ecosystem.
          </p>
          <div className="footer-season-badge">
            <span>Placement Season 2025–2026</span>
          </div>
        </div>

        {/* Col 2: Opportunities */}
        <div>
          <h4 className="footer-col-title">Opportunities</h4>
          <ul className="footer-links">
            <li><Link to="/jobs">Campus Drives</Link></li>
            <li><Link to="/jobs">Full-Time Roles</Link></li>
            <li><Link to="/jobs">Tech Internships</Link></li>
            <li><Link to="/jobs">PM Internship Scheme</Link></li>
          </ul>
        </div>

        {/* Col 3: Portals & Tools */}
        <div>
          <h4 className="footer-col-title">Portals &amp; Tools</h4>
          <ul className="footer-links">
            <li><Link to="/login?role=student">Student Portal</Link></li>
            <li><Link to="/login?role=recruiter">Recruiter Portal</Link></li>
            <li><Link to="/login?role=admin">Placement Cell Admin</Link></li>
            <li><Link to="/ai">AI Career Suite</Link></li>
          </ul>
        </div>

        {/* Col 4: Placement Office */}
        <div>
          <h4 className="footer-col-title">Placement Office</h4>
          <p className="text-xs text-muted mb-2" style={{ lineHeight: 1.6 }}>Central Placement &amp; Training Cell<br />Engineering Campus, Knowledge Park</p>
          <p className="text-xs text-muted mb-2" style={{ lineHeight: 1.6 }}>Email: placements@college.edu<br />Phone: +91 (080) 2345-6789</p>
          <div className="footer-hours text-xs text-brand font-semibold" style={{ marginTop: 8 }}>Hours: Mon–Fri, 9:00 AM – 5:30 PM</div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="container flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div className="text-xs text-muted">
            &copy; 2026 Campus Connect Placement Portal. All rights reserved.
          </div>
          <div className="footer-legal-links">
            <Link to="/about">About Platform</Link>
            <Link to="/contact">Contact Cell</Link>
            <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Placement Policy</span>
            <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
