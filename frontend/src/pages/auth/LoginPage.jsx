import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useToastStore } from '../../store/toastStore';

import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Sparkles, Mail, Lock, LogIn, Shield, User } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password123');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { appName, appLogo, welcomeMessage } = useSettingsStore();
  const { addToast } = useToastStore();

  const loginMutation = useMutation({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (res) => {
      setAuth(res.data.user, res.data.token);
      const isAdmin = res.data.user?.is_admin || res.data.user?.role === 'admin';
      addToast(isAdmin ? 'Welcome Super Admin! 🛡️' : 'Welcome back! 👋', 'success');
      navigate(isAdmin ? '/admin' : '/dashboard');
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        'Invalid credentials. Please try again.';
      setErrorMessage(msg);
      addToast(msg, 'error');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    loginMutation.mutate({ email, password });
  };

  const handleFillDemo = () => {
    setEmail('demo@example.com');
    setPassword('password123');
    setErrorMessage('');
  };

  const handleFillAdmin = () => {
    setEmail('admin@example.com');
    setPassword('admin123');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div
            className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center overflow-hidden p-1 ${
              appLogo
                ? 'bg-transparent'
                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/60 shadow-xs'
            }`}
          >
            {appLogo ? (
              <img
                src={appLogo}
                alt={appName}
                className="w-full h-full object-contain"
              />
            ) : (
              <Sparkles className="w-8 h-8 text-amber-500" />
            )}
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
            {appName ? `Welcome to ${appName}` : 'Welcome Back'}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto">
            {welcomeMessage || 'Sign in to continue writing your personal story.'}
          </p>
        </div>

        {/* Demo & Admin Credentials Quick-Fill Banners */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={handleFillAdmin}
            className="flex items-center justify-between p-2.5 rounded-2xl bg-purple-50/90 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 text-purple-900 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors cursor-pointer text-left"
          >
            <div className="min-w-0">
              <span className="font-bold flex items-center gap-1 text-[11px]">
                <Shield className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                Admin
              </span>
              <p className="text-[10px] text-purple-700/80 dark:text-purple-300/80 truncate">
                admin@example.com
              </p>
            </div>
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 underline shrink-0 ml-1">
              Fill
            </span>
          </button>

          <button
            type="button"
            onClick={handleFillDemo}
            className="flex items-center justify-between p-2.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors cursor-pointer text-left"
          >
            <div className="min-w-0">
              <span className="font-bold flex items-center gap-1 text-[11px]">
                <User className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                Journalist
              </span>
              <p className="text-[10px] text-amber-700/80 dark:text-amber-300/80 truncate">
                demo@example.com
              </p>
            </div>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 underline shrink-0 ml-1">
              Fill
            </span>
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400">
                {errorMessage}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              leftIcon={Mail}
              required
            />

            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={Lock}
                required
              />
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={LogIn}
              className="w-full mt-2"
              isLoading={loginMutation.isPending}
            >
              Sign In
            </Button>
          </form>

          {/* Registration link */}
          <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 text-center text-xs text-stone-500">
            <span>Don't have an account yet? </span>
            <Link
              to="/register"
              className="font-bold text-stone-900 dark:text-stone-100 hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
