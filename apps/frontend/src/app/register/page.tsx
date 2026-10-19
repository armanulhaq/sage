'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormValues) => {
    console.log('Register submitted:', data);
  };

  return (
    <div className="min-h-screen text-white bg-neutral-950 bg-[radial-gradient(ellipse_100%_70%_at_50%_0%,rgba(250,204,21,0.2),rgba(15,15,18,0.95)_55%,#09090b)] flex flex-col justify-center items-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <Image src="/logo.png" alt="Sage" width={28} height={28} />
        <span className="text-2xl font-bold tracking-tight">Sage</span>
      </Link>

      <div className="w-full max-w-sm border border-neutral-800 bg-neutral-900/60 p-8 rounded-2xl shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-1">Create an account</h1>
          <p className="text-sm text-neutral-400">Begin your journey with history’s mentors</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Full name
            </label>
            <input
              type="text"
              placeholder="Alex Morgan"
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