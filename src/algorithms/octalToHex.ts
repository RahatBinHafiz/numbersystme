import { digitsToBinary, groupBinaryToBase } from './primitives'
import type { ChainResult } from './types'

export function octalToHex(octal: string): ChainResult {
  const toBinary = digitsToBinary(octal, 8, 3)
  const bridgeBinary = toBinary.result
  const fromBinary = groupBinaryToBase(bridgeBinary, 4, 16)

  return {
    method: 'binary-bridge',
    fromBase: 8,
    toBase: 16,
    input: octal,
    result: fromBinary.result,
    toBinary,
    fromBinary,
    bridgeBinary,
  }
}
