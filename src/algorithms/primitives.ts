import { digitToValue, valueToDigit } from '../utils/digitValue'
import { powerExpression } from '../utils/formatting'
import type {
  Base,
  DigitExpansionResult,
  DigitExpansionStep,
  DivisionResult,
  DivisionStep,
  GroupingResult,
  GroupStep,
  MultiplicationStep,
  PositionalResult,
  PositionalStep,
} from './types'

/** Format a decimal number cleanly, avoiding floating-point precision artifacts. */
function formatDecimal(num: number): string {
  if (Number.isInteger(num)) return String(num)
  const rounded = parseFloat(num.toFixed(10))
  return String(rounded)
}

/**
 * BASE -> DECIMAL via positional (place-value) expansion.
 * Supports both integer and fractional components:
 * value = sum( digitValue(d_i) * base^i ) for integer positions (n-1 down to 0)
 * + sum( digitValue(d_-j) * base^-j ) for fractional positions (-1, -2, ...)
 */
export function baseToDecimalSteps(digits: string, fromBase: Base): PositionalResult {
  const hasFraction = digits.includes('.')
  const [intPart, fracPart = ''] = digits.split('.')

  const intChars = intPart.split('')
  const fracChars = fracPart.split('')
  const steps: PositionalStep[] = []
  let total = 0

  // Integer positions: (n-1) down to 0
  const n = intChars.length
  for (let i = 0; i < n; i++) {
    const char = intChars[i]
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
      isFraction: false,
    })
  }

  // Fractional positions: -1, -2, -3, ...
  for (let j = 0; j < fracChars.length; j++) {
    const char = fracChars[j]
    const position = -(j + 1)
    const digitVal = digitToValue(char)

    let denom = 1
    for (let p = 0; p < j + 1; p++) {
      denom *= fromBase
    }
    const placeValue = 1 / denom
    const contribution = digitVal * placeValue
    total += contribution

    steps.push({
      digit: char,
      position,
      value: contribution,
      expression: `${digitVal} × ${fromBase}^(${position})`,
      term: `${digitVal}×${powerExpression(fromBase, position)}`,
      isFraction: true,
    })
  }

  const resultStr = formatDecimal(total)

  return {
    method: 'positional-expansion',
    fromBase,
    toBase: 10,
    input: digits,
    result: resultStr,
    resultValue: total,
    steps,
    sumLine: steps.map((s) => String(s.value)).join(' + '),
    hasFraction,
  }
}

/**
 * Manually reads a decimal digit string into a JS number by accumulating
 * value = value*10 + digit for every character, left to right.
 */
export function parseDecimalDigits(digits: string): number {
  let value = 0
  for (const char of digits) {
    if (char >= '0' && char <= '9') {
      value = value * 10 + digitToValue(char)
    }
  }
  return value
}

/**
 * DECIMAL -> BASE via repeated division (for integer part) and
 * repeated multiplication by target base (for fractional part).
 */
export function decimalToBaseSteps(input: number | string, toBase: Base): DivisionResult {
  let intValue = 0
  let fracValue = 0
  let inputStr = String(input)

  if (typeof input === 'string') {
    const [intStr, fracStr] = input.split('.')
    intValue = parseDecimalDigits(intStr || '0')
    if (fracStr && fracStr.length > 0) {
      fracValue = parseDecimalDigits(fracStr) / Math.pow(10, fracStr.length)
    }
  } else {
    intValue = Math.floor(input)
    fracValue = input - intValue
  }

  // 1. Integer portion: repeated division
  const divSteps: DivisionStep[] = []
  if (intValue === 0) {
    divSteps.push({ dividend: 0, divisor: toBase, quotient: 0, remainder: 0, remainderDigit: '0' })
  } else {
    let current = intValue
    while (current > 0) {
      const quotient = Math.floor(current / toBase)
      const remainder = current - quotient * toBase
      divSteps.push({
        dividend: current,
        divisor: toBase,
        quotient,
        remainder,
        remainderDigit: valueToDigit(remainder),
      })
      current = quotient
    }
  }

  const intResult = divSteps
    .slice()
    .reverse()
    .map((s) => s.remainderDigit)
    .join('')

  // 2. Fractional portion: repeated multiplication
  const fracSteps: MultiplicationStep[] = []
  let fracResult = ''
  const hasFraction = fracValue > 1e-12

  if (hasFraction) {
    let currentFrac = fracValue
    const maxFracSteps = 8 // Standard educational limit for recurring fractions

    while (currentFrac > 1e-10 && fracSteps.length < maxFracSteps) {
      const product = currentFrac * toBase
      const intPart = Math.floor(product + 1e-11)
      const digit = valueToDigit(intPart)
      let remainderFrac = product - intPart
      if (remainderFrac < 1e-10) {
        remainderFrac = 0
      }

      fracSteps.push({
        stepNumber: fracSteps.length + 1,
        fraction: currentFrac,
        base: toBase,
        product,
        integerPart: intPart,
        digit,
        remainingFraction: remainderFrac,
      })

      currentFrac = remainderFrac
    }

    fracResult = fracSteps.map((s) => s.digit).join('')
  }

  const finalResult = hasFraction && fracResult.length ? `${intResult}.${fracResult}` : intResult

  return {
    method: 'repeated-division',
    fromBase: 10,
    toBase,
    input: inputStr,
    result: finalResult,
    steps: divSteps,
    hasFraction,
    integerResult: intResult,
    fractionResult: fracResult,
    fractionSteps: fracSteps,
  }
}

