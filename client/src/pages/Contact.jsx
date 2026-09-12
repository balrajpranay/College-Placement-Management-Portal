import React from 'react';
import Icon from '../components/Icon';

export default function Contact() {
  return (
    <section className="section container container-narrow" style={{ paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-16)' }}>
      <div className="section-head" style={{ textAlign: 'left', marginLeft: 0, marginBottom: 'var(--space-8)' }}>
        <div className="eyebrow" style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-cyan-600)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>
          Contact Information
        </div>
        <h1 className="h1" style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
          Training &amp; Placement Cell
        </h1>
        <p className="text-muted" style={{ fontSize: '1.05rem' }}>
          Reach out to our placement officers and support staff for corporate partnerships and student inquiries.
        </p>
      </div>

      <div className="grid-2 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div className="stat-icon brand mb-3" style={{ width: 44, height: 44, borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 150, 255, 0.12)', color: 'var(--accent-cyan-500)', marginBottom: 'var(--space-3)' }}>
            <Icon name="map-pin" size={20} />
          </div>
          <h4 className="mb-2" style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>Office Location</h4>
          <p className="text-muted text-sm" style={{ lineHeight: 1.6 }}>
            Training &amp; Placement Center<br />
            2nd Floor, Academic Block A<br />
            College Main Campus, Pin 400001
          </p>
        </div>

        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div className="stat-icon accent mb-3" style={{ width: 44, height: 44, borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 150, 255, 0.12)', color: 'var(--accent-cyan-500)', marginBottom: 'var(--space-3)' }}>
            <Icon name="clock" size={20} />
          </div>
          <h4 className="mb-2" style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>Office Hours</h4>
          <p className="text-muted text-sm" style={{ lineHeight: 1.6 }}>
            Monday – Friday: 9:00 AM – 5:30 PM<br />
            Saturday: 9:00 AM – 1:00 PM<br />
            Sunday: Closed
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 'var(--space-8)' }}>
        <h3 className="h3 mb-4" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
          Direct Contact Directory
        </h3>
        <div className="table-wrap" style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '12px 16px', fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Department / Role</th>
                <th style={{ padding: '12px 16px', fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Contact Person</th>
                <th style={{ padding: '12px 16px', fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Email</th>
                <th style={{ padding: '12px 16px', fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Phone</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td className="cell-primary" style={{ padding: '14px 16px', fontWeight: 600 }}>Head – Training &amp; Placements</td>
                <td style={{ padding: '14px 16px' }}>Dr. R. K. Sharma</td>
                <td style={{ padding: '14px 16px' }}><a href="mailto:head.placements@college.edu" className="text-brand font-semibold" style={{ color: 'var(--accent-cyan-600)' }}>head.placements@college.edu</a></td>
                <td className="cell-muted" style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>+91 (0) 1234 567 891</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td className="cell-primary" style={{ padding: '14px 16px', fontWeight: 600 }}>Corporate Relations Lead</td>
                <td style={{ padding: '14px 16px' }}>Ms. Ananya Roy</td>
                <td style={{ padding: '14px 16px' }}><a href="mailto:corporate@college.edu" className="text-brand font-semibold" style={{ color: 'var(--accent-cyan-600)' }}>corporate@college.edu</a></td>
                <td className="cell-muted" style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>+91 (0) 1234 567 892</td>
              </tr>
              <tr>
                <td className="cell-primary" style={{ padding: '14px 16px', fontWeight: 600 }}>Student Support Desk</td>
                <td style={{ padding: '14px 16px' }}>Placement Office Staff</td>
                <td style={{ padding: '14px 16px' }}><a href="mailto:placements@college.edu" className="text-brand font-semibold" style={{ color: 'var(--accent-cyan-600)' }}>placements@college.edu</a></td>
                <td className="cell-muted" style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>+91 (0) 1234 567 890</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
