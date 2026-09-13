const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

function getAuthHeader() {
  const token = localStorage.getItem('campus_jwt_token') || localStorage.getItem('cc_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  const contentType = res.headers.get('content-type');
  let data = null;
  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const errorMsg = (data && data.message) || (data && data.error) || (typeof data === 'string' ? data : 'API Request Failed');
    const err = new Error(errorMsg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// Health Check API
export async function checkServerHealth() {
  const res = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(res);
}

// Authentication APIs
export async function loginApi(credentials) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return handleResponse(res);
}

export async function registerStudentApi(data) {
  const res = await fetch(`${API_BASE_URL}/auth/register/student`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function registerRecruiterApi(data) {
  const res = await fetch(`${API_BASE_URL}/auth/register/recruiter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function getGoogleAuthUrlApi(role = 'student') {
  const res = await fetch(`${API_BASE_URL}/auth/google/url?role=${encodeURIComponent(role)}`);
  return handleResponse(res);
}

export async function googleAuthCallbackApi(payload) {
  const res = await fetch(`${API_BASE_URL}/auth/google/callback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function getGithubAuthUrlApi(role = 'student') {
  const res = await fetch(`${API_BASE_URL}/auth/github/url?role=${encodeURIComponent(role)}`);
  return handleResponse(res);
}

export async function githubAuthCallbackApi(payload) {
  const res = await fetch(`${API_BASE_URL}/auth/github/callback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function getCurrentUserApi() {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export const getMeApi = getCurrentUserApi;

// Student Portal APIs
export async function getStudentDashboardApi() {
  const res = await fetch(`${API_BASE_URL}/students/dashboard`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function getStudentProfileApi() {
  const res = await fetch(`${API_BASE_URL}/students/profile`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function updateStudentProfileApi(data) {
  const res = await fetch(`${API_BASE_URL}/students/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function uploadStudentResumeApi(filename) {
  const res = await fetch(`${API_BASE_URL}/students/resume`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ filename })
  });
  return handleResponse(res);
}

export async function getStudentDrivesApi(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/students/drives${query ? `?${query}` : ''}`;
  const res = await fetch(url, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function getStudentDriveDetailApi(id) {
  const res = await fetch(`${API_BASE_URL}/students/drives/${id}`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function applyToStudentDriveApi(driveId, notes = '') {
  const res = await fetch(`${API_BASE_URL}/students/drives/${driveId}/apply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ notes })
  });
  return handleResponse(res);
}

export const applyStudentDriveApi = applyToStudentDriveApi;

export async function getStudentApplicationsApi() {
  const res = await fetch(`${API_BASE_URL}/students/applications`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function withdrawStudentApplicationApi(id) {
  const res = await fetch(`${API_BASE_URL}/students/applications/${id}/withdraw`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });
  return handleResponse(res);
}

export async function getStudentInterviewsApi() {
  const res = await fetch(`${API_BASE_URL}/students/interviews`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function getStudentNotificationsApi() {
  const res = await fetch(`${API_BASE_URL}/students/notifications`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function markStudentNotificationReadApi(id) {
  const res = await fetch(`${API_BASE_URL}/students/notifications/${id}/read`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });
  return handleResponse(res);
}

// Recruiter Portal APIs
export async function getRecruiterDashboardApi() {
  const res = await fetch(`${API_BASE_URL}/recruiters/dashboard`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function getRecruiterProfileApi() {
  const res = await fetch(`${API_BASE_URL}/recruiters/profile`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function updateRecruiterProfileApi(data) {
  const res = await fetch(`${API_BASE_URL}/recruiters/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function getRecruiterDrivesApi() {
  const res = await fetch(`${API_BASE_URL}/recruiters/drives`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function getRecruiterDriveDetailApi(id) {
  const res = await fetch(`${API_BASE_URL}/recruiters/drives/${id}`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function createRecruiterDriveApi(data) {
  const res = await fetch(`${API_BASE_URL}/recruiters/drives`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function updateRecruiterDriveApi(id, data) {
  const res = await fetch(`${API_BASE_URL}/recruiters/drives/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function closeRecruiterDriveApi(id) {
  const res = await fetch(`${API_BASE_URL}/recruiters/drives/${id}/close`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });
  return handleResponse(res);
}

// Recruiter Applicant Review & Pipeline APIs (Step 7C)
export async function getRecruiterApplicantsApi(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/recruiters/applicants${query ? `?${query}` : ''}`;
  const res = await fetch(url, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function getRecruiterApplicantDetailApi(id) {
  const res = await fetch(`${API_BASE_URL}/recruiters/applicants/${id}`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function updateApplicantStatusApi(id, status) {
  const res = await fetch(`${API_BASE_URL}/recruiters/applicants/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ status })
  });
  return handleResponse(res);
}

// Recruiter Interview Management APIs (Step 7D)
export async function getRecruiterInterviewsApi(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/recruiters/interviews${query ? `?${query}` : ''}`;
  const res = await fetch(url, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function getRecruiterInterviewDetailApi(id) {
  const res = await fetch(`${API_BASE_URL}/recruiters/interviews/${id}`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function scheduleRecruiterInterviewApi(data) {
  const res = await fetch(`${API_BASE_URL}/recruiters/interviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function updateRecruiterInterviewApi(id, data) {
  const res = await fetch(`${API_BASE_URL}/recruiters/interviews/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function cancelRecruiterInterviewApi(id) {
  const res = await fetch(`${API_BASE_URL}/recruiters/interviews/${id}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });
  return handleResponse(res);
}

// Recruiter Placement Results & Offers APIs (Step 7E)
export async function getRecruiterResultsApi(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/recruiters/results${query ? `?${query}` : ''}`;
  const res = await fetch(url, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function getRecruiterResultDetailApi(id) {
  const res = await fetch(`${API_BASE_URL}/recruiters/results/${id}`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function createRecruiterResultApi(data) {
  const res = await fetch(`${API_BASE_URL}/recruiters/results`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function updateRecruiterResultApi(id, data) {
  const res = await fetch(`${API_BASE_URL}/recruiters/results/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

// Recruiter Notifications APIs (Step 12A)
export async function getRecruiterNotificationsApi() {
  const res = await fetch(`${API_BASE_URL}/recruiters/notifications`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function markRecruiterNotificationReadApi(id) {
  const res = await fetch(`${API_BASE_URL}/recruiters/notifications/${id}/read`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });
  return handleResponse(res);
}

export async function markAllRecruiterNotificationsReadApi() {
  const res = await fetch(`${API_BASE_URL}/recruiters/notifications/read-all`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });
  return handleResponse(res);
}

// Admin Portal APIs (Step 8A & 8B)
export async function getAdminDashboardApi() {
  const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function getAdminStudentsApi(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/admin/students${query ? `?${query}` : ''}`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function getAdminStudentDetailApi(id) {
  const res = await fetch(`${API_BASE_URL}/admin/students/${id}`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function getAdminRecruitersApi(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/admin/recruiters${query ? `?${query}` : ''}`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function getAdminRecruiterDetailApi(id) {
  const res = await fetch(`${API_BASE_URL}/admin/recruiters/${id}`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function approveRecruiterApi(id) {
  const res = await fetch(`${API_BASE_URL}/admin/recruiters/${id}/approve`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });
  return handleResponse(res);
}

export async function rejectRecruiterApi(id) {
  const res = await fetch(`${API_BASE_URL}/admin/recruiters/${id}/reject`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });
  return handleResponse(res);
}

export async function getAdminDrivesApi(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/admin/drives${query ? `?${query}` : ''}`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function getAdminDriveDetailApi(id) {
  const res = await fetch(`${API_BASE_URL}/admin/drives/${id}`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function getAdminApplicationsApi(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/admin/applications${query ? `?${query}` : ''}`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function getAdminNotificationsApi() {
  const res = await fetch(`${API_BASE_URL}/admin/notifications`, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function markAdminNotificationReadApi(id) {
  const res = await fetch(`${API_BASE_URL}/admin/notifications/${id}/read`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });
  return handleResponse(res);
}

// Jobs & Opportunities APIs
export async function getJobsApi(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/jobs${query ? `?${query}` : ''}`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function getSkillUpOpportunitiesApi(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/jobs/skill-up${query ? `?${query}` : ''}`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function applyForJobApi(jobId) {
  const res = await fetch(`${API_BASE_URL}/jobs/${jobId}/apply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    }
  });
  return handleResponse(res);
}

// AI Suite & Assistant APIs
export async function aiQueryApi(mode, messages) {
  const res = await fetch(`${API_BASE_URL}/ai/${mode || 'advisor'}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ messages })
  });
  return handleResponse(res);
}

export async function getAiHistoryApi(mode = '') {
  const url = mode ? `${API_BASE_URL}/ai/history?mode=${mode}` : `${API_BASE_URL}/ai/history`;
  const res = await fetch(url, {
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}

export async function clearAiHistoryApi(mode = '') {
  const url = mode ? `${API_BASE_URL}/ai/history?mode=${mode}` : `${API_BASE_URL}/ai/history`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { ...getAuthHeader() }
  });
  return handleResponse(res);
}
