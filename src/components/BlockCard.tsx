"use client";

import React, { useState } from 'react';
import Tooltip from './Tooltip';

interface BlockProps {
  index: number;
  timestamp: string | number;
  data: string | object | number | boolean;
  previousHash: string;
  nonce: number;
  hash: string;
  difficulty: number;
  onDataChange?: (newData: string) => void;
  onMine?: () => void;
  highlightHash?: boolean;
  highlightPrevHash?: boolean;
  showEditButton?: boolean;
  highlightEdit?: boolean;
  isMining?: boolean;
  isLinkBroken?: boolean;
}

const getColorFromHash = (hash: string) => {
  if (!hash || hash === '0') return 'transparent';
  const seed = hash.substring(0, 8);
  const hue = parseInt(seed, 16) % 360;
  return `hsl(${hue}, 80%, 80%)`;
};

const truncateHash = (hash: string) => {
  if (hash.length <= 13) return hash;
  return hash.substring(0, 10) + '...';
};

const BlockCard: React.FC<BlockProps> = ({
  index,
  timestamp,
  data,
  previousHash,
  nonce,
  hash,
  difficulty,
  onDataChange,
  onMine,
  highlightHash = false,
  highlightPrevHash = false,
  showEditButton = true,
  highlightEdit = false,
  isMining = false,
  isLinkBroken = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data.toString());
  const hashColor = getColorFromHash(hash);
  const prevHashColor = getColorFromHash(previousHash);

  const formattedDate = new Date(timestamp).toLocaleString();

  // A block hash is invalid if it doesn't meet difficulty (Proof of Work failure)
  const isPoWInvalid = index > 0 && hash.substring(0, difficulty) !== '0'.repeat(difficulty);
  
  // Visual state for the card (any error)
  const isInvalid = isPoWInvalid || isLinkBroken;

  const handleEditClick = () => {
    setEditData(data.toString());
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (onDataChange) {
      onDataChange(editData);
    }
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  return (
    <div className={`flex-shrink-0 w-[85vw] md:w-80 bg-zinc-900 border rounded-xl shadow-2xl overflow-hidden text-zinc-300 font-mono text-xs transition-all hover:scale-[1.02] snap-center ${
      isInvalid 
        ? 'border-red-500 animate-shake shadow-red-900/20' 
        : highlightEdit 
          ? 'border-indigo-500 shadow-indigo-500/20 scale-[1.02]'
          : 'border-zinc-800 hover:border-zinc-700'
    }`}>
      <div className={`p-3 border-b flex justify-between items-center ${
        isInvalid ? 'bg-red-950/30 border-red-900/50' : 'bg-zinc-800 border-zinc-700'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 uppercase tracking-widest font-bold">Block</span>
          <span className="text-white font-bold text-sm">#{index}</span>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleSaveClick}
                className="text-[10px] bg-indigo-600 hover:bg-indigo-500 px-2 py-1 rounded text-white uppercase font-bold transition-colors shadow-lg shadow-indigo-900/20"
              >
                Save
              </button>
              <button 
                onClick={handleCancelClick}
                className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded text-zinc-400 uppercase font-bold transition-colors border border-zinc-700"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              {isPoWInvalid && !isMining && (
                <button 
                  onClick={onMine}
                  className="text-[10px] bg-emerald-600 hover:bg-emerald-500 px-2 py-1 rounded text-white uppercase font-bold transition-colors shadow-lg shadow-emerald-900/20"
                >
                  Re-mine
                </button>
              )}
              {isMining && (
                <div className="flex items-center gap-1 bg-zinc-700 px-2 py-1 rounded text-[10px] uppercase font-bold text-zinc-300">
                  <div className="w-2 h-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Mining
                </div>
              )}
              {index > 0 && showEditButton && (
                <button 
                  onClick={handleEditClick}
                  className={`text-[10px] bg-zinc-700 hover:bg-zinc-600 px-2 py-1 rounded text-zinc-300 uppercase font-bold transition-colors ${
                    highlightEdit ? 'bg-indigo-600 text-white animate-pulse' : ''
                  }`}
                >
                  Edit
                </button>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Timestamp */}
        <div className="space-y-1">
          <label className="text-zinc-500 uppercase text-[10px] tracking-tighter">Timestamp</label>
          <div className="text-zinc-300 break-words">{formattedDate}</div>
        </div>

        {/* Data */}
        <div className="space-y-1">
          <label className="text-zinc-500 uppercase text-[10px] tracking-tighter">Data</label>
          {isEditing ? (
            <input 
              type="text"
              value={editData}
              onChange={(e) => setEditData(e.target.value)}
              className="w-full bg-black border border-indigo-500/50 rounded p-2 text-zinc-200 focus:outline-none focus:border-indigo-400"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveClick();
                if (e.key === 'Escape') handleCancelClick();
              }}
            />
          ) : (
            <div className={`p-2 rounded border text-zinc-200 transition-all ${
              isInvalid ? 'bg-red-950/20 border-red-900/30' : 'bg-black/50 border-zinc-800'
            } ${highlightEdit ? 'border-indigo-500 bg-indigo-500/5' : ''}`}>
              {typeof data === 'string' ? data : JSON.stringify(data)}
            </div>
          )}
        </div>

        {/* Previous Hash */}
        <div className={`space-y-1 transition-all duration-500 p-1 rounded ${highlightPrevHash ? 'bg-indigo-500/10 ring-1 ring-indigo-500/50' : ''}`}>
          <div className="flex justify-between items-center">
            <Tooltip content="The unique link to the predecessor block. Ensures chain history can't be changed unnoticed.">
              <label className={`uppercase text-[10px] tracking-tighter ${highlightPrevHash ? 'text-indigo-400 font-bold' : 'text-zinc-500'}`}>Previous Hash</label>
            </Tooltip>
            {isLinkBroken && !isPoWInvalid && (
              <span className="text-[9px] text-red-400 font-bold uppercase tracking-tighter animate-pulse">Link Broken ⚠️</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span 
              className={`px-2 py-1 rounded text-black font-bold truncate transition-all duration-500 ${highlightPrevHash ? 'scale-110 shadow-lg' : ''}`}
              style={{ backgroundColor: prevHashColor || 'transparent', visibility: previousHash === '0' ? 'hidden' : 'visible' }}
            >
              {truncateHash(previousHash)}
            </span>
            {previousHash === '0' && <span className="text-zinc-600 italic">Genesis</span>}
          </div>
        </div>

        {/* Nonce */}
        <div className="space-y-1">
          <Tooltip content="Random number used once to solve the 'Proof of Work' puzzle and find a valid hash.">
            <label className="text-zinc-500 uppercase text-[10px] tracking-tighter">Nonce</label>
          </Tooltip>
          <div className="text-zinc-300">{nonce}</div>
        </div>

        {/* Hash */}
        <div className={`space-y-1 pt-2 border-t transition-all duration-500 ${isInvalid ? 'border-red-900/30' : 'border-zinc-800'} ${highlightHash ? 'bg-indigo-500/10 p-1 rounded' : ''}`}>
          <Tooltip content="SHA-256 Digital Fingerprint. A unique ID calculated from ALL data in this block.">
            <label className={`uppercase text-[10px] tracking-tighter font-bold ${
              isInvalid ? 'text-red-400' : highlightHash ? 'text-indigo-400' : 'text-indigo-400/70'
            }`}>Hash</label>
          </Tooltip>
          <div className="flex">
            <span 
              className={`px-2 py-1 rounded text-black font-bold w-full text-center transition-all duration-500 ${
                isInvalid ? 'opacity-80' : highlightHash ? 'scale-110 shadow-lg' : ''
              }`}
              style={{ backgroundColor: hashColor }}
            >
              {truncateHash(hash)}
            </span>
          </div>
          {isPoWInvalid && (
            <p className="text-[9px] text-red-500 font-bold mt-1 uppercase animate-pulse">
              ⚠️ Invalid Proof of Work
            </p>
          )}
          {highlightHash && !isInvalid && (
            <p className="text-[9px] text-indigo-400 font-bold mt-1 uppercase animate-pulse">
              ✨ Unique Fingerprint
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


export default BlockCard;
