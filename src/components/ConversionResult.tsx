import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import type { Base, ConversionResult as ConversionResultType } from '../algorithms/types'
import { METHOD_INFO } from '../algorithms'
import { BASE_STYLES } from '../utils/baseStyle'

interface Props {
  input: string
  fromBase: Base
  toBase: Base
  result: ConversionResultType
}

export function ConversionResult({ input, fromBase, toBase, result }: Props) {
  const [copied, setCopied] = useState(false)
  const fromStyle = BASE_STYLES[fromBase]
  const toStyle = BASE_STYLES[toBase]
  const methodInfo = METHOD_INFO[result.method]

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result.result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback if clipboard API restricted in iframe
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="glass overflow-hidden rounded-3xl p-5 sm:p-6 border" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]">Conversion Mode:</span>
          <span
            className="rounded-full px-3 py-0.5 text-xs font-semibold border"
            style={{
              borderColor: toStyle.varName,
              color: toStyle.varName,
              background: `color-mix(in srgb, ${toStyle.varName} 10%, transparent)`,
            }}
          >
            {methodInfo.label}
          </span>
        </div>
        <p className="text-xs text-[var(--ink-soft)] hidden sm:block">{methodInfo.description}</p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        {/* Source Input Display */}
        <div className="rounded-2xl p-4 border" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))', background: 'color-mix(in srgb, var(--surface) 60%, transparent)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)] mb-1">
            Input ({fromStyle.name})
          </p>
          <div className="font-mono-num text-2xl sm:text-3xl font-bold break-all" style={{ color: fromStyle.varName }}>
            {input}
            <span className="text-lg opacity-70 ml-0.5">{fromStyle.subscript}</span>
          </div>
        </div>

        <div className="flex justify-center text-[var(--ink-soft)] text-xl font-bold">
          <span className="hidden sm:inline">→</span>
          <span className="sm:hidden">↓</span>
        </div>

        {/* Target Result Display */}
        <div className="relative rounded-2xl p-4 border" style={{ borderColor: `color-mix(in srgb, ${toStyle.varName} 40%, rgb(var(--border) / var(--border-alpha)))`, background: `color-mix(in srgb, ${toStyle.varName} 8%, var(--surface))` }}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)] mb-1">
              Result ({toStyle.name})
            </p>
            <button
              type="button"
              onClick={handleCopy}
              className="glow-ring flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors hover:border-[var(--accent)]"
              style={{
                borderColor: 'rgb(var(--border) / var(--border-alpha))',
                color: copied ? '#10b981' : 'var(--ink-soft)',
              }}
              aria-label="Copy conversion result"
            >
              {copied ? (
                <>
                  <Check size={12} /> Copied!
                </>
              ) : (
                <>
                  <Copy size={12} /> Copy
                </>
              )}
            </button>
          </div>
          <div className="font-mono-num text-2xl sm:text-3xl font-extrabold break-all" style={{ color: toStyle.varName }}>
            {result.result}
            <span className="text-lg opacity-70 ml-0.5">{toStyle.subscript}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
