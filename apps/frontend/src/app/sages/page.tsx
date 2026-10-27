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
  Info,
  Trash2,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/utils/api';
import type { PersonalityResponse, UserProfile } from 'contract';

export default function SagesPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [personalities, setPersonalities] = useState<PersonalityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [detailsSage, setDetailsSage] = useState<PersonalityResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PersonalityResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  // Handle Delete Confirmation
  const handleDeleteSage = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await api.personality.delete({
        params: { id: deleteTarget.id },
      });

      if (res.status === 200) {
        setPersonalities((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        const body = res.body as any;
        setDeleteError(body?.message || 'Failed to delete sage');
      }
    } catch (err: any) {
      console.error('Delete sage error:', err);
      setDeleteError('An unexpected error occurred while deleting');
    } finally {
      setIsDeleting(false);
    }
  };

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

          <Link
            href="/sages/create"
            className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-950/40 transition-all hover:scale-[1.01] flex-shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Sage</span>
          </Link>
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
              activeTab === 'all'
                ? 'bg-black/20 text-white font-bold'
                : 'bg-stone-900 border border-stone-800 text-stone-400'
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
              activeTab === 'mine'
                ? 'bg-black/20 text-white font-bold'
                : 'bg-stone-900 border border-stone-800 text-stone-400'
            }`}
          >
            {loading ? '...' : mySagesCount}
          </span>
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        // Shimmer Skeleton Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-stone-800/80 bg-[#111218]/40 animate-pulse h-80"
            />
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
          <Link
            href="/sages/create"
            className="px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-lg shadow-red-950/40 hover:scale-[1.02]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create Sage</span>
          </Link>
        </div>
      ) : (
        // Sages Cards Grid - Framed portrait + clean pedestal layout
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedSages.map((p) => {
            const isOwner = user ? p.creatorId === user.id : false;

            return (
              <div
                key={p.id}
                className="group relative rounded-2xl overflow-hidden border border-stone-800/80 bg-[#111218] hover:border-red-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-red-950/30 flex flex-col justify-between"
              >
                {/* 1. Unobstructed Framed Portrait (Top) */}
                <div className="relative w-full aspect-[4/3.8] overflow-hidden bg-stone-950">
                  {p.avatar ? (
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                        const fallback = (e.target as HTMLElement).parentElement?.querySelector(
                          '.avatar-fallback',
                        );
                        if (fallback) (fallback as HTMLElement).classList.remove('hidden');
                      }}
                    />
                  ) : null}

                  {/* Fallback portrait background */}
                  <div
                    className={`avatar-fallback absolute inset-0 w-full h-full bg-gradient-to-b from-stone-900 via-stone-950 to-[#090a0f] flex flex-col items-center justify-center p-6 text-center ${
                      p.avatar ? 'hidden' : ''
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-red-950/40 border border-red-500/20 flex items-center justify-center text-red-400 mb-2 shadow-inner">
                      <UserIcon className="w-7 h-7 opacity-80" />
                    </div>
                    <span className="text-2xl font-serif italic text-red-500/20 select-none">
                      {p.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Top Bar Floating Over Portrait */}
                  <div className="absolute top-0 inset-x-0 p-3 flex items-center justify-between gap-2 z-10 bg-gradient-to-b from-black/70 via-black/30 to-transparent">
                    {/* Status Pill */}
                    {p.status === 'APPROVED' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30 shadow-sm">
                        <Globe className="w-2.5 h-2.5" />
                        <span>Public</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-stone-300 border border-white/10 shadow-sm">
                        <Lock className="w-2.5 h-2.5 text-stone-400" />
                        <span>Private</span>
                      </span>
                    )}

                    {/* Action Buttons: Info & Delete */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setDetailsSage(p)}
                        title="View Sage details"
                        className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-stone-300 hover:text-white border border-white/10 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-md"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>

                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(p)}
                          title="Delete Sage"
                          className="w-7 h-7 rounded-full bg-black/60 hover:bg-red-950/90 text-stone-300 hover:text-red-400 border border-white/10 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Grounded Card Base / Pedestal (No overlap with the photo) */}
                <div className="p-4 bg-[#111218] border-t border-stone-800/80 flex flex-col justify-between flex-1 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight leading-snug group-hover:text-red-400 transition-colors line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">
                      {isOwner ? 'Created by You' : `By ${p.creatorName}`}
                    </p>
                  </div>

                  {/* Clean Non-Intrusive Button */}
                  <button
                    type="button"
                    onClick={() => {
                      alert(`Dialogue with ${p.name} (Chat interface coming up next)`);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-stone-900/90 hover:bg-red-700 border border-stone-800 hover:border-red-600 text-stone-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-lg hover:shadow-red-950/40 group/btn"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-red-400 group-hover/btn:text-white transition-colors" />
                    <span>Start a conversation</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Sage Details Info Modal */}
      {detailsSage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#111218] border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border border-stone-800 bg-stone-900 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {detailsSage.avatar ? (
                    <img
                      src={detailsSage.avatar}
                      alt={detailsSage.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-5 h-5 text-stone-500" />
                  )}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white leading-tight">
                    {detailsSage.name}
                  </h2>
                  <p className="text-xs text-stone-400">
                    Created by {user && detailsSage.creatorId === user.id ? 'You' : detailsSage.creatorName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDetailsSage(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Status and Knowledge sources chips */}
              <div className="flex items-center gap-2.5">
                {detailsSage.status === 'APPROVED' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Globe className="w-3 h-3" />
                    <span>Public Sage</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-stone-900 text-stone-400 border border-stone-800">
                    <Lock className="w-3 h-3" />
                    <span>Private Sage</span>
                  </span>
                )}

                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-stone-900 text-stone-400 border border-stone-800">
                  <BookOpen className="w-3 h-3 text-red-400" />
                  <span>
                    {detailsSage.sourcesCount > 0
                      ? `${detailsSage.sourcesCount} authentic sources`
                      : '0 knowledge sources attached'}
                  </span>
                </span>
              </div>

              {/* Biography */}
              <div>
                <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                  Biography & Worldview
                </h4>
                <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800/80 text-stone-200 text-xs leading-relaxed font-serif-quote">
                  {detailsSage.bio}
                </div>
              </div>

              {/* Voice Tone */}
              {detailsSage.voiceTone && (
                <div>
                  <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                    Speaking Voice & Tone
                  </h4>
                  <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 text-red-300 text-xs italic font-serif-quote">
                    &ldquo;{detailsSage.voiceTone}&rdquo;
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-800 bg-stone-950/40">
              <button
                type="button"
                onClick={() => setDetailsSage(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Starting dialogue with ${detailsSage.name}...`);
                  setDetailsSage(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-700 hover:bg-red-600 text-white transition-all shadow-md shadow-red-950/40 flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Start a conversation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-[#111218] border border-stone-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">
                Delete &ldquo;{deleteTarget.name}&rdquo;?
              </h3>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                This will permanently remove this sage and any attached knowledge sources. This
                action cannot be undone.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 text-xs rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(null);
                  setDeleteError(null);
                }}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSage}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-700 hover:bg-red-600 text-white transition-all flex items-center gap-1.5 disabled:opacity-50 shadow-md shadow-red-950/40"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isDeleting ? 'Deleting...' : 'Delete Sage'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
