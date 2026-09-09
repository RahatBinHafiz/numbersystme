import { baseToDecimalSteps } from './primitives'
import type { PositionalResult } from './types'

export function binaryToDecimal(binary: string): PositionalResult {
  return baseToDecimalSteps(binary, 2)
}
