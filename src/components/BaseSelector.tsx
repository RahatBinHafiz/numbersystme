import type { Base } from '../algorithms/types'
import { BASE_STYLES } from '../utils/baseStyle'

interface Props {
  label: string
  value: Base
  onChange: (b: Base) => void
  exclude?: Base
}

const BASES: Base[] = [2, 8, 10, 16]

export function BaseSelector({ label, value, onChange, exclude }: Props) {
  return (
    <div className="w-full">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
        {label}
      </span>
      <div className="grid grid-cols-4 gap-1.5 rounded-2xl border p-1" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
        {BASES.map((b) => {
          const style = BASE_STYLES[b]
          const isSelected = b === value
          const isExcluded = b === exclude

          return (
            <button
              key={b}
              type="button"
              disabled={isExcluded}
              onClick={() => onChange(b)}
              className="glow-ring flex flex-col items-center justify-center rounded-xl py-2 px-1 text-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: isSelected ? style.varName : 'transparent',
                color: isSelected ? '#ffffff' : 'var(--ink)',
                boxShadow: isSelected ? `0 2px 10px color-mix(in srgb, ${style.varName} 40%, transparent)` : 'none',
              }}
            >
              <span className="font-semibold text-xs sm:text-sm leading-tight">{style.name}</span>
              <span className="font-mono-num text-[11px] opacity-85">Base {b}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
