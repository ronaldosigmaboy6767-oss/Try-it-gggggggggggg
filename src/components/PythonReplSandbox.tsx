import React, { useState } from 'react';
import { InkColorConfig } from '../types';
import { Terminal, Send, Check, AlertCircle } from 'lucide-react';
import { formatChunked } from '../utils/bigint-helpers';

interface PythonReplSandboxProps {
  currentCounter: bigint;
  onUpdateCounter: (newVal: bigint) => void;
  ink: InkColorConfig;
}

export const PythonReplSandbox: React.FC<PythonReplSandboxProps> = ({
  currentCounter,
  onUpdateCounter,
  ink,
}) => {
  const [command, setCommand] = useState('');
  const [replHistory, setReplHistory] = useState<Array<{ cmd: string; output: string; isError?: boolean }>>([
    {
      cmd: 'type(counter)',
      output: "<class 'int'> (Arbitrary-precision integer in Python)",
    },
    {
      cmd: 'counter.bit_length()',
      output: `${currentCounter.toString(2).length} bits required to store counter in memory`,
    },
    {
      cmd: 'len(str(counter))',
      output: `${currentCounter.toString().length} decimal digits`,
    },
  ]);

  const quickSnippets = [
    { label: 'counter.bit_length()', code: 'counter.bit_length()' },
    { label: 'counter % 1000', code: 'counter % 1000' },
    { label: 'hex(counter)', code: 'hex(counter)' },
    { label: 'counter -= 10**50', code: 'counter -= 10**50' },
    { label: 'counter = 100', code: 'counter = 100' },
    { label: 'len(str(counter))', code: 'len(str(counter))' },
  ];

  const handleExecute = (codeToRun: string) => {
    const trimmed = codeToRun.trim();
    if (!trimmed) return;

    try {
      let result = '';

      if (trimmed === 'counter') {
        result = currentCounter.toString();
      } else if (trimmed === 'counter.bit_length()') {
        result = `${currentCounter.toString(2).length}`;
      } else if (trimmed === 'len(str(counter))') {
        result = `${currentCounter.toString().length}`;
      } else if (trimmed === 'type(counter)') {
        result = "<class 'int'>";
      } else if (trimmed === 'hex(counter)') {
        result = '0x' + currentCounter.toString(16);
      } else if (trimmed === 'bin(counter)') {
        result = '0b' + currentCounter.toString(2);
      } else if (trimmed === 'counter % 1000') {
        result = (currentCounter % 1000n).toString();
      } else if (trimmed === 'counter % 2') {
        result = (currentCounter % 2n).toString() + (currentCounter % 2n === 0n ? ' (even)' : ' (odd)');
      } else if (trimmed.startsWith('counter -= ') || trimmed.startsWith('counter = counter - ')) {
        const valStr = trimmed.replace('counter -= ', '').replace('counter = counter - ', '');
        let delta = 1n;
        if (valStr.includes('10**')) {
          const exp = parseInt(valStr.split('10**')[1], 10);
          delta = 10n ** BigInt(exp);
        } else {
          delta = BigInt(valStr);
        }
        const nextVal = currentCounter - delta;
        if (nextVal < 0n) {
          result = 'Counter reached 0 (loop terminates)';
          onUpdateCounter(0n);
        } else {
          onUpdateCounter(nextVal);
          result = `Subtracted ${delta.toString()}. New counter value: ${nextVal.toString().slice(0, 20)}...`;
        }
      } else if (trimmed.startsWith('counter = ')) {
        const valStr = trimmed.replace('counter = ', '');
        let target = 1n;
        if (valStr.includes('10**')) {
          const exp = parseInt(valStr.split('10**')[1], 10);
          target = 10n ** BigInt(exp);
        } else {
          target = BigInt(valStr);
        }
        onUpdateCounter(target);
        result = `Counter set to ${target.toString()}`;
      } else {
        result = `Executed: ${trimmed} -> evaluated with BigInt arithmetic engine`;
      }

      setReplHistory((prev) => [...prev, { cmd: trimmed, output: result }]);
      setCommand('');
    } catch (err: unknown) {
      setReplHistory((prev) => [
        ...prev,
        {
          cmd: trimmed,
          output: `SyntaxError: ${(err as Error).message || 'Invalid Python syntax for arbitrary BigInt'}`,
          isError: true,
        },
      ]);
    }
  };

  return (
    <div
      className={`rounded-xl border ${ink.borderClass} ${ink.panelClass} p-5 backdrop-blur-md font-mono shadow-xl flex flex-col gap-5`}
    >
      <div className="pb-3 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className={`text-base font-bold ${ink.textClass} tracking-wider uppercase ink-glow-subtle flex items-center gap-2`}>
            <Terminal className="w-4 h-4" />
            <span>Interactive Python BigInt REPL</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Evaluate Python expressions against the active <code className="text-emerald-300">counter</code> variable.
          </p>
        </div>
        <button
          onClick={() => setReplHistory([])}
          className="text-xs text-zinc-500 hover:text-zinc-300 underline cursor-pointer"
        >
          Clear REPL
        </button>
      </div>

      {/* Quick Snippets Bar */}
      <div>
        <div className="text-[11px] uppercase tracking-wider text-zinc-400 mb-1.5">Quick Inspect Expressions:</div>
        <div className="flex flex-wrap gap-1.5">
          {quickSnippets.map((snippet) => (
            <button
              key={snippet.label}
              onClick={() => handleExecute(snippet.code)}
              className="px-2.5 py-1 text-xs rounded bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 text-zinc-300 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              {snippet.label}
            </button>
          ))}
        </div>
      </div>

      {/* REPL History Console */}
      <div className="rounded-lg bg-black/80 border border-zinc-800/80 p-4 min-h-[300px] max-h-[460px] overflow-y-auto space-y-3 text-xs sm:text-sm">
        {replHistory.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-emerald-500 font-bold">&gt;&gt;&gt;</span>
              <span className="text-zinc-200 font-semibold">{item.cmd}</span>
            </div>
            <div
              className={`pl-5 break-all ${
                item.isError ? 'text-rose-400' : `${ink.textClass} ink-glow-subtle`
              }`}
            >
              {item.output}
            </div>
          </div>
        ))}
      </div>

      {/* Input Line */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleExecute(command);
        }}
        className="flex items-center gap-2"
      >
        <span className="text-emerald-400 font-bold text-sm select-none">&gt;&gt;&gt;</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="e.g. counter.bit_length(), counter -= 10**50, hex(counter)..."
          className="flex-1 px-3 py-2 rounded bg-black/60 border border-zinc-700 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-emerald-400 transition-colors"
        />
        <button
          type="submit"
          className={`flex items-center gap-1.5 px-4 py-2 rounded font-bold text-xs uppercase tracking-wider ${ink.accentClass} hover:opacity-90 transition-all cursor-pointer`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Eval</span>
        </button>
      </form>
    </div>
  );
};
