'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Plus,
  Search,
  Compass,
  User as UserIcon,
  Globe,
  Lock,
  BookOpen,
  MessageSquare,
  X,
} from 'lucide-react';
import { api } from '@/utils/api';
import type { PersonalityResponse, UserProfile } from 'contract';
import CreatePersonalityModal from '@/components/CreatePersonalityModal';

export default function SagesPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [personalities, setPersonalities] = useState<PersonalityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch or refresh the list of sages
  const fetchPersonalities = useCallback(async () => {
    try {
      const res = await api.personality.list();
      if (res.status === 200) {
        setPersonalities(res.body);
      }
    } catch (err) {
      console.error('Failed to load sages:', err);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const [profileRes, personalitiesRes] = await Promise.all([
          api.auth.getProfile(),
          api.personality.list(),
        ]);

        if (profileRes.status === 200) {
          setUser(profileRes.body);
        }
        if (personalitiesRes.status === 200) {
          setPersonalities(personalitiesRes.body);
        }
      } catch (err) {
        console.error('Failed to load sages page data:', err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const mySagesCount = useMemo(
    () => (user ? personalities.filter((p) => p.creatorId === user.id).length : 0),
    [personalities, user]
  );

  // Search filtered strictly by sage name
  const displayedSages = useMemo(() => {
    return personalities
      .filter((p) => {
        if (activeTab === 'mine') return user && p.creatorId === user.id;
        return true;
      })
      .filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return p.name.toLowerCase().includes(q);
      });
  }, [personalities, activeTab, user, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Dialogue with Sages
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Historical thinkers, philosophers, and leaders grounded in authentic texts.
          </p>
        </div>

        {/* Search Input & Create Sage Action */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search sages by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-stone-900/80 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-colors shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-950/40 transition-all hover:scale-[1.01] flex-shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Sage</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs: All Sages vs My Sages */}
      <div className="flex items-center gap-2 border-b border-stone-800/80 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
            activeTab === 'all'
              ? 'bg-red-700 text-white font-bold shadow-md shadow-red-950/40'
              : 'text-stone-400 hover:text-white hover:bg-stone-900/60'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>All Sages</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded ${
              activeTab === 'all' ? 'bg-black/20 text-white font-bold' : 'bg-stone-900 border border-stone-800 text-stone-400'
            }`}
          >
            {loading ? '...' : personalities.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('mine')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
            activeTab === 'mine'
              ? 'bg-red-700 text-white font-bold shadow-md shadow-red-950/40'
              : 'text-stone-400 hover:text-white hover:bg-stone-900/60'
          }`}
        >
          <UserIcon className="w-3.5 h-3.5" />
          <span>My Sages</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded ${
              activeTab === 'mine' ? 'bg-black/20 text-white font-bold' : 'bg-stone-900 border border-stone-800 text-stone-400'
            }`}
          >
            {loading ? '...' : mySagesCount}
          </span>
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        // Shimmer Skeleton Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-stone-800/80 bg-[#111218]/40 animate-pulse flex flex-col justify-between h-56"
            >
              <div>
                <div className="flex items-start gap-3.5 mb-3.5">
                  <div className="w-12 h-12 rounded-xl bg-stone-800/80 flex-shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 bg-stone-800/80 rounded w-28" />
                    <div className="h-2.5 bg-stone-800/50 rounded w-16" />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="h-2.5 bg-stone-800/60 rounded w-full" />
                  <div className="h-2.5 bg-stone-800/60 rounded w-4/5" />
                  <div className="h-2.5 bg-stone-800/40 rounded w-2/3" />
                </div>
              </div>
              <div className="pt-3 border-t border-stone-800/60 flex items-center justify-between">
                <div className="h-3 bg-stone-800/40 rounded w-16" />
                <div className="h-7 bg-stone-800/70 rounded-lg w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : displayedSages.length === 0 ? (
        // Empty State
        <div className="text-center py-20 px-4 rounded-2xl border border-stone-800/80 bg-[#111218]/40 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 border border-red-500/20 flex items-center justify-center mx-auto mb-3 text-red-400">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">
            {searchQuery ? 'No matching sages found' : 'No sages yet'}
          </h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto mb-5 leading-relaxed">
            {searchQuery
              ? `No sages match "${searchQuery}". Try a different name.`
              : activeTab === 'mine'
              ? 'You have not created any sages yet. Bring a historical thinker to life!'
              : 'No public sages are currently published in the catalog.'}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-lg shadow-red-950/40 hover:scale-[1.02]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create Sage</span>
          </button>
        </div>
      ) : (
        // Sages Cards Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedSages.map((p) => {
            const isOwner = user ? p.creatorId === user.id : false;

            return (
              <div
                key={p.id}
                className="group p-5 rounded-2xl border border-stone-800/80 bg-[#111218]/70 hover:bg-[#151620]/90 hover:border-red-500/40 transition-all flex flex-col justify-between shadow-sm hover:shadow-lg hover:shadow-red-950/10"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start gap-3.5 mb-3.5">
                    <div className="w-12 h-12 rounded-xl border border-stone-800 bg-stone-950 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {p.avatar ? (
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <UserIcon className="w-6 h-6 text-stone-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h3 className="text-sm font-bold text-white truncate group-hover:text-red-400 transition-colors">
                          {p.name}
                        </h3>

                        {/* Status Pill */}
                        {p.status === 'APPROVED' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
                            <Globe className="w-2.5 h-2.5" />
                            <span>Public</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-900 text-stone-400 border border-stone-800 flex-shrink-0">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Private</span>
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-stone-400 truncate">
                        Created by{' '}
                        <span className="text-stone-300 font-medium">
                          {isOwner ? 'You' : p.creatorName}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-stone-300 line-clamp-3 mb-3.5 leading-relaxed font-serif-quote">
                    {p.bio}
                  </p>

                  {/* Voice Tone */}
                  {p.voiceTone && (
                    <div className="mb-4">
                      <span className="inline-block text-[10px] px-2.5 py-1 rounded-md bg-stone-950/80 border border-stone-800 text-red-300/80 italic font-serif-quote">
                        &ldquo;{p.voiceTone}&rdquo;
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Metadata & Actions */}
                <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                    <BookOpen className="w-3.5 h-3.5 text-red-400/80" />
                    <span>
                      {p.sourcesCount > 0
                        ? `${p.sourcesCount} ${p.sourcesCount === 1 ? 'source' : 'sources'}`
                        : '0 sources'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      alert(`Dialogue with ${p.name} (Chat interface coming up next)`);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-red-700 hover:text-white text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Sage Modal */}
      <CreatePersonalityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={() => {
          fetchPersonalities();
        }}
      />
    </div>
  );
}
