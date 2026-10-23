'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  LogOut,
  User as UserIcon,
  Compass,
  Menu,
  X,
} from 'lucide-react';
import { api } from '@/utils/api';
import { getAuthToken, setAuthToken, logout } from '@/utils/auth';
import type { UserProfile } from 'contract';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    // 1. Google OAuth handoff from URL query param
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token');
      if (urlToken) {
        setAuthToken(urlToken);
        window.history.replaceState({}, '', '/sages');
      }
    }

    // 2. Auth check
    const token = getAuthToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    // 3. Load user profile for the layout shell
    const fetchUser = async () => {
      try {
        const res = await api.auth.getProfile();
        if (res.status === 200) {
          setUser(res.body);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Failed to load profile in layout:', err);
        logout();
      }
    };

    fetchUser();
  }, [router]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between bg-[#0b0c12]">
      {/* Brand & Nav */}
      <div>
        <div className="p-5 flex items-center justify-between border-b border-stone-800/80">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Image src="/logo.svg" alt="Sage" width={28} height={28} className="w-full h-full object-contain" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-red-400 transition-colors">
              Sage
            </span>
          </Link>
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Items (Clean, no harsh outlines) */}
        <div className="p-3">
          <Link
            href="/sages"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-stone-900/80 text-stone-100 hover:bg-stone-900 transition-colors"
          >
            <Compass className="w-4 h-4 text-red-500" />
            <span>Sages</span>
          </Link>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-stone-800/80 bg-stone-950/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full border border-stone-800 bg-stone-900 flex items-center justify-center overflow-hidden flex-shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-4 h-4 text-stone-400" />
              )}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-medium text-stone-200 block truncate">
                {user?.name || 'Loading...'}
              </span>
              <span className="text-[10px] text-stone-500 block truncate">
                {user?.email}
              </span>
            </div>
          </div>

          <button
            onClick={() => logout()}
            title="Sign Out"
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors ml-2"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#090a0f] text-stone-100 flex selection:bg-red-500/20 selection:text-red-300">
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 border-r border-stone-800/80 bg-[#0b0c12]/90 backdrop-blur-md h-screen sticky top-0 flex-shrink-0 z-30">
        <SidebarContent />
      </aside>

      {/* Smooth Mobile Drawer Sidebar with Slide Transition */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
        <div
          className={`relative w-72 bg-[#0b0c12] border-r border-stone-800 h-full z-10 transform transition-transform duration-300 ease-in-out ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarContent />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen bg-[#090a0f] relative overflow-hidden">
        {/* Anchored Ambient Wash: Soft top illumination across search and sages directory */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[380px] bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(239,68,68,0.42)_0%,rgba(185,28,28,0.18)_40%,transparent_75%)] pointer-events-none blur-2xl" />

        {/* Mobile Top Navbar */}
        <header className="md:hidden flex items-center justify-between px-5 py-4 border-b border-stone-800/80 bg-[#090a0f]/80 sticky top-0 z-20 backdrop-blur-sm">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-900"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <Image src="/logo.svg" alt="Sage" width={24} height={24} className="w-full h-full object-contain" />
            </div>
            <span className="text-base font-bold tracking-tight text-white">Sage</span>
          </Link>

          <div className="w-8" /> {/* Placeholder for balance */}
        </header>

        {/* Children View */}
        <main className="flex-1 p-6 sm:p-8 max-w-6xl w-full mx-auto relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
