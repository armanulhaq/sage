import React from 'react';
import { ArrowRight, MessageSquare, BookMarked, Compass, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen text-white bg-neutral-950 bg-[radial-gradient(ellipse_100%_70%_at_50%_0%,rgba(250,204,21,0.2),rgba(15,15,18,0.95)_55%,#09090b)]">
      {/* Navigation */}
      <header className="border-b border-white/5 bg-transparent backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Sage" width={24} height={24} />
            <span className="text-xl font-bold">Sage</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-16 px-6 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-yellow-400/30 text-yellow-400 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          AI Mentorship Platform
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
          Timeless Wisdom for <br />
          <span className="text-yellow-400">Modern Dilemmas.</span>
        </h1>

        <p className="text-lg text-neutral-400 mb-8 max-w-xl mx-auto">
          Bring your toughest career, leadership, and personal questions to history’s greatest thinkers. Honest advice, rooted in their real words and ideas.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#chat"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-yellow-400 text-black font-semibold text-sm hover:bg-yellow-300"
          >
            <MessageSquare className="w-4 h-4" />
            Talk to a Mentor
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-neutral-800 text-neutral-300 font-medium text-sm hover:bg-neutral-900"
          >
            How It Works
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">How Sage Works</h2>
          <p className="text-neutral-400 text-sm">
            Real perspective drawn from authentic historical texts, not generic chatbot answers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
            <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-yellow-400 mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-yellow-400 uppercase">Step 01</span>
            <h3 className="text-lg font-bold mt-1 mb-2">Choose Your Mentor</h3>
            <p className="text-sm text-neutral-400">
              Pick the right mind for your challenge; from strategic clarity to calm resilience or team leadership.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
            <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-yellow-400 mb-4">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-yellow-400 uppercase">Step 02</span>
            <h3 className="text-lg font-bold mt-1 mb-2">Ask Anything</h3>
            <p className="text-sm text-neutral-400">
              Bring modern dilemmas like team conflict, career crossroads, or big decisions in plain everyday words.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
            <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-yellow-400 mb-4">
              <BookMarked className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-yellow-400 uppercase">Step 03</span>
            <h3 className="text-lg font-bold mt-1 mb-2">Source-Backed Advice</h3>
            <p className="text-sm text-neutral-400">
              Responses are anchored in historical speeches, books, and letters for genuine, character-true answers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section id="chat" className="py-16 px-6 max-w-4xl mx-auto text-center">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-10">
          <h2 className="text-3xl font-bold mb-3">Ready to Speak with History?</h2>
          <p className="text-neutral-400 text-sm max-w-md mx-auto mb-6">
            Gain fresh clarity from leaders who faced high stakes and tough choices centuries ago.
          </p>
          <a
            href="#chat"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-yellow-400 text-black font-semibold text-sm hover:bg-yellow-300"
          >
            Start Your First Chat
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="border-t border-neutral-900 py-8 px-6 text-sm text-neutral-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Sage</span>
            <span>- AI mentorship grounded in historical writings.</span>
          </div>
          <div>© {new Date().getFullYear()} Sage. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
