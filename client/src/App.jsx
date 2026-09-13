import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import StudentLayout from './layouts/StudentLayout';
import RecruiterLayout from './layouts/RecruiterLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Landing from './pages/Landing';
import About from './pages/About';
import Contact from './pages/Contact';
import JobsHub from './pages/JobsHub';
import AISuite from './pages/AISuite';
import Login from './pages/Login';
import RegisterStudent from './pages/RegisterStudent';
import RegisterRecruiter from './pages/RegisterRecruiter';

// Student Portal Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentDrives from './pages/student/Drives';
import StudentDriveDetail from './pages/student/DriveDetail';
import StudentApplications from './pages/student/Applications';
import StudentInterviews from './pages/student/Interviews';
import StudentNotifications from './pages/student/Notifications';
import StudentSkillUp from './pages/student/SkillUp';

// Recruiter Portal Pages (Step 7A, 7B, 7C, 7D & 7E)
import RecruiterDashboard from './pages/recruiter/Dashboard';
import RecruiterProfile from './pages/recruiter/Profile';
import RecruiterDrives from './pages/recruiter/Drives';
import RecruiterCreateDrive from './pages/recruiter/CreateDrive';
import RecruiterApplicants from './pages/recruiter/Applicants';
import RecruiterInterviews from './pages/recruiter/Interviews';
import RecruiterResults from './pages/recruiter/Results';
import RecruiterNotifications from './pages/recruiter/Notifications';
import RecruiterPlaceholder from './pages/recruiter/RecruiterPlaceholder';

// Admin Portal Pages (Step 8A & 8B)
import AdminDashboard from './pages/admin/Dashboard';
import AdminStudents from './pages/admin/Students';
import AdminRecruiters from './pages/admin/Recruiters';
import AdminDrives from './pages/admin/Drives';
import AdminApplications from './pages/admin/Applications';
import AdminNotifications from './pages/admin/Notifications';

// Protected Route Guard
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Pages */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/opportunities" element={<JobsHub isStudentPortal={false} />} />
            <Route path="/jobs" element={<JobsHub isStudentPortal={false} />} />
            <Route path="/skill-up" element={<StudentSkillUp />} />
            <Route path="/ai-suite" element={<AISuite />} />
            <Route path="/ai" element={<AISuite />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register/student" element={<RegisterStudent />} />
            <Route path="/register/recruiter" element={<RegisterRecruiter />} />
          </Route>

          {/* Student Portal (Protected for role === 'student') */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="opportunities" element={<JobsHub isStudentPortal={true} />} />
            <Route path="jobs" element={<JobsHub isStudentPortal={true} />} />
            <Route path="skill-up" element={<StudentSkillUp />} />
            <Route path="drives" element={<StudentDrives />} />
            <Route path="drives/:id" element={<StudentDriveDetail />} />
            <Route path="applications" element={<StudentApplications />} />
            <Route path="interviews" element={<StudentInterviews />} />
            <Route path="notifications" element={<StudentNotifications />} />
          </Route>

          {/* Recruiter Portal (Protected for role === 'recruiter' - Step 7A & 7B) */}
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <RecruiterLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/recruiter/dashboard" replace />} />
            <Route path="dashboard" element={<RecruiterDashboard />} />
            <Route path="profile" element={<RecruiterProfile />} />
            <Route path="drives" element={<RecruiterDrives />} />
            <Route path="drives/create" element={<RecruiterCreateDrive />} />
            <Route path="drives/:id/edit" element={<RecruiterCreateDrive />} />
            <Route path="applicants" element={<RecruiterApplicants />} />
            <Route path="interviews" element={<RecruiterInterviews />} />
            <Route path="results" element={<RecruiterResults />} />
            <Route path="notifications" element={<RecruiterNotifications />} />
          </Route>

          {/* Admin Portal (Protected for role === 'admin' - Step 8A & 8B) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="recruiters" element={<AdminRecruiters />} />
            <Route path="drives" element={<AdminDrives />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="notifications" element={<AdminNotifications />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

