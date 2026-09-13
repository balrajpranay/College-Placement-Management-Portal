import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { applyForJobApi } from '../services/api';

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

const featuredMNCs = [
  { id: 'mnc-google', name: 'Google', logo: '/static/images/companies/google.svg', roles: 'Software Engineer · Cloud · Data', title: 'Software Engineer - University Graduate', location: 'Bengaluru, India', salary: '₹14.0 - ₹24.0 LPA', url: 'https://www.google.com/about/careers/applications/jobs/results/?location=India' },
  { id: 'mnc-microsoft', name: 'Microsoft', logo: '/static/images/companies/microsoft.svg', roles: 'University SDE · Azure · AI', title: 'Cloud Solutions & AI Trainee', location: 'Hyderabad, India', salary: '₹15.0 - ₹22.0 LPA', url: 'https://careers.microsoft.com/v2/global/en/home.html#find-jobs?p=India&e=Students%20and%20graduates' },
  { id: 'mnc-infosys', name: 'Infosys', logo: '/static/images/companies/infosys.svg', roles: 'Specialist Programmer · DSE', title: 'Specialist Programmer & Systems Engineer', location: 'Bengaluru, India', salary: '₹9.5 - ₹14.0 LPA', url: 'https://career.infosys.com/joblist?countrycode=IN&companyhiringtype=IL' },
  { id: 'mnc-deloitte', name: 'Deloitte', logo: '/static/images/companies/deloitte.svg', roles: 'Tech Analyst · Advisory', title: 'Technology Analyst - Cloud Advisory', location: 'Hyderabad, India', salary: '₹8.5 - ₹13.0 LPA', url: 'https://www.deloitte.com/in/en/careers.html' },
  { id: 'mnc-techmahindra', name: 'Tech Mahindra', logo: '/static/images/companies/techmahindra.svg', roles: 'Associate Software Engineer', title: 'Associate Software Engineer Trainee', location: 'Pune, India', salary: '₹5.5 - ₹8.5 LPA', url: 'https://careers.techmahindra.com/' },
  { id: 'mnc-amazon', name: 'Amazon', logo: '/static/images/companies/amazon.svg', roles: 'SDE-1 · Cloud Support', title: 'Graduate SDE-1 (AWS Services)', location: 'Bengaluru, India', salary: '₹16.0 - ₹26.0 LPA', url: 'https://www.amazon.jobs/en/job_categories/software-development?country=IND' },
  { id: 'mnc-tcs', name: 'TCS', logo: '/static/images/companies/tcs.svg', roles: 'Prime (₹9L) · Digital (₹7.5L)', title: 'TCS Digital & Prime Engineering Cadre', location: 'Pan-India', salary: '₹7.5 - ₹9.0 LPA', url: 'https://www.tcs.com/careers/india' },
  { id: 'mnc-wipro', name: 'Wipro', logo: '/static/images/companies/wipro.svg', roles: 'Turbo Dev · Elite Talent', title: 'Wipro Elite National Talent Hunt', location: 'Bengaluru, India', salary: '₹6.5 - ₹8.5 LPA', url: 'https://careers.wipro.com/global-india/jobs?keywords=engineer&location=India' },
  { id: 'mnc-pmi', name: 'PM Internship', logo: '/static/images/companies/pmi.svg', roles: 'Top 500 Corporates Track', title: 'National Corporate Internship (Top 500 Enterprises)', location: 'Pan-India', salary: '₹5,000/mo + ₹6,000 Grant', url: 'https://pminternship.mca.gov.in/' }
];

const featuredPlacements = [
  { id: 'plc-1', title: 'Graduate Software Development Engineer (SDE-1)', company: 'Google', company_name: 'Google', logo: '/static/images/companies/google.svg', salary: '₹14.0 - ₹24.0 LPA', location: 'Bengaluru', work_mode: 'Hybrid', job_type: 'Campus Placement Drive', source: 'Google University Hiring', url: 'https://www.google.com/about/careers/applications/jobs/results/?location=India' },
  { id: 'plc-2', title: 'Specialist Programmer & Systems Engineer', company: 'Infosys Technologies', company_name: 'Infosys Technologies', logo: '/static/images/companies/infosys.svg', salary: '₹9.5 - ₹14.0 LPA', location: 'Bengaluru', work_mode: 'Hybrid', job_type: 'Full-Time', source: 'Infosys Careers', url: 'https://career.infosys.com/joblist?countrycode=IN&companyhiringtype=IL' },
  { id: 'plc-3', title: 'Cloud Solutions & AI Trainee', company: 'Microsoft', company_name: 'Microsoft', logo: '/static/images/companies/microsoft.svg', salary: '₹15.0 - ₹22.0 LPA', location: 'Hyderabad', work_mode: 'Hybrid', job_type: 'Campus Placement Drive', source: 'Microsoft University', url: 'https://careers.microsoft.com/v2/global/en/home.html#find-jobs?p=India&e=Students%20and%20graduates' },
  { id: 'plc-4', title: 'Technology Analyst - Cloud Advisory', company: 'Deloitte', company_name: 'Deloitte', logo: '/static/images/companies/deloitte.svg', salary: '₹8.5 - ₹13.0 LPA', location: 'Hyderabad', work_mode: 'Hybrid', job_type: 'Full-Time', source: 'Deloitte USI', url: 'https://www.deloitte.com/in/en/careers.html' },
  { id: 'plc-5', title: 'Associate Software Engineer Trainee', company: 'Tech Mahindra', company_name: 'Tech Mahindra', logo: '/static/images/companies/techmahindra.svg', salary: '₹5.5 - ₹8.5 LPA', location: 'Pune', work_mode: 'Onsite', job_type: 'Campus Placement Drive', source: 'Tech Mahindra Campus', url: 'https://careers.techmahindra.com/' },
  { id: 'plc-6', title: 'Graduate SDE-1 (AWS Cloud Infrastructure)', company: 'Amazon', company_name: 'Amazon', logo: '/static/images/companies/amazon.svg', salary: '₹16.0 - ₹26.0 LPA', location: 'Bengaluru', work_mode: 'Onsite', job_type: 'Full-Time', source: 'Amazon Jobs', url: 'https://www.amazon.jobs/en/job_categories/software-development?country=IND' }
];

