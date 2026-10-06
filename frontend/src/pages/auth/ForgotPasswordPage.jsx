import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../api/authApi';
import { useToastStore } from '../../store/toastStore';

import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [tokenInfo, setTokenInfo] = useState(null);
  const { addToast } = useToastStore();

  const forgotMutation = useMutation({
    mutationFn: (emailAddr) => authApi.forgotPassword(emailAddr),
    onSuccess: (res) => {
      setTokenInfo(res.data);
      addToast('Reset instructions generated ✓', 'success');
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Email not found in records.';
      addToast(msg, 'error');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotMutation.mutate(email);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 mx-auto flex items-center justify-center shadow-md">
            <KeyRound className="w-6 h-6 text-amber-400 dark:text-amber-600" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Forgot Password
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Enter your email to receive a password reset token.
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs">
          {tokenInfo ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                <p className="font-bold">Reset Token Generated:</p>
                <p className="font-mono text-[11px] break-all bg-white/80 dark:bg-stone-900 p-2 rounded-lg">
                  {tokenInfo.demo_reset_token}
                </p>
              </div>

              <Link
                to={`/reset-password?email=${encodeURIComponent(email)}&token=${tokenInfo.demo_reset_token}`}
              >
                <Button variant="primary" size="md" className="w-full">
                  Proceed to Reset Password
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                leftIcon={Mail}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={forgotMutation.isPending}
              >
                Send Reset Link
              </Button>
            </form>
          )}

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

