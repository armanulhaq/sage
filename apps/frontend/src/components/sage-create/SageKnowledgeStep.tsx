'use client';

import React from 'react';
import { BookOpen, Sparkles, ArrowLeft } from 'lucide-react';

interface SageKnowledgeStepProps {
  onBackToProfile: () => void;
}

export default function SageKnowledgeStep({ onBackToProfile }: SageKnowledgeStepProps) {
  return (
    <div className="space-y-6">
      <div className="p-8 rounded-2xl border border-stone-800/80 bg-[#111218]/60 text-center max-w-xl mx-auto space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-950/40 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
          <BookOpen className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-base font-bold text-white mb-1.5 flex items-center justify-center gap-2">
            <span>Knowledge Base & Authentic Sources</span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              Phase 3
            </span>
          </h3>
          <p className="text-xs text-stone-400 leading-relaxed max-w-md mx-auto">
            Attach books, memoirs, speeches, and treatise PDFs to this sage. The text will be
            automatically extracted, chunked, and embedded for grounded RAG dialogue.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-stone-800 bg-stone-950/60 text-left text-xs text-stone-300 space-y-2">
          <div className="flex items-center gap-2 text-red-400 font-semibold text-[11px] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Coming Next in Phase 3</span>
          </div>
          <ul className="text-stone-400 space-y-1.5 text-[11px] list-disc list-inside">
            <li>PDF & document direct ingestion via AWS S3</li>
            <li>Plain text speeches, letters, and custom excerpts</li>
            <li>Automated semantic sliding-window chunking</li>
            <li>768-dimensional Gemini neural vector embeddings</li>
          </ul>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onBackToProfile}
            className="px-4 py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-white bg-stone-900 border border-stone-800 hover:border-stone-700 transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Profile Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}
