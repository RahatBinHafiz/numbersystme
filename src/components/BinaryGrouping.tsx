import { motion } from 'framer-motion'
import type { GroupingResult } from '../algorithms/types'
import { BASE_STYLES } from '../utils/baseStyle'

interface Props {
  data: GroupingResult
  activeStep: number
}

export function BinaryGrouping({ data, activeStep }: Props) {
  const toStyle = BASE_STYLES[data.toBase]
  const intGroups = data.groups.filter((g) => !g.isFraction)
  const fracGroups = data.groups.filter((g) => g.isFraction)
  const hasFraction = data.hasFraction && fracGroups.length > 0
  const padded = data.paddedInput !== (data.input.split('.')[0] || '')
  const padCount = data.paddedInput.length - (data.input.split('.')[0] || '').length

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
          Group Binary Digits into {data.groupSize}-bit clusters {hasFraction ? '(Integer: Right-to-Left, Fraction: Left-to-Right)' : '(Right to Left)'}
        </p>

        {padded && (
          <div className="mb-3 rounded-xl p-3 border text-xs text-[var(--ink-soft)] bg-[color-mix(in_srgb,var(--surface)_50%,transparent)]" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
            <span className="font-semibold text-[var(--ink)]">Zero-padding applied:</span> The integer portion was padded on the left with {padCount} zero{padCount > 1 ? 's' : ''} to complete {intGroups.length} full {data.groupSize}-bit group{intGroups.length > 1 ? 's' : ''}.
            <div className="font-mono-num mt-1 text-sm">
              <span className="font-bold" style={{ color: 'var(--accent)' }}>
                {data.paddedInput.slice(0, padCount)}
              </span>
              <span>{data.input.split('.')[0]}</span>
            </div>
          </div>
        )}

        {hasFraction && data.fractionPaddedInput && (
          <div className="mb-3 rounded-xl p-3 border text-xs text-[var(--ink-soft)] bg-[color-mix(in_srgb,var(--surface)_50%,transparent)]" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
            <span className="font-semibold text-[var(--ink)]">Fractional zero-padding:</span> The fractional portion was padded on the right with {data.fractionPaddedInput.length - (data.input.split('.')[1] || '').length} zero(s) to form full {data.groupSize}-bit group(s).
          </div>
        )}

        {/* Groups Display */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {intGroups.map((group, i) => {
            const isActive = i <= activeStep
            const isCurrent = i === activeStep

            return (
              <motion.div
                key={`int-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: isActive ? 1 : 0.35, scale: 1 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className="flex flex-col items-center rounded-2xl border p-3 transition-all"
                style={{
                  borderColor: isCurrent ? toStyle.varName : 'rgb(var(--border) / var(--border-alpha))',
                  background: isCurrent
                    ? `color-mix(in srgb, ${toStyle.varName} 10%, var(--surface))`
                    : 'color-mix(in srgb, var(--surface) 50%, transparent)',
                  boxShadow: isCurrent ? `0 0 12px color-mix(in srgb, ${toStyle.varName} 20%, transparent)` : 'none',
                }}
              >
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">
                  Group {i + 1}
                </div>

                <div className="font-mono-num flex gap-1 rounded-xl border p-1.5" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
                  {group.group.split('').map((bit, j) => (
                    <span
                      key={j}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
                      style={{
                        background: `color-mix(in srgb, ${toStyle.varName} ${bit === '1' ? 24 : 8}%, transparent)`,
                        color: bit === '1' ? toStyle.varName : 'var(--ink-soft)',
                      }}
                    >
                      {bit}
                    </span>
                  ))}
                </div>

                <span className="my-1.5 text-xs text-[var(--ink-soft)] font-bold">↓</span>

                <div
                  className="font-mono-num flex h-10 w-10 items-center justify-center rounded-xl text-lg font-extrabold shadow-sm"
                  style={{ background: toStyle.varName, color: '#ffffff' }}
                >
                  {group.digit}
                </div>

                <div className="mt-2 text-[10px] text-[var(--ink-soft)] font-mono text-center">
                  {group.group}₂ = {group.digit}{toStyle.subscript}
                </div>
              </motion.div>
            )
          })}

          {hasFraction && (
            <div className="flex flex-col items-center justify-center px-1">
              <span className="font-mono font-black text-3xl text-[var(--ink-soft)]">.</span>
              <span className="text-[10px] uppercase font-semibold text-[var(--ink-soft)] tracking-wider">Point</span>
            </div>
          )}

          {fracGroups.map((group, fIndex) => {
            const stepIndex = intGroups.length + fIndex
            const isActive = stepIndex <= activeStep
            const isCurrent = stepIndex === activeStep

            return (
              <motion.div
                key={`frac-${fIndex}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: isActive ? 1 : 0.35, scale: 1 }}
                transition={{ duration: 0.25, delay: fIndex * 0.05 }}
                className="flex flex-col items-center rounded-2xl border p-3 transition-all"
                style={{
                  borderColor: isCurrent ? toStyle.varName : 'rgb(var(--border) / var(--border-alpha))',
                  background: isCurrent
                    ? `color-mix(in srgb, ${toStyle.varName} 10%, var(--surface))`
                    : 'color-mix(in srgb, var(--surface) 50%, transparent)',
                  boxShadow: isCurrent ? `0 0 12px color-mix(in srgb, ${toStyle.varName} 20%, transparent)` : 'none',
                }}
              >
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-soft)] mb-1.5">
                  Frac {fIndex + 1}
                </div>

                <div className="font-mono-num flex gap-1 rounded-xl border p-1.5" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
                  {group.group.split('').map((bit, j) => (
                    <span
                      key={j}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
                      style={{
                        background: `color-mix(in srgb, ${toStyle.varName} ${bit === '1' ? 24 : 8}%, transparent)`,
                        color: bit === '1' ? toStyle.varName : 'var(--ink-soft)',
                      }}
                    >
                      {bit}
                    </span>
                  ))}
                </div>

                <span className="my-1.5 text-xs text-[var(--ink-soft)] font-bold">↓</span>

                <div
                  className="font-mono-num flex h-10 w-10 items-center justify-center rounded-xl text-lg font-extrabold shadow-sm"
                  style={{ background: toStyle.varName, color: '#ffffff' }}
                >
                  {group.digit}
                </div>

                <div className="mt-2 text-[10px] text-[var(--ink-soft)] font-mono text-center">
                  {group.group}₂ = {group.digit}{toStyle.subscript}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl p-4 border bg-[color-mix(in_srgb,var(--surface)_60%,transparent)]" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
        <p className="font-mono-num text-base sm:text-lg">
          Therefore <span className="text-[var(--ink-soft)]">{data.input}₂ =</span>{' '}
          <span className="font-bold text-xl" style={{ color: toStyle.varName }}>
            {data.result}
            {toStyle.subscript}
          </span>
        </p>
      </div>
    </div>
  )
}
