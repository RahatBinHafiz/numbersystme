import { decimalToBaseSteps } from './primitives'
import type { DivisionResult } from './types'

export function decimalToHex(value: number): DivisionResult {
  return decimalToBaseSteps(value, 16)
}
