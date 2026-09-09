import { baseToDecimalSteps } from './primitives'
import type { PositionalResult } from './types'

export function hexToDecimal(hex: string): PositionalResult {
  return baseToDecimalSteps(hex, 16)
}
