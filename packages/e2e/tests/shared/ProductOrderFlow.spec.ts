import { type BrowserContext, expect, type Page, test } from "@playwright/test"
import { loginAdmin } from "../helpers/login"

interface Params {
  id: string
  side: "buy" | "sell"
  doesAccept: boolean
}

const params: Params[] = [
  { id: "buy-accept", side: "buy", doesAccept: true },
  { id: "sell-accept", side: "sell", doesAccept: true },
  { id: "buy-reject", side: "buy", doesAccept: false },
  { id: "sell-reject", side: "sell", doesAccept: false },
]

test.describe("Product Order Flow", () => {
  let clientContext: BrowserContext | null = null
  let adminContext: BrowserContext | null = null
  let clientPage: Page | null = null
  let adminPage: Page | null = null

  test.afterEach(async () => {
    // This runs even if the test fails
    await Promise.allSettled([
      clientPage?.close(),
      adminPage?.close(),
      clientContext?.close(),
      adminContext?.close(),
    ])
  })

  for (const { doesAccept, id, side } of params) {
    const testName = id

    test(testName, async ({ browser }) => {
      // Create two isolated contexts
      clientContext = await browser.newContext()
      adminContext = await browser.newContext()

      // Create pages (tabs)
      clientPage = await clientContext.newPage()
      adminPage = await adminContext.newPage()

      await test.step("Client logs in", async () => {
        if (!clientPage) throw new Error("clientPage is null!")

        await clientPage.goto("http://localhost:4444/login")
        await clientPage.getByTestId("phone").fill("09309421787")
        await clientPage.getByTestId("password").fill("asdf")
        await clientPage.getByTestId("submit").click()
      })

      await test.step("Admin logs in", async () => {
        if (!adminPage) throw new Error("adminPage is null!")

        await adminPage.goto("http://localhost:8888/login")
        await adminPage.getByTestId("username").fill("AdminMs")
        await adminPage.getByTestId("password").fill("786M@ster313")
        await adminPage.getByTestId("submit").click()
        await loginAdmin(adminPage)
      })

      await test.step("Client place an order", async () => {
        if (!clientPage) throw new Error("clientPage is null!")

        await clientPage.getByTestId("product-card").nth(0).click()

        if (side === "buy") {
          await clientPage.getByTestId("buy-sell-toggle-buy-toggle").click()
        }

        if (side === "sell") {
          await clientPage.getByTestId("buy-sell-toggle-sell-toggle").click()
        }

        await clientPage.getByTestId("price-input").fill("10")
        await clientPage.getByTestId("trade-submit-btn").click()

        // Wait for order to be placed
        await clientPage.waitForTimeout(1000)
      })

      await test.step("Admin sees and processes the order", async () => {
        if (!adminPage) throw new Error("adminPage is null!")

        await adminPage.waitForTimeout(1000)
        const actionBtn = adminPage.getByTestId(
          doesAccept ? "accept-order-btn" : "reject-order-btn",
        )
        await actionBtn.click()
        await actionBtn.click()
      })

      await test.step("Client sees real-time confirmation via WebSocket", async () => {
        if (!clientPage) throw new Error("clientPage is null!")

        const expectedMsg = doesAccept ? "سفارش شما تایید شد" : "سفارش شما رد شد"

        await expect(clientPage.getByText(expectedMsg)).toBeVisible()
      })
    })
  }
})
