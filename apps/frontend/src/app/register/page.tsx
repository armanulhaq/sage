'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { api, getApiUrl } from '@/utils/api';
import { setAuthToken } from '@/utils/auth';

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);
    try {
      const res = await api.auth.register({
        body: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      });

      if (res.status === 201) {
        setAuthToken(res.body.accessToken);
        router.push('/dashboard');
      } else {
        const body = res.body as any;
        const errorMsg =
          body?.message ||
          body?.bodyResult?.issues?.[0]?.message ||
          'Registration failed. Please check your information.';
        setServerError(String(errorMsg));
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setServerError('Unable to reach server. Please ensure the backend is running.');
    }
  };

  const googleAuthUrl = `${getApiUrl()}/auth/google`;

  return (
    <div className="min-h-screen text-white bg-neutral-950 bg-[radial-gradient(ellipse_100%_70%_at_50%_0%,rgba(250,204,21,0.2),rgba(15,15,18,0.95)_55%,#09090b)] flex flex-col justify-center items-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <Image src="/logo.png" alt="Sage" width={28} height={28} />
        <span className="text-2xl font-bold tracking-tight">Sage</span>
      </Link>

      <div className="w-full max-w-sm border border-neutral-800 bg-neutral-900/60 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-1">Create an account</h1>
          <p className="text-sm text-neutral-400">Begin your journey with history’s mentors</p>
        </div>

        {serverError && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {serverError}
          </div>
        )}

        {/* Google OAuth Button */}
        <a
          href={googleAuthUrl}
          className="w-full py-2.5 px-4 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 text-white font-medium text-sm flex items-center justify-center gap-2.5 transition-colors mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </a>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-neutral-800 w-full" />
          <span className="bg-neutral-900/60 px-2 text-[11px] text-neutral-500 uppercase tracking-wider absolute">
            or
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Full name
            </label>
            <input
              type="text"
              placeholder="Alex Morgan"
              autoComplete="name"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-yellow-400"
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-yellow-400"
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-yellow-400"
            />
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Confirm password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-yellow-400"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-lg bg-yellow-400 text-black font-semibold text-sm hover:bg-yellow-300 transition-colors disabled:opacity-50 mt-2"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-xs text-neutral-400 text-center mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-yellow-400 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}