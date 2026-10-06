import api from './axios';

export const authApi = {
  async register(data) {
    const res = await api.post('/register', data);
    return res.data;
  },

  async login(credentials) {
    const res = await api.post('/login', credentials);
    return res.data;
  },

  async logout() {
    const res = await api.post('/logout');
    return res.data;
  },

  async getUser() {
    const res = await api.get('/user');
    return res.data;
  },

  async updateProfile(data) {
    const res = await api.put('/user/profile', data);
    return res.data;
  },

  async changePassword(data) {
    const res = await api.put('/user/password', data);
    return res.data;
  },

  async forgotPassword(email) {
    const res = await api.post('/forgot-password', { email });
    return res.data;
  },

  async resetPassword(data) {
    const res = await api.post('/reset-password', data);
    return res.data;
  },
};

