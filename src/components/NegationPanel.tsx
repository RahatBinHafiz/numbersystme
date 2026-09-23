import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowDown,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  Sparkles,
} from 'lucide-react'
import { negateInBase, type NegationResult } from '../algorithms/negation'
import type { Base } from '../algorithms/types'
import { BASE_STYLES } from '../utils/baseStyle'
import { validateInput } from '../utils/validation'

interface Props {
  initialBase?: Base
  initialInput?: string
  onSwitchToLab?: (val: string, base: Base) => void
  onSwitchToSummation?: (val: string, base: Base) => void
}

const BASES: Base[] = [2, 8, 10, 16]

const SAMPLE_VALUES: Record<Base, { val: string; desc: string }[]> = {
  2: [
    { val: '101', desc: '+5₁₀ in binary (converts to 11111011₂ in 8-bit two\'s complement)' },
    { val: '1', desc: '+1₁₀ in binary (converts to 11111111₂ = -1₁₀ in two\'s complement)' },
    { val: '101101', desc: '+45₁₀ in binary (11010011₂ in 8-bit two\'s complement)' },
    { val: '00000000', desc: 'Zero negation edge case' },
  ],
  8: [
    { val: '55', desc: '+55₈ (+45₁₀) in octal (7\'s and 8\'s complement)' },
    { val: '12', desc: '+12₈ (+10₁₀) in octal' },
    { val: '77', desc: 'Octal ripple carry test (+77₈)' },
  ],
  10: [
    { val: '45', desc: '+45₁₀ in decimal (9\'s and 10\'s complement)' },
    { val: '1', desc: '+1₁₀ in decimal' },
    { val: '99', desc: 'Decimal carry ripple test (99₁₀)' },
  ],
  16: [
    { val: '2D', desc: '+2D₁₆ (+45₁₀) in hexadecimal (15\'s and 16\'s complement)' },
    { val: '1F', desc: '+1F₁₆ (+31₁₀) in hexadecimal' },
    { val: 'FF', desc: 'Byte boundary hex test (+FF₁₆)' },
  ],
}

