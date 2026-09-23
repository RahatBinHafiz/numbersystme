import { digitToValue, valueToDigit, BASE_NAMES, BASE_SUBSCRIPT } from '../utils/digitValue'
import { baseToDecimalSteps } from './primitives'
import { addInBase, type SummationResult } from './summation'
import type { Base } from './types'

export interface DiminishedStep {
  position: number
  originalDigit: string
  originalVal: number
  radixMinusOne: number
  complementDigit: string
  complementVal: number
  explanation: string
}

export interface PlusOneRippleStep {
  position: number
  inputDigit: string
  inputVal: number
  carryIn: number
  sumRaw: number
  resultDigit: string
  carryOut: number
  explanation: string
}

export interface NegationResult {
  base: Base
  baseName: string
  subscript: string
  input: string
  wordWidth: number // active word length (digits/bits)
  paddedInput: string
  decimalValue: number

  // Diminished Radix Complement ((r-1)'s complement)
  diminishedName: string // e.g. "1's Complement", "7's Complement", etc.
  diminishedRadix: number // r - 1
  diminishedResult: string
  diminishedSteps: DiminishedStep[]

  // Radix Complement (r's complement)
  radixComplementName: string // e.g. "2's Complement", "8's Complement", etc.
  radixComplementResult: string
  rippleSteps: PlusOneRippleStep[]
  endCarryDiscarded: boolean

  // Signed Information
  signedMagnitude: string // e.g. "-1011"
  isNegativeInTwoComplement?: boolean
  signedDecimalValue: number
  signedMin: number
  signedMax: number

  // Proof by Addition: N + RadixComp(N) = 0 (mod r^w)
  zeroSumProof: SummationResult
  moduloWordResult: string
  discardedCarry: number
  proofExplanation: string
}

export const COMPLEMENT_NAMES: Record<Base, { diminished: string; radix: string }> = {
  2: { diminished: "1's Complement", radix: "2's Complement" },
  8: { diminished: "7's Complement", radix: "8's Complement" },
  10: { diminished: "9's Complement", radix: "10's Complement" },
  16: { diminished: "15's (F's) Complement", radix: "16's Complement" },
}

/**
 * Calculates negation, diminished radix complement ((r-1)'s complement),
 * radix complement (r's complement), carry ripple, signed representations,
 * and zero-sum addition proof for any base.
 */
