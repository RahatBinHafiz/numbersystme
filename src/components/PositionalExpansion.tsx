import { motion } from 'framer-motion'
import type { PositionalResult } from '../algorithms/types'
import { BASE_STYLES } from '../utils/baseStyle'

interface Props {
  data: PositionalResult
  activeStep: number
}

export function PositionalExpansion({ data, activeStep }: Props) {
  const fromStyle = BASE_STYLES[data.fromBase]
  const visibleSteps = data.steps.slice(0, activeStep + 1)
  const isHex = data.fromBase === 16

  return (
    <div className="space-y-6">
      {/* Textbook notation display */}
      <div className="rounded-2xl p-4 sm:p-5 border bg-[color-mix(in_srgb,var(--surface)_70%,transparent)]" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)] mb-3">
          Textbook Positional Formulation
        </p>
        <div className="font-mono-num space-y-2 text-sm sm:text-base leading-relaxed overflow-x-auto pb-1">
          <div className="font-semibold" style={{ color: fromStyle.varName }}>
            {data.input}{fromStyle.subscript}
          </div>
          <div className="text-[var(--ink-soft)]">
            ={' '}
            {data.steps.map((s, i) => (
              <span key={i} className={i <= activeStep ? 'font-semibold text-[var(--ink)]' : 'opacity-40'}>
                {s.term}
                {i < data.steps.length - 1 ? ' + ' : ''}
              </span>
            ))}
          </div>
          <div className="text-[var(--ink-soft)]">
            ={' '}
            {data.steps.map((s, i) => (
              <span key={i} className={i <= activeStep ? 'font-semibold text-[var(--ink)]' : 'opacity-40'}>
                {s.value}
                {i < data.steps.length - 1 ? ' + ' : ''}
              </span>
            ))}
          </div>
          <div className="font-bold text-base sm:text-lg pt-1" style={{ color: 'var(--base-decimal)' }}>
            = {data.result}₁₀
          </div>
        </div>
      </div>

      {/* Breakdown per digit with position and place value */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
          Positional Place-Value Breakdown ({fromStyle.name} powers)
        </p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
          {data.steps.map((step, i) => {
            const isActive = i <= activeStep
            const isCurrent = i === activeStep

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: isActive ? 1 : 0.4, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col rounded-2xl border p-3 transition-all"
                style={{
                  borderColor: isCurrent ? fromStyle.varName : 'rgb(var(--border) / var(--border-alpha))',
                  background: isCurrent
                    ? `color-mix(in srgb, ${fromStyle.varName} 10%, var(--surface))`
                    : 'color-mix(in srgb, var(--surface) 50%, transparent)',
                  boxShadow: isCurrent ? `0 0 12px color-mix(in srgb, ${fromStyle.varName} 20%, transparent)` : 'none',
                }}
              >
                <div className="flex items-center justify-between text-xs text-[var(--ink-soft)] mb-1">
                  <span>Position {step.position}</span>
                  <span className="font-mono">{fromStyle.name[0]}^{step.position}</span>
                </div>
                <div className="font-mono-num flex items-baseline gap-1 my-1">
                  <span className="text-xl font-bold" style={{ color: fromStyle.varName }}>
                    {step.digit}
                  </span>
                  {isHex && Number.isNaN(Number(step.digit)) && (
                    <span className="text-xs text-[var(--ink-soft)]">({step.expression.split(' ')[0]})</span>
                  )}
                  <span className="text-xs text-[var(--ink-soft)]">× {step.term.split('×')[1]}</span>
                </div>
                <div className="font-mono-num mt-auto pt-1 border-t text-sm font-semibold flex items-center justify-between" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
                  <span className="text-xs text-[var(--ink-soft)]">Value:</span>
                  <span style={{ color: 'var(--base-decimal)' }}>{step.value}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Summation banner */}
      <div className="rounded-2xl p-4 border" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))', background: 'color-mix(in srgb, var(--surface) 60%, transparent)' }}>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)] mb-1">
          Sum of all positional values
        </p>
        <p className="font-mono-num text-base sm:text-lg">
          {data.sumLine} = <span className="font-bold text-xl" style={{ color: 'var(--base-decimal)' }}>{data.result}₁₀</span>
        </p>
      </div>
    </div>
  )
}
