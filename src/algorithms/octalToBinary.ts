import { digitsToBinary } from './primitives'
import type { DigitExpansionResult } from './types'

export function octalToBinary(octal: string): DigitExpansionResult {
  return digitsToBinary(octal, 8, 3)
}
