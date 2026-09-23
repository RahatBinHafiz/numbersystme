import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftRight, CheckCircle2, ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Shuffle, Sparkles, Plus, Minus } from 'lucide-react'
import { addInBase, type SummationResult } from '../algorithms/summation'
import { negateInBase } from '../algorithms/negation'
import type { Base } from '../algorithms/types'
import { BASE_STYLES } from '../utils/baseStyle'
import { validateInput } from '../utils/validation'

interface Props {
  initialBase?: Base
  initialA?: string
  initialB?: string
  onSwitchToLab?: (val: string, base: Base) => void
  onSwitchToNegation?: (val: string, base: Base) => void
}

const BASES: Base[] = [2, 8, 10, 16]

const SAMPLE_PAIRS: Record<Base, { a: string; b: string; desc: string }[]> = {
  2: [
    { a: '101101', b: '1101', desc: '45 + 13 = 58 with multiple carries' },
    { a: '101.11', b: '10.011', desc: 'Fractional binary addition (5.75 + 2.375)' },
    { a: '1111', b: '0001', desc: 'Full ripple carry: 15 + 1 = 16 (10000₂)' },
    { a: '110110', b: '101101', desc: 'Standard 6-bit digital adder test' },
  ],
  8: [
    { a: '55', b: '23', desc: '55₈ + 23₈ = 100₈ (45 + 19 = 64₁₀)' },
    { a: '12.4', b: '5.6', desc: 'Fractional octal: 12.4₈ + 5.6₈ = 20.2₈' },
    { a: '77', b: '1', desc: 'Octal carry cascade: 77₈ + 1₈ = 100₈' },
    { a: '157', b: '64', desc: 'Multi-digit octal arithmetic' },
  ],
  10: [
    { a: '45', b: '55', desc: 'Standard decimal boundary: 45 + 55 = 100' },
    { a: '12.75', b: '8.5', desc: 'Fractional decimal: 12.75 + 8.5 = 21.25' },
    { a: '999', b: '1', desc: 'Decimal carry ripple: 999 + 1 = 1000' },
    { a: '378', b: '465', desc: 'Multi-column carries' },
  ],
  16: [
    { a: '2D', b: '1F', desc: '2D₁₆ + 1F₁₆ = 4C₁₆ (45 + 31 = 76₁₀)' },
    { a: 'A.8', b: '2.C', desc: 'Fractional hex: A.8₁₆ + 2.C₁₆ = D.4₁₆' },
    { a: 'FF', b: '1', desc: 'Byte overflow boundary: FF₁₆ + 1₁₆ = 100₁₆' },
    { a: '3C8', b: 'A5E', desc: 'Hexadecimal memory addressing sum' },
  ],
}

