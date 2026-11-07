/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { PythonScriptCard } from './components/PythonScriptCard';
import { TerminalConsole } from './components/TerminalConsole';
import { DigitMatrixView } from './components/DigitMatrixView';
import { CosmicScaleView } from './components/CosmicScaleView';
import { PythonReplSandbox } from './components/PythonReplSandbox';
import { StreamLogEntry, InkTheme } from './types';
import { INITIAL_COUNTER, INK_THEMES } from './utils/bigint-helpers';
import { sound } from './utils/audio';

export default function App() {
  const [counter, setCounter] = useState<bigint>(INITIAL_COUNTER);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [stepAmount, setStepAmount] = useState<bigint>(1n);
  const [tickRate, setTickRate] = useState<number>(20); // 20 ticks per second
  const [totalDecrements, setTotalDecrements] = useState<bigint>(0n);
  const [logs, setLogs] = useState<StreamLogEntry[]>([
    {
      id: 1,
      value: INITIAL_COUNTER.toString(),
      stepDiff: '0',
      timestamp: Date.now(),
      iteration: 0n,
    },
  ]);
  const [inkTheme, setInkTheme] = useState<InkTheme>('phosphor');
  const [scanlines, setScanlines] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'terminal' | 'matrix' | 'cosmic' | 'repl'>('terminal');
  const [activeLine, setActiveLine] = useState<number>(2);

  const counterRef = useRef<bigint>(counter);
  counterRef.current = counter;

  const stepAmountRef = useRef<bigint>(stepAmount);
  stepAmountRef.current = stepAmount;

  const totalDecrementsRef = useRef<bigint>(totalDecrements);
  totalDecrementsRef.current = totalDecrements;

  const ink = INK_THEMES[inkTheme];

  // Sound sync
  useEffect(() => {
    sound.setMuted(!soundEnabled);
  }, [soundEnabled]);

  // Execute a single step
  const executeStep = useCallback((amount?: bigint) => {
    const current = counterRef.current;
    if (current < 1n) {
      setIsRunning(false);
      return;
    }

    const decrement = amount ?? stepAmountRef.current;
    let nextVal = current - decrement;
    if (nextVal < 0n) nextVal = 0n;

    const nextIteration = totalDecrementsRef.current + 1n;

    setCounter(nextVal);
    setTotalDecrements(nextIteration);

    setLogs((prev) => {
      const newEntry: StreamLogEntry = {
        id: Date.now() + Math.random(),
        value: nextVal.toString(),
        stepDiff: decrement.toString(),
        timestamp: Date.now(),
        iteration: nextIteration,
      };
      // Retain the latest 120 lines for high performance rendering
      const nextLogs = [...prev, newEntry];
      return nextLogs.length > 120 ? nextLogs.slice(nextLogs.length - 120) : nextLogs;
    });

    sound.playTick();

    if (nextVal === 0n) {
      sound.playMilestone();
      setIsRunning(false);
    }
  }, []);

  // Main while-loop timer effect
  useEffect(() => {
    if (!isRunning) {
      setActiveLine(2);
      return;
    }

    const intervalMs = Math.max(16, Math.floor(1000 / tickRate));
    let lineToggle = 3;

    const timer = setInterval(() => {
      lineToggle = lineToggle === 3 ? 4 : 3;
      setActiveLine(lineToggle);
      executeStep();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isRunning, tickRate, executeStep]);

  // Keyboard shortcut listener (Space to toggle run/pause, S to step, R to reset)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning((prev) => !prev);
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        executeStep();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executeStep]);

  const handleReset = () => {
    setIsRunning(false);
    setCounter(INITIAL_COUNTER);
    setTotalDecrements(0n);
    setLogs([
      {
        id: Date.now(),
        value: INITIAL_COUNTER.toString(),
        stepDiff: '0',
        timestamp: Date.now(),
        iteration: 0n,
      },
    ]);
    sound.playLineFeed();
  };

  const handleJumpTo = (val: bigint) => {
    setCounter(val);
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now(),
        value: val.toString(),
        stepDiff: `Warp to ${val.toString().slice(0, 8)}...`,
        timestamp: Date.now(),
        iteration: totalDecrementsRef.current,
      },
    ]);
    sound.playMilestone();
  };

  return (
    <div className={`min-h-screen ${ink.bgClass} text-zinc-100 flex flex-col selection:bg-emerald-500 selection:text-black transition-colors duration-200`}>
      {/* 3-Zone Top Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isRunning={isRunning}
        onToggleRunning={() => setIsRunning(!isRunning)}
        ink={ink}
        scanlines={scanlines}
        onToggleScanlines={() => setScanlines(!scanlines)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {/* Main Workspace Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Two-Column Asymmetric Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Python Source Code & Step Controls (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <PythonScriptCard
              currentCounter={counter}
              isRunning={isRunning}
              onToggleRunning={() => setIsRunning(!isRunning)}
              onStep={executeStep}
              onReset={handleReset}
              onJumpTo={handleJumpTo}
              stepAmount={stepAmount}
              setStepAmount={setStepAmount}
              tickRate={tickRate}
              setTickRate={setTickRate}
              ink={ink}
              activeLine={activeLine}
            />

            {/* Quick Context Card */}
            <div className={`rounded-xl border ${ink.borderClass} ${ink.panelClass} p-4 text-xs font-mono text-zinc-400 space-y-2`}>
              <div className="text-zinc-300 font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Problem Statement</span>
                <span className={`${ink.textClass} text-[11px]`}>Green Ink</span>
              </div>
              <p className="leading-relaxed">
                You provided:
                <br />
                <code className="text-emerald-300 font-semibold">
                  counter = 10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
                </code>
                <br />
                <code className="text-emerald-300 font-semibold">while counter &gt;= 1:</code>
                <br />
                <code className="text-emerald-300 font-semibold">&nbsp;&nbsp;print(counter)</code>
                <br />
                <code className="text-emerald-300 font-semibold">&nbsp;&nbsp;counter = counter - 1</code>
              </p>
              <p className="text-[11px] text-zinc-500 pt-1 border-t border-white/5">
                Number of zeros: 88 (10⁸⁸). Rendered in pure phosphor green ink with real-time BigInt computation.
              </p>
            </div>
          </div>

          {/* Right Column: Dynamic Stage based on Active Tab (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            {activeTab === 'terminal' && (
              <TerminalConsole
                currentCounter={counter}
                logs={logs}
                onClearLogs={() => setLogs([])}
                ink={ink}
                setInkTheme={setInkTheme}
                scanlines={scanlines}
                onToggleScanlines={() => setScanlines(!scanlines)}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled(!soundEnabled)}
                isRunning={isRunning}
                totalDecrements={totalDecrements}
              />
            )}

            {activeTab === 'matrix' && (
              <DigitMatrixView
                currentCounter={counter}
                ink={ink}
                onStep={executeStep}
                isRunning={isRunning}
              />
            )}

            {activeTab === 'cosmic' && (
              <CosmicScaleView
                currentCounter={counter}
                ink={ink}
                totalDecrements={totalDecrements}
                onJumpTo={handleJumpTo}
              />
            )}

            {activeTab === 'repl' && (
              <PythonReplSandbox
                currentCounter={counter}
                onUpdateCounter={(newVal) => setCounter(newVal)}
                ink={ink}
              />
            )}
          </div>
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="w-full border-t border-zinc-900 py-4 px-6 text-center text-xs font-mono text-zinc-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Python 10⁸⁸ Green Ink Loop Execution Environment</span>
          <span className="text-[11px] text-zinc-500">Arbitrary-Precision BigInt Engine · Web Audio SFX</span>
        </div>
      </footer>
    </div>
  );
}