const featuredInternships = [
  { id: 'int-1', title: 'National Corporate Internship (Top 500 Enterprises)', company: 'PM Internship Scheme', company_name: 'PM Internship Scheme', logo: '/static/images/companies/pmi.svg', salary: '₹5,000/mo + ₹6,000 Grant', location: 'Pan-India', work_mode: 'Onsite', job_type: 'PM Internship Scheme', source: 'PM Internship Portal', url: 'https://pminternship.mca.gov.in/' },
  { id: 'int-2', title: 'Regional Engineering & Tech Internships', company: 'AICTE Placement Portal', company_name: 'AICTE Placement Portal', logo: '/static/images/companies/aicte.svg', salary: '₹12,000 - ₹20,000/mo', location: 'Hyderabad Hub', work_mode: 'Hybrid', job_type: 'Internship', source: 'AICTE Portal', url: 'https://internship.aicte-india.org/' },
  { id: 'int-3', title: 'Frontend Developer Intern (React)', company: 'Razorpay Software', company_name: 'Razorpay Software', logo: '/static/images/companies/razorpay.svg', salary: '₹25,000 - ₹35,000/mo', location: 'Bengaluru', work_mode: 'Hybrid', job_type: 'Internship', source: 'Razorpay Careers', url: 'https://razorpay.com/jobs/' },
  { id: 'int-4', title: 'Data Analytics & ML Research Intern', company: 'FinEdge Analytics', company_name: 'FinEdge Analytics', logo: null, salary: '₹18,000 - ₹25,000/mo', location: 'Mumbai', work_mode: 'Hybrid', job_type: 'Internship', source: 'FinEdge Hiring', url: 'https://internship.aicte-india.org/' }
];

const activeDrivesSchedule = [
  { id: 'drv-1', title: 'Software Engineer - New Grad', company_name: 'TechNova Solutions', location: 'Bengaluru', branches: ['CSE', 'IT', 'ECE'], package_lpa: '12.0', min_cgpa: '7.0', max_backlogs: '1', deadline: '2026-09-15' },
  { id: 'drv-2', title: 'Data Analytics & Systems Associate', company_name: 'FinEdge Analytics', location: 'Mumbai', branches: ['All Branches'], package_lpa: '6.5', min_cgpa: '7.5', max_backlogs: '0', deadline: '2026-09-20' },
  { id: 'drv-3', title: 'Cloud Infrastructure Engineer', company_name: 'ZenithCloud Systems', location: 'Hyderabad', branches: ['CSE', 'IT', 'ECE', 'EE'], package_lpa: '10.5', min_cgpa: '7.2', max_backlogs: '0', deadline: '2026-09-25' }
];

