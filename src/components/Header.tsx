import React from 'react';
import { Play, Pause } from 'lucide-react';
import { InkColorConfig } from '../types';

interface HeaderProps {
  activeTab: 'terminal' | 'matrix' | 'cosmic' | 'repl';
  setActiveTab: (tab: 'terminal' | 'matrix' | 'cosmic' | 'repl') => void;
  isRunning: boolean;
  onToggleRunning: () => void;
  ink: InkColorConfig;
  scanlines: boolean;
  onToggleScanlines: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isRunning,
  onToggleRunning,
  ink,
}) => {
  return (
    <header className={`w-full border-b ${ink.borderClass} ${ink.panelClass} px-4 lg:px-8 py-3.5 backdrop-blur-md sticky top-0 z-40`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className={`text-base font-bold tracking-wider uppercase font-mono ${ink.textClass} ink-glow-subtle whitespace-nowrap`}>
            Python 10⁸⁸ Green Ink Engine
          </span>
        </div>

        {/* Zone 2: Navigation Links (Clean single-line text links) */}
        <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-mono">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'terminal'
                ? `${ink.textClass} font-bold border-b-2 border-emerald-400`
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Terminal Output
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'matrix'
                ? `${ink.textClass} font-bold border-b-2 border-emerald-400`
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            89-Digit Matrix
          </button>
          <button
            onClick={() => setActiveTab('cosmic')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'cosmic'
                ? `${ink.textClass} font-bold border-b-2 border-emerald-400`
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Cosmic Scale
          </button>
          <button
            onClick={() => setActiveTab('repl')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'repl'
                ? `${ink.textClass} font-bold border-b-2 border-emerald-400`
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Interactive REPL
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleRunning}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider font-mono rounded border transition-all cursor-pointer ${
              isRunning
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                : `${ink.accentClass} hover:opacity-90 shadow-[0_0_15px_rgba(34,197,94,0.3)]`
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute Loop</span>
              </>
            )}
            <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] bg-black/30 rounded border border-white/20">
              Space
            </kbd>
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer Row */}
      <div className="flex md:hidden items-center justify-between gap-2 mt-2 pt-2 border-t border-zinc-800/60 overflow-x-auto text-[11px] font-mono">
        <button
          onClick={() => setActiveTab('terminal')}
          className={`px-2 py-1 whitespace-nowrap cursor-pointer ${
            activeTab === 'terminal' ? `${ink.textClass} font-bold underline` : 'text-zinc-400'
          }`}
        >
          Terminal
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-2 py-1 whitespace-nowrap cursor-pointer ${
            activeTab === 'matrix' ? `${ink.textClass} font-bold underline` : 'text-zinc-400'
          }`}
        >
          89-Digits
        </button>
        <button
          onClick={() => setActiveTab('cosmic')}
          className={`px-2 py-1 whitespace-nowrap cursor-pointer ${
            activeTab === 'cosmic' ? `${ink.textClass} font-bold underline` : 'text-zinc-400'
          }`}
        >
          Cosmic Scale
        </button>
        <button
          onClick={() => setActiveTab('repl')}
          className={`px-2 py-1 whitespace-nowrap cursor-pointer ${
            activeTab === 'repl' ? `${ink.textClass} font-bold underline` : 'text-zinc-400'
          }`}
        >
          REPL
        </button>
      </div>
    </header>
  );
};
