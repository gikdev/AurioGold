import { describe, it, expect, vi } from "vitest"
import { apiRequest } from "../src/request"

describe("apiRequest", () => {
  it("should handle successful requests", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "Content-Type": "application/json" }),
      json: () => Promise.resolve({ id: 1, name: "Test" }),
    })

    const result = await apiRequest({
      options: { url: "/test" },
    })

    expect(result.success).toBe(true)
    expect(result.data).toEqual({ id: 1, name: "Test" })
  })

  it("should handle errors", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      headers: new Headers({ "Content-Type": "application/json" }),
      json: () => Promise.resolve({ message: "Bot found" }),
    })

    const result = await apiRequest({
      options: { url: "/test" },
    })

    console.log(result)
    expect(result.success).toBe(false)
    expect(result.error).toBeTypeOf("string")
    expect(result.status).toBe(404)
  })
})
