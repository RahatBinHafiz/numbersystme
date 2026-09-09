import { useId } from 'react'
import type { Base } from '../algorithms/types'
import { BASE_STYLES } from '../utils/baseStyle'
import type { ValidationResult } from '../utils/validation'

interface Props {
  value: string
  base: Base
  onChange: (value: string) => void
  validation: ValidationResult
}

export function NumberInput({ value, base, onChange, validation }: Props) {
  const id = useId()
  const style = BASE_STYLES[base]
  const showError = value.length > 0 && !validation.valid

  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
        <span>Input number ({style.name})</span>
        <span className="font-mono text-[11px] normal-case opacity-75">Allowed: {style.digits}</span>
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={style.placeholder}
          aria-invalid={showError}
          aria-describedby={showError ? `${id}-error` : undefined}
          className="glow-ring font-mono-num w-full rounded-2xl border bg-transparent px-4 py-3.5 pr-14 text-xl sm:text-2xl tracking-wider outline-none transition-colors placeholder:text-[var(--ink-soft)] placeholder:opacity-40"
          style={{
            borderColor: showError ? '#e1476b' : 'rgb(var(--border) / var(--border-alpha))',
            color: 'var(--ink)',
          }}
        />
        <span
          className="font-mono-num pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg sm:text-xl font-bold opacity-80"
          style={{ color: style.varName }}
        >
          {style.subscript}
        </span>
      </div>
      {showError && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-[#e1476b]">
          <span className="font-semibold">{validation.message}</span>
          {validation.detail ? ` ${validation.detail}` : ''}
        </p>
      )}
    </div>
  )
}
