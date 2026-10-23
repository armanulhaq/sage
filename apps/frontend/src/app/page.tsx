'use client';

import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Quote,
  Library,
  Search,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getAuthToken } from '@/utils/auth';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getAuthToken());
  }, []);

  // Smooth scroll handler without mutating browser URL hash history
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen text-stone-100 bg-[#090a0f] selection:bg-red-500/20 selection:text-red-300 relative overflow-hidden">
      {/* Anchored Ambient Lighting: Hero top wash & CTA bottom anchor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[620px] bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(239,68,68,0.45)_0%,rgba(185,28,28,0.2)_45%,transparent_75%)] pointer-events-none blur-2xl" />
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[750px] h-[400px] bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(239,68,68,0.38)_0%,rgba(185,28,28,0.15)_45%,transparent_75%)] pointer-events-none blur-2xl" />

      {/* Navigation */}
      <header className="border-b border-stone-800/80 bg-[#090a0f]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Image src="/logo.svg" alt="Sage" width={26} height={26} className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-red-400 transition-colors">
              Sage
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-stone-400">
            <button
              onClick={() => scrollTo('why-rag')}
              className="hover:text-white transition-colors"
            >
              Why Source-Grounded
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="hover:text-white transition-colors"
            >
              How It Works
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/sages"
                className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-xs shadow-lg shadow-red-950/40 transition-all hover:scale-[1.02] flex items-center gap-1.5"
              >
                <span>Go to Sages</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs font-medium text-stone-300 hover:text-white px-3 py-2 rounded-lg hover:bg-stone-900/60 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-xs shadow-lg shadow-red-950/40 transition-all hover:scale-[1.02] flex items-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 sm:pt-28 pb-20 px-6 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          Don&apos;t ask an algorithm. <br />
          <span className="text-red-500">
            Converse with History.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-stone-400 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
          Bring your career crossroads, leadership conflicts, and ethical dilemmas to history’s
          greatest minds—with answers rigorously cited from their authentic letters, speeches, and books.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href={isLoggedIn ? '/sages' : '/register'}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-sm shadow-xl shadow-red-950/50 transition-all hover:scale-[1.02] inline-flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{isLoggedIn ? 'Go to Sages' : 'Start Free Dialogue'}</span>
          </Link>
          <Link
            href="/sages"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-stone-800 hover:border-stone-700 bg-stone-900/60 hover:bg-stone-900 text-stone-300 font-medium text-sm transition-all inline-flex items-center justify-center gap-2"
          >
            <Library className="w-4 h-4 text-red-400" />
            <span>Explore Sages</span>
          </Link>
        </div>
      </section>

      {/* Why Grounded RAG Section (The Core Differentiation) */}
      <section id="why-rag" className="py-20 px-6 max-w-5xl mx-auto relative z-10 border-t border-stone-800/80 scroll-mt-20">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2 block">
            The Fundamental Problem
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
            Why Generic AI Fails Historical Wisdom
          </h2>
          <p className="text-sm sm:text-base text-stone-400 max-w-2xl mx-auto">
            Standard chatbots flatten great thinkers into modern corporate consultants, making up
            fabricated quotes and generic advice. Sage uses character-true RAG embeddings.
          </p>
        </div>

        {/* Side by side comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Generic LLM */}
          <div className="p-7 rounded-2xl border border-stone-800 bg-stone-900/40 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 mb-4 text-stone-400 font-bold text-sm">
              <XCircle className="w-5 h-5 text-red-500" />
              <span>Standard AI Chatbots</span>
            </div>
            <ul className="space-y-3.5 text-xs text-stone-300">
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Hallucinates quotes:</strong> Fabricates statements the thinker never wrote or uttered.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Modern slang & anachronisms:</strong> Uses 21st-century jargon alien to the thinker&apos;s worldview.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>No verifiable proof:</strong> Unable to point to a book title, page, or speech text.</span>
              </li>
            </ul>
          </div>

          {/* Card: Sage Grounded RAG */}
          <div className="p-7 rounded-2xl border border-red-500/40 bg-gradient-to-b from-red-950/20 to-transparent backdrop-blur-sm shadow-lg shadow-red-950/20">
            <div className="flex items-center gap-2.5 mb-4 text-red-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-red-400" />
              <span>Sage Grounded Intelligence</span>
            </div>
            <ul className="space-y-3.5 text-xs text-stone-300">
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">•</span>
                <span><strong>Primary source grounding:</strong> Every sage is built on verified books, speeches, and memoirs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">•</span>
                <span><strong>Verbatim citations:</strong> Responses include chapter and section tags you can cross-reference.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">•</span>
                <span><strong>Authentic voice & vocabulary:</strong> Reflects the precise philosophical tone and cadence of each era.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works Architecture Section */}
      <section id="how-it-works" className="py-20 px-6 max-w-5xl mx-auto relative z-10 border-t border-stone-800/80 scroll-mt-20">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2 block">
            Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
            From Authentic Texts to Grounded Dialogue
          </h2>
          <p className="text-sm text-stone-400 max-w-lg mx-auto">
            A three-step architecture engineered for precision, depth, and zero cognitive drift.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="rounded-2xl border border-stone-800 bg-[#111218]/60 p-6 flex flex-col justify-between hover:border-stone-700 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-500/20 flex items-center justify-center text-red-400 mb-5">
                <Library className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-red-400 tracking-wider uppercase">
                Phase 01
              </span>
              <h3 className="text-base font-bold text-white mt-1 mb-2">
                Ingest Authentic Corpora
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Ingest historical speeches, philosophical treatises, and personal letters. Each
                document is cleaned, partitioned into semantic chunks, and embedded into 768-dimensional vectors.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-stone-800/70 text-[11px] text-stone-500">
              PDFs, treatises, and public transcripts
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-stone-800 bg-[#111218]/60 p-6 flex flex-col justify-between hover:border-stone-700 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-500/20 flex items-center justify-center text-red-400 mb-5">
                <Search className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-red-400 tracking-wider uppercase">
                Phase 02
              </span>
              <h3 className="text-base font-bold text-white mt-1 mb-2">
                Neural Vector Search
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                When you share a real-world dilemma, PostgreSQL <code className="text-red-400">pgvector</code> performs
                cosine similarity search to locate the exact paragraphs where the sage tackled identical struggles.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-stone-800/70 text-[11px] text-stone-500">
              Sub-second pgvector retrieval
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-stone-800 bg-[#111218]/60 p-6 flex flex-col justify-between hover:border-stone-700 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-500/20 flex items-center justify-center text-red-400 mb-5">
                <Quote className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-red-400 tracking-wider uppercase">
                Phase 03
              </span>
              <h3 className="text-base font-bold text-white mt-1 mb-2">
                Character-Grounded Dialogue
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Gemini 1.5 synthesizes the retrieved historical excerpts into honest advice,
                adhering strictly to the sage&apos;s tone of voice and providing verbatim citation chips.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-stone-800/70 text-[11px] text-stone-500">
              Full context with exact citation footnotes
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-6 max-w-4xl mx-auto relative z-10 text-center">
        <div className="rounded-3xl border border-red-500/30 bg-gradient-to-b from-[#161214] to-[#0d0a0b] p-10 sm:p-14 shadow-2xl shadow-red-950/30 relative overflow-hidden">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Speak with the minds that <br />
            <span className="text-red-500">shaped human thought.</span>
          </h2>
          <p className="text-sm sm:text-base text-stone-400 max-w-md mx-auto mb-8 leading-relaxed">
            Begin with our curated public thinkers or craft your own sage grounded in your
            favorite author&apos;s works.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href={isLoggedIn ? '/sages' : '/register'}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-sm shadow-xl shadow-red-950/50 transition-all hover:scale-[1.02] inline-flex items-center justify-center gap-2"
            >
              <span>{isLoggedIn ? 'Go to Sages' : 'Get Started Free'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/sages"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-stone-800 hover:border-stone-700 bg-stone-900/60 text-stone-300 font-medium text-sm transition-all inline-flex items-center justify-center gap-2"
            >
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-800/80 py-10 px-6 text-xs text-stone-500 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="Sage" width={18} height={18} className="object-contain" />
            <span className="font-bold text-white text-sm">Sage</span>
            <span>— AI dialogue grounded in authentic historical corpora.</span>
          </div>
          <div>© {new Date().getFullYear()} Sage. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
