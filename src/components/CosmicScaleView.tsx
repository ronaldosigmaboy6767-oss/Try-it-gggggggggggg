import React, { useState } from 'react';
import { InkColorConfig } from '../types';
import { COSMIC_BENCHMARKS, formatScientific, estimateTimeToFinish } from '../utils/bigint-helpers';
import { Globe, Orbit, Atom, Clock, ShieldAlert, Cpu } from 'lucide-react';

interface CosmicScaleViewProps {
  currentCounter: bigint;
  ink: InkColorConfig;
  totalDecrements: bigint;
  onJumpTo: (val: bigint) => void;
}

export const CosmicScaleView: React.FC<CosmicScaleViewProps> = ({
  currentCounter,
  ink,
  totalDecrements,
  onJumpTo,
}) => {
  const [selectedMachine, setSelectedMachine] = useState<number>(0);

  const computerTiers = [
    {
      name: 'Standard Laptop (Python Interpreter)',
      rate: 1000000n, // 10^6 / s
      rateStr: '1,000,000 ops / sec',
      description: 'Your local machine running a standard single-threaded CPython while loop.',
    },
    {
      name: 'World Supercomputer Cluster (Exascale)',
      rate: 1000000000000000000n, // 10^18 / s (1 ExaFLOP)
      rateStr: '10¹⁸ ops / sec (1 ExaOp)',
      description: 'The combined computational power of Frontier, Aurora, and Summit.',
    },
    {
      name: 'Kardashev Type II (Solar Dyson Swarm)',
      rate: 10n ** 35n,
      rateStr: '10³⁵ ops / sec',
      description: 'A hypothetical megastructure harnessing 100% of the Sun’s radiation for computation.',
    },
    {
      name: 'Kardashev Type III (Milky Way Galactic Core)',
      rate: 10n ** 55n,
      rateStr: '10⁵⁵ ops / sec',
      description: 'Every star system in the entire Milky Way galaxy networked into a computing cluster.',
    },
    {
      name: 'Universal Computronium (Every Atom in Cosmos)',
      rate: 10n ** 80n,
      rateStr: '10⁸⁰ ops / sec',
      description: 'All ~10⁸⁰ atoms in the observable universe calculating simultaneously in parallel.',
    },
  ];

  const currentTier = computerTiers[selectedMachine];
  const timeToFinish = estimateTimeToFinish(currentCounter, currentTier.rate);

  return (
    <div
      className={`rounded-xl border ${ink.borderClass} ${ink.panelClass} p-5 backdrop-blur-md font-mono shadow-xl flex flex-col gap-6`}
    >
      {/* Title & Concept Header */}
      <div className="pb-4 border-b border-white/10">
        <h2 className={`text-base font-bold ${ink.textClass} tracking-wider uppercase ink-glow-subtle flex items-center gap-2`}>
          <Orbit className="w-4 h-4" />
          <span>Cosmological Scale of 10⁸⁸</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
          The while loop starting at <span className={`${ink.textClass} font-bold`}>10⁸⁸</span> exceeds the physical bounds of
          humanity, stars, and galaxies. Compare where the loop stands relative to cosmic epochs.
        </p>
      </div>

      {/* Main Cosmological Calculator Card */}
      <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Time-To-Completion Simulator</span>
          </span>
          <span className="text-xs text-zinc-500 font-mono">
            Remaining: <span className={`${ink.textClass} font-bold`}>{formatScientific(currentCounter)}</span> ops
          </span>
        </div>

        {/* Machine Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {computerTiers.map((tier, idx) => (
            <button
              key={tier.name}
              onClick={() => setSelectedMachine(idx)}
              className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                selectedMachine === idx
                  ? `${ink.borderClass} bg-emerald-950/40 ${ink.textClass} font-bold shadow-md`
                  : 'border-zinc-800/80 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <div className="text-xs font-semibold truncate">{tier.name.split(' (')[0]}</div>
              <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{tier.rateStr}</div>
            </button>
          ))}
        </div>

        {/* Computation Readout Result */}
        <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-zinc-500">
              Estimated Duration to count to 1 with {currentTier.name}:
            </div>
            <div className={`text-xl sm:text-2xl font-bold font-mono mt-1 ${ink.textClass} ink-glow-subtle`}>
              {timeToFinish}
            </div>
            <div className="text-xs text-zinc-400 mt-1">{currentTier.description}</div>
          </div>

          <div className="text-right sm:border-l sm:border-zinc-800 sm:pl-6 shrink-0">
            <div className="text-[11px] text-zinc-500 uppercase">Loop Completion Status</div>
            <div className="text-sm font-bold font-mono text-zinc-300 mt-0.5">
              {currentCounter > 0n ? '0.00000000000...%' : '100%'}
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">
              {totalDecrements.toString()} decrements executed
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Milestones List */}
      <div>
        <div className="text-xs uppercase tracking-wider text-zinc-400 mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Atom className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cosmic Benchmarks & Scales (Powers of 10)</span>
          </span>
          <span className="text-zinc-500 text-[11px]">Click any benchmark to warp counter</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {COSMIC_BENCHMARKS.map((bm) => {
            const isPassed = currentCounter < 10n ** BigInt(bm.exponent);
            const isCurrent = currentCounter.toString().length - 1 === bm.exponent;

            return (
              <div
                key={bm.name}
                className={`p-3.5 rounded-lg border transition-all ${
                  isCurrent
                    ? `${ink.borderClass} bg-emerald-950/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]`
                    : 'border-zinc-800 bg-black/40 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-200">{bm.name}</span>
                    {isCurrent && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        CURRENT MAGNITUDE
                      </span>
                    )}
                  </div>
                  <span className={`text-xs font-mono font-bold ${ink.textClass}`}>{bm.scientific}</span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed mb-2.5">{bm.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                  <span className="text-zinc-500">10^{bm.exponent}</span>
                  <button
                    onClick={() => onJumpTo(10n ** BigInt(bm.exponent))}
                    className="text-xs text-zinc-400 hover:text-emerald-400 underline cursor-pointer"
                  >
                    Warp counter here &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
