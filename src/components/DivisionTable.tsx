import { motion } from 'framer-motion'
import type { DivisionResult } from '../algorithms/types'
import { BASE_STYLES } from '../utils/baseStyle'

interface Props {
  data: DivisionResult
  activeStep: number
}

export function DivisionTable({ data, activeStep }: Props) {
  const toStyle = BASE_STYLES[data.toBase]
  const intStepsCount = data.steps.length
  const fracSteps = data.fractionSteps ?? []
  const hasFraction = Boolean(data.hasFraction && fracSteps.length > 0)
  const lastIndex = data.steps.length - 1

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
            {hasFraction ? 'Part 1: Integer Repeated Division' : 'Repeated Integer Division'} by {data.toBase} ({toStyle.name})
          </p>
          <span className="text-xs text-[var(--ink-soft)]">
            Step {Math.min(activeStep + 1, intStepsCount)} of {intStepsCount}
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))', background: 'color-mix(in srgb, var(--surface) 60%, transparent)' }}>
          <table className="font-mono-num w-full min-w-[360px] text-sm sm:text-base">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-[var(--ink-soft)]" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
                <th className="px-4 py-3">Division Operation</th>
                <th className="px-4 py-3">Quotient</th>
                <th className="px-4 py-3">Remainder</th>
                <th className="px-4 py-3">Digit / Role</th>
              </tr>
            </thead>
            <tbody>
              {data.steps.map((step, i) => {
                const isVisible = i <= activeStep
                const isCurrent = i === activeStep

                return (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isVisible ? 1 : 0.25 }}
                    transition={{ duration: 0.2 }}
                    className="border-t transition-colors"
                    style={{
                      borderColor: 'rgb(var(--border) / var(--border-alpha))',
                      background: isCurrent ? `color-mix(in srgb, ${toStyle.varName} 10%, transparent)` : 'transparent',
                    }}
                  >
                    <td className="px-4 py-3">
                      {step.dividend} ÷ {step.divisor}
                    </td>
                    <td className="px-4 py-3 font-medium">{step.quotient}</td>
                    <td className="px-4 py-3 font-bold text-base" style={{ color: toStyle.varName }}>
                      {step.remainder}
                      {data.toBase === 16 && step.remainder >= 10 && (
                        <span className="text-xs opacity-75 font-normal ml-1.5">→ {step.remainderDigit}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base" style={{ color: toStyle.varName }}>
                          {step.remainderDigit}
                        </span>
                        {i === 0 && (
                          <span
                            className="rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                            style={{ borderColor: toStyle.varName, color: toStyle.varName }}
                          >
                            LSB ↓ (First)
                          </span>
                        )}
                        {i === lastIndex && i !== 0 && (
                          <span
                            className="rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                            style={{ borderColor: toStyle.varName, color: toStyle.varName }}
                          >
                            MSB ↑ (Last)
                          </span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl p-4 border bg-[color-mix(in_srgb,var(--surface)_70%,transparent)]" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
          Read Integer Remainders: Bottom → Top (MSB to LSB)
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[var(--ink-soft)] font-medium">Integer portion:</span>
          {data.steps
            .slice(0, Math.min(activeStep + 1, intStepsCount))
            .slice()
            .reverse()
            .map((step, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className="font-mono-num flex h-9 w-9 items-center justify-center rounded-xl border text-base font-bold shadow-sm"
                style={{
                  borderColor: toStyle.varName,
                  color: toStyle.varName,
                  background: `color-mix(in srgb, ${toStyle.varName} 12%, transparent)`,
                }}
              >
                {step.remainderDigit}
              </motion.span>
            ))}
          <span className="font-bold text-sm ml-1" style={{ color: toStyle.varName }}>
            = {data.integerResult ?? data.result}{toStyle.subscript}
          </span>
        </div>
      </div>

      {/* Fractional Part: Repeated Multiplication */}
      {hasFraction && (
        <div className="space-y-4 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
                Part 2: Fractional Repeated Multiplication by {data.toBase} ({toStyle.name})
              </p>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">
                Multiply the fractional part by {data.toBase}, extract the integer digit, and repeat with the remainder.
              </p>
            </div>
            <span className="text-xs text-[var(--ink-soft)]">
              Read Top → Bottom (MSB to LSB)
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))', background: 'color-mix(in srgb, var(--surface) 60%, transparent)' }}>
            <table className="font-mono-num w-full min-w-[380px] text-sm sm:text-base">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-[var(--ink-soft)]" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
                  <th className="px-4 py-3">Multiplication Operation</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Extracted Digit</th>
                  <th className="px-4 py-3">Remaining Fraction</th>
                </tr>
              </thead>
              <tbody>
                {fracSteps.map((fStep, j) => {
                  const stepIndex = intStepsCount + j
                  const isVisible = stepIndex <= activeStep
                  const isCurrent = stepIndex === activeStep

                  return (
                    <motion.tr
                      key={j}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isVisible ? 1 : 0.3 }}
                      transition={{ duration: 0.2 }}
                      className="border-t transition-colors"
                      style={{
                        borderColor: 'rgb(var(--border) / var(--border-alpha))',
                        background: isCurrent ? `color-mix(in srgb, ${toStyle.varName} 10%, transparent)` : 'transparent',
                      }}
                    >
                      <td className="px-4 py-3 font-medium">
                        0.{String(fStep.fraction).split('.')[1] || '0'} × {fStep.base}
                      </td>
                      <td className="px-4 py-3">
                        {parseFloat(fStep.product.toFixed(6))}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base" style={{ color: toStyle.varName }}>
                            {fStep.digit}
                          </span>
                          {j === 0 && (
                            <span
                              className="rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                              style={{ borderColor: toStyle.varName, color: toStyle.varName }}
                            >
                              MSB ↓ (First)
                            </span>
                          )}
                          {j === fracSteps.length - 1 && (
                            <span
                              className="rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                              style={{ borderColor: toStyle.varName, color: toStyle.varName }}
                            >
                              LSB
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[var(--ink-soft)]">
                        {fStep.remainingFraction > 0 ? parseFloat(fStep.remainingFraction.toFixed(6)) : '0 (terminates)'}
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl p-4 border bg-[color-mix(in_srgb,var(--surface)_70%,transparent)]" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
              Read Fractional Digits: Top → Bottom
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[var(--ink-soft)] font-medium">Fractional portion:</span>
              <span className="font-bold text-lg text-[var(--ink-soft)]">.</span>
              {fracSteps
                .filter((_, idx) => intStepsCount + idx <= activeStep)
                .map((step, k) => (
                  <motion.span
                    key={k}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: k * 0.03 }}
                    className="font-mono-num flex h-9 w-9 items-center justify-center rounded-xl border text-base font-bold shadow-sm"
                    style={{
                      borderColor: toStyle.varName,
                      color: toStyle.varName,
                      background: `color-mix(in srgb, ${toStyle.varName} 12%, transparent)`,
                    }}
                  >
                    {step.digit}
                  </motion.span>
                ))}
              <span className="font-bold text-sm ml-1" style={{ color: toStyle.varName }}>
                = 0.{data.fractionResult}{toStyle.subscript}
              </span>
            </div>
          </div>
        </div>
      )}

      <p className="font-mono-num text-base sm:text-lg">
        Therefore <span className="text-[var(--ink-soft)]">{data.input}₁₀ =</span>{' '}
        <span className="font-bold text-xl" style={{ color: toStyle.varName }}>
          {data.result}
          {toStyle.subscript}
        </span>
      </p>
    </div>
  )
}
