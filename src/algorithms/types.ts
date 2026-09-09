export type Base = 2 | 8 | 10 | 16

export interface PositionalStep {
  digit: string
  position: number
  value: number
  expression: string // e.g. "1 × 2^5" or "1 × 2^-1"
  term: string // e.g. "1×2⁵" or "1×2⁻¹"
  isFraction?: boolean
}

export interface PositionalResult {
  method: 'positional-expansion'
  fromBase: Base
  toBase: 10
  input: string
  result: string
  resultValue: number
  steps: PositionalStep[]
  sumLine: string // e.g. "32 + 0 + 8 + 4 + 0 + 1"
  hasFraction?: boolean
}

export interface DivisionStep {
  dividend: number
  divisor: number
  quotient: number
  remainder: number
  remainderDigit: string
}

export interface MultiplicationStep {
  stepNumber: number
  fraction: number
  base: number
  product: number
  integerPart: number
  digit: string
  remainingFraction: number
}

export interface DivisionResult {
  method: 'repeated-division'
  fromBase: 10
  toBase: Base
  input: string
  result: string
  steps: DivisionStep[]
  hasFraction?: boolean
  integerResult?: string
  fractionResult?: string
  fractionSteps?: MultiplicationStep[]
}

export interface GroupStep {
  group: string // padded bits, e.g. "101"
  digit: string // resulting digit, e.g. "5"
  groupPositional: PositionalStep[] // how the group's binary maps to that digit's value
  isFraction?: boolean
}

export interface GroupingResult {
  method: 'binary-grouping'
  fromBase: 2
  toBase: 8 | 16
  input: string
  paddedInput: string
  groupSize: number
  result: string
  groups: GroupStep[]
  hasFraction?: boolean
  fractionGroups?: GroupStep[]
  fractionPaddedInput?: string
  integerResult?: string
  fractionResult?: string
}

export interface DigitExpansionStep {
  digit: string
  value: number
  bits: string
  isFraction?: boolean
}

export interface DigitExpansionResult {
  method: 'digit-expansion'
  fromBase: 8 | 16
  toBase: 2
  input: string
  result: string
  fullBits: string
  bitsPerDigit: number
  steps: DigitExpansionStep[]
  hasFraction?: boolean
  fractionSteps?: DigitExpansionStep[]
  integerResult?: string
  fractionResult?: string
}

export interface ChainResult {
  method: 'binary-bridge'
  fromBase: 8 | 16
  toBase: 8 | 16
  input: string
  result: string
  toBinary: DigitExpansionResult
  fromBinary: GroupingResult
  bridgeBinary: string
}

export type ConversionResult =
  | PositionalResult
  | DivisionResult
  | GroupingResult
  | DigitExpansionResult
  | ChainResult

export interface HistoryEntry {
  id: string
  input: string
  fromBase: Base
  toBase: Base
  result: string
  timestamp: number
}
