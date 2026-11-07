import React, { useRef, useEffect, useState } from 'react';
import {
  Copy,
  Check,
  Trash2,
  ArrowDown,
  Volume2,
  VolumeX,
  Tv,
  Palette,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { StreamLogEntry, InkColorConfig, InkTheme } from '../types';
import { INK_THEMES, formatChunked, formatScientific } from '../utils/bigint-helpers';

interface TerminalConsoleProps {
  currentCounter: bigint;
  logs: StreamLogEntry[];
  onClearLogs: () => void;
  ink: InkColorConfig;
  setInkTheme: (theme: InkTheme) => void;
  scanlines: boolean;
  onToggleScanlines: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isRunning: boolean;
  totalDecrements: bigint;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({
  currentCounter,
  logs,
  onClearLogs,
  ink,
  setInkTheme,
  scanlines,
  onToggleScanlines,
  soundEnabled,
  onToggleSound,
  isRunning,
  totalDecrements,
}) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const [displayMode, setDisplayMode] = useState<'chunked' | 'raw' | 'hex'>('chunked');
  const [showThemePicker, setShowThemePicker] = useState(false);

  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentCounter.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedCurrentValue =
    displayMode === 'hex'
      ? '0x' + currentCounter.toString(16).toUpperCase()
      : displayMode === 'chunked'
      ? formatChunked(currentCounter.toString(), 10, ' ')
      : currentCounter.toString();

  return (
    <div
      className={`relative rounded-xl border ${ink.borderClass} ${ink.bgClass} flex flex-col h-full min-h-[580px] shadow-2xl overflow-hidden font-mono`}
    >
      {/* Scanline CRT overlay when enabled */}
      {scanlines && <div className="absolute inset-0 crt-scanlines z-10 pointer-events-none" />}
      <div className="absolute inset-0 crt-vignette z-10 pointer-events-none" />

      {/* Terminal Title Bar */}
      <div
        className={`relative z-20 flex items-center justify-between px-4 py-2.5 border-b ${ink.borderClass} ${ink.panelClass} select-none`}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/40" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/40" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/40" />
          </div>
          <span className="text-xs tracking-wider text-zinc-300 font-bold flex items-center gap-2">
            <span>stdout //</span>
            <span className={`${ink.textClass} ink-glow-subtle`}>print(counter)</span>
            <span className="text-zinc-500 text-[11px]">[Green Ink TTY-01]</span>
          </span>
        </div>

        {/* Toolbar Affordances */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-1.5 rounded border text-xs transition-colors cursor-pointer ${
              soundEnabled
                ? `${ink.borderClass} ${ink.textClass} bg-emerald-950/40`
                : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
            title={soundEnabled ? 'Mute terminal audio ticks' : 'Enable teletype sound effects'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* CRT Scanline Toggle */}
          <button
            onClick={onToggleScanlines}
            className={`p-1.5 rounded border text-xs transition-colors cursor-pointer ${
              scanlines
                ? `${ink.borderClass} ${ink.textClass} bg-emerald-950/40`
                : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
            title="Toggle CRT Scanline raster effect"
          >
            <Tv className="w-3.5 h-3.5" />
          </button>

          {/* Ink Shade Selector */}
          <div className="relative">
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs cursor-pointer transition-colors ${ink.borderClass} ${ink.textClass} bg-black/40`}
              title="Select Green Ink formulation"
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">{ink.name}</span>
            </button>

            {showThemePicker && (
              <div
                className={`absolute right-0 top-full mt-1.5 z-30 p-2 rounded-lg border ${ink.borderClass} bg-zinc-950 shadow-2xl min-w-[210px] flex flex-col gap-1`}
              >
                <div className="text-[10px] uppercase tracking-wider text-zinc-400 px-2 py-1">
                  Select Ink Formulation
                </div>
                {(Object.keys(INK_THEMES) as InkTheme[]).map((themeKey) => {
                  const theme = INK_THEMES[themeKey];
                  return (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setInkTheme(themeKey);
                        setShowThemePicker(false);
                      }}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-xs text-left cursor-pointer transition-colors ${
                        ink.id === theme.id
                          ? 'bg-zinc-800 font-bold text-white'
                          : 'text-zinc-300 hover:bg-zinc-900'
                      }`}
                    >
                      <div
                        className="w-3 h-3 rounded-full border border-black/40 shadow-sm"
                        style={{ backgroundColor: theme.hex }}
                      />
                      <span>{theme.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Clear Buffer */}
          <button
            onClick={onClearLogs}
            className="p-1.5 rounded border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-900/50 transition-colors cursor-pointer"
            title="Clear output buffer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Prominent Active Counter HUD */}
      <div
        className={`relative z-20 px-5 py-4 border-b ${ink.borderClass} ${ink.panelClass} flex flex-col gap-2`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <span>CURRENT COUNTER VALUE</span>
            <span className="text-zinc-600">·</span>
            <span className={`${ink.textClass} font-bold`}>{currentCounter.toString().length} digits</span>
            <span className="text-zinc-600">·</span>
            <span>Scientific: {formatScientific(currentCounter)}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Buttons */}
            <div className="flex items-center p-0.5 rounded bg-black/50 border border-zinc-800 text-[11px]">
              <button
                onClick={() => setDisplayMode('chunked')}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  displayMode === 'chunked' ? `${ink.textClass} font-bold bg-zinc-800` : 'text-zinc-400'
                }`}
              >
                Chunked
              </button>
              <button
                onClick={() => setDisplayMode('raw')}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  displayMode === 'raw' ? `${ink.textClass} font-bold bg-zinc-800` : 'text-zinc-400'
                }`}
              >
                Raw
              </button>
              <button
                onClick={() => setDisplayMode('hex')}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  displayMode === 'hex' ? `${ink.textClass} font-bold bg-zinc-800` : 'text-zinc-400'
                }`}
              >
                Hex
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={copyToClipboard}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs border transition-colors cursor-pointer ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                  : 'bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:text-white'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* The Huge Green Ink Counter Readout */}
        <div
          className={`relative p-3 rounded-lg bg-black/70 border border-zinc-800/80 overflow-x-auto`}
        >
          <div
            className={`font-mono text-sm sm:text-base md:text-lg font-bold tracking-wider break-all ${ink.textClass} ink-glow-strong select-all leading-relaxed`}
          >
            {formattedCurrentValue}
          </div>
        </div>

        {/* Telemetry Footer of the HUD */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-zinc-400 pt-1">
          <div className="flex items-center gap-3">
            <span>
              Loop Iterations Run:{' '}
              <span className="text-zinc-200 font-bold font-mono">
                {totalDecrements.toString()}
              </span>
            </span>
            <span>·</span>
            <span>
              Status:{' '}
              <span
                className={`font-bold ${
                  isRunning ? `${ink.textClass} ink-glow-subtle` : 'text-amber-400'
                }`}
              >
                {isRunning ? '● EXECUTING WHILE-LOOP' : '❚❚ PAUSED'}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`flex items-center gap-1 text-[11px] cursor-pointer hover:underline ${
                autoScroll ? ink.textClass : 'text-zinc-500'
              }`}
            >
              <ArrowDown className={`w-3 h-3 ${autoScroll ? 'animate-bounce' : ''}`} />
              <span>Auto-scroll {autoScroll ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Stream Buffer (The green ink print stream) */}
      <div
        className="relative z-20 flex-1 p-4 overflow-y-auto space-y-1.5 text-xs sm:text-sm font-mono scroll-smooth select-text"
      >
        <div className="text-zinc-500 text-xs pb-2 border-b border-zinc-900 mb-2">
          &gt; python3 cosmic_counter.py
          <br />
          &gt; Initialized BigInt counter with 89 digits (10⁸⁸).
          <br />
          &gt; Starting while loop: while counter &gt;= 1: print(counter); counter -= 1
        </div>

        {logs.length === 0 ? (
          <div className="py-12 text-center text-zinc-600 italic">
            Console log buffer cleared. Click &quot;Execute Loop&quot; or &quot;Step&quot; to print counter values in green ink.
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={log.id}
              className={`group flex items-start gap-3 py-0.5 hover:bg-emerald-950/20 px-1 rounded transition-colors ${
                index === logs.length - 1 ? 'animate-pulse-glow font-bold' : ''
              }`}
            >
              <span className="text-zinc-600 select-none text-[11px] pt-0.5 w-14 shrink-0 text-right">
                #{log.iteration.toString()}
              </span>
              <div className="flex-1 break-all">
                <span className={`${ink.textClass} ink-glow-subtle font-mono tracking-wide`}>
                  {displayMode === 'chunked'
                    ? formatChunked(log.value, 10, ' ')
                    : log.value}
                </span>
                {log.stepDiff !== '1' && (
                  <span className="text-zinc-500 text-[10px] ml-2 italic">
                    [-{formatScientific(BigInt(log.stepDiff))}]
                  </span>
                )}
              </div>
            </div>
          ))
        )}

        {/* Blinking Terminal Cursor */}
        <div className="flex items-center gap-2 pt-2">
          <span className={`${ink.textClass}`}>&gt;</span>
          <span className={`inline-block w-2.5 h-4 bg-emerald-400 animate-cursor shadow-[0_0_8px_rgba(52,211,153,0.8)]`} />
        </div>

        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};
