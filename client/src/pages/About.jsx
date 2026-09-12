import React from 'react';
import Icon from '../components/Icon';

export default function About() {
  return (
    <main className="page-body" style={{ padding: '0 0 var(--space-16)' }}>
      {/* 1. Hero Section */}
      <section className="about-hero-section" style={{ padding: 'var(--space-12) 0 var(--space-8)' }}>
        <div className="container">
          <div className="section-head text-center" style={{ maxWidth: 840, margin: '0 auto var(--space-8)' }}>
            <div className="section-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-cyan-600)', marginBottom: 'var(--space-4)' }}>
              <Icon name="info" size={14} /> About the Platform
            </div>
            <h1 className="h1" style={{ fontSize: '2.75rem', lineHeight: 1.2, marginBottom: 'var(--space-4)', fontWeight: 800 }}>
              Empowering Institutional Careers Through <span className="text-gradient">Intelligent Automation</span>
            </h1>
            <p className="text-lead" style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Campus Connect is the official next-generation placement management system designed to unify students, corporate hiring partners, and the college placement office in a verified, transparent, and AI-assisted ecosystem.
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="stats-grid-container mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
            <div className="stat-box card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
              <div className="stat-icon-wrap brand" style={{ width: 48, height: 48, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 150, 255, 0.12)', color: 'var(--accent-cyan-500)', margin: '0 auto var(--space-3)' }}>
                <Icon name="users" size={22} />
              </div>
              <div className="stat-number" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--brand-navy-900)' }}>850+</div>
              <div className="stat-label font-bold text-sm" style={{ color: 'var(--text-main)', marginTop: 4 }}>Verified Students</div>
              <div className="stat-sub text-xs text-muted" style={{ marginTop: 2 }}>Across Engineering &amp; Tech Batches</div>
            </div>

            <div className="stat-box card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
              <div className="stat-icon-wrap accent" style={{ width: 48, height: 48, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 150, 255, 0.12)', color: 'var(--accent-cyan-500)', margin: '0 auto var(--space-3)' }}>
                <Icon name="building" size={22} />
              </div>
              <div className="stat-number" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--brand-navy-900)' }}>48+</div>
              <div className="stat-label font-bold text-sm" style={{ color: 'var(--text-main)', marginTop: 4 }}>Corporate Partners</div>
              <div className="stat-sub text-xs text-muted" style={{ marginTop: 2 }}>Active Hiring Partners</div>
            </div>

            <div className="stat-box card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
              <div className="stat-icon-wrap success" style={{ width: 48, height: 48, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success-500)', margin: '0 auto var(--space-3)' }}>
                <Icon name="award" size={22} />
              </div>
              <div className="stat-number" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--brand-navy-900)' }}>320+</div>
              <div className="stat-label font-bold text-sm" style={{ color: 'var(--text-main)', marginTop: 4 }}>Placed Offers</div>
              <div className="stat-sub text-xs text-muted" style={{ marginTop: 2 }}>Season 2025–2026</div>
            </div>

            <div className="stat-box card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
              <div className="stat-icon-wrap warning" style={{ width: 48, height: 48, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(245, 158, 11, 0.12)', color: 'var(--warning-500)', margin: '0 auto var(--space-3)' }}>
                <Icon name="trending-up" size={22} />
              </div>
              <div className="stat-number" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--brand-navy-900)' }}>₹24.5L</div>
              <div className="stat-label font-bold text-sm" style={{ color: 'var(--text-main)', marginTop: 4 }}>Peak Package (CTC)</div>
              <div className="stat-sub text-xs text-muted" style={{ marginTop: 2 }}>Average Package: ₹8.5 LPA</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Three-Pillar Core Ecosystem */}
      <section className="section" style={{ padding: 'var(--space-12) 0', background: 'var(--bg-surface-alt)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-head text-center" style={{ marginBottom: 'var(--space-10)' }}>
            <div className="section-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-cyan-600)', marginBottom: 'var(--space-2)' }}>
              <Icon name="grid" size={14} /> Unified Ecosystem
            </div>
            <h2 className="h2" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Built for Every Stakeholder in Campus Hiring</h2>
            <p className="text-muted">A streamlined, end-to-end operational platform serving students and institutional placement offices.</p>
          </div>

          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
            {/* For Students */}
            <div className="card" style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column' }}>
              <div className="stat-icon brand mb-4" style={{ width: 48, height: 48, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 150, 255, 0.12)', color: 'var(--accent-cyan-500)', marginBottom: 'var(--space-4)' }}>
                <Icon name="user" size={24} />
              </div>
              <h3 className="h3" style={{ fontSize: '1.3rem', margin: '0 0 var(--space-2)', fontWeight: 700 }}>For Students</h3>
              <p className="text-muted text-sm mb-4" style={{ lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
                A centralized candidate hub to build verified profiles, verify drive cutoffs in real time, apply with one click, and access Google Gemini AI coaching.
              </p>
              <ul className="about-feature-list mt-auto" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem' }}>
                <li className="flex-align-center" style={{ gap: 8 }}><Icon name="check" size={14} style={{ color: 'var(--success-500)' }} /> Automated CGPA &amp; Backlog Eligibility</li>
                <li className="flex-align-center" style={{ gap: 8 }}><Icon name="check" size={14} style={{ color: 'var(--success-500)' }} /> 1-Click Drive &amp; Internship Applications</li>
                <li className="flex-align-center" style={{ gap: 8 }}><Icon name="check" size={14} style={{ color: 'var(--success-500)' }} /> Live Google Gemini AI Career Advisor</li>
                <li className="flex-align-center" style={{ gap: 8 }}><Icon name="check" size={14} style={{ color: 'var(--success-500)' }} /> Real-time Interview Calendar Alerts</li>
              </ul>
            </div>

            {/* Live Opportunities & Industry Feeds */}
            <div className="card" style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column' }}>
              <div className="stat-icon accent mb-4" style={{ width: 48, height: 48, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 150, 255, 0.12)', color: 'var(--accent-cyan-500)', marginBottom: 'var(--space-4)' }}>
                <Icon name="briefcase" size={24} />
              </div>
              <h3 className="h3" style={{ fontSize: '1.3rem', margin: '0 0 var(--space-2)', fontWeight: 700 }}>Live Opportunity Feeds</h3>
              <p className="text-muted text-sm mb-4" style={{ lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
                Aggregates verified on-campus placement drives, national PM Internship Scheme opportunities, and live global tech listings directly into one unified catalog.
              </p>
              <ul className="about-feature-list mt-auto" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem' }}>
                <li className="flex-align-center" style={{ gap: 8 }}><Icon name="check" size={14} style={{ color: 'var(--success-500)' }} /> Real-Time API Opportunity Feeds</li>
                <li className="flex-align-center" style={{ gap: 8 }}><Icon name="check" size={14} style={{ color: 'var(--success-500)' }} /> Curated PM Internship Scheme Tracks</li>
                <li className="flex-align-center" style={{ gap: 8 }}><Icon name="check" size={14} style={{ color: 'var(--success-500)' }} /> Salary, Work Mode &amp; Domain Filters</li>
                <li className="flex-align-center" style={{ gap: 8 }}><Icon name="check" size={14} style={{ color: 'var(--success-500)' }} /> Instant Source Application Redirection</li>
              </ul>
            </div>

            {/* For Placement Cell */}
            <div className="card" style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column' }}>
              <div className="stat-icon success mb-4" style={{ width: 48, height: 48, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success-500)', marginBottom: 'var(--space-4)' }}>
                <Icon name="shield" size={24} />
              </div>
              <h3 className="h3" style={{ fontSize: '1.3rem', margin: '0 0 var(--space-2)', fontWeight: 700 }}>For Placement Cell</h3>
              <p className="text-muted text-sm mb-4" style={{ lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
                Institutional command center providing complete governance, batch statistics, policy enforcement, and audit-ready analytics reports.
              </p>
              <ul className="about-feature-list mt-auto" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem' }}>
                <li className="flex-align-center" style={{ gap: 8 }}><Icon name="check" size={14} style={{ color: 'var(--success-500)' }} /> Batch-Wide Placement Analytics</li>
                <li className="flex-align-center" style={{ gap: 8 }}><Icon name="check" size={14} style={{ color: 'var(--success-500)' }} /> 'One Student One Offer' Rule Engine</li>
                <li className="flex-align-center" style={{ gap: 8 }}><Icon name="check" size={14} style={{ color: 'var(--success-500)' }} /> Dean Roster Academic Verification</li>
                <li className="flex-align-center" style={{ gap: 8 }}><Icon name="check" size={14} style={{ color: 'var(--success-500)' }} /> Institutional Broadcast Notices</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
