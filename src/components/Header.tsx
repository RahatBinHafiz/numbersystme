import { Box, Moon, Sun } from 'lucide-react'
import type { Theme } from '../hooks/useTheme'

export type AppMode = 'lab' | 'summation' | 'negation' | 'learn'

interface Props {
  theme: Theme
  onToggleTheme: () => void
  show3D: boolean
  onToggle3D: () => void
  mode: AppMode
  onModeChange: (mode: AppMode) => void
}

const MODES: { id: AppMode; label: string }[] = [
  { id: 'lab', label: 'Converter Lab' },
  { id: 'summation', label: 'Summation (+)' },
  { id: 'negation', label: 'Negation (±)' },
  { id: 'learn', label: 'Learning Guide' },
]

export function Header({ theme, onToggleTheme, show3D, onToggle3D, mode, onModeChange }: Props) {
  return (
    <header className="mx-auto flex max-w-5xl flex-col gap-4 px-4 pt-6 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Number System <span style={{ color: 'var(--accent)' }}>Lab</span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-soft)]">
            Convert · Add · Negate · Learn
          </p>
        </div>
        <div className="flex items-center gap-2">
          {mode === 'lab' && (
            <button
              type="button"
              onClick={onToggle3D}
              aria-pressed={show3D}
              aria-label="Toggle 3D visualization"
              className="glow-ring flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                borderColor: show3D ? 'var(--accent)' : 'rgb(var(--border) / var(--border-alpha))',
                color: show3D ? 'var(--accent)' : 'var(--ink-soft)',
                background: show3D ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'transparent',
              }}
            >
              <Box size={14} />
              <span className="hidden sm:inline">3D View</span>
            </button>
          )}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle light and dark theme"
            className="glow-ring flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-[var(--accent)]"
            style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))', color: 'var(--accent)' }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      <nav className="glass inline-flex flex-wrap w-fit max-w-full gap-1 rounded-2xl p-1" role="tablist" aria-label="App sections">
        {MODES.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={mode === item.id}
            onClick={() => onModeChange(item.id)}
            className="glow-ring whitespace-nowrap rounded-xl px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all"
            style={{
              background: mode === item.id ? 'var(--accent)' : 'transparent',
              color: mode === item.id ? '#ffffff' : 'var(--ink-soft)',
              boxShadow: mode === item.id ? '0 2px 8px color-mix(in srgb, var(--accent) 30%, transparent)' : 'none',
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}

