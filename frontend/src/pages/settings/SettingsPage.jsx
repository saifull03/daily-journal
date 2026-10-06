import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../hooks/useTheme';
import { useToastStore } from '../../store/toastStore';

import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { User, Lock, Moon, Sun, Shield, Save } from 'lucide-react';

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToastStore();

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const email = user?.email || '';
  const [bio, setBio] = useState(user?.bio || '');

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  // Update Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data) => authApi.updateProfile(data),
    onSuccess: (res) => {
      setUser(res.data);
      addToast('Profile updated successfully ✓', 'success');
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to update profile.';
      addToast(msg, 'error');
    },
  });

  // Change Password Mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data) => authApi.changePassword(data),
    onSuccess: () => {
      addToast('Password changed successfully ✓', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Current password was incorrect.';
      addToast(msg, 'error');
    },
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate({ name, bio });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== newPasswordConfirm) {
      addToast('New password confirmation does not match.', 'error');
      return;
    }
    changePasswordMutation.mutate({
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirm,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div className="pb-2">
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          Account & Preferences
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          Manage your personal details, credentials, and app appearance.
        </p>
      </div>

      {/* Theme Card */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-amber-600" />}
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Appearance Theme
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Currently set to {theme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
            </p>
          </div>
        </div>

        <Button size="sm" variant="outline" onClick={toggleTheme}>
          Switch to {theme === 'dark' ? 'Light' : 'Dark'}
        </Button>
      </div>

      {/* Profile Information Form */}
      <form
        onSubmit={handleProfileSubmit}
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
      >
        <div className="flex items-center gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
          <User className="w-4 h-4 text-stone-500" />
          <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            Personal Information
          </h4>
        </div>

        <div className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            value={email}
            disabled
            helperText="Email cannot be changed directly in demo mode."
          />

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
              Bio / Philosophy
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A few words about your writing journey..."
              className="w-full text-xs sm:text-sm bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-xl p-3 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            leftIcon={Save}
            isLoading={updateProfileMutation.isPending}
          >
            Save Profile
          </Button>
        </div>
      </form>

      {/* Change Password Form */}
      <form
        onSubmit={handlePasswordSubmit}
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
      >
        <div className="flex items-center gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
          <Lock className="w-4 h-4 text-stone-500" />
          <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            Change Password
          </h4>
        </div>

        <div className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            leftIcon={Shield}
            isLoading={changePasswordMutation.isPending}
          >
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}
