import { useState } from 'react'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import type { ConversionResult } from '../algorithms/types'
import { METHOD_INFO } from '../algorithms'
import { PositionalExpansion } from './PositionalExpansion'
import { DivisionTable } from './DivisionTable'
import { BinaryGrouping } from './BinaryGrouping'
import { DigitExpansion } from './DigitExpansion'
import { ChainBridge } from './ChainBridge'

interface Props {
  result: ConversionResult
}

export function StepByStepSolution({ result }: Props) {
  // Calculate total number of animation/revealed steps
  const totalSteps = (() => {
    switch (result.method) {
      case 'positional-expansion':
        return result.steps.length
      case 'repeated-division':
        return result.steps.length + (result.fractionSteps?.length ?? 0)
      case 'binary-grouping':
        return result.groups.length
      case 'digit-expansion':
        return result.steps.length
      case 'binary-bridge':
        return result.toBinary.steps.length + result.fromBinary.groups.length
    }
  })()

  // Default to showing all steps, while allowing step-by-step navigation
  const [activeStep, setActiveStep] = useState<number>(totalSteps - 1)
  const isShowingAll = activeStep === totalSteps - 1

  function handlePrev() {
    setActiveStep((prev) => Math.max(0, prev - 1))
  }

  function handleNext() {
    setActiveStep((prev) => Math.min(totalSteps - 1, prev + 1))
  }

  function handleShowAll() {
    setActiveStep(totalSteps - 1)
  }

  const methodInfo = METHOD_INFO[result.method]

  return (
    <div className="glass rounded-3xl p-5 sm:p-6 shadow-sm border" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b pb-4" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
        <div>
          <h2 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2">
            Step-by-Step Mathematical Solution
          </h2>
          <p className="text-xs text-[var(--ink-soft)]">
            Derived using pure arithmetic algorithms — no built-in conversion shortcuts
          </p>
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={activeStep === 0}
            className="glow-ring flex h-8 w-8 items-center justify-center rounded-full border transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--accent)]"
            style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}
            aria-label="Previous step"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="font-mono-num text-xs px-2 text-[var(--ink-soft)] font-medium">
            Step {activeStep + 1} of {totalSteps}
          </span>

          <button
            type="button"
            onClick={handleNext}
            disabled={activeStep === totalSteps - 1}
            className="glow-ring flex h-8 w-8 items-center justify-center rounded-full border transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--accent)]"
            style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}
            aria-label="Next step"
          >
            <ChevronRight size={16} />
          </button>

          {!isShowingAll && (
            <button
              type="button"
              onClick={handleShowAll}
              className="glow-ring ml-1 flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium text-[var(--ink-soft)] transition-colors hover:text-[var(--accent)] hover:border-[var(--accent)]"
              style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}
            >
              <Eye size={12} /> Show All
            </button>
          )}
        </div>
      </div>

      {/* Render Solution Body according to Method */}
      {result.method === 'positional-expansion' && (
        <PositionalExpansion data={result} activeStep={activeStep} />
      )}
      {result.method === 'repeated-division' && (
        <DivisionTable data={result} activeStep={activeStep} />
      )}
      {result.method === 'binary-grouping' && (
        <BinaryGrouping data={result} activeStep={activeStep} />
      )}
      {result.method === 'digit-expansion' && (
        <DigitExpansion data={result} activeStep={activeStep} />
      )}
      {result.method === 'binary-bridge' && (
        <ChainBridge data={result} activeStep={activeStep} />
      )}
    </div>
  )
}
