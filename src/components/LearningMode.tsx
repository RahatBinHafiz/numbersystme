import { useState } from 'react'
import { ArrowRight, BookOpen, Layers, Sparkles } from 'lucide-react'
import type { Base } from '../algorithms/types'
import { BASE_STYLES } from '../utils/baseStyle'
import { LESSONS } from '../data/lessons'

interface Props {
  onSelectExample: (input: string, fromBase: Base, toBase: Base) => void
}

const BASES: Base[] = [2, 8, 10, 16]

// Lookup table for 0 to 15 across all 4 bases
const REFERENCE_TABLE = [
  { dec: '0', bin: '0000', oct: '0', hex: '0' },
  { dec: '1', bin: '0001', oct: '1', hex: '1' },
  { dec: '2', bin: '0010', oct: '2', hex: '2' },
  { dec: '3', bin: '0011', oct: '3', hex: '3' },
  { dec: '4', bin: '0100', oct: '4', hex: '4' },
  { dec: '5', bin: '0101', oct: '5', hex: '5' },
  { dec: '6', bin: '0110', oct: '6', hex: '6' },
  { dec: '7', bin: '0111', oct: '7', hex: '7' },
  { dec: '8', bin: '1000', oct: '10', hex: '8' },
  { dec: '9', bin: '1001', oct: '11', hex: '9' },
  { dec: '10', bin: '1010', oct: '12', hex: 'A' },
  { dec: '11', bin: '1011', oct: '13', hex: 'B' },
  { dec: '12', bin: '1100', oct: '14', hex: 'C' },
  { dec: '13', bin: '1101', oct: '15', hex: 'D' },
  { dec: '14', bin: '1110', oct: '16', hex: 'E' },
  { dec: '15', bin: '1111', oct: '17', hex: 'F' },
]

export function LearningMode({ onSelectExample }: Props) {
  const [selectedBase, setSelectedBase] = useState<Base>(2)
  const lesson = LESSONS[selectedBase]
  const style = BASE_STYLES[selectedBase]

  return (
    <div className="space-y-8">
      {/* Base Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {BASES.map((b) => {
          const bStyle = BASE_STYLES[b]
          const isSelected = b === selectedBase
          return (
            <button
              key={b}
              type="button"
              onClick={() => setSelectedBase(b)}
              className="glow-ring rounded-2xl border px-4 py-2 text-sm font-semibold transition-all"
              style={{
                borderColor: isSelected ? bStyle.varName : 'rgb(var(--border) / var(--border-alpha))',
                background: isSelected ? bStyle.varName : 'transparent',
                color: isSelected ? '#ffffff' : 'var(--ink)',
                boxShadow: isSelected ? `0 2px 10px color-mix(in srgb, ${bStyle.varName} 35%, transparent)` : 'none',
              }}
            >
              {bStyle.name} ({b})
            </button>
          )
        })}
      </div>

      {/* Lesson Details Card */}
      <div className="glass rounded-3xl p-6 border shadow-sm space-y-6" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
        <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
          <div>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2" style={{ color: style.varName }}>
              <BookOpen size={24} /> {lesson.title}
            </h2>
            <p className="mt-1 text-sm text-[var(--ink-soft)] max-w-2xl leading-relaxed">
              {lesson.summary}
            </p>
          </div>
          <div className="rounded-2xl border px-4 py-2 text-center" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))', background: 'color-mix(in srgb, var(--surface) 50%, transparent)' }}>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-soft)]">Digits</span>
            <span className="font-mono text-sm font-bold" style={{ color: style.varName }}>{lesson.digits}</span>
          </div>
        </div>

        {/* Powers of this base */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)] mb-2 flex items-center gap-1.5">
            <Layers size={14} /> Positional Place Values (Weights)
          </h3>
          <div className="flex flex-wrap gap-2">
            {lesson.placeValues.map((pv, idx) => (
              <span
                key={idx}
                className="font-mono-num rounded-xl border px-3 py-1.5 text-xs sm:text-sm font-semibold"
                style={{
                  borderColor: 'rgb(var(--border) / var(--border-alpha))',
                  background: 'color-mix(in srgb, var(--surface) 60%, transparent)',
                  color: style.varName,
                }}
              >
                {pv}
              </span>
            ))}
          </div>
        </div>

        {/* Key Conversion Techniques */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)] mb-3">
            Core Conversion Rules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lesson.techniques.map((tech, idx) => {
              const [title, desc] = tech.split(': ')
              return (
                <div
                  key={idx}
                  className="rounded-2xl border p-3.5 text-xs sm:text-sm"
                  style={{
                    borderColor: 'rgb(var(--border) / var(--border-alpha))',
                    background: 'color-mix(in srgb, var(--surface) 40%, transparent)',
                  }}
                >
                  <span className="font-bold block mb-1" style={{ color: style.varName }}>
                    {title}
                  </span>
                  <span className="text-[var(--ink-soft)] leading-relaxed">{desc}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Worked Examples with Interactive Try In Lab */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)] mb-3">
            Worked Examples (Try Live in Converter)
          </h3>
          <div className="flex flex-wrap gap-3">
            {lesson.examples.map((ex, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-2xl border p-3 bg-[color-mix(in_srgb,var(--surface)_60%,transparent)]"
                style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}
              >
                <div>
                  <span className="font-mono-num font-bold text-base" style={{ color: style.varName }}>
                    {ex.value}
                  </span>
                  <p className="text-xs text-[var(--ink-soft)]">{ex.note}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const cleanValue = ex.value.replace(/[₂₈₁₀₁₆]/g, '')
                    onSelectExample(cleanValue, selectedBase, 10)
                  }}
                  className="glow-ring flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:border-[var(--accent)]"
                  style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))', color: 'var(--accent)' }}
                >
                  <Sparkles size={12} /> Test in Lab <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cross-Base Equivalence Table (0 to 15) */}
      <div className="glass rounded-3xl p-6 border shadow-sm" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
        <div className="mb-4">
          <h3 className="font-display text-lg font-bold">Standard Equivalence Reference (0 to 15)</h3>
          <p className="text-xs text-[var(--ink-soft)]">
            Essential reference showing how 4 bits align with hexadecimal digits 0–F and octal groupings
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
          <table className="font-mono-num w-full text-center text-xs sm:text-sm">
            <thead>
              <tr className="border-b text-[var(--ink-soft)] font-bold text-[11px] uppercase tracking-wider" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))', background: 'color-mix(in srgb, var(--surface) 80%, transparent)' }}>
                <th className="py-2.5 px-3">Decimal (Base 10)</th>
                <th className="py-2.5 px-3">Binary (Base 2 - 4 bits)</th>
                <th className="py-2.5 px-3">Octal (Base 8)</th>
                <th className="py-2.5 px-3">Hexadecimal (Base 16)</th>
              </tr>
            </thead>
            <tbody>
              {REFERENCE_TABLE.map((row) => (
                <tr
                  key={row.dec}
                  className="border-b last:border-b-0 hover:bg-[color-mix(in_srgb,var(--accent)_5%,transparent)] transition-colors"
                  style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}
                >
                  <td className="py-2 px-3 font-semibold" style={{ color: 'var(--base-decimal)' }}>{row.dec}</td>
                  <td className="py-2 px-3 tracking-widest font-mono" style={{ color: 'var(--base-binary)' }}>{row.bin}</td>
                  <td className="py-2 px-3 font-semibold" style={{ color: 'var(--base-octal)' }}>{row.oct}</td>
                  <td className="py-2 px-3 font-bold" style={{ color: 'var(--base-hex)' }}>{row.hex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