const aiDemos = {
  eligibility: {
    user: "What are the eligibility requirements for Tier-1 placement drives?",
    bot: "🎯 <strong>Tier-1 Drive Eligibility Standards:</strong><br><br>• <strong>CGPA Cutoff:</strong> 7.5+ with 0 active backlogs across semesters 1–6.<br>• <strong>Core Branches:</strong> Computer Science, IT, Electronics & Communication.<br>• <strong>Rounds:</strong> Online DSA Assessment, System Design/Tech Interview, HR Culture round.<br><br>💡 <em>Tip: Ensure your GitHub repositories and resume projects are verified before the drive date.</em>"
  },
  pminternship: {
    user: "How does the Prime Minister's Internship Scheme work?",
    bot: "🏛️ <strong>PM Internship Scheme Breakdown:</strong><br><br>• <strong>Duration:</strong> 12 months with top 500 companies in India.<br>• <strong>Stipend:</strong> <strong>₹5,000/month</strong> (₹4,500 by Govt + ₹500 by Company) + <strong>₹6,000</strong> one-time grant.<br>• <strong>Eligibility:</strong> Candidates aged 21–24 years with graduate degree or diploma.<br><br>💡 <em>Direct applications are verified on the national PM Internship Portal.</em>"
  },
  dsa: {
    user: "Give me an example coding challenge for an SDE placement interview.",
    bot: "💻 <strong>Placement Coding Question (Medium):</strong><br><br><strong>Problem:</strong> Given a sorted array of distinct integers and a target value, return the index if target is found. If not, return the index where it would be inserted in order.<br><br>• <strong>Time Complexity:</strong> <code>O(log n)</code> via Binary Search.<br>• <strong>Space Complexity:</strong> <code>O(1)</code> in-place pointers.<br><br>💡 <em>Try writing this in Python or Java and test boundary cases (e.g. target smaller than min).</em>"
  },
  technova: {
    user: "What is the hiring pattern and salary package for TechNova Solutions?",
    bot: "🏢 <strong>TechNova Recruitment Profile:</strong><br><br>• <strong>Role:</strong> Software Engineer - New Grad<br>• <strong>Package CTC:</strong> <strong>₹12.0 LPA</strong> (₹10.5L Fixed + ₹1.5L Performance Bonus)<br>• <strong>Rounds:</strong> 1. Online Aptitude & DSA (60m) · 2. Technical Coding (Trees/Graphs) · 3. Director Round.<br><br>💡 <em>Focus on Python/Java OOP concepts and REST API architecture.</em>"
  }
};