export function NegationPanel({
  initialBase = 2,
  initialInput = '101',
  onSwitchToLab,
  onSwitchToSummation,
}: Props) {
  const [base, setBase] = useState<Base>(initialBase)
  const [input, setInput] = useState<string>(initialInput)
  const [customWidth, setCustomWidth] = useState<number | undefined>(undefined)
  const [activeRippleStep, setActiveRippleStep] = useState<number>(0)
  const [isPlayingRipple, setIsPlayingRipple] = useState<boolean>(false)

  const baseStyle = BASE_STYLES[base]
  const validation = useMemo(() => validateInput(input, base), [input, base])

  // Word length choices
  const widthOptions = useMemo(() => {
    if (base === 2) {
      return [
        { label: 'Auto Width', value: undefined },
        { label: '4-bit (Nibble)', value: 4 },
        { label: '8-bit (Byte)', value: 8 },
        { label: '16-bit (Word)', value: 16 },
      ]
    }
    return [
      { label: 'Auto Width', value: undefined },
      { label: '2 Digits', value: 2 },
      { label: '4 Digits', value: 4 },
      { label: '8 Digits', value: 8 },
    ]
  }, [base])

  const negationResult = useMemo<NegationResult | null>(() => {
    if (!validation.valid || input.trim().length === 0) return null
    try {
      return negateInBase(input, base, customWidth)
    } catch {
      return null
    }
  }, [input, base, customWidth, validation.valid])

  const totalRippleSteps = negationResult ? negationResult.rippleSteps.length : 0

  // Reset ripple step when input or base changes
  useEffect(() => {
    if (negationResult) {
      setActiveRippleStep(negationResult.rippleSteps.length - 1)
      setIsPlayingRipple(false)
    }
  }, [input, base, customWidth])

  // Ripple playback timer
  useEffect(() => {
    if (!isPlayingRipple) return
    const timer = setInterval(() => {
      setActiveRippleStep((curr) => {
        if (curr >= totalRippleSteps - 1) {
          setIsPlayingRipple(false)
          return curr
        }
        return curr + 1
      })
    }, 900)
    return () => clearInterval(timer)
  }, [isPlayingRipple, totalRippleSteps])

  function handleRandomExample() {
    const list = SAMPLE_VALUES[base]
    const pick = list[Math.floor(Math.random() * list.length)]
    setInput(pick.val)
  }

  const currentRippleStep = negationResult && activeRippleStep >= 0 && activeRippleStep < totalRippleSteps
    ? negationResult.rippleSteps[activeRippleStep]
    : null

  return (
    <div className="space-y-6">
      {/* Base & Settings Controls */}
      <div className="glass rounded-3xl border p-4 sm:p-6" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight">
              Base Negation & Complement Systems
            </h2>
            <p className="text-xs text-[var(--ink-soft)] mt-0.5">
              Explore Diminished Radix Complements ((r-1)'s complement) and Radix Complements (r's complement) across all number systems.
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
                    const sample = SAMPLE_VALUES[b][0]
                    setInput(sample.val)
                    setCustomWidth(undefined)
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

        {/* Input and Word Width Configuration */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Operand Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[var(--ink-soft)]">
              <span className="font-semibold uppercase tracking-wider">Number to Negate</span>
              <button
                type="button"
                onClick={handleRandomExample}
                className="flex items-center gap-1 hover:text-[var(--ink)] transition-colors"
              >
                <Shuffle size={12} />
                <span>Example</span>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                placeholder={baseStyle.placeholder}
                className="font-mono-num w-full rounded-2xl border px-4 py-3 text-lg font-bold tracking-wider outline-none transition-all"
                style={{
                  borderColor: !validation.valid ? '#ef4444' : 'rgb(var(--border) / var(--border-alpha))',
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
            {!validation.valid && (
              <p className="text-xs text-red-500">{validation.message}</p>
            )}
          </div>

          {/* Word Width Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[var(--ink-soft)]">
              <span className="font-semibold uppercase tracking-wider">Register / Word Width</span>
              <span className="font-mono text-[11px]">
                {negationResult ? `${negationResult.wordWidth} ${base === 2 ? 'bits' : 'digits'}` : ''}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {widthOptions.map((opt) => {
                const isSelected = customWidth === opt.value
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setCustomWidth(opt.value)}
                    className="flex-1 min-w-[100px] rounded-xl border px-2.5 py-2 text-xs font-medium transition-all"
                    style={{
                      borderColor: isSelected ? baseStyle.varName : 'rgb(var(--border) / var(--border-alpha))',
                      background: isSelected ? `color-mix(in srgb, ${baseStyle.varName} 15%, transparent)` : 'transparent',
                      color: isSelected ? baseStyle.varName : 'var(--ink-soft)',
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {negationResult && (
        <div className="space-y-6">
          {/* Negation High-Level Comparison Header */}
          <div
            className="rounded-3xl border p-5 sm:p-6 transition-all"
            style={{
              borderColor: `color-mix(in srgb, ${baseStyle.varName} 40%, transparent)`,
              background: `linear-gradient(135deg, color-mix(in srgb, ${baseStyle.varName} 12%, transparent) 0%, color-mix(in srgb, var(--surface) 80%, transparent) 100%)`,
            }}
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {/* Positive Original */}
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]">
                  Original Value (+N)
                </span>
                <div className="font-mono-num text-2xl font-extrabold tracking-tight">
                  <span>{negationResult.paddedInput}</span>
                  <span className="text-sm ml-1" style={{ color: baseStyle.varName }}>{baseStyle.subscript}</span>
                </div>
                <div className="text-xs text-[var(--ink-soft)] font-mono">
                  = +{negationResult.decimalValue}₁₀
                </div>
              </div>

              {/* Diminished (r-1)'s Complement */}
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]">
                  {negationResult.diminishedName}
                </span>
                <div className="font-mono-num text-2xl font-extrabold tracking-tight">
                  <span className="text-[var(--ink)]">{negationResult.diminishedResult}</span>
                  <span className="text-sm ml-1" style={{ color: baseStyle.varName }}>{baseStyle.subscript}</span>
                </div>
                <div className="text-xs text-[var(--ink-soft)]">
                  Bitwise / Digit Inversion ((r-1) - d)
                </div>
              </div>

              {/* Radix r's Complement */}
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]">
                  {negationResult.radixComplementName} (True Negation)
                </span>
                <div className="font-mono-num text-2xl font-extrabold tracking-tight" style={{ color: baseStyle.varName }}>
                  <span>{negationResult.radixComplementResult}</span>
                  <span className="text-sm ml-1">{baseStyle.subscript}</span>
                </div>
                <div className="text-xs text-[var(--ink-soft)] font-mono">
                  = {negationResult.signedDecimalValue}₁₀ ({negationResult.diminishedName} + 1)
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
              {onSwitchToLab && (
                <button
                  type="button"
                  onClick={() => onSwitchToLab(negationResult.radixComplementResult, base)}
                  className="rounded-xl border px-3 py-1 text-xs font-medium text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                  style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}
                >
                  Convert {negationResult.radixComplementResult} in Converter Lab →
                </button>
              )}
              {onSwitchToSummation && (
                <button
                  type="button"
                  onClick={() => onSwitchToSummation(negationResult.paddedInput, base)}
                  className="rounded-xl border px-3 py-1 text-xs font-medium text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                  style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}
                >
                  Add with this in Summation Lab →
                </button>
              )}
            </div>
          </div>

          {/* Detailed Step-by-Step Sections Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* 1. Diminished Radix Complement Card */}
            <div className="glass rounded-3xl border p-5 sm:p-6" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
              <div className="flex items-center gap-2 mb-3">
                <Layers size={18} style={{ color: baseStyle.varName }} />
                <h3 className="font-display text-base font-bold">
                  1. {negationResult.diminishedName} Calculation
                </h3>
              </div>
              <p className="text-xs text-[var(--ink-soft)] mb-4">
                In base {base}, subtract each digit from {negationResult.diminishedRadix} ({base} - 1):
              </p>

              {/* Digit Tile Breakdown */}
              <div className="flex flex-wrap gap-2">
                {negationResult.diminishedSteps.map((step) => (
                  <div
                    key={`dim-${step.position}`}
                    className="flex-1 min-w-[55px] rounded-2xl border p-2.5 text-center transition-all bg-[color-mix(in_srgb,var(--surface)_50%,transparent)]"
                    style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}
                  >
                    <div className="text-[10px] text-[var(--ink-soft)] font-mono">
                      Pos {step.position}
                    </div>
                    <div className="font-mono text-lg font-bold text-[var(--ink-soft)] line-through decoration-red-400 my-0.5">
                      {step.originalDigit}
                    </div>
                    <div className="text-[10px] font-mono text-[var(--ink-soft)]">
                      {negationResult.diminishedRadix} - {step.originalVal}
                    </div>
                    <ArrowDown size={12} className="mx-auto text-[var(--ink-soft)] my-0.5" />
                    <div
                      className="font-mono text-xl font-extrabold"
                      style={{ color: baseStyle.varName }}
                    >
                      {step.complementDigit}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl border p-3 text-xs bg-[color-mix(in_srgb,var(--surface)_50%,transparent)]" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
                <span className="font-semibold text-[var(--ink)]">Resulting {negationResult.diminishedName}:</span>{' '}
                <span className="font-mono font-bold" style={{ color: baseStyle.varName }}>
                  {negationResult.diminishedResult}{baseStyle.subscript}
                </span>
              </div>
            </div>

            {/* 2. Radix Complement & Carry Ripple Card */}
            <div className="glass rounded-3xl border p-5 sm:p-6" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} style={{ color: baseStyle.varName }} />
                  <h3 className="font-display text-base font-bold">
                    2. Add 1 for {negationResult.radixComplementName}
                  </h3>
                </div>

                {/* Ripple Playback Controls */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveRippleStep(0)}
                    disabled={activeRippleStep === 0}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border text-xs text-[var(--ink-soft)] hover:text-[var(--ink)] disabled:opacity-30"
                    style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}
                  >
                    <RotateCcw size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveRippleStep((s) => Math.max(0, s - 1))}
                    disabled={activeRippleStep === 0}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border text-xs text-[var(--ink-soft)] hover:text-[var(--ink)] disabled:opacity-30"
                    style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPlayingRipple((p) => !p)}
                    className="flex items-center gap-1 rounded-lg border px-2 h-7 text-xs font-semibold text-white"
                    style={{ background: baseStyle.varName, borderColor: baseStyle.varName }}
                  >
                    {isPlayingRipple ? <Pause size={12} /> : <Play size={12} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveRippleStep((s) => Math.min(totalRippleSteps - 1, s + 1))}
                    disabled={activeRippleStep === totalRippleSteps - 1}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border text-xs text-[var(--ink-soft)] hover:text-[var(--ink)] disabled:opacity-30"
                    style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-[var(--ink-soft)] mb-4">
                Watch the +1 carry ripple from least significant digit (right) towards most significant (left):
              </p>

              {/* Ripple Steps Visualizer */}
              <div className="flex flex-wrap gap-2">
                {negationResult.rippleSteps.map((step, idx) => {
                  const isCurrent = idx === activeRippleStep
                  const isFinished = idx <= activeRippleStep
                  return (
                    <div
                      key={`ripple-${step.position}`}
                      className="flex-1 min-w-[55px] rounded-2xl border p-2.5 text-center transition-all"
                      style={{
                        borderColor: isCurrent
                          ? baseStyle.varName
                          : 'rgb(var(--border) / var(--border-alpha))',
                        background: isCurrent
                          ? `color-mix(in srgb, ${baseStyle.varName} 15%, transparent)`
                          : 'color-mix(in srgb, var(--surface) 50%, transparent)',
                      }}
                    >
                      <div className="text-[10px] text-[var(--ink-soft)] font-mono">
                        Pos {step.position}
                      </div>
                      <div className="font-mono text-base font-bold text-[var(--ink)] my-0.5">
                        {step.inputDigit}
                      </div>
                      <div className="text-[10px] font-mono text-[var(--ink-soft)]">
                        +{step.carryIn}
                      </div>
                      <ArrowDown size={12} className="mx-auto text-[var(--ink-soft)] my-0.5" />
                      <div
                        className="font-mono text-xl font-extrabold"
                        style={{ color: isFinished ? baseStyle.varName : 'transparent' }}
                      >
                        {isFinished ? step.resultDigit : '·'}
                      </div>
                    </div>
                  )
                })}
              </div>

              {currentRippleStep && (
                <div className="mt-4 rounded-xl border p-3 text-xs bg-[color-mix(in_srgb,var(--surface)_50%,transparent)]" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
                  <span className="font-semibold text-[var(--ink)]">Position {currentRippleStep.position}:</span>{' '}
                  <span className="text-[var(--ink-soft)]">{currentRippleStep.explanation}</span>
                </div>
              )}
            </div>
          </div>

          {/* 3. Hardware / Architecture Zero-Sum Proof Card */}
          <div className="glass rounded-3xl border p-5 sm:p-6" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
            <div className="flex items-center gap-2 mb-3">
              <Cpu size={18} className="text-emerald-500" />
              <h3 className="font-display text-base font-bold">
                3. Hardware Zero-Sum Proof: N + ({negationResult.radixComplementName} of N) = 0
              </h3>
            </div>
            <p className="text-xs text-[var(--ink-soft)] mb-4">
              In computer processor ALUs, adding the radix complement to the original number causes a carry overflow that drops beyond the {negationResult.wordWidth}-{base === 2 ? 'bit' : 'digit'} register boundary, leaving exactly all zeros:
            </p>

            {/* Addition Proof Equation Display */}
            <div className="rounded-2xl border p-4 font-mono text-sm sm:text-base space-y-1.5 bg-[color-mix(in_srgb,var(--surface)_60%,transparent)]" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
              <div className="flex justify-end gap-3 text-[var(--ink-soft)]">
                <span>Original (+N):</span>
                <span className="font-bold text-[var(--ink)]">{negationResult.paddedInput}{baseStyle.subscript}</span>
              </div>
              <div className="flex justify-end gap-3 text-[var(--ink-soft)] border-b pb-1" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
                <span>+ Complement (-N):</span>
                <span className="font-bold" style={{ color: baseStyle.varName }}>{negationResult.radixComplementResult}{baseStyle.subscript}</span>
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <span className="text-xs text-[var(--ink-soft)] self-center">(End Carry [1] Discarded) → Stored Value:</span>
                <span className="font-bold text-emerald-500 text-lg sm:text-xl">{negationResult.moduloWordResult}{baseStyle.subscript} (= 0)</span>
              </div>
            </div>

            <div className="mt-3 flex items-start gap-2 text-xs text-[var(--ink-soft)]">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <p>{negationResult.proofExplanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
