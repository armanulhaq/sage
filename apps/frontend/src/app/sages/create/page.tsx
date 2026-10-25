'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, BookOpen } from 'lucide-react';
import SageProfileStep from '@/components/sage-create/SageProfileStep';
import SageKnowledgeStep from '@/components/sage-create/SageKnowledgeStep';

export default function CreateSagePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'knowledge'>('profile');

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation & Page Header */}
      <div>
        <Link
          href="/sages"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-400 hover:text-white transition-colors mb-4 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Sages</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Bring a Sage to Life
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
              Configure their voice, historical portrait, and grounding knowledge base for
              character-accurate dialogues.
            </p>
          </div>
        </div>
      </div>

      {/* Step Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-stone-800/80 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-red-700 text-white shadow-md shadow-red-950/40'
              : 'text-stone-400 hover:text-white hover:bg-stone-900/60'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>1. Profile & Persona</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('knowledge')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'knowledge'
              ? 'bg-red-700 text-white shadow-md shadow-red-950/40'
              : 'text-stone-400 hover:text-white hover:bg-stone-900/60'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>2. Knowledge Base</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-400 font-normal">
            Phase 3
          </span>
        </button>
      </div>

      {/* Step Views */}
      <div className="pt-2">
        {activeTab === 'profile' ? (
          <SageProfileStep
            onSuccess={() => {
              router.push('/sages');
            }}
            onGoToKnowledge={() => setActiveTab('knowledge')}
          />
        ) : (
          <SageKnowledgeStep onBackToProfile={() => setActiveTab('profile')} />
        )}
      </div>
    </div>
  );
}
