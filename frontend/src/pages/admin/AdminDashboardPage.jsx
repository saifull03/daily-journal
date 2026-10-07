import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Shield,
  Palette,
  Users,
  BookOpen,
  Sparkles,
  Upload,
  Trash2,
  Edit2,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Calendar,
  Image as ImageIcon,
  HardDrive,
  UserCheck,
  UserX,
  Eye,
  RefreshCw,
  Lock,
  Mail,
  User as UserIcon,
  X,
  ExternalLink,
} from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import { useSettingsStore } from '../../store/settingsStore';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'branding' | 'users' | 'journals'
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const { addToast } = useToastStore();
  const {
    appName,
    appTagline,
    appLogo,
    primaryColor,
    welcomeMessage,
    footerText,
    allowRegistration,
    updateSettingsLocally,
  } = useSettingsStore();

  // ----------------------------------------------------
  // 1. STATS DATA
  // ----------------------------------------------------
  const {
    data: statsData,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminApi.getStats(),
  });

  const stats = statsData?.data || {
    counts: {
      total_users: 0,
      admin_count: 0,
      regular_users: 0,
      total_journals: 0,
      published_journals: 0,
      draft_journals: 0,
      favorite_journals: 0,
      total_images: 0,
      storage_formatted: '0 B',
    },
    types_breakdown: {},
    moods_breakdown: {},
    user_growth: [],
    monthly_activity: [],
    recent_users: [],
    recent_entries: [],
  };

  // ----------------------------------------------------
  // 2. BRAND & SETTINGS STATE & MUTATIONS
  // ----------------------------------------------------
  const [brandForm, setBrandForm] = useState({
    app_name: appName,
    app_tagline: appTagline,
    primary_color: primaryColor,
    welcome_message: welcomeMessage,
    footer_text: footerText,
    allow_registration: allowRegistration,
  });

  // Sync when store values change
  React.useEffect(() => {
    setBrandForm({
      app_name: appName,
      app_tagline: appTagline,
      primary_color: primaryColor,
      welcome_message: welcomeMessage,
      footer_text: footerText,
      allow_registration: allowRegistration,
    });
  }, [appName, appTagline, primaryColor, welcomeMessage, footerText, allowRegistration]);

  const [logoPreview, setLogoPreview] = useState(appLogo);
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const fileInputRef = useRef(null);

  const updateSettingsMutation = useMutation({
    mutationFn: (data) => adminApi.updateSettings(data),
    onSuccess: (res) => {
      updateSettingsLocally(res.data);
      addToast('Brand and system settings saved successfully! ✨', 'success');
      queryClient.invalidateQueries(['admin-settings']);
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Failed to update settings', 'error');
    },
  });

  const uploadLogoMutation = useMutation({
    mutationFn: (formData) => adminApi.uploadLogo(formData),
    onSuccess: (res) => {
      updateSettingsLocally({ app_logo: res.data.app_logo });
      setLogoPreview(res.data.app_logo);
      setSelectedLogoFile(null);
      addToast('Custom brand logo updated! 🎨', 'success');
      queryClient.invalidateQueries(['admin-settings']);
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Failed to upload logo', 'error');
    },
  });

  const removeLogoMutation = useMutation({
    mutationFn: () => adminApi.removeLogo(),
    onSuccess: () => {
      updateSettingsLocally({ app_logo: null });
      setLogoPreview(null);
      setSelectedLogoFile(null);
      addToast('Brand logo reset to default icon.', 'info');
      queryClient.invalidateQueries(['admin-settings']);
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Failed to reset logo', 'error');
    },
  });

  const handleLogoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        addToast('Logo file size must be less than 4MB.', 'error');
        return;
      }
      setSelectedLogoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBrandSettings = (e) => {
    e.preventDefault();
    updateSettingsMutation.mutate(brandForm);

    if (selectedLogoFile) {
      const formData = new FormData();
      formData.append('logo', selectedLogoFile);
      uploadLogoMutation.mutate(formData);
    }
  };

  // ----------------------------------------------------
  // 3. USER MANAGEMENT STATE & MUTATIONS
  // ----------------------------------------------------
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userPage, setUserPage] = useState(1);

  const { data: usersData, isLoading: isUsersLoading } = useQuery({
    queryKey: ['admin-users', userSearch, userRoleFilter, userPage],
    queryFn: () =>
      adminApi.getUsers({
        search: userSearch || undefined,
        role: userRoleFilter || undefined,
        page: userPage,
      }),
    enabled: activeTab === 'users',
  });

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    bio: '',
  });

  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const createOrUpdateUserMutation = useMutation({
    mutationFn: (data) => {
      if (editingUser) {
        return adminApi.updateUser(editingUser.id, data);
      }
      return adminApi.createUser(data);
    },
    onSuccess: () => {
      addToast(
        editingUser ? 'User updated successfully!' : 'User created successfully!',
        'success'
      );
      setUserModalOpen(false);
      setEditingUser(null);
      queryClient.invalidateQueries(['admin-users']);
      queryClient.invalidateQueries(['admin-stats']);
    },
    onError: (err) => {
      addToast(
        err.response?.data?.message ||
          err.response?.data?.errors?.email?.[0] ||
          'Operation failed',
        'error'
      );
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id) => adminApi.deleteUser(id),
    onSuccess: () => {
      addToast('User deleted successfully.', 'info');
      setDeleteUserModalOpen(false);
      setUserToDelete(null);
      queryClient.invalidateQueries(['admin-users']);
      queryClient.invalidateQueries(['admin-stats']);
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Could not delete user', 'error');
    },
  });

  const handleOpenCreateUser = () => {
    setEditingUser(null);
    setUserFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
      bio: '',
    });
    setUserModalOpen(true);
  };

  const handleOpenEditUser = (user) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role || (user.is_admin ? 'admin' : 'user'),
      bio: user.bio || '',
    });
    setUserModalOpen(true);
  };

  // ----------------------------------------------------
  // 4. JOURNAL MODERATION STATE & MUTATIONS
  // ----------------------------------------------------
  const [journalSearch, setJournalSearch] = useState('');
  const [journalTypeFilter, setJournalTypeFilter] = useState('');
  const [journalPage, setJournalPage] = useState(1);

  const { data: journalsData, isLoading: isJournalsLoading } = useQuery({
    queryKey: ['admin-journals', journalSearch, journalTypeFilter, journalPage],
    queryFn: () =>
      adminApi.getJournals({
        search: journalSearch || undefined,
        type: journalTypeFilter || undefined,
        page: journalPage,
      }),
    enabled: activeTab === 'journals',
  });

  const [previewJournal, setPreviewJournal] = useState(null);
  const [deleteJournalModalOpen, setDeleteJournalModalOpen] = useState(false);
  const [journalToDelete, setJournalToDelete] = useState(null);

  const deleteJournalMutation = useMutation({
    mutationFn: (id) => adminApi.deleteJournal(id),
    onSuccess: () => {
      addToast('Journal entry removed by administrator.', 'info');
      setDeleteJournalModalOpen(false);
      setJournalToDelete(null);
      if (previewJournal?.id === journalToDelete?.id) {
        setPreviewJournal(null);
      }
      queryClient.invalidateQueries(['admin-journals']);
      queryClient.invalidateQueries(['admin-stats']);
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Could not delete entry', 'error');
    },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Admin Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 dark:from-stone-900 dark:via-stone-950 dark:to-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold tracking-wide uppercase flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Super Admin Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            System Administration & Branding
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl">
            Full authority to customize brand identity, manage users, moderate journal content,
            and monitor platform statistics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              refetchStats();
              queryClient.invalidateQueries(['admin-users']);
              queryClient.invalidateQueries(['admin-journals']);
              addToast('Data refreshed.', 'info');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors cursor-pointer border border-stone-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-1 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview & Metrics', icon: BarChart3 },
          { id: 'branding', label: 'Brand & Customization', icon: Palette },
          { id: 'users', label: 'User Management', icon: Users, badge: stats.counts.total_users },
          { id: 'journals', label: 'Journal Moderation', icon: BookOpen, badge: stats.counts.total_journals },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-stone-700 dark:bg-stone-300 text-white dark:text-stone-900'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & METRICS                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
                <span className="text-xs font-semibold">Total Users</span>
                <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 dark:text-stone-100">
                  {stats.counts.total_users}
                </p>
                <span className="text-[11px] font-medium text-stone-500">
                  {stats.counts.admin_count} Admin{stats.counts.admin_count !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
                <span className="text-xs font-semibold">Total Journals</span>
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 dark:text-stone-100">
                  {stats.counts.total_journals}
                </p>
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  {stats.counts.published_journals} Published
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
                <span className="text-xs font-semibold">Photos & Media</span>
                <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 dark:text-stone-100">
                  {stats.counts.total_images}
                </p>
                <span className="text-[11px] font-medium text-stone-500">
                  {stats.counts.storage_formatted} used
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
                <span className="text-xs font-semibold">Brand Status</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                  {appName}
                </p>
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Template Breakdown & Quick Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Journal Template Distribution */}
            <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    Journal Styles Popularity
                  </h3>
                  <p className="text-xs text-stone-500">Distribution of the 10 purpose-built templates</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {Object.entries(stats.types_breakdown || {}).map(([type, count]) => {
                  const percentage =
                    stats.counts.total_journals > 0
                      ? Math.round((count / stats.counts.total_journals) * 100)
                      : 0;
                  return (
                    <div
                      key={type}
                      className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-stone-900 dark:text-stone-100 capitalize">
                          {type.replace('_', ' ')}
                        </span>
                        <span className="font-bold text-stone-600 dark:text-stone-400">
                          {count}
                        </span>
                      </div>
                      <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 dark:bg-amber-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(percentage, 5)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-stone-400">{percentage}% of journals</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions & System Info */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Administration Shortcuts
              </h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('branding')}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-left cursor-pointer border border-stone-200/60 dark:border-stone-700/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                      <Palette className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        Customize Brand Logo & Colors
                      </p>
                      <p className="text-[11px] text-stone-500">Update logo, title, and theme</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('users');
                    handleOpenCreateUser();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-left cursor-pointer border border-stone-200/60 dark:border-stone-700/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-950/40 text-violet-600 flex items-center justify-center">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        Create New User / Admin
                      </p>
                      <p className="text-[11px] text-stone-500">Add an account directly</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('journals')}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-left cursor-pointer border border-stone-200/60 dark:border-stone-700/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/40 text-sky-600 flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        Moderate Journals
                      </p>
                      <p className="text-[11px] text-stone-500">Inspect platform entries</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-stone-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Users & Recent Entries Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users Table */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Recent User Registrations
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('users')}
                  className="text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-2">
                {stats.recent_users?.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center shrink-0">
                        {u.name?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                          {u.name}
                        </p>
                        <p className="text-[11px] text-stone-500 truncate">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.is_admin
                            ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                            : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {u.role || (u.is_admin ? 'admin' : 'user')}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {u.journal_count} {u.journal_count === 1 ? 'entry' : 'entries'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Entries */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Latest Platform Journal Activity
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('journals')}
                  className="text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-2">
                {stats.recent_entries?.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                        {entry.title || 'Untitled Journal'}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        By {entry.user?.name} · <span className="capitalize">{entry.type}</span> ·{' '}
                        {entry.journal_date}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        entry.is_draft
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {entry.is_draft ? 'Draft' : 'Published'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: BRAND & CUSTOMIZATION                                              */}
      {/* ========================================================================= */}
      {activeTab === 'branding' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Brand Customization Form */}
          <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Brand & Theme Customizer
              </h2>
              <p className="text-xs text-stone-500">
                Customize the application brand logo, title, slogan, accent palette, and system
                messages. Changes will immediately reflect across the frontend for all users.
              </p>
            </div>

            <form onSubmit={handleSaveBrandSettings} className="space-y-6">
              {/* 1. Custom Brand Logo Upload Section */}
              <div className="space-y-3 p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/80">
                <label className="block text-xs font-bold text-stone-900 dark:text-stone-100">
                  Brand Logo Image
                </label>
                <p className="text-[11px] text-stone-500">
                  Upload your organization, product, or personal logo (PNG, JPG, SVG, WebP, max 4MB).
                  Appears in Sidebar, Header, and Login screens.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-5 pt-2">
                  {/* Logo Preview box */}
                  <div className="w-20 h-20 rounded-2xl bg-white dark:bg-stone-950 border-2 border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-center p-2 overflow-hidden shrink-0 shadow-2xs">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Brand Logo Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-amber-400 dark:text-amber-600" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleLogoFileChange}
                      accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif"
                      className="hidden"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        leftIcon={Upload}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {logoPreview ? 'Change Logo Image' : 'Upload Logo'}
                      </Button>

                      {logoPreview && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          leftIcon={Trash2}
                          onClick={() => {
                            if (appLogo) {
                              removeLogoMutation.mutate();
                            } else {
                              setLogoPreview(null);
                              setSelectedLogoFile(null);
                            }
                          }}
                          className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          Reset to Default
                        </Button>
                      )}
                    </div>
                    {selectedLogoFile && (
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                        New file selected: {selectedLogoFile.name} (Save changes below to apply)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Brand Names & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Application / Brand Name"
                  type="text"
                  value={brandForm.app_name}
                  onChange={(e) => setBrandForm({ ...brandForm, app_name: e.target.value })}
                  placeholder="Daily Journal"
                  required
                />

                <Input
                  label="Brand Tagline / Slogan"
                  type="text"
                  value={brandForm.app_tagline}
                  onChange={(e) => setBrandForm({ ...brandForm, app_tagline: e.target.value })}
                  placeholder="Digital Diary & Mindful Sanctuary"
                />
              </div>

              {/* 3. Preset Accent Color Swatches */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-900 dark:text-stone-100">
                  Brand Theme Accent Palette
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {[
                    { name: 'Stone Noir', color: '#1c1917' },
                    { name: 'Warm Amber', color: '#d97706' },
                    { name: 'Royal Indigo', color: '#4f46e5' },
                    { name: 'Emerald Sanctuary', color: '#059669' },
                    { name: 'Rose Petal', color: '#e11d48' },
                    { name: 'Deep Violet', color: '#7c3aed' },
                  ].map((swatch) => (
                    <button
                      key={swatch.color}
                      type="button"
                      onClick={() => setBrandForm({ ...brandForm, primary_color: swatch.color })}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-transform ${
                        brandForm.primary_color === swatch.color
                          ? 'border-stone-900 dark:border-stone-100 scale-105 shadow-xs font-bold'
                          : 'border-stone-200 dark:border-stone-800 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: swatch.color }}
                      />
                      <span>{swatch.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Welcome Headline & Description */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-900 dark:text-stone-100">
                  Welcome Subtext (Auth & Landing)
                </label>
                <textarea
                  rows={2}
                  value={brandForm.welcome_message}
                  onChange={(e) => setBrandForm({ ...brandForm, welcome_message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100"
                  placeholder="Capture your thoughts, reflections, and journeys in a distraction-free sanctuary."
                />
              </div>

              {/* 5. Footer Text */}
              <Input
                label="Footer Copyright & Notice"
                type="text"
                value={brandForm.footer_text}
                onChange={(e) => setBrandForm({ ...brandForm, footer_text: e.target.value })}
                placeholder="© Daily Journal — Mindful writing sanctuary"
              />

              {/* 6. System Registration Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800">
                <div>
                  <p className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    Allow Public User Registrations
                  </p>
                  <p className="text-[11px] text-stone-500">
                    When disabled, only administrators can create new accounts from this dashboard.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={brandForm.allow_registration}
                    onChange={(e) =>
                      setBrandForm({ ...brandForm, allow_registration: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  leftIcon={CheckCircle2}
                  isLoading={
                    updateSettingsMutation.isPending || uploadLogoMutation.isPending
                  }
                >
                  Save Brand Settings
                </Button>
              </div>
            </form>
          </div>

          {/* Live Brand Preview Card */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4 sticky top-24">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                  Live Brand Preview
                </span>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mt-2">
                  Visitor & User Experience
                </h3>
                <p className="text-xs text-stone-500">
                  How your customized brand appears live across header and navigation
                </p>
              </div>

              {/* Simulated Sidebar Header */}
              <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Sidebar Brand Header
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 flex items-center justify-center overflow-hidden shadow-xs shrink-0">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <Sparkles className="w-5 h-5 text-amber-400 dark:text-amber-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                      {brandForm.app_name || 'Daily Journal'}
                    </h4>
                    <p className="text-[10px] text-stone-500 truncate">
                      {brandForm.app_tagline || 'Personal Digital Diary'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Simulated Welcome Notice */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Auth & Dashboard Banner
                </p>
                <p className="text-xs font-serif font-bold text-stone-900 dark:text-stone-100">
                  Welcome to {brandForm.app_name || 'Daily Journal'}
                </p>
                <p className="text-[11px] text-stone-500">
                  {brandForm.welcome_message ||
                    'Capture your thoughts, reflections, and journeys in a distraction-free sanctuary.'}
                </p>
              </div>

              {/* Registration Status Badge */}
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
                <span className="text-stone-500">Public Signups:</span>
                <span
                  className={`font-bold ${
                    brandForm.allow_registration
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {brandForm.allow_registration ? 'Open (Enabled)' : 'Closed (Admin Only)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: USER MANAGEMENT                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                User Accounts Management
              </h2>
              <p className="text-xs text-stone-500">
                Manage all registered journalists and administrators.
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              size="sm"
              leftIcon={Plus}
              onClick={handleOpenCreateUser}
            >
              Add New User
            </Button>
          </div>

          {/* Search & Role Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                  setUserPage(1);
                }}
                placeholder="Search user by name or email..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {['', 'admin', 'user'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setUserRoleFilter(role);
                    setUserPage(1);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer capitalize transition-colors ${
                    userRoleFilter === role
                      ? 'bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                  }`}
                >
                  {role === '' ? 'All Roles' : role}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-stone-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Journals</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {isUsersLoading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-stone-400">
                      Loading user accounts...
                    </td>
                  </tr>
                ) : (usersData?.data || []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-stone-400">
                      No user accounts found matching query.
                    </td>
                  </tr>
                ) : (
                  usersData.data.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-stone-50/70 dark:hover:bg-stone-800/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center shrink-0">
                            {u.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-stone-900 dark:text-stone-100">
                              {u.name}{' '}
                              {currentUser?.id === u.id && (
                                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                                  (You)
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-stone-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.is_admin
                              ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                          }`}
                        >
                          {u.is_admin ? 'Super Admin' : 'Journalist'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-stone-700 dark:text-stone-300">
                          {u.journal_entries_count || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-500">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditUser(u)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                            title="Edit User"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {currentUser?.id !== u.id && (
                            <button
                              type="button"
                              onClick={() => {
                                setUserToDelete(u);
                                setDeleteUserModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {usersData?.meta && usersData.meta.last_page > 1 && (
            <div className="flex items-center justify-between text-xs text-stone-500 pt-2">
              <span>
                Page {usersData.meta.current_page} of {usersData.meta.last_page} (
                {usersData.meta.total} users)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={userPage <= 1}
                  onClick={() => setUserPage((p) => Math.max(p - 1, 1))}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={userPage >= usersData.meta.last_page}
                  onClick={() => setUserPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: JOURNAL MODERATION                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'journals' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Journal Moderation & Oversight
              </h2>
              <p className="text-xs text-stone-500">
                Inspect platform-wide journal entries, preview content, and remove inappropriate
                posts.
              </p>
            </div>
          </div>

          {/* Search & Style Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={journalSearch}
                onChange={(e) => {
                  setJournalSearch(e.target.value);
                  setJournalPage(1);
                }}
                placeholder="Search entries by title, author, or content..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100"
              />
            </div>

            <select
              value={journalTypeFilter}
              onChange={(e) => {
                setJournalTypeFilter(e.target.value);
                setJournalPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden cursor-pointer"
            >
              <option value="">All Journal Templates</option>
              <option value="classic">Classic</option>
              <option value="reflection">Daily Reflection</option>
              <option value="planner">Daily Planner</option>
              <option value="mood">Mood Journal</option>
              <option value="gratitude">Gratitude</option>
              <option value="free_writing">Free Writing</option>
              <option value="travel">Travel</option>
              <option value="study">Study</option>
              <option value="work">Work</option>
              <option value="dream">Dream</option>
            </select>
          </div>

          {/* Journals Table */}
          <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-stone-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Title & Author</th>
                  <th className="py-3 px-4">Template Style</th>
                  <th className="py-3 px-4">Mood</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {isJournalsLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-stone-400">
                      Loading journal entries...
                    </td>
                  </tr>
                ) : (journalsData?.data || []).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-stone-400">
                      No journals found.
                    </td>
                  </tr>
                ) : (
                  journalsData.data.map((entry) => (
                    <tr
                      key={entry.id}
                      className="hover:bg-stone-50/70 dark:hover:bg-stone-800/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="min-w-0 max-w-xs sm:max-w-md">
                          <p className="font-bold text-stone-900 dark:text-stone-100 truncate">
                            {entry.title || 'Untitled Journal'}
                          </p>
                          <p className="text-[11px] text-stone-500 truncate">
                            Author: {entry.user?.name} ({entry.user?.email})
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60 capitalize">
                          {entry.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize text-stone-600 dark:text-stone-400">
                          {entry.mood || '—'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-500 whitespace-nowrap">
                        {entry.journal_date}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            entry.is_draft
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {entry.is_draft ? 'Draft' : 'Published'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewJournal(entry)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                            title="Preview Entry"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setJournalToDelete(entry);
                              setDeleteJournalModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete Entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {journalsData?.meta && journalsData.meta.last_page > 1 && (
            <div className="flex items-center justify-between text-xs text-stone-500 pt-2">
              <span>
                Page {journalsData.meta.current_page} of {journalsData.meta.last_page} (
                {journalsData.meta.total} journals)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={journalPage <= 1}
                  onClick={() => setJournalPage((p) => Math.max(p - 1, 1))}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={journalPage >= journalsData.meta.last_page}
                  onClick={() => setJournalPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS                                                                    */}
      {/* ========================================================================= */}

      {/* 1. Create / Edit User Modal */}
      <Modal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        title={editingUser ? 'Edit User Account' : 'Create New User / Administrator'}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createOrUpdateUserMutation.mutate(userFormData);
          }}
          className="space-y-4 pt-2"
        >
          <Input
            label="Full Name"
            type="text"
            value={userFormData.name}
            onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
            placeholder="Jane Doe"
            leftIcon={UserIcon}
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={userFormData.email}
            onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
            placeholder="user@example.com"
            leftIcon={Mail}
            required
          />

          <Input
            label={editingUser ? 'New Password (Leave blank to keep current)' : 'Password'}
            type="password"
            value={userFormData.password}
            onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
            placeholder={editingUser ? '••••••••' : 'Min 6 characters'}
            leftIcon={Lock}
            required={!editingUser}
          />

          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-900 dark:text-stone-100">
              User Role & Permissions
            </label>
            <select
              value={userFormData.role}
              onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden cursor-pointer"
            >
              <option value="user">Journalist (Regular User)</option>
              <option value="admin">Super Administrator (Full System & Brand Control)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-900 dark:text-stone-100">
              Bio / Note
            </label>
            <textarea
              rows={2}
              value={userFormData.bio}
              onChange={(e) => setUserFormData({ ...userFormData, bio: e.target.value })}
              placeholder="Short bio or admin note..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setUserModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={createOrUpdateUserMutation.isPending}
            >
              {editingUser ? 'Update Account' : 'Create Account'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. Delete User Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteUserModalOpen}
        onClose={() => setDeleteUserModalOpen(false)}
        onConfirm={() => {
          if (userToDelete) {
            deleteUserMutation.mutate(userToDelete.id);
          }
        }}
        title="Delete User Account"
        message={`Are you sure you want to permanently delete user "${userToDelete?.name}" (${userToDelete?.email})? All journal entries and tags belonging to this user will also be permanently removed.`}
        confirmText="Delete User"
        isLoading={deleteUserMutation.isPending}
      />

      {/* 3. Delete Journal Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteJournalModalOpen}
        onClose={() => setDeleteJournalModalOpen(false)}
        onConfirm={() => {
          if (journalToDelete) {
            deleteJournalMutation.mutate(journalToDelete.id);
          }
        }}
        title="Delete Journal Entry"
        message={`Are you sure you want to delete the journal entry "${journalToDelete?.title || 'Untitled'}" by ${journalToDelete?.user?.name}? This action cannot be undone.`}
        confirmText="Delete Entry"
        isLoading={deleteJournalMutation.isPending}
      />

      {/* 4. Preview Journal Entry Modal */}
      {previewJournal && (
        <Modal
          isOpen={Boolean(previewJournal)}
          onClose={() => setPreviewJournal(null)}
          title={previewJournal.title || 'Untitled Journal Entry'}
        >
          <div className="space-y-4 pt-2 max-h-[70vh] overflow-y-auto">
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 pb-2 border-b border-stone-100 dark:border-stone-800">
              <span>Author: <strong>{previewJournal.user?.name}</strong></span>
              <span>·</span>
              <span>Template: <strong className="capitalize">{previewJournal.type}</strong></span>
              <span>·</span>
              <span>Date: <strong>{previewJournal.journal_date}</strong></span>
              {previewJournal.mood && (
                <>
                  <span>·</span>
                  <span>Mood: <strong className="capitalize">{previewJournal.mood}</strong></span>
                </>
              )}
            </div>

            {/* Content body */}
            {previewJournal.content && (
              <div
                className="prose dark:prose-invert prose-stone text-xs max-w-none font-serif leading-relaxed"
                dangerouslySetInnerHTML={{ __html: previewJournal.content }}
              />
            )}

            {/* Structured data */}
            {previewJournal.data && Object.keys(previewJournal.data).length > 0 && (
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Structured Template Data
                </p>
                <div className="space-y-1 text-xs">
                  {Object.entries(previewJournal.data).map(([key, val]) => (
                    <div key={key}>
                      <span className="font-semibold capitalize text-stone-700 dark:text-stone-300">
                        {key.replace('_', ' ')}:
                      </span>{' '}
                      <span className="text-stone-600 dark:text-stone-400">
                        {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setPreviewJournal(null)}
              >
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
