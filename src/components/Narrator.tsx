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
    title: "The Digital Fingerprint",
    beforePrompt: "Imagine Alice sends Bob 10 pesos. We need to lock this record in a 'Glass Box'. Type the transaction and click 'Mine' to create your first block.",
    afterPrompt: "You just created a 'Fingerprint' (Hash) for this box. If you change even one comma in the data, the fingerprint changes entirely. This makes the data tamper-proof.",
    actionRequired: "mine_first_block"
  },
  {
    id: 2,
    title: "Linking the Boxes",
    beforePrompt: "Let's add a second record. Notice how the next block 'remembers' the fingerprint of the first one? Mine it to lock the link.",
    afterPrompt: "Now they are 'Chained'. Because Block 2 knows Block 1's fingerprint, you can't change the past without breaking the future. This is the 'Chain' in Blockchain.",
    actionRequired: "mine_second_block"
  },
  {
    id: 3,
    title: "Caught in the Act",
    beforePrompt: "Try to cheat! Go to Block 1, click 'Edit', and change the amount. Watch what happens to the whole chain.",
    afterPrompt: "It turned RED! Because the fingerprint of Block 1 changed, Block 2 (which expects the old fingerprint) now sees a mismatch. This is exactly how the 'National Budget Blockchain' would catch corruption—once it's recorded, it can't be changed in secret.",
    actionRequired: "tamper_block_1"
  },
  {
    id: 4,
    title: "Why it's Secure",
    beforePrompt: "Mining isn't just a button—it's hard work for the computer. Set difficulty to 4 and mine. Watch the 'Attempts' count explode.",
    afterPrompt: "See how many guesses it took? This 'Proof of Work' makes it so expensive to change the past that it's practically impossible to cheat. This is why a Blockchain-based budget would be the most transparent system in the world.",
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
