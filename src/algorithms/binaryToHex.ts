import { groupBinaryToBase } from './primitives'
import type { GroupingResult } from './types'

export function binaryToHex(binary: string): GroupingResult {
  return groupBinaryToBase(binary, 4, 16)
}
