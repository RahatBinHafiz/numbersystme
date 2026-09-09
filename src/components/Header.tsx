import { Box, Moon, Sun } from 'lucide-react'
import type { Theme } from '../hooks/useTheme'

interface Props {
  theme: Theme
  onToggleTheme: () => void
  show3D: boolean
  onToggle3D: () => void
  mode: 'lab' | 'learn'
  onModeChange: (mode: 'lab' | 'learn') => void
}

export function Header({ theme, onToggleTheme, show3D, onToggle3D, mode, onModeChange }: Props) {
  return (
    <header className="mx-auto flex max-w-5xl flex-col gap-5 px-4 pt-6 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Number System <span style={{ color: 'var(--accent)' }}>Lab</span>
          </h1>
          <p className="text-sm text-[var(--ink-soft)]">Learn · Convert · Visualize</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggle3D}
            aria-pressed={show3D}
            aria-label="Toggle 3D visualization"
            className="glow-ring flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-colors"
            style={{
              borderColor: show3D ? 'var(--accent)' : 'rgb(var(--border) / var(--border-alpha))',
              color: show3D ? 'var(--accent)' : 'var(--ink-soft)',
              background: show3D ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'transparent',
            }}
          >
            <Box size={14} />
            <span className="hidden sm:inline">3D View</span>
          </button>
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

      <nav className="glass inline-flex w-fit gap-1 rounded-full p-1" role="tablist" aria-label="App sections">
        {(['lab', 'learn'] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => onModeChange(m)}
            className="glow-ring rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            style={{
              background: mode === m ? 'var(--accent)' : 'transparent',
              color: mode === m ? 'white' : 'var(--ink-soft)',
            }}
          >
            {m === 'lab' ? 'Converter Lab' : 'Learning Mode'}
          </button>
        ))}
      </nav>
    </header>
  )
}
