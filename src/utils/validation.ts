export interface ValidationResult {
  valid: boolean
  message?: string
  detail?: string
}

const RULES: Record<number, { charPattern: RegExp; name: string; digits: string }> = {
  2: { charPattern: /^[01.]+$/, name: 'binary', digits: '0, 1 (and optional . for fraction)' },
  8: { charPattern: /^[0-7.]+$/, name: 'octal', digits: '0 through 7 (and optional . for fraction)' },
  10: { charPattern: /^[0-9.]+$/, name: 'decimal', digits: '0 through 9 (and optional . for fraction)' },
  16: { charPattern: /^[0-9A-Fa-f.]+$/, name: 'hexadecimal', digits: '0-9, A-F (and optional . for fraction)' },
}

export function validateInput(raw: string, base: number): ValidationResult {
  const value = raw.trim()

  if (value.length === 0 || value === '.') {
    return { valid: false, message: 'Enter a number to convert.' }
  }

  const rule = RULES[base]
  if (!rule) {
    return { valid: false, message: 'Unsupported base.' }
  }

  if (!rule.charPattern.test(value)) {
    return {
      valid: false,
      message: `Invalid ${rule.name} number.`,
      detail: `${rule.name[0].toUpperCase()}${rule.name.slice(1)} numbers can only contain ${rule.digits}.`,
    }
  }

  // Count decimal points
  const dotCount = (value.match(/\./g) || []).length
  if (dotCount > 1) {
    return {
      valid: false,
      message: 'Invalid number format.',
      detail: 'A number can contain at most one radix point (.).',
    }
  }

  const parts = value.split('.')
  const intPart = parts[0] || ''
  const fracPart = parts[1] || ''

  if (intPart.length === 0 && fracPart.length === 0) {
    return { valid: false, message: 'Enter a valid number.' }
  }

  if (intPart.replace(/^0+(?=.)/, '').length > 52 && base === 2) {
    return {
      valid: false,
      message: 'Number is too large for this version.',
      detail: 'Try a smaller integer portion.',
    }
  }

  return { valid: true }
}

export function normalizeInput(raw: string, base: number): string {
  let value = base === 16 ? raw.trim().toUpperCase() : raw.trim()
  if (value.startsWith('.')) {
    value = '0' + value
  }
  if (value.endsWith('.')) {
    value = value.slice(0, -1)
  }

  if (value.includes('.')) {
    const [intRaw, fracRaw] = value.split('.')
    const strippedInt = intRaw.replace(/^0+(?=.)/, '')
    const normInt = strippedInt.length ? strippedInt : '0'
    // Trim redundant trailing zeros in fractional part, but keep at least one digit if present
    const strippedFrac = fracRaw.replace(/0+$/, '')
    const normFrac = strippedFrac.length ? strippedFrac : fracRaw.slice(0, 1) || '0'
    return `${normInt}.${normFrac}`
  }

  const stripped = value.replace(/^0+(?=.)/, '')
  return stripped.length ? stripped : '0'
}
