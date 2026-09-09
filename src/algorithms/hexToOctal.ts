import { digitsToBinary, groupBinaryToBase } from './primitives'
import type { ChainResult } from './types'

export function hexToOctal(hex: string): ChainResult {
  const toBinary = digitsToBinary(hex, 16, 4)
  const bridgeBinary = toBinary.result
  const fromBinary = groupBinaryToBase(bridgeBinary, 3, 8)

  return {
    method: 'binary-bridge',
    fromBase: 16,
    toBase: 8,
    input: hex,
    result: fromBinary.result,
    toBinary,
    fromBinary,
    bridgeBinary,
  }
}