/** Drops redundant leading zero digits, keeping a single "0" for the zero value. */
export function stripLeadingZeros(digits: string): string {
  const stripped = digits.replace(/^0+(?=.)/, '')
  return stripped.length ? stripped : '0'
}

/**
 * BINARY -> OCTAL/HEX via grouping.
 * Integer part: padded on left to multiple of groupSize, grouped right-to-left.
 * Fractional part: padded on right to multiple of groupSize, grouped left-to-right.
 */
export function groupBinaryToBase(binary: string, groupSize: number, toBase: 8 | 16): GroupingResult {
  const hasFraction = binary.includes('.')
  const [intPart, fracPart = ''] = binary.split('.')

  // 1. Integer groups (padded left)
  const intRem = intPart.length % groupSize
  const intPadCount = intRem === 0 ? 0 : groupSize - intRem
  const intPadded = '0'.repeat(intPadCount) + intPart

  const intGroups: GroupStep[] = []
  for (let i = 0; i < intPadded.length; i += groupSize) {
    const chunk = intPadded.slice(i, i + groupSize)
    const expansion = baseToDecimalSteps(chunk, 2)
    const digitChar = valueToDigit(expansion.resultValue)
    intGroups.push({ group: chunk, digit: digitChar, groupPositional: expansion.steps, isFraction: false })
  }
  const intResult = stripLeadingZeros(intGroups.map((g) => g.digit).join(''))

  // 2. Fractional groups (padded right)
  const fracGroups: GroupStep[] = []
  let fracPadded = ''
  let fracResult = ''

  if (hasFraction && fracPart.length > 0) {
    const fracRem = fracPart.length % groupSize
    const fracPadCount = fracRem === 0 ? 0 : groupSize - fracRem
    fracPadded = fracPart + '0'.repeat(fracPadCount)

    for (let i = 0; i < fracPadded.length; i += groupSize) {
      const chunk = fracPadded.slice(i, i + groupSize)
      const expansion = baseToDecimalSteps(chunk, 2)
      const digitChar = valueToDigit(expansion.resultValue)
      fracGroups.push({ group: chunk, digit: digitChar, groupPositional: expansion.steps, isFraction: true })
    }
    fracResult = fracGroups.map((g) => g.digit).join('').replace(/0+$/, '')
  }

  const finalResult = hasFraction && fracResult.length ? `${intResult}.${fracResult}` : intResult
  const allGroups = [...intGroups, ...fracGroups]

  return {
    method: 'binary-grouping',
    fromBase: 2,
    toBase,
    input: binary,
    paddedInput: intPadded,
    groupSize,
    result: finalResult,
    groups: allGroups,
    hasFraction,
    fractionGroups: fracGroups,
    fractionPaddedInput: fracPadded,
    integerResult: intResult,
    fractionResult: fracResult,
  }
}

/**
 * OCTAL/HEX -> BINARY by expanding each digit into a fixed-width binary chunk.
 * Handles both integer digits and fractional digits with a radix point separator.
 */
export function digitsToBinary(digits: string, fromBase: 8 | 16, bitsPerDigit: number): DigitExpansionResult {
  const hasFraction = digits.includes('.')
  const [intPart, fracPart = ''] = digits.split('.')

  const intSteps: DigitExpansionStep[] = intPart.split('').map((char) => {
    const value = digitToValue(char)
    const division = decimalToBaseSteps(value, 2)
    const bits = division.result.padStart(bitsPerDigit, '0')
    return { digit: char, value, bits, isFraction: false }
  })

  const fracSteps: DigitExpansionStep[] = fracPart.split('').map((char) => {
    const value = digitToValue(char)
    const division = decimalToBaseSteps(value, 2)
    const bits = division.result.padStart(bitsPerDigit, '0')
    return { digit: char, value, bits, isFraction: true }
  })

  const intResult = stripLeadingZeros(intSteps.map((s) => s.bits).join(''))
  const rawFracResult = fracSteps.map((s) => s.bits).join('')
  const fracResult = rawFracResult.replace(/0+$/, '')
  const finalResult = hasFraction && fracResult.length ? `${intResult}.${fracResult}` : intResult

  const fullBits = hasFraction
    ? `${intSteps.map((s) => s.bits).join('')}.${fracResult}`
    : intSteps.map((s) => s.bits).join('')

  return {
    method: 'digit-expansion',
    fromBase,
    toBase: 2,
    input: digits,
    result: finalResult,
    fullBits,
    bitsPerDigit,
    steps: [...intSteps, ...fracSteps],
    hasFraction,
    fractionSteps: fracSteps,
    integerResult: intResult,
    fractionResult: fracResult,
  }
}
