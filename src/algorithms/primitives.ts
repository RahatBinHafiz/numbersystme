import { digitToValue, valueToDigit } from '../utils/digitValue'
import { powerExpression } from '../utils/formatting'
import type {
  Base,
  DigitExpansionResult,
  DivisionResult,
  DivisionStep,
  GroupingResult,
  GroupStep,
  PositionalResult,
  PositionalStep,
} from './types'

/**
 * BASE -> DECIMAL via positional (place-value) expansion.
 * value = sum( digitValue(d_i) * base^i ) for each digit d_i, read left to
 * right with i counting down from (length-1) to 0.
 * Implemented with manual multiplication/addition — never Number()/parseInt.
 */
export function baseToDecimalSteps(digits: string, fromBase: Base): PositionalResult {
  const chars = digits.split('')
  const n = chars.length
  const steps: PositionalStep[] = []
  let total = 0

  for (let i = 0; i < n; i++) {
    const char = chars[i]
    const position = n - 1 - i
    const digitVal = digitToValue(char)

    let placeValue = 1
    for (let p = 0; p < position; p++) {
      placeValue *= fromBase
    }

    const contribution = digitVal * placeValue
    total += contribution

    steps.push({
      digit: char,
      position,
      value: contribution,
      expression: `${digitVal} × ${fromBase}^${position}`,
      term: `${digitVal}×${powerExpression(fromBase, position)}`,
    })
  }

  return {
    method: 'positional-expansion',
    fromBase,
    toBase: 10,
    input: digits,
    result: String(total),
    resultValue: total,
    steps,
    sumLine: steps.map((s) => String(s.value)).join(' + '),
  }
}

/**
 * Manually reads a decimal digit string into a JS number by accumulating
 * value = value*10 + digit for every character, left to right. This is the
 * same accumulation a person does mentally when reading "347" as three
 * hundred and forty-seven — never Number(str) or parseInt(str, 10).
 */
export function parseDecimalDigits(digits: string): number {
  let value = 0
  for (const char of digits) {
    value = value * 10 + digitToValue(char)
  }
  return value
}

/**
 * DECIMAL -> BASE via repeated division.
 * Standard textbook long-division-by-the-target-base method: divide,
 * record the remainder as the next digit (least-significant first), and
 * repeat on the quotient until it reaches zero. Read remainders bottom-up.
 */
export function decimalToBaseSteps(value: number, toBase: Base): DivisionResult {
  if (value === 0) {
    return {
      method: 'repeated-division',
      fromBase: 10,
      toBase,
      input: '0',
      result: '0',
      steps: [{ dividend: 0, divisor: toBase, quotient: 0, remainder: 0, remainderDigit: '0' }],
    }
  }

  const steps: DivisionStep[] = []
  let current = value

  while (current > 0) {
    const quotient = Math.floor(current / toBase)
    const remainder = current - quotient * toBase
    steps.push({
      dividend: current,
      divisor: toBase,
      quotient,
      remainder,
      remainderDigit: valueToDigit(remainder),
    })
    current = quotient
  }

  // remainders read bottom (last computed) to top (first computed)
  const result = steps
    .slice()
    .reverse()
    .map((s) => s.remainderDigit)
    .join('')

  return {
    method: 'repeated-division',
    fromBase: 10,
    toBase,
    input: String(value),
    result,
    steps,
  }
}

/** Drops redundant leading zero digits, keeping a single "0" for the zero value. */
export function stripLeadingZeros(digits: string): string {
  const stripped = digits.replace(/^0+(?=.)/, '')
  return stripped.length ? stripped : '0'
}

/**
 * BINARY -> OCTAL/HEX via grouping.
 * Pads the binary string on the left with zeros until its length is a
 * multiple of groupSize, splits it into groups of groupSize bits (right to
 * left), and converts each group individually using positional expansion
 * in base 2.
 */
export function groupBinaryToBase(binary: string, groupSize: number, toBase: 8 | 16): GroupingResult {
  const remainder = binary.length % groupSize
  const padCount = remainder === 0 ? 0 : groupSize - remainder
  const padded = '0'.repeat(padCount) + binary

  const groups: GroupStep[] = []
  for (let i = 0; i < padded.length; i += groupSize) {
    const chunk = padded.slice(i, i + groupSize)
    const expansion = baseToDecimalSteps(chunk, 2)
    const digitChar = valueToDigit(expansion.resultValue)
    groups.push({ group: chunk, digit: digitChar, groupPositional: expansion.steps })
  }

  return {
    method: 'binary-grouping',
    fromBase: 2,
    toBase,
    input: binary,
    paddedInput: padded,
    groupSize,
    result: stripLeadingZeros(groups.map((g) => g.digit).join('')),
    groups,
  }
}

/**
 * OCTAL/HEX -> BINARY by expanding each digit individually into a
 * fixed-width binary chunk (3 bits for octal, 4 bits for hex) using
 * repeated division by 2, then concatenating the chunks in order.
 */
export function digitsToBinary(digits: string, fromBase: 8 | 16, bitsPerDigit: number): DigitExpansionResult {
  const steps = digits.split('').map((char) => {
    const value = digitToValue(char)
    const division = decimalToBaseSteps(value, 2)
    const bits = division.result.padStart(bitsPerDigit, '0')
    return { digit: char, value, bits }
  })

  return {
    method: 'digit-expansion',
    fromBase,
    toBase: 2,
    input: digits,
    result: stripLeadingZeros(steps.map((s) => s.bits).join('')),
    fullBits: steps.map((s) => s.bits).join(''),
    bitsPerDigit,
    steps,
  }
}
