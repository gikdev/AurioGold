import { expect, test } from "@playwright/test"

test("client buys gold, admin accepts, client sees confirmation", async ({ browser }) => {
  // Create two isolated contexts
  const clientContext = await browser.newContext({ isMobile: true })
  const adminContext = await browser.newContext()

  // Create pages (tabs)
  const clientPage = await clientContext.newPage()
  const adminPage = await adminContext.newPage()

  await test.step("Client logs in", async () => {
    await clientPage.goto("http://localhost:4444/login")
    await clientPage.getByTestId("phone").fill("09309421787")
    await clientPage.getByTestId("password").fill("asdf")
    await clientPage.getByTestId("submit").click()
  })

  await test.step("Admin logs in", async () => {
    await adminPage.goto("http://localhost:8888/login")
    await adminPage.getByTestId("username").fill("AdminMs")
    await adminPage.getByTestId("password").fill("786M@ster313")
    await adminPage.getByTestId("submit").click()
  })

  await test.step("Client palce an order", async () => {
    await clientPage.getByTestId("product-card").nth(0).click()
    await clientPage.getByTestId("price-input").fill("10")
    await clientPage.getByTestId("trade-submit-btn").click()
  })

  await test.step("Admin sees and accepts the order", async () => {
    const acceptBtn = adminPage.getByTestId("accept-order-btn")
    await expect(acceptBtn).toBeVisible()
    await expect(acceptBtn).toBeEnabled()
    await acceptBtn.click()
    await acceptBtn.click()
  })

  await test.step("Client sees real-time confirmation via WebSocket", async () => {
    await clientPage.waitForTimeout(3000)
    await expect(clientPage.getByText("سفارش شما تایید شد")).toBeVisible()
  })
})
