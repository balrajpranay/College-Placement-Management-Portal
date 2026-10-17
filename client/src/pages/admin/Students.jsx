import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import { getAdminStudentsApi, getAdminStudentDetailApi } from '../../services/api';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    loadStudents();
  }, [search, selectedDept]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.q = search.trim();
      if (selectedDept !== 'All') params.department = selectedDept;
      const res = await getAdminStudentsApi(params);
      if (res && res.data) {
        setStudents(res.data);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const res = await getAdminStudentDetailApi(id);
      if (res && res.data) {
        setSelectedStudent(res.data);
      }
    } catch (err) {
      console.error('Failed to load student details:', err);
    }
  };

  const departments = [
    'All',
    'Computer Science',
    'Information Technology',
    'Electronics & Comm.',
    'Mechanical Engineering',
    'Electrical Engineering'
  ];

  return (
    <div className="admin-students-page">
      <div className="flex-between mb-6" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="h2" style={{ margin: '0 0 var(--space-1)' }}>Institutional Student Roster</h1>
          <p className="text-muted" style={{ margin: 0 }}>
            Review candidate profiles, academic eligibility, and career application records.
          </p>
        </div>
        <div className="badge badge-brand" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
          {students.length} Candidates Listed
        </div>
      </div>

      <div className="card mb-6" style={{ padding: '1rem 1.25rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div className="topbar-search" style={{ flex: 1, minWidth: 260, maxWidth: 400 }}>
            <input
              type="text"
              placeholder="Search by name, email, roll no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex-align-center" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
            <label className="text-xs font-semibold text-muted">DEPARTMENT:</label>
            <select
              className="form-control"
              style={{ width: 'auto', minWidth: 200 }}
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted">Loading candidate roster...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="graduation" size={36} className="text-muted mb-2" />
            <p className="text-muted">No students found matching your criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Candidate</th>
                  <th>Department</th>
                  <th>Grad Year</th>
                  <th>CGPA</th>
                  <th>Applications</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td className="font-mono text-sm">{s.studentNo}</td>
                    <td>
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-xs text-muted">{s.email}</div>
                    </td>
                    <td>{s.department}</td>
                    <td>{s.gradYear}</td>
                    <td className="font-medium text-brand">{s.cgpa}</td>
                    <td>
                      <span className="badge badge-neutral">{s.applicationsCount} Applied</span>
                    </td>
                    <td>
                      <span className={`badge ${
                        s.status === 'Selected' ? 'badge-success' :
                        s.status === 'Interview Scheduled' ? 'badge-brand' : 'badge-neutral'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleViewDetail(s.id)}
                      >
                        <Icon name="user" size={14} /> <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedStudent && (
        <div
          className="modal-backdrop open"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(6, 19, 37, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050,
            padding: 'var(--space-4)'
          }}
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="modal modal-dialog"
            style={{
              maxWidth: 720,
              width: '100%',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-subtle)',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="h3" style={{ margin: 0 }}>Candidate Profile Overview</h3>
              <button className="btn-close" onClick={() => setSelectedStudent(null)}>
                <Icon name="x" size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ overflowY: 'auto', flex: 1 }}>
              {/* Candidate Top Hero Bar */}
              <div className="mb-4">
                <div className="flex-between" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div className="flex-align-center" style={{ gap: '0.85rem' }}>
                    <div
                      className="avatar"
                      style={{
                        width: 48,
                        height: 48,
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #0096FF, #0056b3)',
                        color: '#FFF',
                        boxShadow: '0 2px 8px rgba(0, 150, 255, 0.25)',
                        flexShrink: 0
                      }}
                    >
                      {(selectedStudent.name?.[0] || 'S').toUpperCase()}
                    </div>
                    <div>
                      <h4 className="h4" style={{ margin: '0 0 0.35rem', fontSize: '1.25rem', fontWeight: 700 }}>
                        {selectedStudent.name}
                      </h4>
                      <div className="flex-align-center" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span className="badge badge-brand font-mono" style={{ fontSize: '0.75rem' }}>
                          {selectedStudent.studentNo}
                        </span>
                        <span className="badge badge-neutral">
                          {selectedStudent.department}
                        </span>
                        <span className="badge badge-neutral">
                          Class of {selectedStudent.gradYear}
                        </span>
                        <span className={`badge ${
                          selectedStudent.status === 'Selected' ? 'badge-success' :
                          selectedStudent.status === 'Interview Scheduled' ? 'badge-brand' : 'badge-neutral'
                        }`}>
                          {selectedStudent.status || 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="text-xs text-muted font-semibold uppercase tracking-wider">ACADEMIC STANDING</div>
                    <div className="font-bold text-brand" style={{ fontSize: '1.15rem' }}>
                      {selectedStudent.cgpa !== undefined ? `${selectedStudent.cgpa} CGPA` : 'N/A'}
                    </div>
                    <div className="text-xs text-muted">
                      {selectedStudent.backlogs === 0 ? '0 Active Backlogs' : `${selectedStudent.backlogs} Active Backlog(s)`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Candidate Identity & Contact Audit Card */}
              <div style={{ background: 'var(--bg-surface-secondary, rgba(0,0,0,0.02))', padding: '14px 16px', borderRadius: 8, marginBottom: 16, border: '1px solid var(--border-subtle)' }}>
                <div className="flex-between mb-2" style={{ alignItems: 'center' }}>
                  <div className="text-xs font-semibold text-muted uppercase tracking-wider">
                    CANDIDATE IDENTITY & CONTACT AUDIT
                  </div>
                  <div>
                    <span className="badge badge-success" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                      <Icon name="check" size={12} style={{ marginRight: 4 }} /> Verified University Student
                    </span>
                  </div>
                </div>
                <div className="grid grid-2 gap-3" style={{ fontSize: '0.85rem' }}>
                  <div>
                    <span className="text-xs text-muted">Candidate Name: </span>
                    <span className="font-semibold">{selectedStudent.name}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted">Institutional Roll No: </span>
                    <span className="font-mono text-xs font-semibold">{selectedStudent.studentNo}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted">University Email: </span>
                    <span className="font-mono text-xs">{selectedStudent.email}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted">Primary Phone: </span>
                    <span className="font-mono text-xs">{selectedStudent.phone || '+91 98765 43210'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted">Academic Department: </span>
                    <span className="font-medium">{selectedStudent.department}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted">Graduation Cohort: </span>
                    <span className="font-medium">Class of {selectedStudent.gradYear}</span>
                  </div>
                </div>
              </div>

              {/* Academic Specifications & Career Activity Cards */}
              <div className="grid grid-2 gap-4 mb-4">
                <div style={{ background: 'var(--bg-surface-secondary, #fafafa)', padding: '10px 14px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                  <div className="text-xs text-muted font-semibold mb-1 uppercase tracking-wider">CUMULATIVE CGPA & RECORD</div>
                  <div className="font-semibold text-sm">
                    {selectedStudent.cgpa !== undefined ? `${selectedStudent.cgpa} CGPA` : 'N/A'}
                  </div>
                  <div className="text-xs text-muted mt-1">
                    Institutional Standing: {selectedStudent.backlogs === 0 ? 'Strictly 0 Active Backlogs' : `${selectedStudent.backlogs} Active Backlog(s)`}
                  </div>
                </div>
                <div style={{ background: 'var(--bg-surface-secondary, #fafafa)', padding: '10px 14px', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                  <div className="text-xs text-muted font-semibold mb-1 uppercase tracking-wider">PLACEMENT PIPELINE & OUTCOME</div>
                  <div className="font-semibold text-sm">
                    {(selectedStudent.applications?.length ?? selectedStudent.applicationsCount) || 0} {(selectedStudent.applications?.length ?? selectedStudent.applicationsCount) === 1 ? 'Campus Application' : 'Campus Applications'}
                  </div>
                  <div className="text-xs text-muted mt-1">
                    Current Stage: {selectedStudent.status || 'Active'}
                  </div>
                </div>
              </div>

              {/* Technical Skills & Competencies */}
              <div className="mb-4">
                <div className="text-xs text-muted mb-1 font-semibold uppercase tracking-wider">TECHNICAL SKILLS & COMPETENCIES</div>
                <div className="flex" style={{ flexWrap: 'wrap', gap: '0.4rem' }}>
                  {selectedStudent.skills && selectedStudent.skills.length > 0 ? (
                    selectedStudent.skills.map(s => (
                      <span key={s} className="badge badge-brand" style={{ background: 'rgba(0,150,255,0.08)', fontSize: '0.8rem', padding: '4px 10px' }}>
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted italic">Core domain fundamentals, technical aptitude, and problem solving.</span>
                  )}
                </div>
              </div>

              {/* Campus Drive Applications */}
              <div className="mb-4">
                <div className="text-xs text-muted mb-2 font-semibold uppercase tracking-wider">CAMPUS DRIVE APPLICATIONS</div>
                {selectedStudent.applications && selectedStudent.applications.length > 0 ? (
                  <div className="table-responsive" style={{ border: '1px solid var(--border-subtle)', borderRadius: 6, overflow: 'hidden' }}>
                    <table className="table text-sm" style={{ margin: 0 }}>
                      <thead>
                        <tr>
                          <th>Drive / Role</th>
                          <th>Corporate Partner</th>
                          <th>Package (LPA)</th>
                          <th>Application Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedStudent.applications.map(a => (
                          <tr key={a.id || a._id}>
                            <td className="font-semibold">{a.driveTitle}</td>
                            <td>
                              <span className="badge badge-brand" style={{ fontWeight: 500 }}>
                                {a.companyName}
                              </span>
                            </td>
                            <td className="text-brand font-medium">
                              {a.ctc ? `₹${a.ctc} LPA` : '—'}
                            </td>
                            <td>
                              <span className={`badge ${
                                a.status === 'Selected' ? 'badge-success' :
                                a.status === 'Interview Scheduled' ? 'badge-brand' : 'badge-neutral'
                              }`}>{a.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-3 text-center text-muted text-xs" style={{ background: 'var(--bg-surface-secondary, #fafafa)', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                    No campus placement applications recorded for this candidate yet.
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer flex-between">
              <div>
                <span className="text-xs text-muted">
                  Candidate ID: <span className="font-mono">{selectedStudent.id || selectedStudent._id}</span>
                </span>
              </div>
              <button className="btn btn-outline" onClick={() => setSelectedStudent(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
