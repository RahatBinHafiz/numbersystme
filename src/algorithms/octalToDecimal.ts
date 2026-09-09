import { baseToDecimalSteps } from './primitives'
import type { PositionalResult } from './types'

export function octalToDecimal(octal: string): PositionalResult {
  return baseToDecimalSteps(octal, 8)
}
