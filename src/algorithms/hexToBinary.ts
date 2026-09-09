import { digitsToBinary } from './primitives'
import type { DigitExpansionResult } from './types'

export function hexToBinary(hex: string): DigitExpansionResult {
  return digitsToBinary(hex, 16, 4)
}
