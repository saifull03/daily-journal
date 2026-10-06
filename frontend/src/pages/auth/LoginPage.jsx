import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';

import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Sparkles, Mail, Lock, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password123');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { addToast } = useToastStore();

  const loginMutation = useMutation({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (res) => {
      setAuth(res.data.user, res.data.token);
      addToast('Welcome back! 👋', 'success');
      navigate('/dashboard');
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
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 mx-auto flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6 text-amber-400 dark:text-amber-600" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Welcome Back
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Sign in to continue writing your personal story.
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Banner */}
        <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-3.5 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div>
            <span className="font-bold">Demo Account:</span>
            <span className="text-stone-600 dark:text-stone-300 ml-1.5">
              demo@example.com / password123
            </span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="font-bold underline text-amber-700 dark:text-amber-400 hover:text-amber-900 cursor-pointer text-[11px]"
          >
            Auto Fill
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
