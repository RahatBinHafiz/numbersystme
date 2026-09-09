import { decimalToBaseSteps } from './primitives'
import type { DivisionResult } from './types'

export function decimalToBinary(value: number | string): DivisionResult {
  return decimalToBaseSteps(value, 2)
}
