"use client";

import React from 'react';

interface LandingOverlayProps {
  onStartGuided: () => void;
  onSkipToFreePlay: () => void;
}

const LandingOverlay: React.FC<LandingOverlayProps> = ({ onStartGuided, onSkipToFreePlay }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-2xl animate-fade-in overflow-y-auto scrollbar-hide">
      <div className="max-w-4xl w-full bg-zinc-950 border border-zinc-800 rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] overflow-hidden my-auto">
        <div className="p-6 md:p-10 space-y-8">
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="space-y-4 md:flex-1">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl shadow-2xl shadow-indigo-900/40">
                ⛓️
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Understand <br /> 
                <span className="bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent italic">
                  Blockchain
                </span>
                <br /> In 5 Minutes
              </h1>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                Most people think it&apos;s just about Bitcoin. <br />
                <strong>It&apos;s actually about accountability.</strong>
              </p>
            </div>

            {/* How it Works Simplified */}
            <div className="md:flex-1 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 space-y-4">
              <h2 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">The &quot;ELI5&quot; Breakdown</h2>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="text-xl">📦</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">The Glass Box</h4>
                    <p className="text-xs text-zinc-500 leading-snug">Think of a block as a glass box. Everyone can see what&apos;s inside, but no one can open it once it&apos;s locked.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-xl">☝️</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">The Digital Fingerprint</h4>
                    <p className="text-xs text-zinc-500 leading-snug">Every &quot;box&quot; has a unique fingerprint (Hash). If you change even one letter inside, the fingerprint changes completely.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-xl">🤝</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">The Secret Link</h4>
                    <p className="text-xs text-zinc-500 leading-snug">Each box remembers the fingerprint of the box before it. That&apos;s the <strong>chain</strong>.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real World Impact Section */}
          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-6 md:p-8 space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <span className="text-6xl">🏛️</span>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-500 text-[10px] font-black uppercase px-2 py-0.5 rounded text-white">Philippines 🇵🇭</span>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Real World Impact</h3>
                </div>
                <h4 className="text-lg md:text-xl font-bold text-indigo-100">The National Budget Blockchain Act</h4>
                <p className="text-xs md:text-sm text-indigo-200/70 leading-relaxed">
                  Senator <strong>Bam Aquino</strong> is pushing for <strong>Senate Bill No. 1330</strong>. 
                  The goal? To record the entire National Budget on a blockchain.
                </p>
                <div className="pt-2 text-[10px] md:text-xs text-indigo-300 font-mono italic bg-black/20 p-3 rounded-lg border border-indigo-500/10">
                  &quot;If the budget is on a blockchain, no government official can &apos;erase&apos; or &apos;hide&apos; a transaction. The record is eternal and visible to every citizen.&quot;
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-zinc-900">
            <button 
              onClick={onStartGuided}
              className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 px-8 rounded-2xl transition-all active:scale-95 shadow-xl shadow-indigo-900/30 group flex items-center justify-center gap-3 text-base"
            >
              Start Interactive Lab
              <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button 
              onClick={onSkipToFreePlay}
              className="flex-1 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold py-4 px-8 rounded-2xl transition-all border border-zinc-800 text-base"
            >
              Skip to Free Play
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default LandingOverlay;
