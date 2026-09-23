import { describe, expect, it } from 'vitest'
import { negateInBase } from './negation'

describe('Base Negation & Complements', () => {
  describe('Binary Negation (Base 2)', () => {
    it('1\'s and 2\'s complement of 5 (101 in 8-bit)', () => {
      const res = negateInBase('101', 2, 8)
      expect(res.paddedInput).toBe('00000101')
      expect(res.diminishedName).toBe("1's Complement")
      expect(res.diminishedResult).toBe('11111010') // invert all bits
      expect(res.radixComplementName).toBe("2's Complement")
      expect(res.radixComplementResult).toBe('11111011') // add 1
      expect(res.signedDecimalValue).toBe(-5)
    })

    it('2\'s complement of 1 (00000001) is 11111111 (-1)', () => {
      const res = negateInBase('1', 2, 8)
      expect(res.diminishedResult).toBe('11111110')
      expect(res.radixComplementResult).toBe('11111111')
      expect(res.signedDecimalValue).toBe(-1)
    })

    it('zero-sum addition proof: N + Comp_2(N) mod 2^w = 0', () => {
      const res = negateInBase('101101', 2, 8)
      expect(res.moduloWordResult).toBe('00000000')
      expect(res.zeroSumProof.result).toBe('100000000')
    })
  })

  describe('Octal Negation (Base 8)', () => {
    it('7\'s and 8\'s complement of 55₈ in 4 digits', () => {
      const res = negateInBase('55', 8, 4)
      expect(res.paddedInput).toBe('0055')
      expect(res.diminishedName).toBe("7's Complement")
      expect(res.diminishedResult).toBe('7722') // 7-0=7, 7-0=7, 7-5=2, 7-5=2
      expect(res.radixComplementName).toBe("8's Complement")
      expect(res.radixComplementResult).toBe('7723') // 7722 + 1 = 7723
      expect(res.moduloWordResult).toBe('0000')
      expect(res.zeroSumProof.result).toBe('10000')
    })
  })

  describe('Decimal Negation (Base 10)', () => {
    it('9\'s and 10\'s complement of 45₁₀ in 4 digits', () => {
      const res = negateInBase('45', 10, 4)
      expect(res.paddedInput).toBe('0045')
      expect(res.diminishedName).toBe("9's Complement")
      expect(res.diminishedResult).toBe('9954') // 9999 - 45
      expect(res.radixComplementName).toBe("10's Complement")
      expect(res.radixComplementResult).toBe('9955')
      expect(res.moduloWordResult).toBe('0000')
      expect(res.zeroSumProof.result).toBe('10000')
    })
  })

  describe('Hexadecimal Negation (Base 16)', () => {
    it('15\'s (F\'s) and 16\'s complement of 2D₁₆ in 4 digits', () => {
      const res = negateInBase('2D', 16, 4)
      expect(res.paddedInput).toBe('002D')
      expect(res.diminishedName).toBe("15's (F's) Complement")
      expect(res.diminishedResult).toBe('FFD2') // F-0=F, F-0=F, F-2=D, F-D(13)=2
      expect(res.radixComplementName).toBe("16's Complement")
      expect(res.radixComplementResult).toBe('FFD3') // FFD2 + 1 = FFD3
      expect(res.moduloWordResult).toBe('0000')
      expect(res.zeroSumProof.result).toBe('10000')
    })
  })
})
