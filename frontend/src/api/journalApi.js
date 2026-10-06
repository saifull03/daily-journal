import api from './axios';

export const journalApi = {
  async getJournals(params = {}) {
    const res = await api.get('/journals', { params });
    return res.data;
  },

  async getJournal(id) {
    const res = await api.get(`/journals/${id}`);
    return res.data;
  },

  async createJournal(data) {
    const res = await api.post('/journals', data);
    return res.data;
  },

  async updateJournal(id, data) {
    const res = await api.put(`/journals/${id}`, data);
    return res.data;
  },

  async deleteJournal(id) {
    const res = await api.delete(`/journals/${id}`);
    return res.data;
  },

  async toggleFavorite(id) {
    const res = await api.post(`/journals/${id}/favorite`);
    return res.data;
  },

  async autosave(data) {
    const url = data.id ? `/journals/${data.id}/autosave` : '/journals/autosave';
    const res = await api.post(url, data);
    return res.data;
  },

  async getFavorites(params = {}) {
    const res = await api.get('/favorites', { params });
    return res.data;
  },

  async getDrafts(params = {}) {
    const res = await api.get('/drafts', { params });
    return res.data;
  },

  async uploadImage(journalId, formData) {
    const res = await api.post(`/journals/${journalId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async deleteImage(imageId) {
    const res = await api.delete(`/journals/images/${imageId}`);
    return res.data;
  },

  async getTags() {
    const res = await api.get('/tags');
    return res.data;
  },

  async createTag(data) {
    const res = await api.post('/tags', data);
    return res.data;
  },

  async deleteTag(id) {
    const res = await api.delete(`/tags/${id}`);
    return res.data;
  },

  async getCalendar(params = {}) {
    const res = await api.get('/calendar', { params });
    return res.data;
  },

  async getStatistics() {
    const res = await api.get('/statistics');
    return res.data;
  },
};

