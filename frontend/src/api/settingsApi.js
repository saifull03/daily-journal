import api from './axios';

export const settingsApi = {
  /**
   * Fetch public system and brand customization settings.
   */
  getPublicSettings: async () => {
    const response = await api.get('/settings/public');
    return response.data;
  },
};
