'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowRight } from 'lucide-react';
import { api, getApiUrl } from '@/utils/api';
import { setAuthToken, getAuthToken } from '@/utils/auth';

type LoginFormValues = {
  email: string;
  password: string;
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthError = searchParams.get('error');

  const [serverError, setServerError] = useState<string | null>(
    oauthError ? 'Google sign-in was cancelled or failed. Please try again.' : null,
  );

  useEffect(() => {
    if (getAuthToken()) {
      router.replace('/sages');
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      const res = await api.auth.login({
        body: {
          email: data.email,
          password: data.password,
        },
      });

      if (res.status === 200) {
        setAuthToken(res.body.accessToken);
        router.replace('/sages');
      } else {
        const body = res.body as any;
        const errorMsg =
          body?.message ||
          body?.bodyResult?.issues?.[0]?.message ||
          'Invalid email or password';
        setServerError(String(errorMsg));
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setServerError('Unable to reach server. Please ensure the backend is running.');
    }
  };

  const googleAuthUrl = `${getApiUrl()}/auth/google`;

  return (
    <div className="w-full max-w-sm border border-red-500/30 bg-[#111218]/95 p-8 rounded-2xl shadow-2xl shadow-red-950/70 backdrop-blur-xl relative z-10">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Welcome back</h1>
        <p className="text-xs text-stone-400">Continue your conversations with history</p>
      </div>

      {serverError && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {serverError}
        </div>
      )}

      {/* Google OAuth Button */}
      <a
        href={googleAuthUrl}
        className="w-full py-2.5 px-4 rounded-xl border border-stone-800 bg-stone-900/80 hover:bg-stone-800 text-stone-200 font-medium text-xs flex items-center justify-center gap-2.5 transition-colors mb-4 shadow-sm"
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
        <div className="border-t border-stone-800 w-full" />
        <span className="bg-[#111218] px-2 text-[10px] text-stone-500 uppercase tracking-widest absolute">
          or email
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-stone-300 mb-1.5">
            Email address
          </label>
          <input
            type="email"
            placeholder="you@domain.com"
            autoComplete="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950/80 border border-stone-800 text-stone-200 placeholder-stone-600 text-xs focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-colors"
          />
          {errors.email && (
            <p className="text-[11px] text-red-400 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-300 mb-1.5">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950/80 border border-stone-800 text-stone-200 placeholder-stone-600 text-xs focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-colors"
          />
          {errors.password && (
            <p className="text-[11px] text-red-400 mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-xs shadow-lg shadow-red-950/40 transition-all hover:scale-[1.01] disabled:opacity-50 mt-2 flex items-center justify-center gap-1.5"
        >
          <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      <p className="text-xs text-stone-400 text-center mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-red-400 hover:text-red-300 font-semibold underline underline-offset-2">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen text-stone-100 bg-[#090a0f] relative overflow-hidden flex flex-col justify-center items-center px-4 py-12">
      {/* Single Cohesive Ambient Halo centered behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.36)_0%,rgba(185,28,28,0.14)_45%,transparent_70%)] pointer-events-none blur-3xl" />

      <Link href="/" className="flex items-center gap-2.5 mb-6 group relative z-10">
        <div className="w-8 h-8 flex items-center justify-center group-hover:scale-105 transition-transform">
          <Image src="/logo.svg" alt="Sage" width={32} height={32} className="w-full h-full object-contain" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-white group-hover:text-red-400 transition-colors">
          Sage
        </span>
      </Link>

      <Suspense fallback={<div className="w-full max-w-sm h-96 animate-pulse bg-stone-900 rounded-2xl" />}>
        <LoginForm />
      </Suspense>

      <p className="text-[11px] text-stone-500 mt-8 italic max-w-xs text-center font-serif-quote">
        &ldquo;The soul becomes dyed with the color of its thoughts.&rdquo; — Marcus Aurelius
      </p>
    </div>
  );
}