export function negateInBase(
  rawInput: string,
  base: Base,
  customWordWidth?: number
): NegationResult {
  const clean = rawInput.trim().toUpperCase().replace(/^[-+]/, '') || '0'
  // Complements in hardware registers operate on integers or fixed-point
  const intOnly = clean.split('.')[0] || '0'

  // Determine standard word width
  const minDigits = intOnly.length + (base === 2 ? 1 : 0) // binary needs extra leading bit for sign
  let wordWidth = customWordWidth ?? 0
  if (!wordWidth || wordWidth < minDigits) {
    if (base === 2) {
      if (minDigits <= 4) wordWidth = 4
      else if (minDigits <= 8) wordWidth = 8
      else if (minDigits <= 16) wordWidth = 16
      else wordWidth = Math.ceil(minDigits / 8) * 8
    } else {
      if (minDigits <= 2) wordWidth = 2
      else if (minDigits <= 4) wordWidth = 4
      else wordWidth = minDigits
    }
  }

  const paddedInput = intOnly.padStart(wordWidth, '0')
  const decimalValue = baseToDecimalSteps(paddedInput, base).resultValue

  const rMinusOne = base - 1
  const compNames = COMPLEMENT_NAMES[base]

  // 1. Calculate Diminished Radix Complement ((r-1)'s complement)
  const diminishedSteps: DiminishedStep[] = []
  const diminishedChars: string[] = []

  for (let i = 0; i < wordWidth; i++) {
    const char = paddedInput[i]
    const val = digitToValue(char)
    const compVal = rMinusOne - val
    const compChar = valueToDigit(compVal)
    const position = wordWidth - 1 - i

    diminishedChars.push(compChar)
    diminishedSteps.push({
      position,
      originalDigit: char,
      originalVal: val,
      radixMinusOne: rMinusOne,
      complementDigit: compChar,
      complementVal: compVal,
      explanation: `${rMinusOne} - ${char} (${val}) = ${compVal} (${compChar})`,
    })
  }

  const diminishedResult = diminishedChars.join('')

  // 2. Calculate Radix Complement (r's complement) by adding 1 to the LSB
  const rippleSteps: PlusOneRippleStep[] = []
  const radixCompChars = [...diminishedChars]
  let carry = 1

  for (let i = wordWidth - 1; i >= 0; i--) {
    const char = radixCompChars[i]
    const val = digitToValue(char)
    const rawSum = val + carry
    const resultVal = rawSum % base
    const carryOut = Math.floor(rawSum / base)
    const resultChar = valueToDigit(resultVal)
    const position = wordWidth - 1 - i

    radixCompChars[i] = resultChar

    let explanation = ''
    if (carry > 0) {
      if (rawSum >= base) {
        explanation = `Digit ${char} (${val}) + carry 1 = ${rawSum} ≥ ${base}. Write "${resultChar}", carry 1 left.`
      } else {
        explanation = `Digit ${char} (${val}) + carry 1 = ${resultVal} < ${base}. Write "${resultChar}", carry stops (0).`
      }
    } else {
      explanation = `Digit ${char} (${val}) + carry 0 = ${char}. Stays "${resultChar}".`
    }

    rippleSteps.push({
      position,
      inputDigit: char,
      inputVal: val,
      carryIn: carry,
      sumRaw: rawSum,
      resultDigit: resultChar,
      carryOut,
      explanation,
    })

    carry = carryOut
  }

  const endCarryDiscarded = carry > 0
  const radixComplementResult = radixCompChars.join('')

  // 3. Signed values and ranges
  let signedMin = 0
  let signedMax = 0
  let signedDecimalValue = decimalValue
  const isNeg = base === 2 && radixComplementResult[0] === '1'

  if (base === 2) {
    signedMin = -Math.pow(2, wordWidth - 1)
    signedMax = Math.pow(2, wordWidth - 1) - 1
    // Decimal equivalent of the 2's complement result
    signedDecimalValue = -decimalValue
  } else {
    signedMin = -Math.floor((Math.pow(base, wordWidth) - 1) / 2)
    signedMax = Math.floor((Math.pow(base, wordWidth) - 1) / 2)
    signedDecimalValue = -decimalValue
  }

  // 4. Zero-Sum Addition Proof: paddedInput + radixComplementResult
  const zeroSumProof = addInBase(paddedInput, radixComplementResult, base)
  // In a fixed-width register of width w, the leftmost carry 1 overflows out of the register
  const overflowColumn = zeroSumProof.columns.find((c) => c.isFinalCarryColumn)
  const discardedCarry = overflowColumn ? overflowColumn.carryIn : 0
  const moduloWordResult = '0'.repeat(wordWidth)
  const proofExplanation = `In a fixed-width register of ${wordWidth} ${base === 2 ? 'bits' : 'digits'}, the final carry of ${discardedCarry || 1} overflows beyond the register boundary and is discarded. The stored register value becomes ${moduloWordResult} = 0, proving that N + (-N) ≡ 0 (mod ${base}^${wordWidth}).`

  return {
    base,
    baseName: BASE_NAMES[base],
    subscript: BASE_SUBSCRIPT[base],
    input: clean,
    wordWidth,
    paddedInput,
    decimalValue,
    diminishedName: compNames.diminished,
    diminishedRadix: rMinusOne,
    diminishedResult,
    diminishedSteps,
    radixComplementName: compNames.radix,
    radixComplementResult,
    rippleSteps,
    endCarryDiscarded,
    signedMagnitude: `-${clean}`,
    isNegativeInTwoComplement: isNeg,
    signedDecimalValue,
    signedMin,
    signedMax,
    zeroSumProof,
    moduloWordResult,
    discardedCarry: discardedCarry || 1,
    proofExplanation,
  }
}
