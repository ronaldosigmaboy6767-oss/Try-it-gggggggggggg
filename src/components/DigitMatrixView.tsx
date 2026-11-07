import React, { useMemo } from 'react';
import { InkColorConfig } from '../types';
import { formatScientific, toSuperscript } from '../utils/bigint-helpers';
import { Binary, Database, Cpu, Layers } from 'lucide-react';

interface DigitMatrixViewProps {
  currentCounter: bigint;
  ink: InkColorConfig;
  onStep: (amount?: bigint) => void;
  isRunning: boolean;
}

export const DigitMatrixView: React.FC<DigitMatrixViewProps> = ({
  currentCounter,
  ink,
  onStep,
  isRunning,
}) => {
  const digitsStr = currentCounter.toString();
  const digitCount = digitsStr.length;
  const digitsArray = useMemo(() => digitsStr.split(''), [digitsStr]);

  // Statistics
  const digitStats = useMemo(() => {
    let zeros = 0;
    let nines = 0;
    let sum = 0;
    for (const d of digitsArray) {
      if (d === '0') zeros++;
      else if (d === '9') nines++;
      sum += parseInt(d, 10);
    }
    const binary = currentCounter.toString(2);
    const hex = currentCounter.toString(16);
    return {
      zeros,
      nines,
      sum,
      bits: binary.length,
      bytes: Math.ceil(binary.length / 8),
      hexDigits: hex.length,
    };
  }, [digitsArray, currentCounter]);

  return (
    <div
      className={`rounded-xl border ${ink.borderClass} ${ink.panelClass} p-5 backdrop-blur-md font-mono shadow-xl flex flex-col gap-6`}
    >
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className={`text-base font-bold ${ink.textClass} tracking-wider uppercase ink-glow-subtle`}>
            89-Digit BigInt Precision Matrix
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time individual positional inspection of every digit in the 10⁸⁸ counter while-loop.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => onStep(1n)}
            disabled={isRunning || currentCounter < 1n}
            className={`px-3 py-1.5 rounded border ${ink.borderClass} ${ink.textClass} hover:bg-emerald-950/40 cursor-pointer disabled:opacity-40 transition-colors`}
          >
            Subtract 1 (Watch Borrow Ripple)
          </button>
        </div>
      </div>

      {/* Bit & Byte Memory Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-black/40 border border-zinc-800">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] uppercase">
            <Layers className="w-3.5 h-3.5" />
            <span>Decimal Digits</span>
          </div>
          <div className={`text-xl font-bold font-mono mt-1 ${ink.textClass}`}>
            {digitCount} <span className="text-xs text-zinc-500 font-normal">/ 89 max</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-black/40 border border-zinc-800">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] uppercase">
            <Binary className="w-3.5 h-3.5" />
            <span>Binary Width</span>
          </div>
          <div className="text-xl font-bold font-mono mt-1 text-zinc-100">
            {digitStats.bits} <span className="text-xs text-zinc-500 font-normal">bits</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-black/40 border border-zinc-800">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] uppercase">
            <Database className="w-3.5 h-3.5" />
            <span>Memory Allocated</span>
          </div>
          <div className="text-xl font-bold font-mono mt-1 text-zinc-100">
            {digitStats.bytes} <span className="text-xs text-zinc-500 font-normal">bytes (pure)</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-black/40 border border-zinc-800">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] uppercase">
            <Cpu className="w-3.5 h-3.5" />
            <span>Digit Sum</span>
          </div>
          <div className="text-xl font-bold font-mono mt-1 text-zinc-100">
            {digitStats.sum} <span className="text-xs text-zinc-500 font-normal">/ {digitCount * 9}</span>
          </div>
        </div>
      </div>

      {/* Explanatory Callout for the Cascading Borrow */}
      <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs text-zinc-300 leading-relaxed">
        <span className="font-bold text-emerald-400">The Borrow Ripple Phenomenon: </span>
        When the initial value <code className="text-emerald-300">10⁸⁸</code> (1 followed by 88 zeros) undergoes{' '}
        <code className="text-emerald-300">counter = counter - 1</code>, the least significant zero cannot subtract 1
        without borrowing. This triggers a cascading borrow across all 88 positions—instantly converting all 88 zeros
        into 9s, while the leading 1 drops to 0!
      </div>

      {/* The 89 Digit Grid Display */}
      <div>
        <div className="text-xs uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center justify-between">
          <span>Positional Digit Array (Position 10⁸⁸ to 10⁰):</span>
          <span className="text-zinc-500 text-[11px]">Least Significant Digits at Bottom-Right</span>
        </div>

        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 gap-1.5 p-3 rounded-lg bg-black/60 border border-zinc-800/80">
          {digitsArray.map((digit, idx) => {
            const power = digitCount - 1 - idx;
            const isLowestDigit = power <= 3;
            const isHighestDigit = power >= digitCount - 2;

            return (
              <div
                key={idx}
                className={`relative flex flex-col items-center justify-center p-2 rounded border transition-all ${
                  isLowestDigit
                    ? 'border-emerald-500/60 bg-emerald-950/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : isHighestDigit
                    ? 'border-cyan-500/50 bg-cyan-950/20'
                    : 'border-zinc-800 bg-zinc-950/60'
                }`}
                title={`Digit at 10${toSuperscript(power)} position = ${digit}`}
              >
                <span className="text-[9px] text-zinc-500 select-none">10{toSuperscript(power)}</span>
                <span
                  className={`text-lg sm:text-xl font-bold font-mono mt-0.5 select-all ${
                    digit === '9'
                      ? `${ink.textClass} ink-glow-subtle`
                      : digit === '0'
                      ? 'text-zinc-600'
                      : 'text-zinc-200'
                  }`}
                >
                  {digit}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Digit Distribution Breakdown */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-2 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/80" />
          <span>Active / Non-Zero Digits: {digitCount - digitStats.zeros}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-zinc-700" />
          <span>Zero Digits: {digitStats.zeros}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
          <span>Nines Count: {digitStats.nines}</span>
        </div>
      </div>
    </div>
  );
};
