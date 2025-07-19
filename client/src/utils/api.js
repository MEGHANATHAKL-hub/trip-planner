import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
  getMe: () => api.get('/api/auth/me'),
};

export const tripAPI = {
  getTrips: () => api.get('/api/trips'),
  getTripById: (id) => api.get(`/api/trips/${id}`),
  createTrip: (tripData) => api.post('/api/trips', tripData),
  updateTrip: (id, tripData) => api.put(`/api/trips/${id}`, tripData),
  deleteTrip: (id) => api.delete(`/api/trips/${id}`),
};

export const collaboratorAPI = {
  getCollaborators: (tripId) => api.get(`/api/collaborators/${tripId}`),
  addCollaborator: (tripId, userData) => api.post(`/api/collaborators/${tripId}`, userData),
  removeCollaborator: (tripId, userId) => api.delete(`/api/collaborators/${tripId}/${userId}`),
};

export const userAPI = {
  getUsers: (params) => api.get('/api/users', { params }),
  getUserProfile: (userId) => api.get(`/api/users/${userId}`),
  searchUsers: (query) => api.get('/api/users/search', { params: { q: query } }),
  deleteUser: (userId) => api.delete(`/api/users/${userId}`),
  updateUserRole: (userId, role) => api.put(`/api/users/${userId}/role`, { role }),
  updateUserPassword: (userId, password) => api.put(`/api/users/${userId}/password`, { password }),
};

export const itineraryAPI = {
  getItinerary: (tripId) => api.get(`/api/itinerary/${tripId}`),
  updateDay: (tripId, dayData) => api.put(`/api/itinerary/${tripId}/day`, dayData),
  deleteDay: (tripId, day) => api.delete(`/api/itinerary/${tripId}/day/${day}`),
  reorderActivities: (tripId, data) => api.put(`/api/itinerary/${tripId}/reorder`, data),
  copyActivities: (tripId, data) => api.post(`/api/itinerary/${tripId}/copy`, data),
};

export default api;