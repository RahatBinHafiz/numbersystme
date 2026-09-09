import type { Base } from '../algorithms/types'

export interface BaseLesson {
  base: Base
  title: string
  summary: string
  digits: string
  placeValues: string[]
  examples: { value: string; note: string }[]
  techniques: string[]
}

export const LESSONS: Record<Base, BaseLesson> = {
  2: {
    base: 2,
    title: 'Binary — Base 2',
    summary:
      'Binary is the fundamental language of digital computers and circuits: every number is expressed using only two symbols (0 and 1), physically representing a switch in an off or on state.',
    digits: '0, 1',
    placeValues: ['2⁰ = 1', '2¹ = 2', '2² = 4', '2³ = 8', '2⁴ = 16', '2⁵ = 32'],
    examples: [
      { value: '1011₂', note: '= 8 + 0 + 2 + 1 = 11₁₀' },
      { value: '100000₂', note: '= 32₁₀' },
    ],
    techniques: [
      'Binary → Decimal: Positional expansion — multiply each bit by its power of 2 and add.',
      'Decimal → Binary: Repeated division by 2, recording remainders and reading bottom-to-top.',
      'Binary → Octal: Group bits in clusters of 3, from right to left (pad left with 0s if needed).',
      'Binary → Hex: Group bits in clusters of 4, from right to left (pad left with 0s if needed).',
    ],
  },
  8: {
    base: 8,
    title: 'Octal — Base 8',
    summary:
      'Octal groups binary digits into neat triples of 3 bits (2³ = 8). It was historically popular in early computing (such as PDP minicomputers and Unix file permission modes) because 3 bits align directly with octal digits 0–7.',
    digits: '0, 1, 2, 3, 4, 5, 6, 7',
    placeValues: ['8⁰ = 1', '8¹ = 8', '8² = 64', '8³ = 512'],
    examples: [
      { value: '17₈', note: '= 1×8 + 7×1 = 15₁₀' },
      { value: '100₈', note: '= 1×64 = 64₁₀' },
    ],
    techniques: [
      'Octal → Decimal: Positional expansion using powers of 8.',
      'Decimal → Octal: Repeated division by 8.',
      'Octal → Binary: Expand each octal digit into exactly 3 binary bits.',
      'Octal → Hex: Bridge through binary — octal to binary (3 bits each), then group into 4 bits for hex.',
    ],
  },
  10: {
    base: 10,
    title: 'Decimal — Base 10',
    summary:
      'Decimal is humanity’s ubiquitous counting system, evolved around ten human fingers. In computing, it serves as the benchmark against which positional values in other bases are compared.',
    digits: '0, 1, 2, 3, 4, 5, 6, 7, 8, 9',
    placeValues: ['10⁰ = 1', '10¹ = 10', '10² = 100', '10³ = 1000'],
    examples: [
      { value: '45₁₀', note: '= 100101₂ = 55₈ = 2D₁₆' },
      { value: '9₁₀', note: 'The highest single digit before carrying into the tens place' },
    ],
    techniques: [
      'Decimal is the natural result of positional expansion from other bases.',
      'Decimal → any base: Repeated integer division by the target base, collecting remainders.',
      'Any base → Decimal: Multiply each digit by that base’s positional power and sum.',
    ],
  },
  16: {
    base: 16,
    title: 'Hexadecimal — Base 16',
    summary:
      'Hexadecimal is the standard shorthand in software engineering, cryptography, and network addressing. Because 16 = 2⁴, one hex digit represents exactly 4 bits (a nibble), and two hex digits represent an 8-bit byte (00 to FF).',
    digits: '0-9, A, B, C, D, E, F (where A=10, B=11, C=12, D=13, E=14, F=15)',
    placeValues: ['16⁰ = 1', '16¹ = 16', '16² = 256', '16³ = 4096'],
    examples: [
      { value: '2F₁₆', note: '= 2×16 + 15×1 = 32 + 15 = 47₁₀' },
      { value: 'FF₁₆', note: '= 15×16 + 15×1 = 255₁₀ (one byte maximum)' },
    ],
    techniques: [
      'Hex → Decimal: Positional expansion using powers of 16 (replacing letters A–F with 10–15).',
      'Decimal → Hex: Repeated division by 16, mapping remainders 10–15 to A–F.',
      'Hex → Binary: Expand each hex digit into exactly 4 binary bits.',
      'Hex → Octal: Bridge through binary — hex to binary (4 bits each), then group into 3 bits for octal.',
    ],
  },
}
