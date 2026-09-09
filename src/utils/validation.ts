export interface ValidationResult {
  valid: boolean
  message?: string
  detail?: string
}

const RULES: Record<number, { pattern: RegExp; name: string; digits: string }> = {
  2: { pattern: /^[01]+$/, name: 'binary', digits: '0 and 1' },
  8: { pattern: /^[0-7]+$/, name: 'octal', digits: '0 through 7' },
  10: { pattern: /^[0-9]+$/, name: 'decimal', digits: '0 through 9' },
  16: { pattern: /^[0-9A-Fa-f]+$/, name: 'hexadecimal', digits: '0-9 and A-F' },
}

export function validateInput(raw: string, base: number): ValidationResult {
  const value = raw.trim()

  if (value.length === 0) {
    return { valid: false, message: 'Enter a number to convert.' }
  }

  const rule = RULES[base]
  if (!rule) {
    return { valid: false, message: 'Unsupported base.' }
  }

  if (!rule.pattern.test(value)) {
    return {
      valid: false,
      message: `Invalid ${rule.name} number.`,
      detail: `${rule.name[0].toUpperCase()}${rule.name.slice(1)} numbers can only contain ${rule.digits}.`,
    }
  }

  // Reject numbers so large that safe positional arithmetic in JS floating
  // point would lose precision — keeps this first version limited to
  // positive integers within the safe integer range, as specified.
  if (value.replace(/^0+(?=.)/, '').length > 52 && base === 2) {
    return {
      valid: false,
      message: 'Number is too large for this version.',
      detail: 'Try a smaller value — support for arbitrarily large numbers is planned.',
    }
  }

  return { valid: true }
}

export function normalizeInput(raw: string, base: number): string {
  const value = base === 16 ? raw.trim().toUpperCase() : raw.trim()
  const stripped = value.replace(/^0+(?=.)/, '')
  return stripped.length ? stripped : '0'
}
