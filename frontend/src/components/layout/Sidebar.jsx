import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PenSquare,
  BookOpen,
  Calendar,
  Heart,
  FileEdit,
  Tag,
  BarChart2,
  Settings,
  LogOut,
  Sun,
  Moon,
  Sparkles,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useTheme } from '../../hooks/useTheme';

export default function Sidebar({ onOpenTemplateSelector }) {
  const { user, logout } = useAuthStore();
  const { appName, appTagline, appLogo } = useSettingsStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const isAdmin = Boolean(user?.is_admin || user?.role === 'admin');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'All Journals', to: '/journals', icon: BookOpen },
    { label: 'Calendar', to: '/calendar', icon: Calendar },
    { label: 'Favorites', to: '/favorites', icon: Heart },
    { label: 'Drafts', to: '/drafts', icon: FileEdit },
    { label: 'Tags', to: '/tags', icon: Tag },
    { label: 'Statistics', to: '/statistics', icon: BarChart2 },
    { label: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-stone-50/80 dark:bg-stone-950/80 border-r border-stone-200 dark:border-stone-800/80 backdrop-blur-md p-4 justify-between select-none">
      <div className="space-y-6">
        {/* Dynamic App Logo & Title */}
        <div className="flex items-center gap-3 px-2 pt-2">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden shrink-0 ${
              appLogo
                ? 'bg-transparent'
                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/60 shadow-2xs'
            }`}
          >
            {appLogo ? (
              <img
                src={appLogo}
                alt={appName}
                className="w-full h-full object-contain"
              />
            ) : (
              <Sparkles className="w-5 h-5 text-amber-500" />
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold tracking-tight text-stone-900 dark:text-stone-100 truncate">
              {appName || 'Daily Journal'}
            </h1>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
              {appTagline || 'Personal Digital Diary'}
            </p>
          </div>
        </div>

        {/* Primary Action Button: Write Journal */}
        <div className="px-1">
          <button
            type="button"
            onClick={onOpenTemplateSelector}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white text-sm font-semibold shadow-xs transition-all duration-150 active:scale-[0.98] cursor-pointer"
          >
            <PenSquare className="w-4 h-4 text-amber-400 dark:text-amber-600" />
            <span>Write Journal</span>
          </button>
        </div>

        {/* Main Navigation Links */}
        <nav className="space-y-1 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-stone-200/70 dark:bg-stone-800/90 text-stone-900 dark:text-stone-100 font-semibold'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 hover:text-stone-900 dark:hover:text-stone-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Admin Portal Link (Visible only to administrators) */}
          {isAdmin && (
            <div className="pt-2 mt-2 border-t border-stone-200/60 dark:border-stone-800/60">
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 font-bold border border-purple-300 dark:border-purple-800'
                      : 'text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span>Admin Portal</span>
                </div>
                <span className="px-1.5 py-0.2 rounded-full bg-purple-200 dark:bg-purple-900 text-[10px] font-bold text-purple-800 dark:text-purple-200">
                  Admin
                </span>
              </NavLink>
            </div>
          )}
        </nav>
      </div>

      {/* User Section & Theme / Logout */}
      <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-800/80 px-2">
        {/* User Card */}
        <div
          onClick={() => navigate('/settings')}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 cursor-pointer transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-200 flex items-center justify-center font-bold text-xs uppercase shrink-0">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                {user?.name || 'Journalist'}
              </p>
              {isAdmin && (
                <span className="px-1.5 py-0.2 rounded-md bg-purple-100 dark:bg-purple-950 text-[9px] font-bold text-purple-700 dark:text-purple-300">
                  Admin
                </span>
              )}
            </div>
            <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Action icons row */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2 p-2 rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 hover:text-stone-900 dark:hover:text-stone-100 text-xs transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-stone-600" />
                <span>Dark</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 p-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium transition-colors cursor-pointer"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
