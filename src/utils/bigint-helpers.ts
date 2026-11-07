import { CosmicBenchmark, InkColorConfig, InkTheme } from '../types';

/**
 * Exact target value from the user prompt:
 * 10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
 * (1 followed by 88 zeros = 10^88)
 */
export const INITIAL_COUNTER_STR = '10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
export const INITIAL_COUNTER: bigint = BigInt(INITIAL_COUNTER_STR);

export const INK_THEMES: Record<InkTheme, InkColorConfig> = {
  phosphor: {
    id: 'phosphor',
    name: 'P1 Phosphor Green',
    bgClass: 'bg-[#040d06]',
    panelClass: 'bg-[#06150a]/90',
    textClass: 'text-[#00ff66]',
    borderClass: 'border-[#00ff66]/30',
    accentClass: 'bg-[#00ff66] text-[#040d06]',
    glowColor: 'rgba(0, 255, 102, 0.45)',
    hex: '#00ff66',
  },
  matrix: {
    id: 'matrix',
    name: 'Cyber Jade Matrix',
    bgClass: 'bg-[#020b05]',
    panelClass: 'bg-[#041208]/90',
    textClass: 'text-[#10b981]',
    borderClass: 'border-[#10b981]/30',
    accentClass: 'bg-[#10b981] text-[#020b05]',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    hex: '#10b981',
  },
  vintage: {
    id: 'vintage',
    name: 'Amber-Lime CRT',
    bgClass: 'bg-[#0c0d03]',
    panelClass: 'bg-[#151705]/90',
    textClass: 'text-[#a3e635]',
    borderClass: 'border-[#a3e635]/30',
    accentClass: 'bg-[#a3e635] text-[#0c0d03]',
    glowColor: 'rgba(163, 230, 53, 0.45)',
    hex: '#a3e635',
  },
  mint: {
    id: 'mint',
    name: 'Terminal Mint Glow',
    bgClass: 'bg-[#030d0d]',
    panelClass: 'bg-[#061717]/90',
    textClass: 'text-[#2dd4bf]',
    borderClass: 'border-[#2dd4bf]/30',
    accentClass: 'bg-[#2dd4bf] text-[#030d0d]',
    glowColor: 'rgba(45, 212, 191, 0.45)',
    hex: '#2dd4bf',
  },
  parchment: {
    id: 'parchment',
    name: 'Verdant Manuscript',
    bgClass: 'bg-[#f4f7f2]',
    panelClass: 'bg-[#e7ece4]/90',
    textClass: 'text-[#065f46]',
    borderClass: 'border-[#065f46]/30',
    accentClass: 'bg-[#065f46] text-[#f4f7f2]',
    glowColor: 'rgba(6, 95, 70, 0.2)',
    hex: '#065f46',
    isLight: true,
  },
};

export const COSMIC_BENCHMARKS: CosmicBenchmark[] = [
  {
    name: 'Counter Initial Value',
    exponent: 88,
    scientific: '1.00 × 10⁸⁸',
    description: 'The starting value of the while-loop in your prompt (10⁸⁸).',
    category: 'computation',
  },
  {
    name: 'Observable Universe Atoms',
    exponent: 80,
    scientific: '1.00 × 10⁸⁰',
    description: 'Estimated total number of subatomic particles/atoms in the observable universe.',
    category: 'astronomy',
  },
  {
    name: 'Photons in Universe',
    exponent: 89,
    scientific: '1.00 × 10⁸⁹',
    description: 'Total number of cosmic microwave background photons in the cosmos.',
    category: 'astronomy',
  },
  {
    name: 'Solar Mass in Nucleons',
    exponent: 57,
    scientific: '1.20 × 10⁵⁷',
    description: 'Number of protons and neutrons comprising the Sun.',
    category: 'physics',
  },
  {
    name: 'Planck Times Since Big Bang',
    exponent: 61,
    scientific: '8.00 × 10⁶⁰',
    description: 'The shortest physical measurement of time elapsed since the universe began 13.8 billion years ago.',
    category: 'physics',
  },
  {
    name: 'Grains of Sand on Earth',
    exponent: 19,
    scientific: '7.50 × 10¹⁸',
    description: 'Estimated grains of sand covering every beach and desert across planet Earth.',
    category: 'earth',
  },
  {
    name: 'Seconds Since Big Bang',
    exponent: 17,
    scientific: '4.35 × 10¹⁷',
    description: 'Total elapsed seconds since the cosmos inflated (~13.8 billion years).',
    category: 'astronomy',
  },
  {
    name: 'Nanoseconds in 1 Year',
    exponent: 16,
    scientific: '3.15 × 10¹⁶',
    description: 'Total nanoseconds in an Earth solar year.',
    category: 'physics',
  },
  {
    name: 'Googol (for comparison)',
    exponent: 100,
    scientific: '1.00 × 10¹⁰⁰',
    description: '1 followed by 100 zeros; 10¹² times larger than our 10⁸⁸ counter.',
    category: 'computation',
  },
];

/**
 * Format a BigInt into scientific notation
 */
export function formatScientific(num: bigint): string {
  if (num === 0n) return '0';
  const str = num.toString();
  const len = str.length;
  if (len <= 4) return str;
  const lead = str[0];
  const decimals = str.slice(1, 4);
  const exp = len - 1;
  const supExp = toSuperscript(exp);
  return `${lead}.${decimals} × 10${supExp}`;
}

/**
 * Group large number string into blocks of 3, 4, or 10 digits
 */
export function formatChunked(str: string, chunkSize = 10, separator = ' '): string {
  const parts: string[] = [];
  for (let i = 0; i < str.length; i += chunkSize) {
    parts.push(str.slice(i, i + chunkSize));
  }
  return parts.join(separator);
}

/**
 * Convert number to Unicode superscript
 */
export function toSuperscript(num: number): string {
  const map: Record<string, string> = {
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
    '-': '⁻',
  };
  return num
    .toString()
    .split('')
    .map((c) => map[c] || c)
    .join('');
}

/**
 * Calculate estimated time to complete at current speed in human / cosmological terms
 */
export function estimateTimeToFinish(remaining: bigint, decrementsPerSec: bigint): string {
  if (remaining <= 0n) return 'Complete!';
  if (decrementsPerSec <= 0n) return 'Infinite (Paused)';

  const seconds = remaining / decrementsPerSec;
  if (seconds < 60n) return `${seconds.toString()} seconds`;
  const minutes = seconds / 60n;
  if (minutes < 60n) return `${minutes.toString()} minutes`;
  const hours = minutes / 60n;
  if (hours < 24n) return `${hours.toString()} hours`;
  const days = hours / 24n;
  if (days < 365n) return `${days.toString()} days`;
  const years = days / 365n;

  if (years < 1000n) return `${years.toString()} years`;
  if (years < 1000000n) return `${(years / 1000n).toString()} millennia`;

  // Compare to age of universe (~1.38 x 10^10 years)
  const universeAges = years / 13800000000n;
  if (universeAges < 1000n) {
    return `${years.toString()} years (~${universeAges.toString()}× age of universe)`;
  }

  return `${formatScientific(years)} years (Heat Death territory)`;
}
