import { create } from 'zustand';
import { settingsApi } from '../api/settingsApi';

export const useSettingsStore = create((set, get) => ({
  appName: 'Daily Journal',
  appTagline: 'Digital Diary & Mindful Sanctuary',
  appLogo: null,
  appLogoBg: 'transparent',
  primaryColor: '#1c1917',
  welcomeMessage: 'Capture your thoughts, reflections, and journeys in a distraction-free sanctuary.',
  footerText: '© Daily Journal — Mindful writing sanctuary',
  allowRegistration: true,
  isLoaded: false,
  isLoading: false,

  fetchSettings: async () => {
    try {
      set({ isLoading: true });
      const res = await settingsApi.getPublicSettings();
      if (res.success && res.data) {
        set({
          appName: res.data.app_name || 'Daily Journal',
          appTagline: res.data.app_tagline || 'Digital Diary & Mindful Sanctuary',
          appLogo: res.data.app_logo || null,
          appLogoBg: res.data.app_logo_bg || 'transparent',
          primaryColor: res.data.primary_color || '#1c1917',
          welcomeMessage: res.data.welcome_message || '',
          footerText: res.data.footer_text || '',
          allowRegistration: res.data.allow_registration ?? true,
          isLoaded: true,
          isLoading: false,
        });

        // Dynamically update document title if changed
        if (res.data.app_name) {
          document.title = `${res.data.app_name} — Mindful Journaling`;
        }
      }
    } catch (err) {
      console.warn('Could not load brand settings, using defaults.', err);
      set({ isLoaded: true, isLoading: false });
    }
  },

  updateSettingsLocally: (newSettings) => {
    set((state) => {
      const updated = {
        appName: newSettings.app_name !== undefined ? newSettings.app_name : state.appName,
        appTagline: newSettings.app_tagline !== undefined ? newSettings.app_tagline : state.appTagline,
        appLogo: newSettings.app_logo !== undefined ? newSettings.app_logo : state.appLogo,
        appLogoBg: newSettings.app_logo_bg !== undefined ? newSettings.app_logo_bg : state.appLogoBg,
        primaryColor: newSettings.primary_color !== undefined ? newSettings.primary_color : state.primaryColor,
        welcomeMessage: newSettings.welcome_message !== undefined ? newSettings.welcome_message : state.welcomeMessage,
        footerText: newSettings.footer_text !== undefined ? newSettings.footer_text : state.footerText,
        allowRegistration: newSettings.allow_registration !== undefined ? newSettings.allow_registration : state.allowRegistration,
      };

      if (updated.appName) {
        document.title = `${updated.appName} — Mindful Journaling`;
      }

      return updated;
    });
  },
}));
