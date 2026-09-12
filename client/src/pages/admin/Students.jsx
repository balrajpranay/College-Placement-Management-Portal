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
        <div className="modal-backdrop" onClick={() => setSelectedStudent(null)}>
          <div className="modal-dialog" style={{ maxWidth: 650 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="h3" style={{ margin: 0 }}>Candidate Profile Overview</h3>
              <button className="btn-close" onClick={() => setSelectedStudent(null)}>
                <Icon name="x" size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="flex-align-center mb-4" style={{ gap: '1rem' }}>
                <div
                  className="avatar"
                  style={{
                    width: 48,
                    height: 48,
                    fontSize: '1.25rem',
                    background: 'linear-gradient(135deg, #0096FF, #0056b3)',
                    color: '#FFF'
                  }}
                >
                  {(selectedStudent.name[0] || 'S').toUpperCase()}
                </div>
                <div>
                  <h4 className="h4" style={{ margin: 0 }}>{selectedStudent.name}</h4>
                  <p className="text-muted text-sm" style={{ margin: 0 }}>
                    {selectedStudent.studentNo} · {selectedStudent.department}
                  </p>
                </div>
              </div>

              <div className="grid grid-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-muted">EMAIL ADDRESS</div>
                  <div className="font-medium">{selectedStudent.email}</div>
                </div>
                <div>
                  <div className="text-xs text-muted">PHONE NUMBER</div>
                  <div className="font-medium">{selectedStudent.phone || '+91 98765 43210'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted">CGPA / BACKLOGS</div>
                  <div className="font-medium">{selectedStudent.cgpa} CGPA (Backlogs: {selectedStudent.backlogs})</div>
                </div>
                <div>
                  <div className="text-xs text-muted">GRADUATION BATCH</div>
                  <div className="font-medium">Class of {selectedStudent.gradYear}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-muted mb-1">TECHNICAL SKILLS</div>
                <div className="flex" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(selectedStudent.skills || ['Python', 'React', 'SQL']).map(sk => (
                    <span key={sk} className="badge badge-neutral">{sk}</span>
                  ))}
                </div>
              </div>

              {selectedStudent.applications && selectedStudent.applications.length > 0 && (
                <div>
                  <div className="text-xs text-muted mb-2">CAMPUS DRIVE APPLICATIONS</div>
                  <div className="table-responsive">
                    <table className="table text-sm">
                      <thead>
                        <tr>
                          <th>Drive</th>
                          <th>Company</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedStudent.applications.map(a => (
                          <tr key={a.id}>
                            <td className="font-medium">{a.driveTitle}</td>
                            <td>{a.companyName}</td>
                            <td>
                              <span className={`badge ${
                                a.status === 'Selected' ? 'badge-success' : 'badge-neutral'
                              }`}>{a.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
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
