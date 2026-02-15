"use client";

import React from 'react';

interface GlossaryProps {
  isOpen: boolean;
  onClose: () => void;
}

const terms = [
  {
    term: "Block",
    analogy: "A Glass Box",
    definition: "A container for data (like a list of payments). Once the box is 'full' and locked, everyone can see what's inside, but no one can change it."
  },
  {
    term: "Hash",
    analogy: "A Digital Fingerprint",
    definition: "A long string of letters and numbers that uniquely identifies a block. If you change even one tiny thing inside the block, the Fingerprint changes completely."
  },
  {
    term: "Previous Hash",
    analogy: "The Chain Link",
    definition: "This is how blocks connect. Each block 'remembers' the fingerprint of the box before it. This makes it impossible to swap a box without breaking the whole chain."
  },
  {
    term: "Nonce",
    analogy: "The Golden Ticket",
    definition: "A random number that computers 'guess' millions of times to find a valid fingerprint. It's the 'Proof' that work was done."
  },
  {
    term: "Mining",
    analogy: "The Guessing Game",
    definition: "The process of a computer guessing the Nonce. It's designed to be hard so that cheating becomes too expensive and slow to be worth it."
  },
  {
    term: "Immutable",
    analogy: "Written in Stone",
    definition: "A fancy word meaning 'cannot be changed'. Once a block is mined and shared, its contents are permanent."
  }
];

const Glossary: React.FC<GlossaryProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-white italic">GLOSSARY</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">The Blockchain for Humans</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
          {terms.map((item, i) => (
            <div key={i} className="space-y-1 group">
              <div className="flex items-center gap-2">
                <h3 className="text-indigo-400 font-black text-base uppercase tracking-tight">{item.term}</h3>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-full font-bold border border-indigo-500/20">
                  {item.analogy}
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                {item.definition}
              </p>
            </div>
          ))}
        </div>

        <div className="p-6 bg-zinc-950/50 border-t border-zinc-800">
          <p className="text-[10px] text-zinc-500 text-center uppercase font-bold tracking-[0.2em]">
            Knowledge is Power 🏛️
          </p>
        </div>
      </div>
    </div>
  );
};

export default Glossary;
