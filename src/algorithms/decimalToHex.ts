import { decimalToBaseSteps } from './primitives'
import type { DivisionResult } from './types'

export function decimalToHex(value: number | string): DivisionResult {
  return decimalToBaseSteps(value, 16)
}
