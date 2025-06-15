import { formatPersianPrice } from "@repo/shared/utils"
import { describe, expect, it } from "vitest"

describe("formatPersianNumber", () => {
  it("should format your original example correctly", () => {
    expect(formatPersianPrice("۱۲۲۰۰۰۰۰")).toBe("۱۲,۲۰۰,۰۰۰")
  })

  it("should handle string input", () => {
    expect(formatPersianPrice("۱۲۳۴")).toBe("۱,۲۳۴")
    expect(formatPersianPrice("۱۲۳")).toBe("۱۲۳")
  })

  it("should handle number input", () => {
    expect(formatPersianPrice(1234)).toBe("۱,۲۳۴")
    expect(formatPersianPrice(123)).toBe("۱۲۳")
    expect(formatPersianPrice(12200000)).toBe("۱۲,۲۰۰,۰۰۰")
  })

  it("should handle mixed Persian/English digits", () => {
    expect(formatPersianPrice("1۲3۴")).toBe("۱,۲۳۴")
    expect(formatPersianPrice("۱23۴")).toBe("۱,۲۳۴")
  })

  it("should handle edge cases", () => {
    expect(formatPersianPrice("۰")).toBe("۰")
    expect(formatPersianPrice(0)).toBe("۰")
    expect(formatPersianPrice("۱۰۰")).toBe("۱۰۰")
    expect(formatPersianPrice("۱۰۰۰")).toBe("۱,۰۰۰")
  })

  it("should use regular English comma, not Arabic separators", () => {
    const result = formatPersianPrice("۱۲۳۴")
    expect(result).toContain(",") // Regular comma
    expect(result).not.toContain("،") // Persian comma
    expect(result).not.toContain("٬") // Arabic thousands separator
  })

  it("should handle large numbers", () => {
    expect(formatPersianPrice("۱۲۳۴۵۶۷۸۹")).toBe("۱۲۳,۴۵۶,۷۸۹")
    expect(formatPersianPrice(1234567890)).toBe("۱,۲۳۴,۵۶۷,۸۹۰")
  })

  it("should only output Persian digits and English commas", () => {
    const result = formatPersianPrice("123456789")
    const validChars = /^[۰-۹,]+$/
    expect(validChars.test(result)).toBe(true)
  })
})
