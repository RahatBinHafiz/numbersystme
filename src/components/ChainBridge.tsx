import { ArrowDown } from 'lucide-react'
import type { ChainResult } from '../algorithms/types'
import { BASE_STYLES } from '../utils/baseStyle'
import { DigitExpansion } from './DigitExpansion'
import { BinaryGrouping } from './BinaryGrouping'

interface Props {
  data: ChainResult
  activeStep: number
}

export function ChainBridge({ data, activeStep }: Props) {
  const fromStyle = BASE_STYLES[data.fromBase]
  const toStyle = BASE_STYLES[data.toBase]
  const phaseOneSteps = data.toBinary.steps.length
  const inPhaseOne = activeStep < phaseOneSteps

  return (
    <div className="space-y-6">
      {/* 3-Step Educational Pipeline Header */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 rounded-2xl p-4 border bg-[color-mix(in_srgb,var(--surface)_60%,transparent)]" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
        <div className="flex items-center gap-1.5 font-bold text-sm" style={{ color: fromStyle.varName }}>
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: fromStyle.varName }} />
          {fromStyle.name} (Base {data.fromBase})
        </div>
        <ArrowDown size={16} className="text-[var(--ink-soft)] -rotate-90 sm:rotate-0" />
        <div className="flex items-center gap-1.5 font-bold text-sm text-[var(--base-binary)]">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--base-binary)]" />
          Binary Bridge (Base 2)
        </div>
        <ArrowDown size={16} className="text-[var(--ink-soft)] -rotate-90 sm:rotate-0" />
        <div className="flex items-center gap-1.5 font-bold text-sm" style={{ color: toStyle.varName }}>
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: toStyle.varName }} />
          {toStyle.name} (Base {data.toBase})
        </div>
      </div>

      {/* Phase 1: Source to Binary */}
      <div className="rounded-2xl p-4 sm:p-5 border" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))', background: 'color-mix(in srgb, var(--surface) 40%, transparent)' }}>
        <div className="mb-3 flex items-center justify-between">
          <span className="font-semibold text-xs uppercase tracking-wider text-[var(--ink-soft)]">
            Step 1: Convert {fromStyle.name} Digits to Binary Bits
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded border" style={{ borderColor: fromStyle.varName, color: fromStyle.varName }}>
            {data.toBinary.bitsPerDigit} bits / digit
          </span>
        </div>
        <DigitExpansion data={data.toBinary} activeStep={inPhaseOne ? activeStep : phaseOneSteps} />
      </div>

      {/* Phase 2: Binary to Target */}
      <div className="rounded-2xl p-4 sm:p-5 border" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))', background: 'color-mix(in srgb, var(--surface) 40%, transparent)' }}>
        <div className="mb-3 flex items-center justify-between">
          <span className="font-semibold text-xs uppercase tracking-wider text-[var(--ink-soft)]">
            Step 2: Group Binary Bits into {toStyle.name} Digits
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded border" style={{ borderColor: toStyle.varName, color: toStyle.varName }}>
            {data.fromBinary.groupSize} bits / group
          </span>
        </div>
        <BinaryGrouping data={data.fromBinary} activeStep={inPhaseOne ? -1 : activeStep - phaseOneSteps} />
      </div>

      <div className="rounded-2xl p-4 border bg-[color-mix(in_srgb,var(--surface)_70%,transparent)]" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
        <p className="font-mono-num text-base sm:text-lg">
          Final Answer:{' '}
          <span className="text-[var(--ink-soft)]">{data.input}{fromStyle.subscript} =</span>{' '}
          <span className="font-bold text-xl" style={{ color: toStyle.varName }}>
            {data.result}
            {toStyle.subscript}
          </span>
        </p>
      </div>
    </div>
  )
}
