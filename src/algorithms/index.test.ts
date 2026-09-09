import { describe, expect, it } from 'vitest'
import { convert } from './index'
import { validateInput } from '../utils/validation'

describe('Binary <-> Decimal', () => {
  it('101101₂ = 45₁₀', () => expect(convert(2, 10, '101101').result).toBe('45'))
  it('45₁₀ = 101101₂', () => expect(convert(10, 2, '45').result).toBe('101101'))
})

describe('Octal <-> Decimal', () => {
  it('55₈ = 45₁₀', () => expect(convert(8, 10, '55').result).toBe('45'))
  it('45₁₀ = 55₈', () => expect(convert(10, 8, '45').result).toBe('55'))
})

describe('Hexadecimal <-> Decimal', () => {
  it('2D₁₆ = 45₁₀', () => expect(convert(16, 10, '2D').result).toBe('45'))
  it('45₁₀ = 2D₁₆', () => expect(convert(10, 16, '45').result).toBe('2D'))
})

describe('Binary <-> Octal', () => {
  it('101101₂ = 55₈', () => expect(convert(2, 8, '101101').result).toBe('55'))
  it('55₈ = 101101₂', () => expect(convert(8, 2, '55').result).toBe('101101'))
})

describe('Binary <-> Hexadecimal', () => {
  it('101101₂ = 2D₁₆', () => expect(convert(2, 16, '101101').result).toBe('2D'))
  it('2D₁₆ = 101101₂', () => expect(convert(16, 2, '2D').result).toBe('101101'))
})

describe('Octal <-> Hexadecimal (via binary bridge)', () => {
  it('55₈ = 2D₁₆', () => expect(convert(8, 16, '55').result).toBe('2D'))
  it('2D₁₆ = 55₈', () => expect(convert(16, 8, '2D').result).toBe('55'))
})

describe('worked textbook examples from the spec', () => {
  it('157₈ = 111₁₀', () => expect(convert(8, 10, '157').result).toBe('111'))
  it('2F₁₆ = 47₁₀', () => expect(convert(16, 10, '2F').result).toBe('47'))
  it('37₁₀ = 100101₂', () => expect(convert(10, 2, '37').result).toBe('100101'))
  it('47₁₀ = 2F₁₆', () => expect(convert(10, 16, '47').result).toBe('2F'))
  it('1101₂ = 15₈', () => expect(convert(2, 8, '1101').result).toBe('15'))
  it('57₈ = 101111₂', () => expect(convert(8, 2, '57').result).toBe('101111'))
  it('57₈ = 2F₁₆', () => expect(convert(8, 16, '57').result).toBe('2F'))
  it('2F₁₆ = 57₈', () => expect(convert(16, 8, '2F').result).toBe('57'))
})

describe('known integer values round-trip through every base', () => {
  const values = [0, 1, 7, 8, 9, 10, 15, 16, 31, 32, 37, 45, 255, 256]
  for (const v of values) {
    it(`decimal ${v} round-trips through binary, octal and hex`, () => {
      const bin = convert(10, 2, String(v)).result
      const oct = convert(10, 8, String(v)).result
      const hex = convert(10, 16, String(v)).result

      expect(convert(2, 10, bin).result).toBe(String(v))
      expect(convert(8, 10, oct).result).toBe(String(v))
      expect(convert(16, 10, hex).result).toBe(String(v))
    })
  }
})

describe('input validation', () => {
  it('rejects binary containing non 0/1 digits', () => {
    const res = validateInput('1012', 2)
    expect(res.valid).toBe(false)
    expect(res.message).toMatch(/Invalid binary/)
  })
  it('rejects octal containing 8 or 9', () => {
    expect(validateInput('189', 8).valid).toBe(false)
  })
  it('rejects decimal containing letters', () => {
    expect(validateInput('12A', 10).valid).toBe(false)
  })
  it('accepts hex with lowercase letters', () => {
    expect(validateInput('2f', 16).valid).toBe(true)
  })
  it('rejects empty input', () => {
    expect(validateInput('', 2).valid).toBe(false)
  })
})

describe('zero edge case', () => {
  it('0 converts cleanly in every direction', () => {
    expect(convert(10, 2, '0').result).toBe('0')
    expect(convert(2, 10, '0').result).toBe('0')
    expect(convert(8, 16, '0').result).toBe('0')
  })
})

describe('Fractional numbers conversion', () => {
  it('binary to decimal: 10.1₂ = 2.5₁₀', () => {
    expect(convert(2, 10, '10.1').result).toBe('2.5')
  })
  it('binary to decimal: 0.11₂ = 0.75₁₀', () => {
    expect(convert(2, 10, '0.11').result).toBe('0.75')
  })
  it('binary to decimal: 101.101₂ = 5.625₁₀', () => {
    expect(convert(2, 10, '101.101').result).toBe('5.625')
  })

  it('decimal to binary: 2.5₁₀ = 10.1₂', () => {
    expect(convert(10, 2, '2.5').result).toBe('10.1')
  })
  it('decimal to binary: 0.75₁₀ = 0.11₂', () => {
    expect(convert(10, 2, '0.75').result).toBe('0.11')
  })
  it('decimal to binary: 5.625₁₀ = 101.101₂', () => {
    expect(convert(10, 2, '5.625').result).toBe('101.101')
  })

  it('octal <-> decimal with fractions', () => {
    expect(convert(8, 10, '12.4').result).toBe('10.5')
    expect(convert(10, 8, '10.5').result).toBe('12.4')
  })

  it('hex <-> decimal with fractions', () => {
    expect(convert(16, 10, 'A.8').result).toBe('10.5')
    expect(convert(10, 16, '10.5').result).toBe('A.8')
  })

  it('binary <-> octal with fractions', () => {
    expect(convert(2, 8, '101.11').result).toBe('5.6')
    expect(convert(8, 2, '5.6').result).toBe('101.11')
  })

  it('binary <-> hex with fractions', () => {
    expect(convert(2, 16, '101.11').result).toBe('5.C')
    expect(convert(16, 2, '5.C').result).toBe('101.11')
  })

  it('octal <-> hex with fractions (via bridge)', () => {
    expect(convert(8, 16, '5.6').result).toBe('5.C')
    expect(convert(16, 8, '5.C').result).toBe('5.6')
  })

  it('validates fractional inputs', () => {
    expect(validateInput('10.1', 2).valid).toBe(true)
    expect(validateInput('10.2', 2).valid).toBe(false)
    expect(validateInput('10..1', 2).valid).toBe(false)
    expect(validateInput('12.7', 8).valid).toBe(true)
    expect(validateInput('12.8', 8).valid).toBe(false)
    expect(validateInput('2F.A', 16).valid).toBe(true)
  })
})
