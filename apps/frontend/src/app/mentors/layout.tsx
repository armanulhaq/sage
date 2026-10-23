'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  LogOut,
  User as UserIcon,
  Plus,
  Compass,
  Menu,
  X,
} from 'lucide-react';
import { api } from '@/utils/api';
import { getAuthToken, setAuthToken, logout } from '@/utils/auth';
import type { UserProfile } from 'contract';
import CreatePersonalityModal from '@/components/CreatePersonalityModal';

export default function MentorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    // 1. Google OAuth handoff from URL query param
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token');
      if (urlToken) {
        setAuthToken(urlToken);
        window.history.replaceState({}, '', '/mentors');
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

    // Listen for open-create-mentor event triggered from child pages
    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener('open-create-mentor', handleOpenModal);
    return () => window.removeEventListener('open-create-mentor', handleOpenModal);
  }, [router]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      {/* Brand & Action */}
      <div>
        <div className="p-5 flex items-center justify-between border-b border-neutral-800/80">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Sage" width={26} height={26} />
            <span className="text-xl font-bold tracking-tight text-white">Sage</span>
          </Link>
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4">
          <button
            onClick={() => {
              setIsMobileSidebarOpen(false);
              setIsModalOpen(true);
            }}
            className="w-full py-2.5 px-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/10 transition-all hover:scale-[1.01]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Mentor</span>
          </button>
        </div>

        {/* Single Navigation Item: Mentors */}
        <div className="px-3">
          <Link
            href="/mentors"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold bg-neutral-800 text-white transition-colors"
          >
            <Compass className="w-4 h-4 text-yellow-400" />
            <span>Mentors</span>
          </Link>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-neutral-800/80 bg-neutral-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full border border-neutral-800 bg-neutral-900 flex items-center justify-center overflow-hidden flex-shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-4 h-4 text-yellow-400" />
              )}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-medium text-white block truncate">
                {user?.name || 'Loading...'}
              </span>
              <span className="text-[10px] text-neutral-500 block truncate">
                {user?.email}
              </span>
            </div>
          </div>

          <button
            onClick={() => logout()}
            title="Sign Out"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors ml-2"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 border-r border-neutral-800/80 bg-neutral-950/70 backdrop-blur-md h-screen sticky top-0 flex-shrink-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative w-72 bg-neutral-950 border-r border-neutral-800 h-full z-10">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen bg-[radial-gradient(ellipse_100%_70%_at_50%_0%,rgba(250,204,21,0.08),rgba(15,15,18,0.98)_55%,#09090b)]">
        {/* Mobile Top Navbar */}
        <header className="md:hidden flex items-center justify-between px-5 py-4 border-b border-neutral-800/80 bg-neutral-950/60 sticky top-0 z-20 backdrop-blur-sm">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Sage" width={22} height={22} />
            <span className="text-base font-bold tracking-tight">Sage</span>
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 rounded-lg bg-yellow-400 text-black"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </header>

        {/* Children View */}
        <main className="flex-1 p-6 sm:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Create Mentor Modal */}
      <CreatePersonalityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={() => {
          // Notify child page to refresh mentor list
          window.dispatchEvent(new Event('mentor-created'));
        }}
      />
    </div>
  );
}