export default function Landing() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [oppTab, setOppTab] = useState('placements');
  const [activeAiDemoKey, setActiveAiDemoKey] = useState('eligibility');
  const [aiDemoOutput, setAiDemoOutput] = useState(aiDemos.eligibility);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [globalBanner, setGlobalBanner] = useState(null);

  const handleSecureApply = async (job) => {
    setGlobalBanner(null);

    if (!isAuthenticated || !user) {
      navigate('/login?role=student', {
        state: {
          from: '/jobs',
          targetJob: job,
          message: `Please sign in to your student account to apply for ${job.title || job.name} at ${job.company || job.company_name || job.name}.`
        }
      });
      return;
    }

    if (user.role !== 'student') {
      setGlobalBanner({
        type: 'error',
        message: `Application Denied: Only registered student accounts may apply for placement drives. Logged in as ${user.role}.`
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Authenticated Student
    try {
      const res = await applyForJobApi(job.id || 'plc-1');
      setGlobalBanner({
        type: 'success',
        message: res.message || `Application for ${job.title || job.name} registered successfully!`
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (job.url) {
        window.open(job.url, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      setGlobalBanner({
        type: 'error',
        message: err.message || 'Application could not be processed.'
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAiDemoChange = (key) => {
    setActiveAiDemoKey(key);
    setIsAiLoading(true);
    setTimeout(() => {
      setAiDemoOutput(aiDemos[key] || aiDemos.eligibility);
      setIsAiLoading(false);
    }, 250);
  };

  return (
    <div className="landing-page-container">
      {/* Global Action Banner */}
      {globalBanner && (
        <div className="container" style={{ paddingTop: 16 }}>
          <div className={`alert-box ${globalBanner.type === 'success' ? 'alert-success-box' : 'alert-danger-box'}`}>
            <div className="alert-box-icon">
              <Icon name={globalBanner.type === 'success' ? 'check-circle' : 'alert-circle'} size={18} />
            </div>
            <div className="alert-box-text">
              {globalBanner.message}
            </div>
            <button
              onClick={() => setGlobalBanner(null)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700, marginLeft: 'auto' }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 1. HERO SECTION */}
      <section className="landing-hero">
        <div className="container landing-hero-grid">
          {/* Left Hero Copy */}
          <div className="landing-hero-content">
            <div className="hero-season-badge">
              <span className="live-pulse-dot" aria-hidden="true"></span>
              <span>Placement Season 2025–2026 Live</span>
            </div>

            <h1 className="landing-hero-title">
              Your next opportunity <br />starts on campus.
            </h1>

            <p className="landing-hero-subtitle">
              Campus Connect brings students, corporate recruiters, and college placement teams into one verified ecosystem—combining automated eligibility checks, live opportunity feeds, and AI career coaching.
            </p>

            <div className="landing-hero-cta-row">
              <Link to="/jobs" className="btn btn-primary btn-lg">
                <Icon name="briefcase" size={18} /> Explore Opportunities
              </Link>
              {isAuthenticated && user ? (
                <Link to={`/${user.role}/dashboard`} className="btn btn-outline btn-lg">
                  <Icon name="user" size={18} /> Enter {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Portal
                </Link>
              ) : (
                <Link to="/login?role=student" className="btn btn-outline btn-lg">
                  <Icon name="user" size={18} /> Enter Student Portal
                </Link>
              )}
            </div>

            <div className="hero-trust-micro">
              <span className="text-xs text-muted font-semibold uppercase tracking-wider">Verified institutional platforms:</span>
              <div className="hero-sources-strip">
                <span className="hero-source-tag">AICTE Placement Portal</span>
                <span className="hero-source-tag">PM Internship Scheme</span>
                <span className="hero-source-tag">Naukri &amp; Internshala</span>
              </div>
            </div>
          </div>

          {/* Right Realistic Product Dashboard Visual */}
          <div className="hero-visual-container">
            <div className="product-mockup-card">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>
                <div className="mockup-title-bar">
                  <span>app.campusconnect.edu/student/dashboard</span>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>Live Sync</span>
              </div>

              <div className="mockup-body">
                <div className="mockup-user-bar">
                  <div className="mockup-avatar">PS</div>
                  <div style={{ flex: 1 }}>
                    <div className="mockup-user-name">Priya Sharma <span className="badge badge-brand" style={{ fontSize: '0.65rem', marginLeft: 4 }}>Verified Candidate</span></div>
                    <div className="mockup-user-sub">B.Tech Computer Science · Class of 2026 · CGPA 8.9</div>
                  </div>
                  <div className="mockup-score-badge">
                    <div className="score-num">92%</div>
                    <div className="score-lbl">Profile Strength</div>
                  </div>
                </div>

                <div className="mockup-eligibility-strip">
                  <div className="eligibility-item verified">
                    <Icon name="check" size={14} /> <span>CGPA: 8.9 / 10.0</span>
                  </div>
                  <div className="eligibility-item verified">
                    <Icon name="check" size={14} /> <span>0 Active Backlogs</span>
                  </div>
                  <div className="eligibility-item verified">
                    <Icon name="check" size={14} /> <span>ATS Resume: 94/100</span>
                  </div>
                </div>

                <div className="mockup-drives-list">
                  <div className="mockup-section-heading">
                    <span>ACTIVE OPPORTUNITY MATCHES (3)</span>
                    <span className="text-xs text-brand font-semibold">1-Click Apply</span>
                  </div>

                  <div className="mockup-drive-item" onClick={() => handleSecureApply(featuredPlacements[0])} style={{ cursor: 'pointer' }}>
                    <CompanyLogo logo="/static/images/companies/google.svg" companyName="Google" size={36} />
                    <div style={{ flex: 1 }}>
                      <div className="mockup-drive-role">Graduate SDE-1</div>
                      <div className="mockup-drive-company">Google · Bengaluru</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="mockup-drive-ctc">₹24.0 LPA</div>
                      <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>Apply →</span>
                    </div>
                  </div>

                  <div className="mockup-drive-item" onClick={() => handleSecureApply(featuredPlacements[1])} style={{ cursor: 'pointer' }}>
                    <CompanyLogo logo="/static/images/companies/infosys.svg" companyName="Infosys" size={36} />
                    <div style={{ flex: 1 }}>
                      <div className="mockup-drive-role">Specialist Programmer</div>
                      <div className="mockup-drive-company">Infosys · Bengaluru</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="mockup-drive-ctc">₹14.0 LPA</div>
                      <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>Apply →</span>
                    </div>
                  </div>
                </div>

                <div className="mockup-ai-chip">
                  <div className="mockup-ai-icon"><Icon name="award" size={14} /></div>
                  <div className="text-xs text-muted" style={{ lineHeight: 1.35 }}>
                    <strong style={{ color: 'var(--text-main)' }}>AI Career Advisor:</strong> "Your profile matches Google's DSA criteria. Practice Binary Trees before Friday's technical round."
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. RECRUITER LOGO STRIP & PARTNERS */}
      <section className="partner-ticker-section">
        <div className="container">
          <div className="text-center mb-4">
            <span className="text-xs text-muted font-semibold uppercase tracking-wider">Top Hiring Partners &amp; Corporate Networks</span>
          </div>
          <div className="partner-logos-row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 32 }}>
            {[
              { name: 'Google', logo: '/static/images/companies/google.svg' },
              { name: 'Amazon', logo: '/static/images/companies/amazon.svg' },
              { name: 'Microsoft', logo: '/static/images/companies/microsoft.svg' },
              { name: 'Infosys', logo: '/static/images/companies/infosys.svg' },
              { name: 'Deloitte', logo: '/static/images/companies/deloitte.svg' },
              { name: 'TCS', logo: '/static/images/companies/tcs.svg' },
              { name: 'Tech Mahindra', logo: '/static/images/companies/techmahindra.svg' },
              { name: 'Wipro', logo: '/static/images/companies/wipro.svg' },
              { name: 'L&T Infotech', logo: '/static/images/companies/ltimindtree.svg' }
            ].map(p => (
              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={p.logo} alt={p.name} style={{ width: 24, height: 24, objectFit: 'contain' }} />
                </div>
                <span className="partner-logo-item" style={{ fontWeight: 600 }}>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. VERIFIED INSTITUTIONAL STATS STRIP */}
      <section className="stats-banner-section">
        <div className="container">
          <div className="stats-grid-container">
            <div className="stat-box">
              <div className="stat-icon-wrap brand"><Icon name="users" size={22} /></div>
              <div className="stat-number">850+</div>
              <div className="stat-label">Registered Candidates</div>
              <div className="stat-sub">Verified Institutional Roster</div>
            </div>

            <div className="stat-box">
              <div className="stat-icon-wrap accent"><Icon name="building" size={22} /></div>
              <div className="stat-number">48+</div>
              <div className="stat-label">Corporate Partners</div>
              <div className="stat-sub">Active Placement Recruiters</div>
            </div>

            <div className="stat-box">
              <div className="stat-icon-wrap success"><Icon name="award" size={22} /></div>
              <div className="stat-number">320+</div>
              <div className="stat-label">Offers Placed</div>
              <div className="stat-sub">Across Season 2025–2026</div>
            </div>

            <div className="stat-box">
              <div className="stat-icon-wrap warning"><Icon name="trending-up" size={22} /></div>
              <div className="stat-number">₹24.5L</div>
              <div className="stat-label">Highest Package CTC</div>
              <div className="stat-sub">Average CTC: ₹8.5 LPA</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TABBED PLACEMENTS & OPPORTUNITIES SECTION */}
      <section className="section landing-opportunities-section">
        <div className="container">
          <div className="flex-between mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 'var(--space-6)' }}>
            <div>
              <div className="section-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 9999, fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-cyan-600)', marginBottom: 6 }}>
                <Icon name="briefcase" size={14} /> Live Opportunities
              </div>
              <h2 className="h2" style={{ margin: '0 0 6px', fontSize: '1.85rem', fontWeight: 800 }}>Featured Placements &amp; Internships</h2>
              <p className="text-muted" style={{ margin: 0, fontSize: '1rem' }}>
                Real-time opportunities aggregated from verified placement drives, PM Internship Scheme, and national job boards.
              </p>
            </div>

            {/* Tab Controls */}
            <div className="opportunity-tab-controls" style={{ display: 'flex', gap: 8, background: 'var(--bg-surface-alt)', padding: 4, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
              <button
                className={`btn btn-sm ${oppTab === 'placements' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setOppTab('placements')}
              >
                🎓 Placements &amp; Full-Time Jobs
              </button>
              <button
                className={`btn btn-sm ${oppTab === 'internships' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setOppTab('internships')}
              >
                💼 Internships &amp; PM Scheme
              </button>
            </div>
          </div>

          {/* Tab Panel 1: Placements */}
          {oppTab === 'placements' && (
            <div className="opportunity-panel">
              <div className="landing-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
                {featuredPlacements.map((j) => (
                  <div key={j.id} className="card landing-job-card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div className="flex-between mb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <CompanyLogo logo={j.logo} companyName={j.company_name} size={48} />
                        <span className={`badge ${j.job_type === 'Campus Placement Drive' ? 'badge-brand' : 'badge-success'}`} style={{ fontSize: '0.7rem', padding: '3px 8px' }}>
                          {j.job_type === 'Campus Placement Drive' ? 'Campus Drive' : 'Full-Time'}
                        </span>
                      </div>

                      <h3 className="h4" style={{ margin: '0 0 4px', fontSize: '1.05rem', lineHeight: 1.3, fontWeight: 700 }}>{j.title}</h3>
                      <div className="text-sm font-semibold text-muted mb-3" style={{ marginBottom: 12 }}>{j.company_name}</div>

                      <div className="drive-meta mb-3" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                        <span className="drive-meta-chip" style={{ fontSize: '0.75rem', background: 'var(--bg-surface-alt)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border-subtle)' }}><Icon name="dollar" size={13} /> {j.salary}</span>
                        <span className="drive-meta-chip" style={{ fontSize: '0.75rem', background: 'var(--bg-surface-alt)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border-subtle)' }}><Icon name="map-pin" size={13} /> {j.location}</span>
                        <span className="drive-meta-chip" style={{ fontSize: '0.75rem', background: 'var(--bg-surface-alt)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border-subtle)' }}><Icon name="briefcase" size={13} /> {j.work_mode}</span>
                      </div>
                    </div>

                    <div className="landing-card-footer mt-auto pt-3 flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
                      <span className="text-xs text-muted">Source: {j.source}</span>
                      <button type="button" onClick={() => handleSecureApply(j)} className="btn btn-primary btn-sm">
                        View &amp; Apply &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-6" style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
                <Link to="/jobs" className="btn btn-outline btn-lg">
                  View All Full-Time Placements (14 Active Drives) &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* Tab Panel 2: Internships */}
          {oppTab === 'internships' && (
            <div className="opportunity-panel">
              <div className="landing-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
                {featuredInternships.map((j) => (
                  <div key={j.id} className="card landing-job-card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div className="flex-between mb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <CompanyLogo logo={j.logo} companyName={j.company_name} size={48} />
                        <span className={`badge ${j.job_type === 'PM Internship Scheme' ? 'badge-warning' : 'badge-accent'}`} style={{ fontSize: '0.7rem', padding: '3px 8px' }}>
                          {j.job_type}
                        </span>
                      </div>

                      <h3 className="h4" style={{ margin: '0 0 4px', fontSize: '1.05rem', lineHeight: 1.3, fontWeight: 700 }}>{j.title}</h3>
                      <div className="text-sm font-semibold text-muted mb-3" style={{ marginBottom: 12 }}>{j.company_name}</div>

                      <div className="drive-meta mb-3" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                        <span className="drive-meta-chip" style={{ fontSize: '0.75rem', background: 'var(--bg-surface-alt)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border-subtle)' }}><Icon name="dollar" size={13} /> {j.salary}</span>
                        <span className="drive-meta-chip" style={{ fontSize: '0.75rem', background: 'var(--bg-surface-alt)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border-subtle)' }}><Icon name="map-pin" size={13} /> {j.location}</span>
                        <span className="drive-meta-chip" style={{ fontSize: '0.75rem', background: 'var(--bg-surface-alt)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border-subtle)' }}><Icon name="briefcase" size={13} /> {j.work_mode}</span>
                      </div>
                    </div>

                    <div className="landing-card-footer mt-auto pt-3 flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
                      <span className="text-xs text-muted">Source: {j.source}</span>
                      <button type="button" onClick={() => handleSecureApply(j)} className="btn btn-primary btn-sm">
                        View &amp; Apply &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-6" style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
                <Link to="/jobs" className="btn btn-outline btn-lg">
                  View All Tech &amp; PM Internships &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. 6-STEP CAREER PROGRESS JOURNEY */}
      <section className="section journey-section" style={{ padding: 'var(--space-12) 0', background: 'var(--bg-surface-alt)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-head text-center" style={{ marginBottom: 'var(--space-8)' }}>
            <div className="section-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 9999, fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-cyan-600)', marginBottom: 6 }}>
              <Icon name="trending-up" size={14} /> Structured Pipeline
            </div>
            <h2 className="h2" style={{ fontSize: '2rem', fontWeight: 800 }}>From Student Profile to Offer Letter</h2>
            <p className="text-muted">A clear, transparent 6-stage placement pathway designed for maximum success.</p>
          </div>

          <div className="journey-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
            <div className="card journey-step-card" style={{ padding: 'var(--space-5)', textAlign: 'left' }}>
              <div className="journey-step-num" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan-500)', marginBottom: 6 }}>01</div>
              <h3 className="journey-step-title" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>Complete Profile</h3>
              <p className="journey-step-desc text-xs text-muted" style={{ lineHeight: 1.5 }}>Upload your verified resume, academic transcripts, and technical skill tags.</p>
            </div>

            <div className="card journey-step-card" style={{ padding: 'var(--space-5)', textAlign: 'left' }}>
              <div className="journey-step-num" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan-500)', marginBottom: 6 }}>02</div>
              <h3 className="journey-step-title" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>Verify Eligibility</h3>
              <p className="journey-step-desc text-xs text-muted" style={{ lineHeight: 1.5 }}>Automated rules evaluate CGPA cutoffs and backlog limits before drives open.</p>
            </div>

            <div className="card journey-step-card" style={{ padding: 'var(--space-5)', textAlign: 'left' }}>
              <div className="journey-step-num" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan-500)', marginBottom: 6 }}>03</div>
              <h3 className="journey-step-title" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>AI Skill Scoring</h3>
              <p className="journey-step-desc text-xs text-muted" style={{ lineHeight: 1.5 }}>Gemini AI analyzes your resume against company job descriptions with ATS scoring.</p>
            </div>

            <div className="card journey-step-card" style={{ padding: 'var(--space-5)', textAlign: 'left' }}>
              <div className="journey-step-num" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan-500)', marginBottom: 6 }}>04</div>
              <h3 className="journey-step-title" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>1-Click Apply</h3>
              <p className="journey-step-desc text-xs text-muted" style={{ lineHeight: 1.5 }}>Apply instantly to institutional placement drives and verified corporate tracks.</p>
            </div>

            <div className="card journey-step-card" style={{ padding: 'var(--space-5)', textAlign: 'left' }}>
              <div className="journey-step-num" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan-500)', marginBottom: 6 }}>05</div>
              <h3 className="journey-step-title" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>Attend Interviews</h3>
              <p className="journey-step-desc text-xs text-muted" style={{ lineHeight: 1.5 }}>Track technical tests, GDs, and HR slots on an integrated interview calendar.</p>
            </div>

            <div className="card journey-step-card highlight" style={{ padding: 'var(--space-5)', textAlign: 'left', border: '1px solid var(--accent-cyan-500)' }}>
              <div className="journey-step-num" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success-500)', marginBottom: 6 }}>06</div>
              <h3 className="journey-step-title" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>Secure Offer</h3>
              <p className="journey-step-desc text-xs text-muted" style={{ lineHeight: 1.5 }}>Receive official placement confirmation, offer letters, and institutional records.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EMBEDDED INTERACTIVE AI CAREER ADVISOR MODULE */}
      <section className="section ai-interactive-section" style={{ padding: 'var(--space-12) 0' }}>
        <div className="container">
          <div className="card ai-interactive-box" style={{ padding: 'var(--space-8)' }}>
            <div className="ai-box-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-8)', alignItems: 'center' }}>
              {/* Left Explainer */}
              <div>
                <div className="badge badge-success mb-2" style={{ display: 'inline-block', fontSize: '0.75rem', padding: '3px 8px', marginBottom: 8 }}>Google Gemini AI Career Suite</div>
                <h2 className="h2" style={{ margin: '0 0 var(--space-3)', fontSize: '1.85rem', fontWeight: 800 }}>Interactive Career Intelligence at Your Fingertips</h2>
                <p className="text-muted" style={{ lineHeight: 1.6, marginBottom: 'var(--space-5)', fontSize: '0.95rem' }}>
                  Ask complex questions about placement drive criteria, national internship stipends, or coding interview algorithms. Our AI engine provides verified, context-aware guidance.
                </p>

                <div className="ai-preset-chips-title text-xs font-semibold text-muted mb-2" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>TRY A LIVE PROMPT:</div>
                <div className="ai-interactive-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <button
                    className={`btn btn-xs ${activeAiDemoKey === 'eligibility' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleAiDemoChange('eligibility')}
                  >
                    🎯 Drive Eligibility Rules
                  </button>
                  <button
                    className={`btn btn-xs ${activeAiDemoKey === 'pminternship' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleAiDemoChange('pminternship')}
                  >
                    🏛️ PM Internship Scheme
                  </button>
                  <button
                    className={`btn btn-xs ${activeAiDemoKey === 'dsa' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleAiDemoChange('dsa')}
                  >
                    💻 DSA Binary Search Prep
                  </button>
                  <button
                    className={`btn btn-xs ${activeAiDemoKey === 'technova' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleAiDemoChange('technova')}
                  >
                    🏢 TechNova Hiring Strategy
                  </button>
                </div>

                <div className="mt-5" style={{ marginTop: 'var(--space-5)' }}>
                  <Link to="/ai" className="btn btn-primary btn-lg">
                    <Icon name="award" size={18} /> Open Full AI Career Workspace &rarr;
                  </Link>
                </div>
              </div>

              {/* Right Live Simulator Window */}
              <div className="ai-simulator-window card" style={{ padding: 'var(--space-6)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                <div className="ai-sim-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10, marginBottom: 14 }}>
                  <div className="flex-align-center" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="live-pulse-dot" aria-hidden="true"></span>
                    <span className="font-bold text-xs" style={{ color: 'var(--accent-cyan-600)', letterSpacing: '0.05em' }}>AI CAREER ADVISOR (LIVE PREVIEW)</span>
                  </div>
                  <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>Gemini 3.5 Flash</span>
                </div>

                <div className="ai-sim-body">
                  <div className="ai-sim-user" style={{ background: 'var(--bg-surface-alt)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', padding: '10px 14px', borderRadius: 8, fontSize: '0.875rem', marginBottom: 12, opacity: isAiLoading ? 0.6 : 1 }}>
                    "{aiDemoOutput.user}"
                  </div>
                  <div className="ai-sim-bot" style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-main)' }} dangerouslySetInnerHTML={{ __html: isAiLoading ? '<span style="color:var(--text-muted);">Generating verified intelligence...</span>' : aiDemoOutput.bot }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ACTIVE PLACEMENT DRIVES SCHEDULE */}
      <section className="section active-drives-section" style={{ padding: 'var(--space-12) 0' }}>
        <div className="container">
          <div className="flex-between mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 'var(--space-6)' }}>
            <div>
              <div className="section-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 9999, fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-cyan-600)', marginBottom: 4 }}>
                <Icon name="calendar" size={14} /> On-Campus Calendar
              </div>
              <h2 className="h2" style={{ margin: '0 0 4px', fontSize: '1.85rem', fontWeight: 800 }}>Verified Placement &amp; Hiring Tracks</h2>
              <p className="text-muted" style={{ margin: 0 }}>Direct placement opportunities across national portals and corporate hiring programs.</p>
            </div>
            <Link to="/jobs" className="btn btn-outline btn-sm">
              View All Active Drives &rarr;
            </Link>
          </div>

          <div className="active-drives-table-card card" style={{ padding: 'var(--space-4)', overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '12px 14px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Company &amp; Role</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Eligible Branches</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Package (CTC)</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Cutoff Criteria</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Deadline</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeDrivesSchedule.map((d) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px' }}>
                      <div className="font-bold text-main" style={{ fontWeight: 700 }}>{d.title}</div>
                      <div className="text-xs text-muted">{d.company_name} · {d.location}</div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {d.branches.map(b => (
                          <span key={b} className="skill-tag" style={{ fontSize: '0.72rem', background: 'var(--bg-surface-alt)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border-subtle)' }}>{b}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span className="text-sm font-bold text-brand" style={{ color: 'var(--accent-cyan-600)', fontWeight: 700 }}>₹{d.package_lpa} LPA</span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span className="text-xs font-semibold text-muted">Min CGPA {d.min_cgpa} · Max {d.max_backlogs} Backlog</span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span className="text-xs font-medium text-warning" style={{ color: 'var(--warning-600)', fontWeight: 600 }}>{d.deadline}</span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <button
                        type="button"
                        onClick={() => handleSecureApply({ id: d.id, title: d.title, company: d.company_name, location: d.location, salary: `₹${d.package_lpa} LPA` })}
                        className="btn btn-primary btn-sm"
                      >
                        Apply →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 8. STUDENT SUCCESS STORIES */}
      <section className="section success-stories-section" style={{ padding: 'var(--space-12) 0', background: 'var(--bg-surface-alt)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-head text-center" style={{ marginBottom: 'var(--space-8)' }}>
            <div className="section-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 9999, fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-cyan-600)', marginBottom: 4 }}>
              <Icon name="award" size={14} /> Student Achievements
            </div>
            <h2 className="h2" style={{ fontSize: '1.85rem', fontWeight: 800 }}>Placed Candidate Spotlights</h2>
            <p className="text-muted">Real success stories from students placed through Campus Connect drives.</p>
          </div>

          <div className="stories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
            <div className="card story-card" style={{ padding: 'var(--space-6)' }}>
              <div className="flex-align-center mb-3" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div className="story-avatar" style={{ width: 40, height: 40, borderRadius: 20, background: 'var(--brand-navy-900)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>AK</div>
                <div>
                  <h3 className="h4" style={{ margin: '0 0 2px', fontSize: '1rem', fontWeight: 700 }}>Aarav Kapoor</h3>
                  <div className="text-xs text-muted">B.Tech CSE · Placed at <strong>TechNova</strong></div>
                </div>
                <span className="badge badge-success ml-auto" style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>₹12.0 LPA</span>
              </div>
              <p className="story-quote text-xs text-muted" style={{ lineHeight: 1.6 }}>
                "The automated eligibility check and AI mock interviews gave me exactly what I needed to clear TechNova's multi-round coding process without stress."
              </p>
            </div>

            <div className="card story-card" style={{ padding: 'var(--space-6)' }}>
              <div className="flex-align-center mb-3" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div className="story-avatar" style={{ width: 40, height: 40, borderRadius: 20, background: 'var(--success-700)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>NM</div>
                <div>
                  <h3 className="h4" style={{ margin: '0 0 2px', fontSize: '1rem', fontWeight: 700 }}>Neha Menon</h3>
                  <div className="text-xs text-muted">B.Tech ECE · Placed at <strong>FinEdge Analytics</strong></div>
                </div>
                <span className="badge badge-success ml-auto" style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>₹8.5 LPA</span>
              </div>
              <p className="story-quote text-xs text-muted" style={{ lineHeight: 1.6 }}>
                "Having real-time drive notifications and instant 1-click applications saved me hours during peak placement weeks. The platform is super intuitive."
              </p>
            </div>

            <div className="card story-card" style={{ padding: 'var(--space-6)' }}>
              <div className="flex-align-center mb-3" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div className="story-avatar" style={{ width: 40, height: 40, borderRadius: 20, background: 'var(--accent-cyan-700)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>RV</div>
                <div>
                  <h3 className="h4" style={{ margin: '0 0 2px', fontSize: '1rem', fontWeight: 700 }}>Rohan Verma</h3>
                  <div className="text-xs text-muted">B.Tech IT · Selected for <strong>PM Internship</strong></div>
                </div>
                <span className="badge badge-warning ml-auto" style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>₹5,000/mo + Grant</span>
              </div>
              <p className="story-quote text-xs text-muted" style={{ lineHeight: 1.6 }}>
                "Found the PM Internship Scheme track right on the portal and received full guidance on stipend structure and selection timelines from the AI Advisor."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TOP HIRING PARTNERS SHOWCASE */}
      <section className="section" style={{ padding: 'var(--space-12) 0' }}>
        <div className="container">
          <div className="section-head text-center" style={{ marginBottom: 'var(--space-8)' }}>
            <div className="section-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 9999, fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-cyan-600)', marginBottom: 4 }}>
              <Icon name="building" size={14} /> Corporate Hiring Ecosystem
            </div>
            <h2 className="h2" style={{ fontSize: '1.85rem', fontWeight: 800 }}>Featured Top Hiring Partners</h2>
            <p className="text-muted">Top multinational corporations, Fortune 500 tech leaders, and national internship initiatives actively hiring our graduates.</p>
          </div>

          <div className="company-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
            {featuredMNCs.map((c) => (
              <div
                key={c.name}
                onClick={() => handleSecureApply(c)}
                className="card company-card"
                style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
              >
                <div>
                  <CompanyLogo logo={c.logo} companyName={c.name} size={48} />
                  <div className="company-card-name" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: 12, marginBottom: 4 }}>{c.name}</div>
                  <div className="company-card-roles text-xs text-muted" style={{ lineHeight: 1.5, marginBottom: 12 }}>{c.roles}</div>
                </div>
                <div className="company-card-action text-brand font-semibold text-xs" style={{ color: 'var(--accent-cyan-600)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                  View Opportunity &amp; Apply &rarr;
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
