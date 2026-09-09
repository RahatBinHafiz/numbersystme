import { History, Trash2 } from 'lucide-react'
import type { HistoryEntry } from '../algorithms/types'
import { BASE_STYLES } from '../utils/baseStyle'

interface Props {
  entries: HistoryEntry[]
  onSelect: (entry: HistoryEntry) => void
  onClear: () => void
}

export function HistoryPanel({ entries, onSelect, onClear }: Props) {
  if (entries.length === 0) return null

  return (
    <div className="glass rounded-3xl p-5 sm:p-6 border shadow-sm" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display flex items-center gap-2 text-base font-bold">
          <History size={16} style={{ color: 'var(--accent)' }} /> Conversion History
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="glow-ring flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium text-[var(--ink-soft)] transition-colors hover:text-[#e1476b] hover:border-[#e1476b]"
          style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}
        >
          <Trash2 size={12} /> Clear
        </button>
      </div>
      <ul className="scrollbar-thin grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
        {entries.map((entry) => {
          const from = BASE_STYLES[entry.fromBase]
          const to = BASE_STYLES[entry.toBase]
          return (
            <li key={entry.id}>
              <button
                type="button"
                onClick={() => onSelect(entry)}
                className="glow-ring font-mono-num flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]"
                style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}
              >
                <span>
                  <span style={{ color: from.varName }}>{entry.input}{from.subscript}</span>
                  <span className="mx-1.5 text-[var(--ink-soft)]">→</span>
                  <span style={{ color: to.varName }}>{entry.result}{to.subscript}</span>
                </span>
                <span className="text-[10px] text-[var(--ink-soft)] opacity-60">Restore</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
