import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../api/authApi';
import { useToastStore } from '../../store/toastStore';

import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { KeyRound, Lock, ArrowLeft } from 'lucide-react';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const resetMutation = useMutation({
    mutationFn: (data) => authApi.resetPassword(data),
    onSuccess: () => {
      addToast('Password reset successfully! You can now log in.', 'success');
      navigate('/login');
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to reset password.';
      setErrorMessage(msg);
      addToast(msg, 'error');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    setErrorMessage('');
    resetMutation.mutate({
      email,
      token,
      password,
      password_confirmation: passwordConfirmation,
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 mx-auto flex items-center justify-center shadow-md">
            <KeyRound className="w-6 h-6 text-amber-400 dark:text-amber-600" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Reset Password
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Enter your token and choose a new secure password.
          </p>
        </div>

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
              required
            />

            <Input
              label="Reset Token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste the reset token"
              required
            />

            <Input
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              leftIcon={Lock}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Repeat your new password"
              leftIcon={Lock}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              isLoading={resetMutation.isPending}
            >
              Reset Password
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

