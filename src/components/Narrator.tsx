"use client";

import React from 'react';

export interface Step {
  id: number;
  title: string;
  beforePrompt: string;
  afterPrompt: string;
  actionRequired: string;
}

export const STEPS: Step[] = [
  {
    id: 1,
    title: "Build Your First Block",
    beforePrompt: "Alice wants to send Bob 10 coins. But how do we make sure no one fakes this transaction? Type it in and mine your first block.",
    afterPrompt: "You just created a block. It contains your data, a timestamp, and a unique fingerprint called a hash. The hash is generated from everything inside — change anything, and the fingerprint changes. That's what makes it secure.",
    actionRequired: "mine_first_block"
  },
  {
    id: 2,
    title: "Chain Them Together",
    beforePrompt: "Let's add another record. Mine a second block to see how they connect.",
    afterPrompt: "See how Block 2 remembers Block 1's fingerprint? That's the chain. Every block is linked to the one before it. This chain of fingerprints is what makes a blockchain a BLOCKchain.",
    actionRequired: "mine_second_block"
  },
  {
    id: 3,
    title: "Try to Cheat",
    beforePrompt: "Now try something sneaky — edit Block 1's data. Change 'Alice pays Bob 10' to 'Alice pays Bob 1000'. Watch what happens.",
    afterPrompt: "Notice the chain turned RED? Since you changed the data, the 'Fingerprint' (Hash) changed. But Block 2 still points to the OLD fingerprint. In a real blockchain, other computers would see this mismatch and reject your change instantly. That's how decentralization prevents cheating.",
    actionRequired: "tamper_block_1"
  },
  {
    id: 4,
    title: "Why Mining is Hard",
    beforePrompt: "You've been mining at difficulty 2. Try difficulty 4 and mine a new block. Watch the 'Attempts' count. Notice how much harder the computer has to work?",
    afterPrompt: "See the massive jump in attempts? Higher difficulty requires finding a hash with more leading zeros—like finding a needle in a much larger haystack. This 'Proof of Work' makes it computationally expensive to rewrite history, securing the entire network.",
    actionRequired: "mine_high_difficulty"
  }
];

interface NarratorProps {
  currentStep: number;
  isActionCompleted: boolean;
  onNext: () => void;
  onToggleGuided: () => void;
  isGuidedMode: boolean;
}

const Narrator: React.FC<NarratorProps> = ({ 
  currentStep, 
  isActionCompleted, 
  onNext, 
  onToggleGuided,
  isGuidedMode 
}) => {
  if (!isGuidedMode) return null;

  const step = STEPS[currentStep - 1];
  if (!step) return null;

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="fixed bottom-4 md:bottom-8 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[90%] max-w-2xl z-[100] animate-slide-up-mobile md:animate-slide-up">
      <div className="bg-zinc-900/95 border border-zinc-700 backdrop-blur-xl rounded-2xl shadow-2xl p-4 md:p-6 overflow-hidden relative">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-zinc-800 w-full">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 text-2xl shadow-lg shadow-indigo-900/20">
            🤖
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-indigo-400 font-black text-xs uppercase tracking-widest">
                Step {step.id}: {step.title}
              </h3>
              <button 
                onClick={onToggleGuided}
                className="text-[10px] text-zinc-500 hover:text-white transition-colors uppercase font-bold"
              >
                Exit Tour
              </button>
            </div>
            
            <p className="text-zinc-200 text-sm leading-relaxed font-medium">
              {isActionCompleted ? step.afterPrompt : step.beforePrompt}
            </p>

            {isActionCompleted && (
              <button
                onClick={onNext}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-bold text-xs transition-all active:scale-95 shadow-lg shadow-indigo-900/20"
              >
                {currentStep === STEPS.length ? "Finish & Explore" : "Continue to Next Step"}
              </button>
            )}
            
            {!isActionCompleted && (
              <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-wider bg-black/30 w-fit px-3 py-1 rounded-full border border-zinc-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Action: {step.title}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Narrator;
