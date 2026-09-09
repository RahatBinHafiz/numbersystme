import { useEffect, useMemo, useState } from 'react'
import { convert } from './algorithms'
import type { Base, ConversionResult as ConversionResultType, HistoryEntry } from './algorithms/types'
import { Header } from './components/Header'
import { ConverterPanel } from './components/ConverterPanel'
import { ConversionResult } from './components/ConversionResult'
import { StepByStepSolution } from './components/StepByStepSolution'
import { HistoryPanel } from './components/HistoryPanel'
import { ThreeScene } from './components/ThreeScene'
import { LearningMode } from './components/LearningMode'
import { useTheme } from './hooks/useTheme'
import { useHistory } from './hooks/useHistory'
import { normalizeInput, validateInput } from './utils/validation'
import { buildBlockScene } from './utils/sceneAdapter'
import { BASE_STYLES } from './utils/baseStyle'

export function App() {
  const { theme, toggle: toggleTheme } = useTheme()
  const { entries: historyEntries, addEntry: addToHistory, clear: clearHistory } = useHistory()

  const [mode, setMode] = useState<'lab' | 'learn'>('lab')
  const [show3D, setShow3D] = useState(false)
  const [fromBase, setFromBase] = useState<Base>(2)
  const [toBase, setToBase] = useState<Base>(10)
  const [input, setInput] = useState<string>('101101')
  const [sceneVersion, setSceneVersion] = useState<number>(1)

  // Validation
  const validation = useMemo(() => validateInput(input, fromBase), [input, fromBase])

  // Conversion result calculated purely using custom arithmetic algorithms
  const conversionResult = useMemo<ConversionResultType | null>(() => {
    if (!validation.valid || fromBase === toBase) return null
    try {
      const normalized = normalizeInput(input, fromBase)
      return convert(fromBase, toBase, normalized)
    } catch {
      return null
    }
  }, [input, fromBase, toBase, validation.valid])

  // 3D Scene Specification
  const sceneSpec = useMemo(() => {
    if (!conversionResult) return null
    return buildBlockScene(conversionResult)
  }, [conversionResult])

  // Automatically update history when a valid conversion is obtained
  useEffect(() => {
    if (conversionResult && validation.valid && input.trim().length > 0) {
      addToHistory(input.trim(), fromBase, toBase, conversionResult.result)
      setSceneVersion((v) => v + 1)
    }
  }, [conversionResult, validation.valid, input, fromBase, toBase, addToHistory])

  // Swapping bases
  function handleSwap() {
    setFromBase(toBase)
    setToBase(fromBase)
    if (conversionResult) {
      setInput(conversionResult.result)
    }
  }

  // Preload example
  function handleExample() {
    const examples: Record<Base, string[]> = {
      2: ['101101', '101.101', '1101.11', '11111111'],
      8: ['55', '12.4', '157', '5.6'],
      10: ['45', '10.5', '5.625', '255'],
      16: ['2D', 'A.8', '5.C', '2F.4'],
    }
    const pool = examples[fromBase]
    const nextVal = pool[Math.floor(Math.random() * pool.length)]
    setInput(nextVal)
  }

  // Reset to initial
  function handleReset() {
    setInput('101101')
    setFromBase(2)
    setToBase(10)
  }

  // Restore history entry
  function handleSelectHistory(entry: HistoryEntry) {
    setFromBase(entry.fromBase)
    setToBase(entry.toBase)
    setInput(entry.input)
    setMode('lab')
  }

  // Load from Learning mode into Lab
  function handleSelectFromLearn(newInput: string, newFrom: Base, newTo: Base) {
    setFromBase(newFrom)
    setToBase(newTo)
    setInput(newInput)
    setMode('lab')
  }

  const activeColorHex = BASE_STYLES[toBase].colorHex

  return (
    <div className="min-h-screen pb-16">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        show3D={show3D}
        onToggle3D={() => setShow3D((v) => !v)}
        mode={mode}
        onModeChange={setMode}
      />

      <main className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        {mode === 'lab' ? (
          <div className="space-y-6">
            <ConverterPanel
              input={input}
              fromBase={fromBase}
              toBase={toBase}
              validation={validation}
              onInputChange={setInput}
              onFromBaseChange={(b) => {
                setFromBase(b)
                if (b === toBase) {
                  setToBase(b === 10 ? 2 : 10)
                }
              }}
              onToBaseChange={(b) => {
                setToBase(b)
                if (b === fromBase) {
                  setFromBase(b === 10 ? 2 : 10)
                }
              }}
              onSwap={handleSwap}
              onExample={handleExample}
              onReset={handleReset}
            />

            {conversionResult && (
              <>
                <ConversionResult
                  input={input}
                  fromBase={fromBase}
                  toBase={toBase}
                  result={conversionResult}
                />

                {show3D && sceneSpec && (
                  <div className="glass overflow-hidden rounded-3xl border p-4 sm:p-6" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-display text-base font-bold flex items-center gap-2">
                        Interactive 3D Structure
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShow3D(false)}
                        className="glow-ring rounded-full border px-2.5 py-1 text-xs text-[var(--ink-soft)] transition-colors hover:border-[var(--accent)]"
                        style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}
                      >
                        Hide 3D
                      </button>
                    </div>
                    <ThreeScene
                      spec={sceneSpec}
                      isDark={theme === 'dark'}
                      accentHex={activeColorHex}
                      version={sceneVersion}
                    />
                  </div>
                )}

                <StepByStepSolution result={conversionResult} />
              </>
            )}

            <HistoryPanel
              entries={historyEntries}
              onSelect={handleSelectHistory}
              onClear={clearHistory}
            />
          </div>
        ) : (
          <LearningMode onSelectExample={handleSelectFromLearn} />
        )}
      </main>
    </div>
  )
}

export default App
