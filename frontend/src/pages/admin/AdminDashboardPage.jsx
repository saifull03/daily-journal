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
  Eye,
  RefreshCw,
  Lock,
  Mail,
  User as UserIcon,
  X,
  ExternalLink,
  Feather,
  Sun,
  Moon,
  Compass,
  Mountain,
  Globe,
} from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import { useSettingsStore } from '../../store/settingsStore';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';

// Curated high-res SVG presets for instant logo selection
const PRESET_LOGOS = [
  {
    id: 'lotus',
    name: 'Mindful Lotus',
    icon: Sparkles,
    color: '#d97706',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" fill="%23fef3c7"/><path d="M50 20C40 38 30 50 25 65C38 68 45 60 50 80C55 60 62 68 75 65C70 50 60 38 50 20Z" fill="%23d97706"/><circle cx="50" cy="45" r="8" fill="%23b45309"/></svg>`,
  },
  {
    id: 'quill',
    name: 'Elegant Quill',
    icon: Feather,
    color: '#6366f1',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" fill="%23e0e7ff"/><path d="M68 22C60 22 36 45 32 68C38 66 48 58 54 50C60 42 66 32 68 22Z" fill="%234f46e5"/><path d="M32 68L26 78L36 74L32 68Z" fill="%234338ca"/></svg>`,
  },
  {
    id: 'sunburst',
    name: 'Golden Dawn',
    icon: Sun,
    color: '#f59e0b',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" fill="%23fef3c7"/><circle cx="50" cy="50" r="22" fill="%23f59e0b"/><path d="M50 14V22M50 78V86M14 50H22M78 50H86M25 25L31 31M69 69L75 75M25 75L31 69M69 31L75 25" stroke="%23d97706" stroke-width="6" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'sanctuary',
    name: 'Zen Mountain',
    icon: Mountain,
    color: '#10b981',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" fill="%23d1fae5"/><path d="M22 72L42 38L54 55L64 42L78 72H22Z" fill="%23059669"/><circle cx="70" cy="30" r="8" fill="%23047857"/></svg>`,
  },
  {
    id: 'compass',
    name: 'Explorer Compass',
    icon: Compass,
    color: '#06b6d4',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" fill="%23cffafe"/><circle cx="50" cy="50" r="34" stroke="%230891b2" stroke-width="4"/><polygon points="50,24 58,48 50,44 42,48" fill="%230284c7"/><polygon points="50,76 58,52 50,56 42,52" fill="%230369a1"/></svg>`,
  },
  {
    id: 'nocturne',
    name: 'Cosmic Moon',
    icon: Moon,
    color: '#a855f7',
    svgUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" fill="%23f3e8ff"/><path d="M52 24C37 24 25 36 25 51C25 66 37 78 52 78C44 72 39 62 39 51C39 40 44 30 52 24Z" fill="%239333ea"/><circle cx="68" cy="38" r="3" fill="%237e22ce"/><circle cx="62" cy="62" r="2" fill="%237e22ce"/></svg>`,
  },
];

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
  // 2. BRAND & LOGO STATE & MUTATIONS
  // ----------------------------------------------------
  const [brandForm, setBrandForm] = useState({
    app_name: appName,
    app_tagline: appTagline,
    primary_color: primaryColor,
    welcome_message: welcomeMessage,
    footer_text: footerText,
    allow_registration: allowRegistration,
  });

  const [logoSourceType, setLogoSourceType] = useState('upload'); // 'upload' | 'preset' | 'url'
  const [customLogoUrl, setCustomLogoUrl] = useState('');
  const [logoPreview, setLogoPreview] = useState(appLogo);
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const fileInputRef = useRef(null);
  const overviewFileInputRef = useRef(null);

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
    setLogoPreview(appLogo);
  }, [appName, appTagline, appLogo, primaryColor, welcomeMessage, footerText, allowRegistration]);

  const updateSettingsMutation = useMutation({
    mutationFn: (data) => adminApi.updateSettings(data),
    onSuccess: (res) => {
      updateSettingsLocally(res.data);
      addToast('Brand settings updated successfully! ✨', 'success');
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
      addToast('Brand logo uploaded & applied live! 🎨', 'success');
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
      setCustomLogoUrl('');
      addToast('Brand logo reset to default emblem.', 'info');
      queryClient.invalidateQueries(['admin-settings']);
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Failed to reset logo', 'error');
    },
  });

  // Handle local file selection
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

      // Instantly upload file to server
      const formData = new FormData();
      formData.append('logo', file);
      uploadLogoMutation.mutate(formData);
    }
  };

  // Handle Preset logo selection
  const handleSelectPresetLogo = (preset) => {
    setLogoPreview(preset.svgUrl);
    setSelectedLogoFile(null);
    updateSettingsMutation.mutate({
      ...brandForm,
      app_logo: preset.svgUrl,
    });
    addToast(`"${preset.name}" preset logo applied! 🌟`, 'success');
  };

  // Handle Custom URL apply
  const handleApplyLogoUrl = () => {
    if (!customLogoUrl.trim()) return;
    setLogoPreview(customLogoUrl.trim());
    setSelectedLogoFile(null);
    updateSettingsMutation.mutate({
      ...brandForm,
      app_logo: customLogoUrl.trim(),
    });
    addToast('Custom logo URL applied! 🌐', 'success');
  };

  // Save all general brand settings
  const handleSaveBrandSettings = (e) => {
    e.preventDefault();
    updateSettingsMutation.mutate(brandForm);
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
            System Administration & Brand Studio
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl">
            Manage and customize brand logos, application identity, user permissions, and content
            moderation across the entire platform.
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
          { id: 'overview', label: 'Overview & Quick Brand Setup', icon: BarChart3 },
          { id: 'branding', label: 'Brand & Logo Studio', icon: Palette },
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
      {/* TAB 1: OVERVIEW & QUICK BRAND SETUP                                       */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 🌟 FEATURED SYSTEM FORM: Change Brand Logo Directly from Dashboard */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-200/80 dark:border-stone-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-extrabold uppercase tracking-wider">
                    Quick Brand Control
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
                    Change Brand Logo & Identity
                  </h2>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Update the application logo instantly. Upload a custom image file, choose from
                  curated brand presets, or paste a URL.
                </p>
              </div>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                leftIcon={Palette}
                onClick={() => setActiveTab('branding')}
              >
                Open Full Studio
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Current Active Logo Display Card (Transparent / Clean Container - No Black Box) */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/80 shadow-2xs text-center space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Active Brand Logo
                </p>

                {/* Clean Logo Container without forced black background */}
                <div className="w-24 h-24 rounded-2xl bg-transparent flex items-center justify-center p-2 overflow-hidden relative group">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Brand Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-amber-500" />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {appName || 'Daily Journal'}
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    {logoPreview ? 'Custom Brand Logo Active' : 'Default Emblem Active'}
                  </p>
                </div>

                {logoPreview && (
                  <button
                    type="button"
                    onClick={() => removeLogoMutation.mutate()}
                    className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer flex items-center gap-1 pt-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset to Default</span>
                  </button>
                )}
              </div>

              {/* Instant Logo Selection Options */}
              <div className="lg:col-span-8 space-y-4">
                {/* 1. Upload Local Logo File */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-amber-500" /> Option 1: Upload Image File (PNG, JPG, SVG, WebP)
                    </span>
                    <span className="text-[10px] text-stone-400">Max 4MB</span>
                  </div>

                  <input
                    type="file"
                    ref={overviewFileInputRef}
                    onChange={handleLogoFileChange}
                    accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif"
                    className="hidden"
                  />

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      leftIcon={Upload}
                      onClick={() => overviewFileInputRef.current?.click()}
                      isLoading={uploadLogoMutation.isPending}
                    >
                      Select & Apply Image File
                    </Button>
                    <span className="text-xs text-stone-500">
                      Instantly updates Sidebar, Header & Auth screens!
                    </span>
                  </div>
                </div>

                {/* 2. Choose from Curated Logo Presets */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/80 space-y-2.5">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-500" /> Option 2: 1-Click Curated Presets
                  </span>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {PRESET_LOGOS.map((preset) => {
                      const isSelected = logoPreview === preset.svgUrl;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectPresetLogo(preset)}
                          className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-amber-500 bg-white dark:bg-stone-900 shadow-xs ring-2 ring-amber-400'
                              : 'border-stone-200 dark:border-stone-700 bg-white/70 dark:bg-stone-900/70 hover:bg-white dark:hover:bg-stone-900'
                          }`}
                          title={preset.name}
                        >
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 p-1">
                            <img
                              src={preset.svgUrl}
                              alt={preset.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="text-[10px] font-semibold text-stone-700 dark:text-stone-300 truncate w-full">
                            {preset.name.split(' ')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Image URL */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/80 space-y-2">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-sky-500" /> Option 3: Remote Logo Image URL
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={customLogoUrl}
                      onChange={(e) => setCustomLogoUrl(e.target.value)}
                      placeholder="https://example.com/brand-logo.png"
                      className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleApplyLogoUrl}
                      disabled={!customLogoUrl.trim()}
                    >
                      Apply URL
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                <span className="text-xs font-semibold">Current Brand</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                  {appName}
                </p>
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  Live
                </span>
              </div>
            </div>
          </div>

          {/* Template Breakdown & Activity Overview */}
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

            {/* Quick Actions */}
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
                        Brand & Logo Studio
                      </p>
                      <p className="text-[11px] text-stone-500">Edit titles, colors, and slogans</p>
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
      {/* TAB 2: BRAND & LOGO STUDIO                                                */}
      {/* ========================================================================= */}
      {activeTab === 'branding' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Brand Customization Form */}
          <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-500" /> Complete Brand & Logo Studio
              </h2>
              <p className="text-xs text-stone-500">
                Customize every facet of your brand identity. Upload logos, configure slogans, choose
                color themes, and adjust system permissions.
              </p>
            </div>

            {/* 1. BRAND LOGO MANAGER FORM */}
            <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide">
                    Brand Logo Customizer
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Choose how you want to set your brand logo image (Transparent, No background box)
                  </p>
                </div>

                {logoPreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    leftIcon={Trash2}
                    onClick={() => removeLogoMutation.mutate()}
                    className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    Reset Logo
                  </Button>
                )}
              </div>

              {/* Logo Source Selector Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-200/70 dark:bg-stone-800 max-w-sm">
                {[
                  { id: 'upload', label: 'File Upload', icon: Upload },
                  { id: 'preset', label: 'Presets', icon: Sparkles },
                  { id: 'url', label: 'Image URL', icon: Globe },
                ].map((src) => {
                  const Icon = src.icon;
                  const isCur = logoSourceType === src.id;
                  return (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => setLogoSourceType(src.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isCur
                          ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{src.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Source 1: File Upload */}
              {logoSourceType === 'upload' && (
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <div className="w-16 h-16 rounded-2xl bg-transparent flex items-center justify-center p-1 overflow-hidden shrink-0 border border-stone-200 dark:border-stone-700">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Sparkles className="w-6 h-6 text-amber-500" />
                    )}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleLogoFileChange}
                      accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      leftIcon={Upload}
                      onClick={() => fileInputRef.current?.click()}
                      isLoading={uploadLogoMutation.isPending}
                    >
                      Browse & Upload Image File
                    </Button>
                    <p className="text-[10px] text-stone-400">
                      Supports PNG, JPG, JPEG, SVG, WebP (Max 4MB) · Renders clean without any background
                    </p>
                  </div>
                </div>
              )}

              {/* Source 2: Curated Presets */}
              {logoSourceType === 'preset' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {PRESET_LOGOS.map((preset) => {
                    const isSelected = logoPreview === preset.svgUrl;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPresetLogo(preset)}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-500 bg-white dark:bg-stone-900 shadow-xs ring-2 ring-amber-400'
                            : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800'
                        }`}
                      >
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 p-1">
                          <img
                            src={preset.svgUrl}
                            alt={preset.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                            {preset.name}
                          </p>
                          <span className="text-[10px] text-stone-400">Click to apply</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Source 3: Remote Image URL */}
              {logoSourceType === 'url' && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    value={customLogoUrl}
                    onChange={(e) => setCustomLogoUrl(e.target.value)}
                    placeholder="https://example.com/brand-logo.png"
                    className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleApplyLogoUrl}
                    disabled={!customLogoUrl.trim()}
                  >
                    Set URL
                  </Button>
                </div>
              )}
            </div>

            {/* General Brand Details Form */}
            <form onSubmit={handleSaveBrandSettings} className="space-y-6">
              {/* Brand Names & Tagline */}
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

              {/* Accent Color Palettes */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-900 dark:text-stone-100">
                  Theme Accent Palette
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

              {/* Welcome Headline & Description */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-900 dark:text-stone-100">
                  Welcome Subtext (Auth & Landing Screens)
                </label>
                <textarea
                  rows={2}
                  value={brandForm.welcome_message}
                  onChange={(e) => setBrandForm({ ...brandForm, welcome_message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100"
                  placeholder="Capture your thoughts, reflections, and journeys in a distraction-free sanctuary."
                />
              </div>

              {/* Footer Text */}
              <Input
                label="Footer Copyright & Notice"
                type="text"
                value={brandForm.footer_text}
                onChange={(e) => setBrandForm({ ...brandForm, footer_text: e.target.value })}
                placeholder="© Daily Journal — Mindful writing sanctuary"
              />

              {/* System Registration Toggle */}
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
                  isLoading={updateSettingsMutation.isPending}
                >
                  Save Brand Settings
                </Button>
              </div>
            </form>
          </div>

          {/* Live Multi-View Brand Sandbox */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4 sticky top-24">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                  Live Brand Preview
                </span>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mt-2">
                  Real-Time UI Preview
                </h3>
                <p className="text-xs text-stone-500">
                  How your customized brand appears live across navigation and authentication
                </p>
              </div>

              {/* Sidebar Header Preview (Transparent Logo Container) */}
              <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  1. Sidebar Navigation Brand
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-transparent flex items-center justify-center overflow-hidden shadow-xs shrink-0">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                      </div>
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

              {/* Login Modal Preview (Transparent Logo Container) */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-2 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 text-left">
                  2. Login & Sign Up Screen
                </p>
                <div className="w-14 h-14 rounded-2xl bg-transparent mx-auto flex items-center justify-center overflow-hidden p-1">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-amber-500" />
                    </div>
                  )}
                </div>
                <p className="text-xs font-serif font-bold text-stone-900 dark:text-stone-100">
                  Welcome to {brandForm.app_name || 'Daily Journal'}
                </p>
                <p className="text-[10px] text-stone-500">
                  {brandForm.welcome_message ||
                    'Capture your thoughts, reflections, and journeys in a distraction-free sanctuary.'}
                </p>
              </div>

              {/* Registration Status */}
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
