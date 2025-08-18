import { describe, expect, it } from "vitest"
import { calcOutputRial, calcOutputWeight } from "./shared"

describe("calcOutputWeight", () => {
  it("should calculate weight correctly with 2 decimals", () => {
    const result = calcOutputWeight(1_000_000, 500_000, 1, 2)
    // 1_000_000 / 500_000 = 2 → * 1 = 2
    expect(result).toBe(2.0)
  })

  it("should handle decimal precision", () => {
    const result = calcOutputWeight(3333, 1000, 1, 3)
    // 3333/1000=3.333 → rounded to 3 decimals
    expect(result).toBe(3.333)
  })

  it("should return 0 if NaN", () => {
    // biome-ignore lint/suspicious/noExplicitAny: I have to
    const result = calcOutputWeight(NaN as any, 1000, 1, 2)
    expect(result).toBe(0)
  })
})

describe("calcOutputRial", () => {
  it("should calculate rial correctly", () => {
    const result = calcOutputRial(2, 500_000, 1)
    // (2 * 500000) / 1 = 1_000_000 → floor = 1_000_000
    expect(result).toBe(1_000_000)
  })

  it("should floor decimals", () => {
    const result = calcOutputRial(2.5, 500_000, 2)
    // (2.5*500000)/2 = 625000 → floor = 625000
    expect(result).toBe(625000)
  })
})
