import { digitToValue, valueToDigit, BASE_NAMES, BASE_SUBSCRIPT } from '../utils/digitValue'
import { baseToDecimalSteps } from './primitives'
import type { Base } from './types'

export interface SummationColumn {
  id: string
  stepNumber: number // 1-based order of calculation (from right to left)
  position: number // e.g. -2, -1, 0, 1, 2
  isFraction: boolean
  digitA: string
  valA: number
  digitB: string
  valB: number
  carryIn: number
  rawSum: number // carryIn + valA + valB
  resultDigit: string
  carryOut: number
  isFinalCarryColumn?: boolean
  explanation: string
}

export interface SummationResult {
  base: Base
  baseName: string
  subscript: string
  operandA: string
  operandB: string
  alignedA: string
  alignedB: string
  hasFraction: boolean
  columns: SummationColumn[] // ordered from right to left in execution order
  displayColumns: SummationColumn[] // ordered from left to right for table display
  carries: number[] // carry values aligned with displayColumns
  result: string
  decimalA: number
  decimalB: number
  decimalSum: number
  decimalResult: number
  verified: boolean
}

/**
 * Add two numbers in any base (2, 8, 10, 16) column-by-column with carries.
 * Supports both integer and fractional values with radix alignment.
 */
export function addInBase(aRaw: string, bRaw: string, base: Base): SummationResult {
  const cleanA = aRaw.trim().toUpperCase() || '0'
  const cleanB = bRaw.trim().toUpperCase() || '0'

  const [intA = '0', fracA = ''] = cleanA.split('.')
  const [intB = '0', fracB = ''] = cleanB.split('.')

  const hasFraction = fracA.length > 0 || fracB.length > 0
  const maxFracLen = Math.max(fracA.length, fracB.length)
  const maxIntLen = Math.max(intA.length, intB.length)

  const paddedIntA = intA.padStart(maxIntLen, '0')
  const paddedIntB = intB.padStart(maxIntLen, '0')
  const paddedFracA = maxFracLen > 0 ? fracA.padEnd(maxFracLen, '0') : ''
  const paddedFracB = maxFracLen > 0 ? fracB.padEnd(maxFracLen, '0') : ''

  const alignedA = hasFraction ? `${paddedIntA}.${paddedFracA}` : paddedIntA
  const alignedB = hasFraction ? `${paddedIntB}.${paddedFracB}` : paddedIntB

  const columns: SummationColumn[] = []
  let currentCarry = 0
  let stepCounter = 1

  // 1. Process Fractional columns from rightmost (least significant) to -1
  if (hasFraction && maxFracLen > 0) {
    for (let f = maxFracLen - 1; f >= 0; f--) {
      const charA = paddedFracA[f]
      const charB = paddedFracB[f]
      const valA = digitToValue(charA)
      const valB = digitToValue(charB)
      const rawSum = currentCarry + valA + valB
      const resultVal = rawSum % base
      const carryOut = Math.floor(rawSum / base)
      const resultChar = valueToDigit(resultVal)
      const position = -(f + 1)

      const carryText = currentCarry > 0 ? `Carry in ${currentCarry} + ` : ''
      let explanation = `${carryText}${charA} (${valA}) + ${charB} (${valB}) = ${rawSum}₁₀.`
      if (rawSum >= base) {
        explanation += ` Since ${rawSum} ≥ ${base}: ${rawSum} = (${carryOut} × ${base}) + ${resultVal}. Write "${resultChar}", carry ${carryOut} to the left.`
      } else {
        explanation += ` Since ${rawSum} < ${base}: Write "${resultChar}", carry 0.`
      }

      columns.push({
        id: `col-frac-${f}`,
        stepNumber: stepCounter++,
        position,
        isFraction: true,
        digitA: charA,
        valA,
        digitB: charB,
        valB,
        carryIn: currentCarry,
        rawSum,
        resultDigit: resultChar,
        carryOut,
        explanation,
      })

      currentCarry = carryOut
    }
  }

  // 2. Process Integer columns from rightmost (position 0) to maxIntLen - 1
  for (let i = maxIntLen - 1; i >= 0; i--) {
    const charA = paddedIntA[i]
    const charB = paddedIntB[i]
    const valA = digitToValue(charA)
    const valB = digitToValue(charB)
    const rawSum = currentCarry + valA + valB
    const resultVal = rawSum % base
    const carryOut = Math.floor(rawSum / base)
    const resultChar = valueToDigit(resultVal)
    const position = maxIntLen - 1 - i

    const carryText = currentCarry > 0 ? `Carry in ${currentCarry} + ` : ''
    let explanation = `${carryText}${charA} (${valA}) + ${charB} (${valB}) = ${rawSum}₁₀.`
    if (rawSum >= base) {
      explanation += ` Since ${rawSum} ≥ ${base}: ${rawSum} = (${carryOut} × ${base}) + ${resultVal}. Write "${resultChar}", carry ${carryOut} to position ${position + 1}.`
    } else {
      explanation += ` Since ${rawSum} < ${base}: Write "${resultChar}", carry 0.`
    }

    columns.push({
      id: `col-int-${i}`,
      stepNumber: stepCounter++,
      position,
      isFraction: false,
      digitA: charA,
      valA,
      digitB: charB,
      valB,
      carryIn: currentCarry,
      rawSum,
      resultDigit: resultChar,
      carryOut,
      explanation,
    })

    currentCarry = carryOut
  }

  // 3. Final overflow carry (if currentCarry > 0 after the most significant column)
  if (currentCarry > 0) {
    const resultChar = valueToDigit(currentCarry)
    const position = maxIntLen
    columns.push({
      id: `col-overflow`,
      stepNumber: stepCounter++,
      position,
      isFraction: false,
      digitA: '0',
      valA: 0,
      digitB: '0',
      valB: 0,
      carryIn: currentCarry,
      rawSum: currentCarry,
      resultDigit: resultChar,
      carryOut: 0,
      isFinalCarryColumn: true,
      explanation: `Final overflow carry ${currentCarry} brings down a new leading digit "${resultChar}" at position ${position}.`,
    })
  }

  // Reorder columns for left-to-right table display
  // Leftmost is highest integer position down to 0, then fractions -1 down to -maxFracLen
  const displayColumns = [...columns].sort((c1, c2) => c2.position - c1.position)

  // Construct final result string
  const intDigits = displayColumns
    .filter((c) => !c.isFraction)
    .map((c) => c.resultDigit)
    .join('')
  const fracDigits = displayColumns
    .filter((c) => c.isFraction)
    .map((c) => c.resultDigit)
    .join('')

  // Strip excessive leading zeros for display result, keep at least one digit
  const strippedInt = intDigits.replace(/^0+(?=\d)/, '') || '0'
  const strippedFrac = fracDigits.replace(/0+$/, '')
  const result = strippedFrac.length > 0 ? `${strippedInt}.${strippedFrac}` : strippedInt

  // Decimal verification
  const decA = baseToDecimalSteps(cleanA, base).resultValue
  const decB = baseToDecimalSteps(cleanB, base).resultValue
  const decimalSum = parseFloat((decA + decB).toFixed(8))
  const decResult = baseToDecimalSteps(result, base).resultValue
  const verified = Math.abs(decimalSum - decResult) < 0.0001

  const carries = displayColumns.map((c) => c.carryIn)

  return {
    base,
    baseName: BASE_NAMES[base],
    subscript: BASE_SUBSCRIPT[base],
    operandA: cleanA,
    operandB: cleanB,
    alignedA,
    alignedB,
    hasFraction,
    columns,
    displayColumns,
    carries,
    result,
    decimalA: decA,
    decimalB: decB,
    decimalSum,
    decimalResult: decResult,
    verified,
  }
}
