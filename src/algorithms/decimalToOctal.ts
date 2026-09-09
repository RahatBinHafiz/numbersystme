import { decimalToBaseSteps } from './primitives'
import type { DivisionResult } from './types'

export function decimalToOctal(value: number | string): DivisionResult {
  return decimalToBaseSteps(value, 8)
}
