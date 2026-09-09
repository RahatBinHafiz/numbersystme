import { binaryToDecimal } from './binaryToDecimal'
import { binaryToOctal } from './binaryToOctal'
import { binaryToHex } from './binaryToHex'
import { decimalToBinary } from './decimalToBinary'
import { decimalToOctal } from './decimalToOctal'
import { decimalToHex } from './decimalToHex'
import { octalToBinary } from './octalToBinary'
import { octalToDecimal } from './octalToDecimal'
import { octalToHex } from './octalToHex'
import { hexToBinary } from './hexToBinary'
import { hexToDecimal } from './hexToDecimal'
import { hexToOctal } from './hexToOctal'
import { parseDecimalDigits } from './primitives'
import type { Base, ConversionResult } from './types'

export * from './types'
export {
  binaryToDecimal,
  binaryToOctal,
  binaryToHex,
  decimalToBinary,
  decimalToOctal,
  decimalToHex,
  octalToBinary,
  octalToDecimal,
  octalToHex,
  hexToBinary,
  hexToDecimal,
  hexToOctal,
}

export interface MethodInfo {
  label: string
  description: string
}

export const METHOD_INFO: Record<ConversionResult['method'], MethodInfo> = {
  'positional-expansion': {
    label: 'Positional Expansion',
    description: 'Multiply each digit by its place value (base raised to its position) and add the results.',
  },
  'repeated-division': {
    label: 'Repeated Division',
    description: 'Divide repeatedly by the target base, recording each remainder, then read remainders bottom to top.',
  },
  'binary-grouping': {
    label: 'Binary Grouping',
    description: 'Split the binary digits into fixed-size groups and convert each group to a single target digit.',
  },
  'digit-expansion': {
    label: 'Digit Expansion',
    description: 'Expand each digit individually into a fixed-width binary chunk, then concatenate the chunks.',
  },
  'binary-bridge': {
    label: 'Binary Bridge',
    description: 'Convert through binary as an intermediate step, since octal and hex both relate to binary directly.',
  },
}

/**
 * Single entry point the UI calls for any of the 12 supported directions.
 * Dispatches to the correct manual algorithm — no conversion logic lives
 * in the UI layer.
 */
export function convert(fromBase: Base, toBase: Base, input: string): ConversionResult {
  if (fromBase === toBase) {
    throw new Error('Source and target base must differ.')
  }

  if (fromBase === 2 && toBase === 10) return binaryToDecimal(input)
  if (fromBase === 8 && toBase === 10) return octalToDecimal(input)
  if (fromBase === 16 && toBase === 10) return hexToDecimal(input)

  if (fromBase === 10 && toBase === 2) return decimalToBinary(input)
  if (fromBase === 10 && toBase === 8) return decimalToOctal(input)
  if (fromBase === 10 && toBase === 16) return decimalToHex(input)

  if (fromBase === 2 && toBase === 8) return binaryToOctal(input)
  if (fromBase === 2 && toBase === 16) return binaryToHex(input)

  if (fromBase === 8 && toBase === 2) return octalToBinary(input)
  if (fromBase === 16 && toBase === 2) return hexToBinary(input)

  if (fromBase === 8 && toBase === 16) return octalToHex(input)
  if (fromBase === 16 && toBase === 8) return hexToOctal(input)

  throw new Error(`Unsupported conversion: base ${fromBase} to base ${toBase}`)
}
