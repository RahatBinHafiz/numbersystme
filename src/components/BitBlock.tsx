interface Props {
  digit: string
  color?: string
  size?: 'sm' | 'md'
  active?: boolean
}

export function BitBlock({ digit, color = 'var(--accent)', size = 'md', active = true }: Props) {
  const dimension = size === 'sm' ? 'h-7 w-7 text-xs' : 'h-9 w-9 text-sm'
  return (
    <span
      className={`font-mono-num inline-flex ${dimension} items-center justify-center rounded-lg font-bold transition-opacity`}
      style={{
        background: `color-mix(in srgb, ${color} ${active ? 18 : 6}%, transparent)`,
        color: active ? color : 'var(--ink-soft)',
        opacity: active ? 1 : 0.5,
      }}
    >
      {digit}
    </span>
  )
}
