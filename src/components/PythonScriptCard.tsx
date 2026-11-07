import React from 'react';
import { Play, Pause, RotateCcw, StepForward, FastForward, Sparkles } from 'lucide-react';
import { InkColorConfig } from '../types';
import { INITIAL_COUNTER, formatScientific } from '../utils/bigint-helpers';

interface PythonScriptCardProps {
  currentCounter: bigint;
  isRunning: boolean;
  onToggleRunning: () => void;
  onStep: (amount?: bigint) => void;
  onReset: () => void;
  onJumpTo: (val: bigint) => void;
  stepAmount: bigint;
  setStepAmount: (amount: bigint) => void;
  tickRate: number;
  setTickRate: (rate: number) => void;
  ink: InkColorConfig;
  activeLine: number;
}

export const PythonScriptCard: React.FC<PythonScriptCardProps> = ({
  currentCounter,
  isRunning,
  onToggleRunning,
  onStep,
  onReset,
  onJumpTo,
  stepAmount,
  setStepAmount,
  tickRate,
  setTickRate,
  ink,
  activeLine,
}) => {
  const speedPresets = [
    { label: '1 op', value: 1n },
    { label: '1K ops', value: 1000n },
    { label: '1M ops', value: 1000000n },
    { label: '10¹² ops', value: 1000000000000n },
    { label: '10⁵⁰ ops', value: 10n ** 50n },
    { label: '10⁸⁰ ops', value: 10n ** 80n },
  ];

  const jumpPresets = [
    { label: 'Start (10⁸⁸)', value: INITIAL_COUNTER },
    { label: 'Universe Atoms (10⁸⁰)', value: 10n ** 80n },
    { label: 'Planck Horizon (10⁶¹)', value: 10n ** 61n },
    { label: 'Final Stretch (1,000)', value: 1000n },
    { label: 'Penultimate (5)', value: 5n },
    { label: 'Finish Line (1)', value: 1n },
  ];

  return (
    <div className={`rounded-xl border ${ink.borderClass} ${ink.panelClass} p-5 backdrop-blur-md font-mono flex flex-col justify-between shadow-lg`}>
      {/* Top Header & Execution Badge */}
      <div>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Source:</span>
            <span className={`${ink.textClass} font-bold`}>cosmic_counter.py</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500">Python 3.12 (Arbitrary-Precision BigInt)</span>
          </div>
        </div>

        {/* Python Code Editor / Block */}
        <div className="relative rounded-lg bg-black/60 p-4 border border-zinc-800/80 text-xs sm:text-sm leading-relaxed overflow-x-auto select-text">
          <div className="flex flex-col gap-1.5 font-mono">
            {/* Line 1: Definition */}
            <div
              className={`flex items-start gap-3 px-2 py-1 rounded transition-colors ${
                activeLine === 1 ? 'bg-emerald-950/70 text-emerald-300' : 'text-zinc-300'
              }`}
            >
              <span className="text-zinc-600 select-none w-5 text-right font-mono text-xs pt-0.5">1</span>
              <div className="flex-1">
                <span className="text-cyan-400 font-semibold">counter</span>
                <span className="text-zinc-500 mx-2">=</span>
                <span className={`${ink.textClass} break-all font-semibold select-all`}>
                  10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
                </span>
              </div>
            </div>

            {/* Line 2: While loop */}
            <div
              className={`flex items-start gap-3 px-2 py-1 rounded transition-colors ${
                activeLine === 2 ? 'bg-emerald-950/70 text-emerald-300' : 'text-zinc-300'
              }`}
            >
              <span className="text-zinc-600 select-none w-5 text-right font-mono text-xs pt-0.5">2</span>
              <div className="flex-1">
                <span className="text-amber-400 font-bold">while</span>
                <span className="text-cyan-400 font-semibold ml-2">counter</span>
                <span className="text-zinc-400 ml-2">&gt;=</span>
                <span className="text-orange-400 font-semibold ml-2">1</span>
                <span className="text-zinc-500">:</span>
              </div>
            </div>

            {/* Line 3: print statement */}
            <div
              className={`flex items-start gap-3 px-2 py-1 rounded transition-colors ${
                activeLine === 3 ? 'bg-emerald-950/80 text-emerald-300 ink-glow-subtle' : 'text-zinc-300'
              }`}
            >
              <span className="text-zinc-600 select-none w-5 text-right font-mono text-xs pt-0.5">3</span>
              <div className="flex-1 pl-4">
                <span className="text-emerald-400 font-bold">print</span>
                <span className="text-zinc-400">(</span>
                <span className="text-cyan-400 font-semibold">counter</span>
                <span className="text-zinc-400">)</span>
                <span className="text-zinc-500 text-xs italic ml-3">// in green ink</span>
              </div>
            </div>

            {/* Line 4: decrement statement */}
            <div
              className={`flex items-start gap-3 px-2 py-1 rounded transition-colors ${
                activeLine === 4 ? 'bg-emerald-950/80 text-emerald-300 ink-glow-subtle' : 'text-zinc-300'
              }`}
            >
              <span className="text-zinc-600 select-none w-5 text-right font-mono text-xs pt-0.5">4</span>
              <div className="flex-1 pl-4">
                <span className="text-cyan-400 font-semibold">counter</span>
                <span className="text-zinc-500 mx-2">=</span>
                <span className="text-cyan-400 font-semibold">counter</span>
                <span className="text-zinc-500 mx-2">-</span>
                <span className="text-orange-400 font-semibold">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Execution Controls & Steppers */}
      <div className="mt-5 pt-4 border-t border-white/10 flex flex-col gap-4">
        {/* Play / Step / Reset Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onToggleRunning}
            className={`flex items-center gap-2 px-4 py-2.5 rounded font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              isRunning
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : `${ink.accentClass} hover:opacity-95 shadow-[0_0_15px_rgba(34,197,94,0.3)]`
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Loop</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Loop</span>
              </>
            )}
          </button>

          <button
            onClick={() => onStep(stepAmount)}
            disabled={isRunning || currentCounter < 1n}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded bg-zinc-800/80 hover:bg-zinc-700/80 disabled:opacity-40 text-xs text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
            title="Execute 1 tick forward"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>Step {stepAmount > 1n ? formatScientific(stepAmount) : '1'}</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded bg-zinc-800/80 hover:bg-zinc-700/80 text-xs text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
            title="Reset counter to initial 10⁸⁸"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset 10⁸⁸</span>
          </button>
        </div>

        {/* Step Size Selector */}
        <div>
          <div className="text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <FastForward className="w-3 h-3" /> Decrement Step Multiplier (Per Tick)
            </span>
            <span className={`${ink.textClass} font-bold`}>{formatScientific(stepAmount)} / op</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {speedPresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setStepAmount(preset.value)}
                className={`px-2 py-1.5 text-[11px] rounded font-mono border transition-all cursor-pointer ${
                  stepAmount === preset.value
                    ? `${ink.borderClass} ${ink.textClass} bg-emerald-950/40 font-bold shadow-sm`
                    : 'border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 bg-black/30'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tick Frequency Slider */}
        <div>
          <div className="text-[11px] uppercase tracking-wider text-zinc-400 mb-1 flex items-center justify-between">
            <span>Terminal Ticks / Sec:</span>
            <span className="text-zinc-200 font-bold">{tickRate} Hz (fps)</span>
          </div>
          <input
            type="range"
            min={1}
            max={60}
            step={1}
            value={tickRate}
            onChange={(e) => setTickRate(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Jump Presets to Explore Cosmological Scales */}
        <div>
          <div className="text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Cosmic Scale Warp Jumps</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {jumpPresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => onJumpTo(preset.value)}
                className="px-2.5 py-1 text-[11px] rounded bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/50 text-zinc-300 hover:text-emerald-300 transition-colors cursor-pointer font-mono"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
