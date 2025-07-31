import { type BrowserContext, expect, type Page, test } from "@playwright/test"

let side: "buy" | "sell" | (string & {})

function convertPersianNumberStringsBack(persianNumberStr: string): number {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
  const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

  let result = persianNumberStr.replace(/,/g, "")

  for (let i = 0; i < persianDigits.length; i++) {
    const pd = persianDigits[i]
    result = result.replace(new RegExp(pd, "g"), englishDigits[i])
  }

  const converted = Number(result)
  return converted
}

test.describe("Buying or selling effect on remaining", () => {
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

  test("testName", async ({ browser }) => {
    // Create two isolated contexts
    clientContext = await browser.newContext()
    adminContext = await browser.newContext()

    // Create pages (tabs)
    clientPage = await clientContext.newPage()
    adminPage = await adminContext.newPage()

    if (!clientPage) throw new Error("clientPage is null!")
    if (!adminPage) throw new Error("adminPage is null!")

    side = "sell"

    await clientPage.goto("http://localhost:4444/login")
    await clientPage.getByTestId("phone").fill("09309421787")
    await clientPage.getByTestId("password").fill("asdf")
    await clientPage.getByTestId("submit").click()

    await adminPage.goto("http://localhost:8888/login")
    await adminPage.getByTestId("username").fill("AdminMs")
    await adminPage.getByTestId("password").fill("786M@ster313")
    await adminPage.getByTestId("submit").click()

    const productCardTitle = clientPage.getByTestId("product-card-title").nth(0)
    const productCardTitleText = await productCardTitle.textContent()

    if (typeof productCardTitleText !== "string")
      throw new Error("`productCardTitleText` is not a `string`!")

    await clientPage.goto("http://localhost:4444/balance")

    const remainingCard = clientPage.locator("label", {
      hasText: new RegExp(productCardTitleText, "i"),
    })
    const remainingCardRawPrice = await remainingCard
      .getByTestId("portfolio-card-price")
      .textContent()
    const debtElementText = await remainingCard
      .getByTestId("portfolio-card-debt-status")
      .textContent()
    const isInDebt = (() => {
      if (debtElementText?.includes("بستانکار")) return false
      if (debtElementText?.includes("بدهکار")) return true
      return null
    })()

    if (typeof isInDebt !== "boolean") throw new Error("`isInDebt` is not a `boolean`!")
    if (typeof remainingCardRawPrice !== "string")
      throw new Error("`remainingCardRawPrice` is not a `string`!")

    const remainingCardPrice = isInDebt
      ? -convertPersianNumberStringsBack(remainingCardRawPrice)
      : convertPersianNumberStringsBack(remainingCardRawPrice)

    await clientPage.goto("http://localhost:4444/")

    const previouslySelectedProductCard = clientPage.locator("[data-testid='product-card']", {
      hasText: productCardTitleText,
    })
    await previouslySelectedProductCard.click()

    if (side === "buy") {
      await clientPage.getByTestId("buy-sell-toggle-buy-toggle").click()
    }

    if (side === "sell") {
      await clientPage.getByTestId("buy-sell-toggle-sell-toggle").click()
    }

    await clientPage.getByTestId("price-input").fill("10")
    await clientPage.getByTestId("trade-submit-btn").click()

    await adminPage.waitForTimeout(1000)

    const actionBtn = adminPage.getByTestId("accept-order-btn")
    await actionBtn.click()
    await actionBtn.click()

    await clientPage.goto("http://localhost:4444/balance")

    const remainingCard_ = clientPage.locator("label", {
      hasText: new RegExp(productCardTitleText, "i"),
    })
    const remainingCardRawPrice_ = await remainingCard_
      .getByTestId("portfolio-card-price")
      .textContent()
    const debtElementText_ = await remainingCard_
      .getByTestId("portfolio-card-debt-status")
      .textContent()
    const isInDebt_ = (() => {
      if (debtElementText_?.includes("بستانکار")) return false
      if (debtElementText_?.includes("بدهکار")) return true
      return null
    })()

    if (typeof isInDebt_ !== "boolean") throw new Error("`isInDebt` is not a `boolean`!")
    if (typeof remainingCardRawPrice_ !== "string")
      throw new Error("`remainingCardRawPrice` is not a `string`!")

    const remainingCardPrice_ = isInDebt_
      ? -convertPersianNumberStringsBack(remainingCardRawPrice_)
      : convertPersianNumberStringsBack(remainingCardRawPrice_)

    if (side === "buy") {
      expect(remainingCardPrice_ === remainingCardPrice + 10).toBe(true)
    }

    if (side === "sell") {
      expect(remainingCardPrice_ === remainingCardPrice - 10).toBe(true)
    }
  })
})
