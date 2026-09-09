import { groupBinaryToBase } from './primitives'
import type { GroupingResult } from './types'

export function binaryToOctal(binary: string): GroupingResult {
  return groupBinaryToBase(binary, 3, 8)
}
