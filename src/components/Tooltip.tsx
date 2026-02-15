"use client";

import React, { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, position = 'top' }) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="group relative inline-block cursor-help">
      {children}
      <div className={`absolute z-[100] scale-0 transition-all group-hover:scale-100 ${positionClasses[position]}`}>
        <div className="bg-zinc-800 border border-zinc-700 text-zinc-100 text-[10px] px-2 py-1.5 rounded-lg shadow-2xl whitespace-nowrap min-w-[120px] text-center pointer-events-none">
          {content}
          {/* Arrow */}
          <div className={`absolute w-2 h-2 bg-zinc-800 border-zinc-700 transform rotate-45 ${
            position === 'top' ? 'bottom-[-5px] left-1/2 -translate-x-1/2 border-r border-b' :
            position === 'bottom' ? 'top-[-5px] left-1/2 -translate-x-1/2 border-l border-t' :
            position === 'left' ? 'right-[-5px] top-1/2 -translate-y-1/2 border-r border-t' :
            'left-[-5px] top-1/2 -translate-y-1/2 border-l border-b'
          }`} />
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
