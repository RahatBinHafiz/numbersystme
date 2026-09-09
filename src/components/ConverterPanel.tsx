import { ArrowLeftRight, RotateCcw, Sparkles } from 'lucide-react'
import type { Base } from '../algorithms/types'
import { BASE_STYLES } from '../utils/baseStyle'
import type { ValidationResult } from '../utils/validation'
import { BaseSelector } from './BaseSelector'
import { NumberInput } from './NumberInput'

interface Props {
  input: string
  fromBase: Base
  toBase: Base
  validation: ValidationResult
  onInputChange: (v: string) => void
  onFromBaseChange: (b: Base) => void
  onToBaseChange: (b: Base) => void
  onSwap: () => void
  onExample: () => void
  onReset: () => void
}

export function ConverterPanel({
  input,
  fromBase,
  toBase,
  validation,
  onInputChange,
  onFromBaseChange,
  onToBaseChange,
  onSwap,
  onExample,
  onReset,
}: Props) {
  const fromStyle = BASE_STYLES[fromBase]
  const toStyle = BASE_STYLES[toBase]

  return (
    <div className="glass rounded-3xl p-5 sm:p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-bold">Number System Converter</h2>
          <p className="text-xs text-[var(--ink-soft)]">Choose your bases and enter a value to solve</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExample}
            className="glow-ring flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-[var(--ink-soft)] transition-colors hover:text-[var(--accent)] hover:border-[var(--accent)]"
            style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}
          >
            <Sparkles size={13} /> Example
          </button>
          <button
            type="button"
            onClick={onReset}
            className="glow-ring flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-[var(--ink-soft)] transition-colors hover:text-[var(--accent)] hover:border-[var(--accent)]"
            style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      <NumberInput value={input} base={fromBase} onChange={onInputChange} validation={validation} />

      <div className="mt-5 grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <BaseSelector label="Source Base" value={fromBase} onChange={onFromBaseChange} exclude={toBase} />

        <div className="flex justify-center sm:pt-4">
          <button
            type="button"
            onClick={onSwap}
            aria-label="Swap source and target bases"
            title="Swap bases"
            className="glow-ring flex h-11 w-11 items-center justify-center rounded-full border transition-all hover:rotate-180 hover:border-[var(--accent)]"
            style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))', color: 'var(--accent)' }}
          >
            <ArrowLeftRight size={18} />
          </button>
        </div>

        <BaseSelector label="Target Base" value={toBase} onChange={onToBaseChange} exclude={fromBase} />
      </div>

      <div className="mt-4 rounded-xl px-3.5 py-2 text-center text-xs sm:text-sm text-[var(--ink-soft)] bg-[color-mix(in_srgb,var(--surface)_50%,transparent)] border" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
        Converting from <span style={{ color: fromStyle.varName }} className="font-semibold">{fromStyle.name} (Base {fromBase})</span>{' '}
        to <span style={{ color: toStyle.varName }} className="font-semibold">{toStyle.name} (Base {toBase})</span>
      </div>
    </div>
  )
}
