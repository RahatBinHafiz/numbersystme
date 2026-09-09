import { useCallback, useEffect, useState } from 'react'
import type { Base, HistoryEntry } from '../algorithms/types'

const STORAGE_KEY = 'numlab-history'
const MAX_ENTRIES = 12

function load(): HistoryEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : []
  } catch {
    return []
  }
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(load)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  const addEntry = useCallback((input: string, fromBase: Base, toBase: Base, result: string) => {
    setEntries((prev) => {
      const next: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        input,
        fromBase,
        toBase,
        result,
        timestamp: Date.now(),
      }
      const deduped = prev.filter((e) => !(e.input === input && e.fromBase === fromBase && e.toBase === toBase))
      return [next, ...deduped].slice(0, MAX_ENTRIES)
    })
  }, [])

  const clear = useCallback(() => setEntries([]), [])

  return { entries, addEntry, clear }
}
