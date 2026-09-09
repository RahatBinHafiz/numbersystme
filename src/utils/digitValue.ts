// Manual digit <-> value tables.
// These are lookup tables, not base-conversion built-ins: every conversion
// algorithm in /algorithms builds its answer from arithmetic (+, ×, ÷, %)
// applied to the values these tables expose, never from parseInt(x, radix),
// Number(x), or x.toString(radix).

const DIGIT_TO_VALUE: Record<string, number> = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4,
  '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  A: 10, B: 11, C: 12, D: 13, E: 14, F: 15,
}

const VALUE_TO_DIGIT = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']

/** Convert a single character (any case) to its numeric value. */
export function digitToValue(char: string): number {
  const upper = char.toUpperCase()
  if (!(upper in DIGIT_TO_VALUE)) {
    throw new Error(`"${char}" is not a recognised digit`)
  }
  return DIGIT_TO_VALUE[upper]
}

/** Convert a numeric value (0-15) back to its display character. */
export function valueToDigit(value: number): string {
  if (value < 0 || value > 15) {
    throw new Error(`Value ${value} is out of digit range`)
  }
  return VALUE_TO_DIGIT[value]
}

export const BASE_NAMES: Record<number, string> = {
  2: 'Binary',
  8: 'Octal',
  10: 'Decimal',
  16: 'Hexadecimal',
}

export const BASE_SUBSCRIPT: Record<number, string> = {
  2: '₂',
  8: '₈',
  10: '₁₀',
  16: '₁₆',
}

export const BITS_PER_DIGIT: Record<number, number> = {
  2: 1,
  8: 3,
  16: 4,
}
