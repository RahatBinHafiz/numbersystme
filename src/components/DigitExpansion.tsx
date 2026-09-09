import { motion } from 'framer-motion'
import type { DigitExpansionResult } from '../algorithms/types'
import { BASE_STYLES } from '../utils/baseStyle'

interface Props {
  data: DigitExpansionResult
  activeStep: number
}

export function DigitExpansion({ data, activeStep }: Props) {
  const fromStyle = BASE_STYLES[data.fromBase]

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
          Expand each {fromStyle.name} digit into exactly {data.bitsPerDigit} binary bits
        </p>

        <div className="flex flex-wrap gap-4">
          {data.steps.map((step, i) => {
            const isActive = i <= activeStep
            const isCurrent = i === activeStep

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: isActive ? 1 : 0.35, scale: 1 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className="flex flex-col items-center rounded-2xl border p-3 transition-all"
                style={{
                  borderColor: isCurrent ? fromStyle.varName : 'rgb(var(--border) / var(--border-alpha))',
                  background: isCurrent
                    ? `color-mix(in srgb, ${fromStyle.varName} 10%, var(--surface))`
                    : 'color-mix(in srgb, var(--surface) 50%, transparent)',
                  boxShadow: isCurrent ? `0 0 12px color-mix(in srgb, ${fromStyle.varName} 20%, transparent)` : 'none',
                }}
              >
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-soft)] mb-1">
                  Digit {i + 1}
                </div>

                <div
                  className="font-mono-num flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold shadow-sm"
                  style={{ background: fromStyle.varName, color: '#ffffff' }}
                >
                  {step.digit}
                </div>

                <span className="my-1.5 text-xs text-[var(--ink-soft)] font-bold">↓</span>

                <div
                  className="font-mono-num flex gap-1 rounded-xl border p-1.5"
                  style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}
                >
                  {step.bits.split('').map((bit, j) => (
                    <span
                      key={j}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
                      style={{
                        background: `color-mix(in srgb, ${fromStyle.varName} ${bit === '1' ? 24 : 8}%, transparent)`,
                        color: bit === '1' ? fromStyle.varName : 'var(--ink-soft)',
                      }}
                    >
                      {bit}
                    </span>
                  ))}
                </div>

                <div className="mt-2 text-[10px] text-[var(--ink-soft)] font-mono text-center">
                  {step.digit}{fromStyle.subscript} → {step.bits}₂
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl p-4 border space-y-2 bg-[color-mix(in_srgb,var(--surface)_60%,transparent)]" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
        <p className="font-mono-num text-sm sm:text-base text-[var(--ink-soft)]">
          Raw concatenation:{' '}
          <span className="font-semibold text-[var(--ink)] tracking-wider">
            {data.steps.map((s) => s.bits).join(' ')}₂
          </span>
        </p>

        {data.fullBits !== data.result && (
          <p className="text-xs text-[var(--ink-soft)]">
            Trim leading zeros: <span className="line-through opacity-60">{data.fullBits}₂</span> →{' '}
            <span className="font-mono-num font-bold text-sm text-[var(--base-binary)]">{data.result}₂</span>
          </p>
        )}

        <p className="font-mono-num text-base sm:text-lg pt-1">
          Therefore <span className="text-[var(--ink-soft)]">{data.input}{fromStyle.subscript} =</span>{' '}
          <span className="font-bold text-xl" style={{ color: 'var(--base-binary)' }}>
            {data.result}₂
          </span>
        </p>
      </div>
    </div>
  )
}
