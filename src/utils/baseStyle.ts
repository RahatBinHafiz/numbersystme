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
    placeholder: 'e.g. 101101',
    example: '101101',
    varName: 'var(--base-binary)',
    colorHex: '#38bdf8', // sky blue
    description: 'Base 2 — uses only bits 0 and 1',
    digits: '0, 1',
  },
  8: {
    name: 'Octal',
    subscript: '₈',
    placeholder: 'e.g. 55',
    example: '55',
    varName: 'var(--base-octal)',
    colorHex: '#34d399', // emerald green
    description: 'Base 8 — uses digits 0 through 7 (3 bits per digit)',
    digits: '0–7',
  },
  10: {
    name: 'Decimal',
    subscript: '₁₀',
    placeholder: 'e.g. 45',
    example: '45',
    varName: 'var(--base-decimal)',
    colorHex: '#f59e0b', // amber
    description: 'Base 10 — standard everyday counting system',
    digits: '0–9',
  },
  16: {
    name: 'Hexadecimal',
    subscript: '₁₆',
    placeholder: 'e.g. 2D',
    example: '2D',
    varName: 'var(--base-hex)',
    colorHex: '#c084fc', // purple / magenta
    description: 'Base 16 — uses 0–9 and A–F (4 bits per digit)',
    digits: '0–9, A–F',
  },
}
