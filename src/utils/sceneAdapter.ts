import type { ConversionResult } from '../algorithms/types'

export interface PositionalBlock {
  kind: 'positional'
  digit: string
  position: number
  base: number
  power: string
  value: number
}

export interface DivisionBlock {
  kind: 'division'
  index: number
  dividend: number
  divisor: number
  quotient: number
  remainder: string
  isFirst: boolean
  isLast: boolean
}

export interface BitCluster {
  bits: string
  label: string
  arrowDown: boolean // true: bits -> label (grouping). false: label -> bits (expansion)
}

export type BlockSceneSpec =
  | { kind: 'positional'; blocks: PositionalBlock[]; resultLabel: string }
  | { kind: 'division'; blocks: DivisionBlock[]; resultLabel: string }
  | { kind: 'grouped'; clusters: BitCluster[]; resultLabel: string; note?: string }

export function buildBlockScene(result: ConversionResult): BlockSceneSpec {
  switch (result.method) {
    case 'positional-expansion':
      return {
        kind: 'positional',
        resultLabel: `${result.result}₁₀`,
        blocks: result.steps.map((s) => ({
          kind: 'positional',
          digit: s.digit,
          position: s.position,
          base: result.fromBase,
          power: `${result.fromBase}^${s.position}`,
          value: s.value,
        })),
      }
    case 'repeated-division': {
      const n = result.steps.length
      return {
        kind: 'division',
        resultLabel: `${result.result}`,
        blocks: result.steps.map((s, i) => ({
          kind: 'division',
          index: i,
          dividend: s.dividend,
          divisor: s.divisor,
          quotient: s.quotient,
          remainder: s.remainderDigit,
          isFirst: i === 0,
          isLast: i === n - 1,
        })),
      }
    }
    case 'binary-grouping':
      return {
        kind: 'grouped',
        resultLabel: `${result.result}${result.toBase === 16 ? '₁₆' : '₈'}`,
        clusters: result.groups.map((g) => ({ bits: g.group, label: g.digit, arrowDown: true })),
      }
    case 'digit-expansion':
      return {
        kind: 'grouped',
        resultLabel: `${result.result}₂`,
        clusters: result.steps.map((s) => ({ bits: s.bits, label: s.digit, arrowDown: false })),
      }
    case 'binary-bridge':
      return {
        kind: 'grouped',
        resultLabel: `${result.result}${result.toBase === 16 ? '₁₆' : '₈'}`,
        note: `via binary bridge (${result.bridgeBinary}₂)`,
        clusters: result.fromBinary.groups.map((g) => ({ bits: g.group, label: g.digit, arrowDown: true })),
      }
  }
}
