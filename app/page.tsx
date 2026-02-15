"use client";

import React, { useState, useEffect } from "react";
import Blockchain from "@/lib/Blockchain";
import Block from "@/lib/Block";
import BlockCard from "@/components/BlockCard";
import Narrator from "@/components/Narrator";
import LandingOverlay from "@/components/LandingOverlay";
import Tooltip from "@/components/Tooltip";
import Glossary from "@/components/Glossary";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [blockchain] = useState(() => new Blockchain());
  const [blockData, setBlockData] = useState("");
  const [isMining, setIsMining] = useState(false);
  const [miningTime, setMiningTime] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState(2);
  const [isValid, setIsValid] = useState(true);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [miningNonce, setMiningNonce] = useState(0);
  const [miningIndices, setMiningIndices] = useState<Set<number>>(new Set());
  const [lastMiningStats, setLastMiningStats] = useState<{ attempts: number; duration: number; difficulty: number } | null>(null);

  // Walkthrough State
  const [isGuidedMode, setIsGuidedMode] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [walkthroughStep, setWalkthroughStep] = useState(1);
  const [isStepActionCompleted, setIsStepActionCompleted] = useState(false);
  const [hasTampered, setHasTampered] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

  // Contextual Feedback State
  const [toast, setToast] = useState<{ message: string; submessage?: string; type: 'info' | 'warning' | 'success' } | null>(null);

  const showToast = (message: string, submessage?: string, type: 'info' | 'warning' | 'success' = 'info') => {
    setToast({ message, submessage, type });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      setIsValid(blockchain.isChainValid());
    }, 0);
    return () => clearTimeout(timer);
  }, [blockchain]);

  // Effect to rapidly increment nonce visually during mining
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMining || miningIndices.size > 0) {
      interval = setInterval(() => {
        setMiningNonce(prev => prev + Math.floor(Math.random() * 500) + 13);
      }, 40);
    } 
    return () => clearInterval(interval);
  }, [isMining, miningIndices]);

  const handleMineBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockData || isMining) return;

    setIsMining(true);
    setMiningTime(null);

    const worker = new Worker(new URL('../src/workers/mining.worker.ts', import.meta.url));
    
    const index = blockchain.chain.length;
    const timestamp = new Date().toISOString();

    worker.postMessage({
      index,
      timestamp,
      data: blockData,
      previousHash: blockchain.getLatestBlock().hash,
      difficulty
    });

    worker.onmessage = (e) => {
      if (e.data.type === 'SUCCESS') {
        const { nonce, hash, duration } = e.data;
        const newBlock = new Block(index, timestamp, blockData);
        newBlock.nonce = nonce;
        newBlock.hash = hash;
        newBlock.previousHash = blockchain.getLatestBlock().hash;
        
        blockchain.chain.push(newBlock);
        
        setMiningTime(duration);
        setLastMiningStats({ attempts: nonce, duration, difficulty });
        setIsMining(false);
        setBlockData("");
        setIsValid(blockchain.isChainValid());
        setUpdateTrigger((prev) => prev + 1);

        showToast(
          "Block Mined Successfully", 
          `Computer tried ${nonce.toLocaleString()} different nonces (guesses) in ${duration.toFixed(0)}ms to find a valid hash.`,
          'success'
        );

        if (isGuidedMode) {
          if (walkthroughStep === 1 && blockchain.chain.length === 2) {
            setIsStepActionCompleted(true);
          } else if (walkthroughStep === 2 && blockchain.chain.length === 3) {
            setIsStepActionCompleted(true);
          } else if (walkthroughStep === 4 && difficulty >= 4) {
            setIsStepActionCompleted(true);
          }
        }
        worker.terminate();
      }
    };
  };

  const handleRemineBlock = (index: number) => {
    const block = blockchain.chain[index];
    if (!block) return;

    setMiningIndices(prev => new Set(prev).add(index));
    
    const worker = new Worker(new URL('../src/workers/mining.worker.ts', import.meta.url));
    
    worker.postMessage({
      index,
      timestamp: block.timestamp,
      data: block.data,
      previousHash: block.previousHash,
      difficulty
    });

    worker.onmessage = (e) => {
      if (e.data.type === 'SUCCESS') {
        const { nonce, hash, duration } = e.data;
        block.nonce = nonce;
        block.hash = hash;
        
        setMiningIndices(prev => {
          const next = new Set(prev);
          next.delete(index);
          return next;
        });
        
        setLastMiningStats({ attempts: nonce, duration, difficulty });
        setIsValid(blockchain.isChainValid());
        setUpdateTrigger(prev => prev + 1);

        if (index < blockchain.chain.length - 1) {
          showToast(
            "Avalanche Effect! ❄️", 
            `Block #${index} is fixed, but its NEW hash doesn't match the 'Previous Hash' stored in Block #${index+1}. You'll need to re-mine the next block too!`,
            'info'
          );
        } else {
          showToast(
            "Block Repaired", 
            `Successfully re-mined Block #${index}. The chain is now valid!`,
            'success'
          );
        }
        worker.terminate();
      }
    };
  };

  const handleUpdateBlockData = (index: number, newData: string) => {
    const block = blockchain.chain[index];
    if (block) {
      Object.assign(block, {
        data: newData,
        hash: block.calculateHash()
      });
      
      const newHash = block.hash;
      const valid = blockchain.isChainValid();
      setIsValid(valid);
      setUpdateTrigger((prev) => prev + 1);

      // Show contextual feedback for tampering
      if (!valid) {
        const nextBlock = blockchain.chain[index + 1];
        const nextBlockPrevHash = nextBlock ? nextBlock.previousHash : null;

        let breakdown = `Data in Block #${index} was changed. Its hash no longer matches what's stored in the next block.`;
        if (nextBlockPrevHash) {
          breakdown = `BROKEN LINK: Block #${index} now has hash ${newHash.substring(0, 8)}..., but Block #${index+1} still expects ${nextBlockPrevHash.substring(0, 8)}...`;
        }

        showToast(
          isGuidedMode && walkthroughStep === 3 ? "Manipulation Detected!" : "Chain Integrity Compromised!", 
          breakdown,
          'warning'
        );
      }

      // Walkthrough logic for tampering
      if (isGuidedMode && walkthroughStep === 3 && index === 1) {
        setHasTampered(true);
        setIsStepActionCompleted(true);
      }
    }
  };

  const handleDifficultyChange = (level: number) => {
    setDifficulty(level);
    if (blockchain) {
      blockchain.setDifficulty(level);
      showToast(
        "Difficulty Updated", 
        `New blocks now require hashes starting with ${'0'.repeat(level)}. This exponentially increases the mining "guesses" (nonces) required.`,
        'info'
      );
    }
  };

  const handleAutoFixChain = () => {
    // Find the first invalid block
    let startIndex = -1;
    for (let i = 0; i < blockchain.chain.length; i++) {
        const block = blockchain.chain[i];
        const prevBlock = i > 0 ? blockchain.chain[i - 1] : null;
        
        const isPoWInvalid = i > 0 && block.hash.substring(0, difficulty) !== '0'.repeat(difficulty);
        const isLinkBroken = i > 0 && prevBlock && block.previousHash !== prevBlock.hash;
        
        if (isPoWInvalid || isLinkBroken) {
            startIndex = i;
            break;
        }
    }

    if (startIndex === -1) {
        showToast("Chain is healthy", "No repairs needed!", "success");
        return;
    }

    // Process blocks one by one with a delay for visual effect
    const processBlock = (index: number) => {
        if (index >= blockchain.chain.length) {
            setIsValid(true);
            setUpdateTrigger(prev => prev + 1);
            showToast("Chain Fully Repaired", "All links and Proofs of Work are now valid.", "success");
            return;
        }

        setMiningIndices(prev => new Set(prev).add(index));
        
        // Sync previousHash if broken
        if (index > 0) {
            blockchain.chain[index].previousHash = blockchain.chain[index - 1].hash;
        }

        const worker = new Worker(new URL('../src/workers/mining.worker.ts', import.meta.url));
        
        worker.postMessage({
            index,
            timestamp: blockchain.chain[index].timestamp,
            data: blockchain.chain[index].data,
            previousHash: blockchain.chain[index].previousHash,
            difficulty
        });

        worker.onmessage = (e) => {
            if (e.data.type === 'SUCCESS') {
                const { nonce, hash } = e.data;
                blockchain.chain[index].nonce = nonce;
                blockchain.chain[index].hash = hash;
                
                setMiningIndices(prev => {
                    const next = new Set(prev);
                    next.delete(index);
                    return next;
                });

                setUpdateTrigger(prev => prev + 1);
                worker.terminate();
                
                // Move to next block after a short delay
                setTimeout(() => processBlock(index + 1), 600);
            }
        };
    };

    showToast("Commencing Chain Repair", "Calculating new hashes for all downstream blocks...", "info");
    processBlock(startIndex);
  };

  const handleStartGuided = () => {
    setShowLanding(false);
    setIsGuidedMode(true);
    setWalkthroughStep(1);
  };

  const handleSkipToFreePlay = () => {
    setShowLanding(false);
    setIsGuidedMode(false);
  };

  const handleNextStep = () => {
    if (walkthroughStep < 4) {
      setWalkthroughStep(prev => prev + 1);
      setIsStepActionCompleted(false);
    } else {
      setIsGuidedMode(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 font-mono">
        Initializing Chain...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Narrator Component - Moved to root for z-index and transform safety */}
      <Narrator 
        currentStep={walkthroughStep}
        isActionCompleted={isStepActionCompleted}
        onNext={handleNextStep}
        onToggleGuided={() => setIsGuidedMode(false)}
        isGuidedMode={isGuidedMode}
      />

      {showLanding && (
        <LandingOverlay 
          onStartGuided={handleStartGuided}
          onSkipToFreePlay={handleSkipToFreePlay}
        />
      )}
      {/* Validation Banner - Hidden in early steps of guided mode */}
      {(!isGuidedMode || walkthroughStep >= 3) && (
        <div 
          className={`w-full py-4 px-4 md:px-8 flex flex-col items-center transition-all duration-500 sticky top-0 z-[60] shadow-2xl ${
            isValid ? 'bg-emerald-600' : 'bg-amber-600'
          }`}
        >
          <div className="flex items-center gap-3">
            <Tooltip content={isValid ? "Every block has a valid hash and correctly points to its predecessor." : "Some blocks have been tampered with or the links are broken."}>
              <span className="font-black text-sm tracking-[0.2em] uppercase flex items-center gap-2">
                {isValid ? (
                  <>Chain Integrity: Secure <span className="text-xl">🛡️</span></>
                ) : (
                  <>Chain Integrity: Issues Found <span className="text-xl">🔦</span></>
                )}
              </span>
            </Tooltip>
            {!isValid && (
              <span className="text-[10px] bg-black/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse border border-white/20">
                Action Required
              </span>
            )}
          </div>
          
          {!isValid && (
            <div className="mt-2 text-[11px] font-mono text-white/90 bg-black/10 px-4 py-2 rounded-lg border border-white/5 flex flex-col md:flex-row gap-4 items-center">
              <span className="font-bold border-r border-white/20 pr-4">DIAGNOSIS:</span>
              <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
                {blockchain.chain.some((b, i) => i > 0 && b.hash.substring(0, difficulty) !== '0'.repeat(difficulty)) && (
                  <span className="flex items-center gap-1">❌ Invalid Proof of Work (Block data modified)</span>
                )}
                {blockchain.chain.some((b, i) => i > 0 && b.previousHash !== blockchain.chain[i-1].hash) && (
                  <span className="flex items-center gap-1">🔗 Link Mismatch (Follow the Red blocks)</span>
                )}
                <button 
                  onClick={handleAutoFixChain}
                  className="ml-4 px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md text-[10px] uppercase font-bold transition-all hover:scale-105 active:scale-95"
                >
                  ⚡ Fix Entire Chain
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <header className={`p-4 md:p-8 border-b border-zinc-900 bg-black/20 backdrop-blur-md sticky z-50 transition-all duration-500 ${
        walkthroughStep >= 3 ? 'top-[76px]' : 'top-0'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent italic flex items-center justify-center md:justify-start gap-2">
              ⛓️ BLOCKCHAIN VISUALIZER
            </h1>
            <p className="text-zinc-500 text-xs font-mono mt-1 uppercase tracking-widest leading-tight">
              An interactive lab for learning cryptography
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => setIsGuidedMode(!isGuidedMode)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
                isGuidedMode 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/40' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
              }`}
            >
              {isGuidedMode ? 'Guided Mode' : 'Free Play'}
            </button>
            <button 
              onClick={() => setIsGlossaryOpen(true)}
              className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all hover:border-indigo-500/50"
              title="Open Glossary"
            >
              📖
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-8 max-w-full">
        {/* Mine Panel & Difficulty Selector */}
        <section className="mb-12 max-w-7xl mx-auto space-y-6">
          <form 
            onSubmit={handleMineBlock}
            className={`flex flex-col md:flex-row gap-4 items-end p-4 md:p-6 bg-zinc-900/50 border rounded-2xl shadow-xl transition-all duration-500 ${
              isGuidedMode && !isStepActionCompleted && (walkthroughStep === 1 || walkthroughStep === 2)
                ? 'border-indigo-500 shadow-indigo-500/10 scale-[1.02]' 
                : 'border-zinc-800'
            }`}
          >
            <div className="flex-1 space-y-2 w-full">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">New Block Data</label>
              <input 
                type="text" 
                value={blockData}
                onChange={(e) => setBlockData(e.target.value)}
                placeholder={isGuidedMode && walkthroughStep === 1 ? "Example: Alice pays Bob 10" : "Enter block data..."}
                className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-base md:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                disabled={isMining || (isGuidedMode && isStepActionCompleted)}
              />
            </div>
            <button 
              type="submit"
              disabled={isMining || !blockData || (isGuidedMode && isStepActionCompleted)}
              className={`h-[46px] w-full md:w-auto px-8 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-3 active:scale-95 whitespace-nowrap ${
                isGuidedMode && !isStepActionCompleted && (walkthroughStep === 1 || walkthroughStep === 2)
                  ? 'bg-indigo-600 hover:bg-indigo-500 animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600'
              }`}
            >
              {isMining ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Mining (Nonce: {miningNonce})...
                </>
              ) : (
                'Mine Block'
              )}
            </button>
          </form>

          {/* Difficulty Selector - Hidden until Step 4 */}
          {(!isGuidedMode || walkthroughStep >= 4) && (
            <div className={`p-4 md:p-6 bg-zinc-900/30 border rounded-2xl transition-all duration-500 ${
              isGuidedMode && walkthroughStep === 4 && !isStepActionCompleted
                ? 'border-indigo-500 shadow-indigo-500/10 scale-[1.02]'
                : 'border-zinc-800/50'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Mining Difficulty</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((level) => (
                      <button
                        key={level}
                        onClick={() => handleDifficultyChange(level)}
                        className={`w-12 h-10 rounded-full font-bold text-sm transition-all border ${
                          difficulty === level 
                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40' 
                            : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex-1 max-w-md bg-black/40 p-4 rounded-xl border border-zinc-800/50 flex items-center justify-between gap-6">
                   <div className="space-y-1">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">Difficulty Rule</p>
                    <p className="text-xs text-white font-mono break-all">
                      Hash starts with: <span className="text-blue-400">{'0'.repeat(difficulty)}</span>
                    </p>
                  </div>
                  
                  {lastMiningStats && (
                    <div className="text-right space-y-1 border-l border-zinc-800/50 pl-6 animate-fade-in">
                      <p className="text-[10px] text-indigo-400 font-bold uppercase animate-pulse">Last Benchmark</p>
                      <p className="text-xs text-white font-mono">
                         <span className="text-indigo-400">{lastMiningStats.attempts.toLocaleString()}</span> attempts
                      </p>
                      <p className="text-[9px] text-zinc-500 uppercase">at level {lastMiningStats.difficulty}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {miningTime !== null && (
            <p className="mt-3 text-xs font-mono text-emerald-500 pl-2">
              ✓ Block successfully added to chain. Mined in <span className="text-white font-bold">{miningTime.toFixed(2)}ms</span>
            </p>
          )}
        </section>

        <div className="relative">
          {/* Main Chain Container: Horizontal Scroll Snap on Mobile */}
          <div className="flex flex-row items-start gap-4 md:gap-0 overflow-x-auto pb-12 pt-4 px-4 md:px-0 scrollbar-hide snap-x snap-mandatory">
            {blockchain.chain.map((block, index) => (
              <React.Fragment key={`${block.index}-${block.timestamp}-${updateTrigger}`}>
                <div className="flex flex-row items-center animate-fade-in snap-center" style={{ animationDelay: `${index * 50}ms` }}>
                  <BlockCard
                    index={block.index}
                    timestamp={block.timestamp}
                    data={block.data}
                    previousHash={block.previousHash}
                    nonce={block.nonce}
                    hash={block.hash}
                    difficulty={difficulty}
                    onDataChange={(newData) => handleUpdateBlockData(index, newData)}
                    onMine={() => handleRemineBlock(index)}
                    isMining={miningIndices.has(index)}
                    isLinkBroken={index > 0 && block.previousHash !== blockchain.chain[index - 1].hash}
                    highlightHash={isGuidedMode && index === blockchain.chain.length - 1 && (walkthroughStep === 1 || walkthroughStep === 2)}
                    highlightPrevHash={isGuidedMode && index === blockchain.chain.length - 1 && walkthroughStep === 2}
                    showEditButton={!isGuidedMode || walkthroughStep >= 3}
                    highlightEdit={isGuidedMode && walkthroughStep === 3 && index === 1 && !hasTampered}
                  />
                  
                  {/* Arrow Connector */}
                  {index < blockchain.chain.length - 1 && (
                    <div className="px-2 md:px-4 py-0 flex flex-col items-center justify-center text-zinc-700 relative">
                      <svg 
                        width="40" 
                        height="24" 
                        viewBox="0 0 40 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transition-all duration-500 ${
                          isGuidedMode && walkthroughStep === 2 && index === blockchain.chain.length - 2
                            ? 'text-indigo-500 scale-125 stroke-[3px]' 
                            : 'text-zinc-700'
                        } ${isValid ? '' : 'text-red-900/50'}`}
                      >
                        <path 
                          d="M0 12H38M38 12L28 2M38 12L28 22" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-[10px] uppercase font-bold mt-2 tracking-tighter opacity-50 absolute top-6 left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:mt-2">next</span>
                      
                      {/* Educational Link Connection Visualization */}
                      {isGuidedMode && walkthroughStep === 2 && index === blockchain.chain.length - 2 && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-1 bg-indigo-500/20 blur-xl animate-pulse -z-10" />
                      )}
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}

            {/* Empty State placeholder */}
            <div className="flex-shrink-0 w-[85vw] md:w-80 h-96 border-2 border-dashed border-zinc-900 rounded-xl flex items-center justify-center md:ml-8 opacity-20 hover:opacity-40 transition-all snap-center">
              <div className="text-center">
                <div className="text-4xl mb-2 text-zinc-700 animate-bounce">+</div>
                <div className="text-xs font-mono text-zinc-700 uppercase">Awaiting New Block</div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Ledger */}
        <div className="mt-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 pb-32">
          {/* Chain Metadata */}
          <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl backdrop-blur-sm">
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Chain Metadata</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] text-zinc-500 uppercase">Difficulty</p>
                <p className="font-mono text-xl font-black text-indigo-400">{blockchain.difficulty}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-zinc-500 uppercase">Total Blocks</p>
                <p className="font-mono text-xl font-black text-white">{blockchain.chain.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-zinc-500 uppercase">Integrity Status</p>
                <p className={`font-mono text-xl font-black ${isValid ? 'text-emerald-500' : 'text-red-500'}`}>
                  {isValid ? 'SECURE' : 'COMPROMISED'}
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Ledger */}
          <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl backdrop-blur-sm flex flex-col">
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Transaction Ledger</h2>
            <div className="flex-1 space-y-2 font-mono text-[10px] overflow-y-auto max-h-48 scrollbar-hide">
              {blockchain.chain.map((block) => (
                <div key={block.index} className="flex gap-4 p-2 bg-black/30 rounded border border-zinc-800/50 group hover:border-zinc-700 transition-colors">
                  <span className="text-zinc-600 font-bold group-hover:text-zinc-400">BLOCK {block.index}</span>
                  <span className="text-zinc-300 truncate">{typeof block.data === 'string' ? block.data : JSON.stringify(block.data)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Glossary Modal */}
      <Glossary 
        isOpen={isGlossaryOpen} 
        onClose={() => setIsGlossaryOpen(false)} 
      />

      {/* Contextual ToastNotification */}
      {toast && (
        <div className="fixed top-24 right-8 z-[100] animate-slide-in-right max-w-sm">
          <div className={`p-4 rounded-xl border shadow-2xl backdrop-blur-xl flex gap-4 transition-all duration-300 ${
            toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-200' :
            toast.type === 'warning' ? 'bg-red-500/10 border-red-500/50 text-red-200' :
            'bg-indigo-500/10 border-indigo-500/50 text-indigo-200'
          }`}>
            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xl ${
               toast.type === 'success' ? 'bg-emerald-500/20' :
               toast.type === 'warning' ? 'bg-red-500/20' :
               'bg-indigo-500/20'
            }`}>
              {toast.type === 'success' ? '✅' : toast.type === 'warning' ? '⚠️' : 'ℹ️'}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm tracking-tight">{toast.message}</h4>
              <p className="text-[11px] opacity-70 mt-1 leading-relaxed">{toast.submessage}</p>
              <button 
                onClick={() => setToast(null)}
                className="mt-3 text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}


      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes slide-up {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        @keyframes slide-up-mobile {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up-mobile {
          animation: slide-up-mobile 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
