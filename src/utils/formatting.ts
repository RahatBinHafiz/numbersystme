const SUPERSCRIPTS: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻',
}

const SUBSCRIPTS: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
}

export function toSuperscript(n: number): string {
  return String(n).split('').map((c) => SUPERSCRIPTS[c] ?? c).join('')
}

export function toSubscript(n: number): string {
  return String(n).split('').map((c) => SUBSCRIPTS[c] ?? c).join('')
}

/** e.g. formatWithBase("101101", 2) -> "101101₂" */
export function formatWithBase(digits: string, base: number, subscripts: Record<number, string>): string {
  return `${digits}${subscripts[base] ?? ''}`
}

/** e.g. powerExpression(2, 5) -> "2⁵" */
export function powerExpression(base: number, exponent: number): string {
  return `${base}${toSuperscript(exponent)}`
}
