import api from './axios';

export const adminApi = {
  // Statistics & overview
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // User management
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  createUser: async (data) => {
    const response = await api.post('/admin/users', data);
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Journal moderation
  getJournals: async (params = {}) => {
    const response = await api.get('/admin/journals', { params });
    return response.data;
  },

  getJournal: async (id) => {
    const response = await api.get(`/admin/journals/${id}`);
    return response.data;
  },

  deleteJournal: async (id) => {
    const response = await api.delete(`/admin/journals/${id}`);
    return response.data;
  },

  // Brand & System Settings
  getSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  updateSettings: async (data) => {
    const response = await api.put('/admin/settings', data);
    return response.data;
  },

  uploadLogo: async (formData) => {
    const response = await api.post('/admin/settings/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  removeLogo: async () => {
    const response = await api.delete('/admin/settings/logo');
    return response.data;
  },
};
