import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  PenSquare,
  Calendar,
  Settings,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function MobileNav({ onOpenTemplateSelector }) {
  const { user } = useAuthStore();
  const isAdmin = Boolean(user?.is_admin || user?.role === 'admin');

  const items = [
    { label: 'Home', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Journals', to: '/journals', icon: BookOpen },
    { label: 'Calendar', to: '/calendar', icon: Calendar },
    ...(isAdmin ? [{ label: 'Admin', to: '/admin', icon: Shield }] : [{ label: 'Settings', to: '/settings', icon: Settings }]),
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 border-t border-stone-200 dark:border-stone-800/80 backdrop-blur-md px-3 py-2 flex items-center justify-around">
      {items.slice(0, 2).map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-stone-900 dark:text-stone-100 font-bold'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}

      {/* Center Write Button */}
      <button
        type="button"
        onClick={onOpenTemplateSelector}
        className="-mt-5 w-12 h-12 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer border-4 border-white dark:border-stone-900"
        title="Write Journal"
      >
        <PenSquare className="w-5 h-5 text-amber-400 dark:text-amber-600" />
      </button>

      {items.slice(2).map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-stone-900 dark:text-stone-100 font-bold'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
