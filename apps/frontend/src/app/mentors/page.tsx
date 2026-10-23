'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Sparkles,
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

export default function MentorsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [personalities, setPersonalities] = useState<PersonalityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch or refresh the list of mentors
  const fetchPersonalities = useCallback(async () => {
    try {
      const res = await api.personality.list();
      if (res.status === 200) {
        setPersonalities(res.body);
      }
    } catch (err) {
      console.error('Failed to load mentors:', err);
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
        console.error('Failed to load mentors page data:', err);
      } finally {
        setLoading(false);
      }
    };

    init();

    // Re-fetch when a new mentor is created in the sidebar modal
    const handleMentorCreated = () => fetchPersonalities();
    window.addEventListener('mentor-created', handleMentorCreated);
    return () => window.removeEventListener('mentor-created', handleMentorCreated);
  }, [fetchPersonalities]);

  const myMentorsCount = useMemo(
    () => (user ? personalities.filter((p) => p.creatorId === user.id).length : 0),
    [personalities, user]
  );

  // Search filtered strictly by mentor name
  const displayedMentors = useMemo(() => {
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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 text-xs font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Source-Grounded Mentors</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Dialogue with Sages
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Explore historical thinkers, philosophers, and mentors grounded in authentic texts.
          </p>
        </div>

        {/* Search Input - Strictly filters by mentor name */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search mentors by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-neutral-900/70 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs: All Mentors vs My Mentors */}
      <div className="flex items-center gap-2 border-b border-neutral-800/80 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'all'
              ? 'bg-yellow-400 text-black font-semibold'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>All Mentors</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded ${
              activeTab === 'all' ? 'bg-black/15 text-black' : 'bg-neutral-800 text-neutral-400'
            }`}
          >
            {loading ? '...' : personalities.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('mine')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'mine'
              ? 'bg-yellow-400 text-black font-semibold'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <UserIcon className="w-3.5 h-3.5" />
          <span>My Mentors</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded ${
              activeTab === 'mine' ? 'bg-black/15 text-black' : 'bg-neutral-800 text-neutral-400'
            }`}
          >
            {loading ? '...' : myMentorsCount}
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
              className="p-5 rounded-2xl border border-neutral-800/80 bg-neutral-900/30 animate-pulse flex flex-col justify-between h-56"
            >
              <div>
                <div className="flex items-start gap-3.5 mb-3.5">
                  <div className="w-12 h-12 rounded-xl bg-neutral-800/70 flex-shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 bg-neutral-800/80 rounded w-28" />
                    <div className="h-2.5 bg-neutral-800/50 rounded w-16" />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="h-2.5 bg-neutral-800/60 rounded w-full" />
                  <div className="h-2.5 bg-neutral-800/60 rounded w-4/5" />
                  <div className="h-2.5 bg-neutral-800/40 rounded w-2/3" />
                </div>
              </div>
              <div className="pt-3 border-t border-neutral-800/60 flex items-center justify-between">
                <div className="h-3 bg-neutral-800/40 rounded w-16" />
                <div className="h-7 bg-neutral-800/70 rounded-lg w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : displayedMentors.length === 0 ? (
        // Empty State
        <div className="text-center py-20 px-4 rounded-2xl border border-neutral-800/80 bg-neutral-900/20 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-3 text-neutral-500">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">
            {searchQuery ? 'No matching mentors found' : 'No mentors yet'}
          </h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-5 leading-relaxed">
            {searchQuery
              ? `No mentors match "${searchQuery}". Try a different name.`
              : activeTab === 'mine'
              ? 'You have not created any mentors yet. Bring a thinker or guide to life!'
              : 'No mentors are currently available in the directory.'}
          </p>
          <button
            onClick={() => window.dispatchEvent(new Event('open-create-mentor'))}
            className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-lg shadow-yellow-400/10"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create Mentor</span>
          </button>
        </div>
      ) : (
        // Mentor Cards Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedMentors.map((p) => {
            const isOwner = user ? p.creatorId === user.id : false;

            return (
              <div
                key={p.id}
                className="group p-5 rounded-2xl border border-neutral-800/90 bg-neutral-900/40 hover:bg-neutral-900/80 hover:border-neutral-700/80 transition-all flex flex-col justify-between shadow-sm"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start gap-3.5 mb-3.5">
                    <div className="w-12 h-12 rounded-xl border border-neutral-800 bg-neutral-950 flex-shrink-0 overflow-hidden flex items-center justify-center">
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
                        <UserIcon className="w-6 h-6 text-neutral-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h3 className="text-sm font-bold text-white truncate group-hover:text-yellow-400 transition-colors">
                          {p.name}
                        </h3>

                        {/* Status Pill */}
                        {p.status === 'APPROVED' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
                            <Globe className="w-2.5 h-2.5" />
                            <span>Public</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 flex-shrink-0">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Private</span>
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-neutral-400 truncate">
                        Created by{' '}
                        <span className="text-neutral-300 font-medium">
                          {isOwner ? 'You' : p.creatorName}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-neutral-300 line-clamp-3 mb-3.5 leading-relaxed">
                    {p.bio}
                  </p>

                  {/* Voice Tone */}
                  {p.voiceTone && (
                    <div className="mb-4">
                      <span className="inline-block text-[10px] px-2.5 py-1 rounded-md bg-neutral-950 border border-neutral-800 text-neutral-400 italic">
                        &ldquo;{p.voiceTone}&rdquo;
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Metadata & Actions */}
                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <BookOpen className="w-3.5 h-3.5 text-neutral-500" />
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
                    className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-yellow-400 hover:text-black text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
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
    </div>
  );
}
