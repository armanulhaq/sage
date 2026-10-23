'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { LogOut, User as UserIcon, Shield, Sparkles } from 'lucide-react';
import { api } from '@/utils/api';
import { getAuthToken, logout } from '@/utils/auth';
import type { UserProfile } from 'contract';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.auth.getProfile();
        if (res.status === 200) {
          setUser(res.body);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white bg-[radial-gradient(ellipse_100%_70%_at_50%_0%,rgba(250,204,21,0.15),rgba(15,15,18,0.95)_55%,#09090b)]">
      {/* Header */}
      <header className="border-b border-neutral-800/80 px-6 py-4 flex items-center justify-between backdrop-blur-sm bg-neutral-950/50 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="Sage" width={26} height={26} />
          <span className="text-xl font-bold tracking-tight">Sage</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/60 text-xs text-neutral-300">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name || 'User Avatar'}
                width={20}
                height={20}
                className="rounded-full"
              />
            ) : (
              <UserIcon className="w-3.5 h-3.5 text-yellow-400" />
            )}
            <span className="font-medium text-white">{user?.name}</span>
          </div>

          <button
            onClick={() => logout()}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Protected Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-sm text-neutral-400">
            Your authenticated session is active and verified by the Sage API.
          </p>
        </div>

        {/* Profile Card */}
        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-sm space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-yellow-400" />
            Authenticated User Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-950/60">
              <span className="text-xs text-neutral-500 block mb-1">User ID</span>
              <span className="text-xs font-mono text-neutral-300 break-all">{user?.id}</span>
            </div>

            <div className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-950/60">
              <span className="text-xs text-neutral-500 block mb-1">Email Address</span>
              <span className="text-sm text-neutral-200">{user?.email}</span>
            </div>

            <div className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-950/60">
              <span className="text-xs text-neutral-500 block mb-1">Role</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 inline-block">
                {user?.role}
              </span>
            </div>

            <div className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-950/60">
              <span className="text-xs text-neutral-500 block mb-1">Authentication Method</span>
              <span className="text-sm text-neutral-300">
                {user?.avatar ? 'Google OAuth' : 'Email & Password'}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
