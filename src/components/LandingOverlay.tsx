"use client";

import React from 'react';

interface LandingOverlayProps {
  onStartGuided: () => void;
  onSkipToFreePlay: () => void;
}

const LandingOverlay: React.FC<LandingOverlayProps> = ({ onStartGuided, onSkipToFreePlay }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-2xl animate-fade-in">
      <div className="max-w-2xl w-full bg-zinc-950 border border-zinc-800 rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-12 space-y-6 md:space-y-8">
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl shadow-2xl shadow-indigo-900/40 animate-bounce">
              ⛓️
            </div>
            <h1 className="text-2xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Welcome to the <br /> 
              <span className="bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
                Blockchain Visualizer
              </span>
            </h1>
            <p className="text-zinc-400 text-sm md:text-lg leading-relaxed">
              Blockchain isn&apos;t just about money—it&apos;s a digital fortress for data. 
              This interactive tool will guide you through the cryptography that makes it impossible to cheat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-2">
              <span className="text-indigo-400 text-lg">💎</span>
              <h3 className="font-bold text-xs text-white uppercase tracking-widest">Digital Fingerprints</h3>
              <p className="text-[10px] text-zinc-500 font-mono italic leading-snug">Every block has a unique SHA-256 hash.</p>
            </div>
            <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-2">
              <span className="text-emerald-400 text-lg">🔗</span>
              <h3 className="font-bold text-xs text-white uppercase tracking-widest">Immutable Links</h3>
              <p className="text-[10px] text-zinc-500 font-mono italic leading-snug">Change one block, and the whole chain breaks.</p>
            </div>
             <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-2">
              <span className="text-amber-400 text-lg">⛏️</span>
              <h3 className="font-bold text-xs text-white uppercase tracking-widest">Proof of Work</h3>
              <p className="text-[10px] text-zinc-500 font-mono italic leading-snug">Mining makes tampering expensive & slow.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-zinc-900">
            <button 
              onClick={onStartGuided}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 md:py-4 px-8 rounded-xl md:rounded-2xl transition-all active:scale-95 shadow-lg shadow-indigo-900/20 group flex items-center justify-center gap-2 text-sm md:text-base"
            >
              Start Guided Lab
              <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button 
              onClick={onSkipToFreePlay}
              className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold py-3 md:py-4 px-8 rounded-xl md:rounded-2xl transition-all border border-zinc-800 text-sm md:text-base"
            >
              Skip to Free Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingOverlay;