export function SummationPanel({
  initialBase = 2,
  initialA = '101101',
  initialB = '1101',
  onSwitchToLab,
  onSwitchToNegation,
}: Props) {
  const [base, setBase] = useState<Base>(initialBase)
  const [opA, setOpA] = useState<string>(initialA)
  const [opB, setOpB] = useState<string>(initialB)
  const [isSubtractionMode, setIsSubtractionMode] = useState<boolean>(false)
  const [activeStep, setActiveStep] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const baseStyle = BASE_STYLES[base]

  // Validate inputs
  const validationA = useMemo(() => validateInput(opA, base), [opA, base])
  const validationB = useMemo(() => validateInput(opB, base), [opB, base])
  const isValid = validationA.valid && validationB.valid

  // Compute addition or subtraction-via-complement
  const effectiveB = useMemo(() => {
    if (!isSubtractionMode || !validationB.valid) return opB
    try {
      const neg = negateInBase(opB, base)
      return neg.radixComplementResult
    } catch {
      return opB
    }
  }, [isSubtractionMode, opB, base, validationB.valid])

  const summationResult = useMemo<SummationResult | null>(() => {
    if (!isValid) return null
    try {
      return addInBase(opA, effectiveB, base)
    } catch {
      return null
    }
  }, [opA, effectiveB, base, isValid])

  const totalSteps = summationResult ? summationResult.columns.length : 0

  // Reset step to end on input/base changes
  useEffect(() => {
    if (summationResult) {
      setActiveStep(summationResult.columns.length - 1)
      setIsPlaying(false)
    }
  }, [opA, effectiveB, base])

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setActiveStep((curr) => {
        if (curr >= totalSteps - 1) {
          setIsPlaying(false)
          return curr
        }
        return curr + 1
      })
    }, 1100)
    return () => clearInterval(timer)
  }, [isPlaying, totalSteps])

  function handleSwap() {
    setOpA(opB)
    setOpB(opA)
  }

  function handleRandomExample() {
    const list = SAMPLE_PAIRS[base]
    const pick = list[Math.floor(Math.random() * list.length)]
    setOpA(pick.a)
    setOpB(pick.b)
  }

  // Active column being computed in the current step
  const activeColumn = summationResult && activeStep >= 0 && activeStep < totalSteps
    ? summationResult.columns[activeStep]
    : null

  return (
    <div className="space-y-6">
      {/* Base Selection and Mode Bar */}
      <div className="glass rounded-3xl border p-4 sm:p-6" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight">
              Base Summation & Column Addition
            </h2>
            <p className="text-xs text-[var(--ink-soft)] mt-0.5">
              Perform direct arithmetic addition with carries in any positional number system.
            </p>
          </div>

          {/* Base selector pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl border" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))', background: 'color-mix(in srgb, var(--surface) 60%, transparent)' }}>
            {BASES.map((b) => {
              const bStyle = BASE_STYLES[b]
              const isSelected = b === base
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    setBase(b)
                    const sample = SAMPLE_PAIRS[b][0]
                    setOpA(sample.a)
                    setOpB(sample.b)
                  }}
                  className="rounded-xl px-3 py-1.5 text-xs font-semibold transition-all"
                  style={{
                    background: isSelected ? bStyle.varName : 'transparent',
                    color: isSelected ? '#ffffff' : 'var(--ink-soft)',
                    boxShadow: isSelected ? `0 2px 8px color-mix(in srgb, ${bStyle.varName} 30%, transparent)` : 'none',
                  }}
                >
                  {bStyle.name} ({b})
                </button>
              )
            })}
          </div>
        </div>

        {/* Operation Mode Toggle: Standard Addition vs Subtraction via Complement */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSubtractionMode(false)}
              className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                borderColor: !isSubtractionMode ? baseStyle.varName : 'rgb(var(--border) / var(--border-alpha))',
                background: !isSubtractionMode ? `color-mix(in srgb, ${baseStyle.varName} 15%, transparent)` : 'transparent',
                color: !isSubtractionMode ? baseStyle.varName : 'var(--ink-soft)',
              }}
            >
              <Plus size={14} />
              <span>Standard Addition (A + B)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSubtractionMode(true)}
              className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                borderColor: isSubtractionMode ? baseStyle.varName : 'rgb(var(--border) / var(--border-alpha))',
                background: isSubtractionMode ? `color-mix(in srgb, ${baseStyle.varName} 15%, transparent)` : 'transparent',
                color: isSubtractionMode ? baseStyle.varName : 'var(--ink-soft)',
              }}
            >
              <Minus size={14} />
              <span>Subtraction via Radix Complement (A - B)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleRandomExample}
            className="flex items-center gap-1 text-xs text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
          >
            <Shuffle size={13} />
            <span>Random Example</span>
          </button>
        </div>

        {/* Inputs for Operand A and Operand B */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr]">
          {/* Operand A */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[var(--ink-soft)]">
              <span className="font-semibold uppercase tracking-wider">Operand A</span>
              <span>Base {base} ({baseStyle.name})</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={opA}
                onChange={(e) => setOpA(e.target.value.toUpperCase())}
                placeholder={baseStyle.placeholder}
                className="font-mono-num w-full rounded-2xl border px-4 py-3 text-lg font-bold tracking-wider outline-none transition-all"
                style={{
                  borderColor: !validationA.valid ? '#ef4444' : 'rgb(var(--border) / var(--border-alpha))',
                  background: 'color-mix(in srgb, var(--surface) 60%, transparent)',
                  color: 'var(--ink)',
                }}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold"
                style={{ color: baseStyle.varName }}
              >
                {baseStyle.subscript}
              </span>
            </div>
            {!validationA.valid && (
              <p className="text-xs text-red-500">{validationA.message}</p>
            )}
          </div>

          {/* Middle Swap Button */}
          <div className="flex items-center justify-center pt-2 sm:pt-6">
            <button
              type="button"
              onClick={handleSwap}
              title="Swap operands"
              className="glow-ring flex h-10 w-10 items-center justify-center rounded-2xl border transition-all hover:scale-105"
              style={{
                borderColor: 'rgb(var(--border) / var(--border-alpha))',
                background: 'color-mix(in srgb, var(--surface) 60%, transparent)',
                color: 'var(--ink-soft)',
              }}
            >
              <ArrowLeftRight size={16} />
            </button>
          </div>

          {/* Operand B */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[var(--ink-soft)]">
              <span className="font-semibold uppercase tracking-wider">Operand B</span>
              {isSubtractionMode && (
                <span className="text-[11px] font-medium" style={{ color: baseStyle.varName }}>
                  Subtracted via complement
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                value={opB}
                onChange={(e) => setOpB(e.target.value.toUpperCase())}
                placeholder={baseStyle.placeholder}
                className="font-mono-num w-full rounded-2xl border px-4 py-3 text-lg font-bold tracking-wider outline-none transition-all"
                style={{
                  borderColor: !validationB.valid ? '#ef4444' : 'rgb(var(--border) / var(--border-alpha))',
                  background: 'color-mix(in srgb, var(--surface) 60%, transparent)',
                  color: 'var(--ink)',
                }}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold"
                style={{ color: baseStyle.varName }}
              >
                {baseStyle.subscript}
              </span>
            </div>
            {!validationB.valid && (
              <p className="text-xs text-red-500">{validationB.message}</p>
            )}
          </div>
        </div>

        {isSubtractionMode && validationB.valid && (
          <div className="mt-3 rounded-2xl border p-3 text-xs bg-[color-mix(in_srgb,var(--surface)_50%,transparent)]" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
            <span className="font-semibold text-[var(--ink)]">Hardware Complement Subtraction:</span>{' '}
            <span className="text-[var(--ink-soft)]">
              Computing <span className="font-mono">{opA}{baseStyle.subscript} - {opB}{baseStyle.subscript}</span> is transformed into{' '}
              <span className="font-mono">{opA}{baseStyle.subscript} + ({effectiveB}{baseStyle.subscript})</span> using the radix complement of {opB}.
            </span>
          </div>
        )}
      </div>

      {/* Main Solution & Visualizer */}
      {summationResult && (
        <div className="space-y-6">
          {/* Quick Result Summary Card */}
          <div
            className="rounded-3xl border p-5 sm:p-6 transition-all"
            style={{
              borderColor: `color-mix(in srgb, ${baseStyle.varName} 40%, transparent)`,
              background: `linear-gradient(135deg, color-mix(in srgb, ${baseStyle.varName} 10%, transparent) 0%, color-mix(in srgb, var(--surface) 80%, transparent) 100%)`,
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]">
                  {isSubtractionMode ? 'Difference in Base' : 'Sum in Base'} {base} ({baseStyle.name})
                </span>
                <div className="font-mono-num flex flex-wrap items-baseline gap-2 mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight">
                  <span>{opA}{baseStyle.subscript}</span>
                  <span className="text-[var(--ink-soft)]">{isSubtractionMode ? '-' : '+'}</span>
                  <span>{opB}{baseStyle.subscript}</span>
                  <span className="text-[var(--ink-soft)]">=</span>
                  <span style={{ color: baseStyle.varName }}>
                    {summationResult.result}{baseStyle.subscript}
                  </span>
                </div>
              </div>

              {/* Decimal Verification Check */}
              <div className="flex items-center gap-2 rounded-2xl border p-3 text-xs bg-[color-mix(in_srgb,var(--surface)_70%,transparent)]" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <div>
                  <div className="font-semibold text-[var(--ink)]">Decimal Verification</div>
                  <div className="font-mono-num text-[var(--ink-soft)]">
                    {summationResult.decimalA} + {summationResult.decimalB} = {summationResult.decimalSum}₁₀
                  </div>
                </div>
              </div>
            </div>

            {/* Quick jump to lab/negation buttons */}
            <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
              {onSwitchToLab && (
                <button
                  type="button"
                  onClick={() => onSwitchToLab(summationResult.result, base)}
                  className="rounded-xl border px-3 py-1 text-xs font-medium text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                  style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}
                >
                  Convert Result ({summationResult.result}) in Converter Lab →
                </button>
              )}
              {onSwitchToNegation && (
                <button
                  type="button"
                  onClick={() => onSwitchToNegation(summationResult.result, base)}
                  className="rounded-xl border px-3 py-1 text-xs font-medium text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                  style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}
                >
                  Explore Negation of {summationResult.result} →
                </button>
              )}
            </div>
          </div>

          {/* Interactive Step-by-Step Column Addition Visualizer */}
          <div className="glass rounded-3xl border p-5 sm:p-6" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
            {/* Header and Step Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display text-base font-bold flex items-center gap-2">
                  <Sparkles size={16} style={{ color: baseStyle.varName }} />
                  Step-by-Step Column Addition
                </h3>
                <p className="text-xs text-[var(--ink-soft)] mt-0.5">
                  Calculating from right to left (least significant position to most significant).
                </p>
              </div>

              {/* Playback Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveStep(0)}
                  disabled={activeStep === 0}
                  className="glow-ring flex h-8 w-8 items-center justify-center rounded-xl border text-xs text-[var(--ink-soft)] hover:text-[var(--ink)] disabled:opacity-30"
                  style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}
                  title="Reset to first step"
                >
                  <RotateCcw size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                  disabled={activeStep === 0}
                  className="glow-ring flex h-8 w-8 items-center justify-center rounded-xl border text-xs text-[var(--ink-soft)] hover:text-[var(--ink)] disabled:opacity-30"
                  style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}
                  title="Previous column"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  className="glow-ring flex items-center gap-1.5 rounded-xl border px-3 h-8 text-xs font-semibold text-white transition-all"
                  style={{ background: baseStyle.varName, borderColor: baseStyle.varName }}
                >
                  {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                  <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep((s) => Math.min(totalSteps - 1, s + 1))}
                  disabled={activeStep === totalSteps - 1}
                  className="glow-ring flex h-8 w-8 items-center justify-center rounded-xl border text-xs text-[var(--ink-soft)] hover:text-[var(--ink)] disabled:opacity-30"
                  style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}
                  title="Next column"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Column Addition Grid */}
            <div className="overflow-x-auto pb-4">
              <div className="inline-block min-w-full">
                <div className="flex flex-col items-end gap-1.5 font-mono text-lg sm:text-xl font-bold">
                  {/* Position Exponents Row */}
                  <div className="flex items-center gap-2 pb-1 text-[11px] text-[var(--ink-soft)] font-sans border-b w-full justify-end" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
                    <span className="mr-auto text-xs uppercase font-semibold">Place Value</span>
                    {summationResult.displayColumns.map((col) => (
                      <span key={col.id} className="w-10 sm:w-12 text-center">
                        {base}<sup>{col.position}</sup>
                      </span>
                    ))}
                  </div>

                  {/* Carries Row */}
                  <div className="flex items-center gap-2 text-xs py-1 w-full justify-end">
                    <span className="mr-auto text-[11px] uppercase tracking-wider font-semibold text-[var(--ink-soft)]">
                      Carry
                    </span>
                    {summationResult.displayColumns.map((col) => {
                      // Carry is visible if the step that produced it has completed
                      const stepIndex = summationResult.columns.findIndex((c) => c.id === col.id)
                      const isCarryActive = stepIndex === activeStep && col.carryIn > 0
                      const showCarry = col.carryIn > 0 && stepIndex <= activeStep

                      return (
                        <div key={`carry-${col.id}`} className="w-10 sm:w-12 flex justify-center">
                          {showCarry ? (
                            <span
                              className="flex h-6 w-6 items-center justify-center rounded-md font-bold text-xs shadow-sm transition-all"
                              style={{
                                background: isCarryActive
                                  ? baseStyle.varName
                                  : `color-mix(in srgb, ${baseStyle.varName} 20%, transparent)`,
                                color: isCarryActive ? '#ffffff' : baseStyle.varName,
                                border: `1px solid ${baseStyle.varName}`,
                              }}
                            >
                              {col.carryIn}
                            </span>
                          ) : (
                            <span className="h-6 w-6" />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Operand A Row */}
                  <div className="flex items-center gap-2 py-1 w-full justify-end">
                    <span className="mr-auto text-xs uppercase font-semibold text-[var(--ink-soft)]">
                      A
                    </span>
                    {summationResult.displayColumns.map((col) => {
                      const isColActive = activeColumn?.id === col.id
                      return (
                        <span
                          key={`a-${col.id}`}
                          className="w-10 sm:w-12 h-10 flex items-center justify-center rounded-xl transition-all"
                          style={{
                            background: isColActive
                              ? `color-mix(in srgb, ${baseStyle.varName} 15%, transparent)`
                              : 'transparent',
                            color: isColActive ? baseStyle.varName : 'var(--ink)',
                          }}
                        >
                          {col.digitA}
                        </span>
                      )
                    })}
                  </div>

                  {/* Operand B Row */}
                  <div className="flex items-center gap-2 py-1 w-full justify-end border-b-2" style={{ borderColor: baseStyle.varName }}>
                    <span className="mr-auto flex items-center gap-1.5 text-xs uppercase font-semibold text-[var(--ink-soft)]">
                      <span className="text-base font-extrabold" style={{ color: baseStyle.varName }}>
                        {isSubtractionMode ? '−' : '+'}
                      </span>
                      <span>B</span>
                    </span>
                    {summationResult.displayColumns.map((col) => {
                      const isColActive = activeColumn?.id === col.id
                      return (
                        <span
                          key={`b-${col.id}`}
                          className="w-10 sm:w-12 h-10 flex items-center justify-center rounded-xl transition-all"
                          style={{
                            background: isColActive
                              ? `color-mix(in srgb, ${baseStyle.varName} 15%, transparent)`
                              : 'transparent',
                            color: isColActive ? baseStyle.varName : 'var(--ink)',
                          }}
                        >
                          {col.digitB}
                        </span>
                      )
                    })}
                  </div>

                  {/* Result Row */}
                  <div className="flex items-center gap-2 pt-2 w-full justify-end">
                    <span className="mr-auto text-xs uppercase font-semibold" style={{ color: baseStyle.varName }}>
                      Sum
                    </span>
                    {summationResult.displayColumns.map((col) => {
                      const stepIndex = summationResult.columns.findIndex((c) => c.id === col.id)
                      const isCalculated = stepIndex <= activeStep
                      const isCurrent = stepIndex === activeStep

                      return (
                        <span
                          key={`res-${col.id}`}
                          className="w-10 sm:w-12 h-11 flex items-center justify-center rounded-xl font-extrabold text-xl shadow-sm transition-all"
                          style={{
                            background: isCurrent
                              ? baseStyle.varName
                              : isCalculated
                              ? `color-mix(in srgb, ${baseStyle.varName} 20%, transparent)`
                              : 'color-mix(in srgb, var(--surface) 40%, transparent)',
                            color: isCurrent ? '#ffffff' : isCalculated ? baseStyle.varName : 'transparent',
                            border: `1px solid ${isCalculated ? baseStyle.varName : 'rgb(var(--border) / var(--border-alpha))'}`,
                          }}
                        >
                          {isCalculated ? col.resultDigit : '·'}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Step Explanation Callout */}
            <AnimatePresence mode="wait">
              {activeColumn && (
                <motion.div
                  key={activeColumn.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 rounded-2xl border p-4 transition-all"
                  style={{
                    borderColor: `color-mix(in srgb, ${baseStyle.varName} 40%, transparent)`,
                    background: `color-mix(in srgb, ${baseStyle.varName} 8%, var(--surface))`,
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded-lg px-2 py-0.5 text-xs font-bold text-white"
                        style={{ background: baseStyle.varName }}
                      >
                        Step {activeColumn.stepNumber} of {totalSteps}
                      </span>
                      <span className="text-xs font-semibold text-[var(--ink)]">
                        Column Position: {activeColumn.position} (Place Value {base}<sup>{activeColumn.position}</sup> = {Math.pow(base, activeColumn.position)})
                      </span>
                    </div>

                    <span className="text-xs font-mono text-[var(--ink-soft)]">
                      Carry In: {activeColumn.carryIn} → Carry Out: {activeColumn.carryOut}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-[var(--ink)] leading-relaxed">
                    {activeColumn.explanation}
                  </p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-[var(--ink-soft)] pt-2 border-t" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
                    <span>Digit A: <strong className="text-[var(--ink)]">{activeColumn.digitA}</strong> ({activeColumn.valA})</span>
                    <span>•</span>
                    <span>Digit B: <strong className="text-[var(--ink)]">{activeColumn.digitB}</strong> ({activeColumn.valB})</span>
                    <span>•</span>
                    <span>Raw Sum: <strong className="text-[var(--ink)]">{activeColumn.rawSum}₁₀</strong></span>
                    <span>•</span>
                    <span>Result Digit: <strong style={{ color: baseStyle.varName }}>"{activeColumn.resultDigit}"</strong></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}
