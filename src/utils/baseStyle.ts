import type { Base } from '../algorithms/types'

export interface BaseStyle {
  name: string
  subscript: string
  placeholder: string
  example: string
  varName: string // theme color variable / hex
  colorHex: string
  description: string
  digits: string
}

export const BASE_STYLES: Record<Base, BaseStyle> = {
  2: {
    name: 'Binary',
    subscript: '₂',
    placeholder: 'e.g. 101101 or 101.11',
    example: '101101',
    varName: 'var(--base-binary)',
    colorHex: '#38bdf8', // sky blue
    description: 'Base 2 — uses bits 0, 1 (with optional fraction)',
    digits: '0, 1 (and .)',
  },
  8: {
    name: 'Octal',
    subscript: '₈',
    placeholder: 'e.g. 55 or 55.4',
    example: '55',
    varName: 'var(--base-octal)',
    colorHex: '#34d399', // emerald green
    description: 'Base 8 — uses digits 0 through 7 (with optional fraction)',
    digits: '0–7 (and .)',
  },
  10: {
    name: 'Decimal',
    subscript: '₁₀',
    placeholder: 'e.g. 45 or 45.625',
    example: '45',
    varName: 'var(--base-decimal)',
    colorHex: '#f59e0b', // amber
    description: 'Base 10 — standard everyday counting system',
    digits: '0–9 (and .)',
  },
  16: {
    name: 'Hexadecimal',
    subscript: '₁₆',
    placeholder: 'e.g. 2D or 2D.A',
    example: '2D',
    varName: 'var(--base-hex)',
    colorHex: '#c084fc', // purple / magenta
    description: 'Base 16 — uses 0–9 and A–F (with optional fraction)',
    digits: '0–9, A–F (and .)',
  },
}
