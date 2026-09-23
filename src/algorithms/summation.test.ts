import { describe, expect, it } from 'vitest'
import { addInBase } from './summation'

describe('Base Summation (Addition)', () => {
  describe('Binary addition (Base 2)', () => {
    it('1 + 1 = 10', () => {
      const res = addInBase('1', '1', 2)
      expect(res.result).toBe('10')
      expect(res.verified).toBe(true)
    })

    it('101101 + 1101 = 111010 (45 + 13 = 58)', () => {
      const res = addInBase('101101', '1101', 2)
      expect(res.result).toBe('111010')
      expect(res.decimalA).toBe(45)
      expect(res.decimalB).toBe(13)
      expect(res.decimalSum).toBe(58)
      expect(res.verified).toBe(true)
    })

    it('binary fractional addition: 10.1 + 1.11 = 100.01 (2.5 + 1.75 = 4.25)', () => {
      const res = addInBase('10.1', '1.11', 2)
      expect(res.result).toBe('100.01')
      expect(res.decimalA).toBe(2.5)
      expect(res.decimalB).toBe(1.75)
      expect(res.decimalSum).toBe(4.25)
      expect(res.verified).toBe(true)
    })

    it('handles carry ripple: 1111 + 1 = 10000', () => {
      const res = addInBase('1111', '1', 2)
      expect(res.result).toBe('10000')
      expect(res.verified).toBe(true)
    })
  })

  describe('Octal addition (Base 8)', () => {
    it('7 + 5 = 14₈ (7 + 5 = 12₁₀)', () => {
      const res = addInBase('7', '5', 8)
      expect(res.result).toBe('14')
      expect(res.decimalSum).toBe(12)
      expect(res.verified).toBe(true)
    })

    it('55 + 23 = 100₈ (45 + 19 = 64₁₀)', () => {
      const res = addInBase('55', '23', 8)
      expect(res.result).toBe('100')
      expect(res.decimalSum).toBe(64)
      expect(res.verified).toBe(true)
    })

    it('octal fractional addition: 12.4 + 5.6 = 20.2₈', () => {
      const res = addInBase('12.4', '5.6', 8)
      expect(res.result).toBe('20.2')
      expect(res.verified).toBe(true)
    })
  })

  describe('Decimal addition (Base 10)', () => {
    it('45 + 55 = 100', () => {
      const res = addInBase('45', '55', 10)
      expect(res.result).toBe('100')
      expect(res.verified).toBe(true)
    })

    it('12.75 + 8.5 = 21.25', () => {
      const res = addInBase('12.75', '8.5', 10)
      expect(res.result).toBe('21.25')
      expect(res.verified).toBe(true)
    })
  })

  describe('Hexadecimal addition (Base 16)', () => {
    it('A + B = 15₁₆ (10 + 11 = 21₁₀)', () => {
      const res = addInBase('A', 'B', 16)
      expect(res.result).toBe('15')
      expect(res.decimalSum).toBe(21)
      expect(res.verified).toBe(true)
    })

    it('2D + 1F = 4C₁₆ (45 + 31 = 76₁₀)', () => {
      const res = addInBase('2D', '1F', 16)
      expect(res.result).toBe('4C')
      expect(res.decimalSum).toBe(76)
      expect(res.verified).toBe(true)
    })

    it('hex fractional addition: A.8 + 2.C = D.4₁₆', () => {
      const res = addInBase('A.8', '2.C', 16)
      expect(res.result).toBe('D.4')
      expect(res.verified).toBe(true)
    })

    it('handles carry across multiple hex digits: FF + 1 = 100₁₆', () => {
      const res = addInBase('FF', '1', 16)
      expect(res.result).toBe('100')
      expect(res.decimalSum).toBe(256)
      expect(res.verified).toBe(true)
    })
  })
})
