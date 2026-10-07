import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import { useSettingsStore } from './store/settingsStore';
import { useTheme } from './hooks/useTheme';

// Layout & Route Protection
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// App Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import AllJournalsPage from './pages/journal/AllJournalsPage';
import JournalEditorPage from './pages/journal/JournalEditorPage';
import JournalDetailPage from './pages/journal/JournalDetailPage';
import CalendarPage from './pages/calendar/CalendarPage';
import FavoritesPage from './pages/favorites/FavoritesPage';
import DraftsPage from './pages/drafts/DraftsPage';
import TagsPage from './pages/tags/TagsPage';
import StatisticsPage from './pages/statistics/StatisticsPage';
import SettingsPage from './pages/settings/SettingsPage';

// Admin Page
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Create a single TanStack Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 2, // 2 minutes
    },
  },
});

export default function App() {
  const { initialize } = useAuthStore();
  const { fetchSettings } = useSettingsStore();
  useTheme(); // Initialize theme on root load

  useEffect(() => {
    initialize();
    fetchSettings();
  }, [initialize, fetchSettings]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Root redirect: to dashboard if authenticated, else login handled by ProtectedRoute */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected Routes inside AppLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/journals" element={<AllJournalsPage />} />
              <Route path="/journals/new" element={<Navigate to="/journals/new/classic" replace />} />
              <Route path="/journals/new/:type" element={<JournalEditorPage />} />
              <Route path="/journals/:id" element={<JournalDetailPage />} />
              <Route path="/journals/:id/edit" element={<JournalEditorPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/drafts" element={<DraftsPage />} />
              <Route path="/tags" element={<TagsPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<Navigate to="/settings" replace />} />

              {/* Admin Protected Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/branding" element={<AdminDashboardPage />} />
                <Route path="/admin/users" element={<AdminDashboardPage />} />
                <Route path="/admin/journals" element={<AdminDashboardPage />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
