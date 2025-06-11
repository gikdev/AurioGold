import { formatPersianNumber } from "@repo/shared/utils"
import { describe, expect, it } from "vitest"

describe("formatPersianNumber", () => {
  it("should format your original example correctly", () => {
    expect(formatPersianNumber("۱۲۲۰۰۰۰۰")).toBe("۱۲,۲۰۰,۰۰۰")
  })

  it("should handle string input", () => {
    expect(formatPersianNumber("۱۲۳۴")).toBe("۱,۲۳۴")
    expect(formatPersianNumber("۱۲۳")).toBe("۱۲۳")
  })

  it("should handle number input", () => {
    expect(formatPersianNumber(1234)).toBe("۱,۲۳۴")
    expect(formatPersianNumber(123)).toBe("۱۲۳")
    expect(formatPersianNumber(12200000)).toBe("۱۲,۲۰۰,۰۰۰")
  })

  it("should handle mixed Persian/English digits", () => {
    expect(formatPersianNumber("1۲3۴")).toBe("۱,۲۳۴")
    expect(formatPersianNumber("۱23۴")).toBe("۱,۲۳۴")
  })

  it("should handle edge cases", () => {
    expect(formatPersianNumber("۰")).toBe("۰")
    expect(formatPersianNumber(0)).toBe("۰")
    expect(formatPersianNumber("۱۰۰")).toBe("۱۰۰")
    expect(formatPersianNumber("۱۰۰۰")).toBe("۱,۰۰۰")
  })

  it("should use regular English comma, not Arabic separators", () => {
    const result = formatPersianNumber("۱۲۳۴")
    expect(result).toContain(",") // Regular comma
    expect(result).not.toContain("،") // Persian comma
    expect(result).not.toContain("٬") // Arabic thousands separator
  })

  it("should handle large numbers", () => {
    expect(formatPersianNumber("۱۲۳۴۵۶۷۸۹")).toBe("۱۲۳,۴۵۶,۷۸۹")
    expect(formatPersianNumber(1234567890)).toBe("۱,۲۳۴,۵۶۷,۸۹۰")
  })

  it("should only output Persian digits and English commas", () => {
    const result = formatPersianNumber("123456789")
    const validChars = /^[۰-۹,]+$/
    expect(validChars.test(result)).toBe(true)
  })
})
