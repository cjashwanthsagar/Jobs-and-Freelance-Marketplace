import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT Bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle unauthorized errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear credentials
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-change'));
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
};

export const userAPI = {
  getMyProfile: () => api.get('/users/me'),
  updateMyProfile: (data) => api.put('/users/me', data),
  getUserProfile: (id) => api.get(`/users/${id}`),
};

export const jobAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  searchJobs: (q, params) => api.get('/jobs/search', { params: { q, ...params } }),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getMyPostedJobs: (params) => api.get('/jobs/employer/my', { params }),
};

export const applicationAPI = {
  apply: (data) => api.post('/applications', data),
  getMyApplications: () => api.get('/applications/my'),
  getJobApplications: (jobId) => api.get(`/jobs/${jobId}/applications`),
  getAllEmployerApplications: () => api.get('/applications/employer/all'),
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
};

export const projectAPI = {
  getProjects: (params) => api.get('/projects', { params }),
  getProjectById: (id) => api.get(`/projects/${id}`),
  searchProjects: (q, params) => api.get('/projects/search', { params: { q, ...params } }),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  getMyProjects: (params) => api.get('/projects/client/my', { params }),
};

export const proposalAPI = {
  submitProposal: (data) => api.post('/proposals', data),
  getMyProposals: () => api.get('/proposals/my'),
  getProjectProposals: (projectId) => api.get(`/projects/${projectId}/proposals`),
  getAllClientProposals: () => api.get('/proposals/client/all'),
  updateStatus: (id, status) => api.put(`/proposals/${id}/status`, { status }),
};

export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
  getJobs: (params) => api.get('/admin/jobs', { params }),
  getProjects: (params) => api.get('/admin/projects', { params }),
  getStats: () => api.get('/admin/stats'),
};

export default api;
