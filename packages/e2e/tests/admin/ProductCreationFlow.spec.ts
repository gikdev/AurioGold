import { fakerFA as faker } from "@faker-js/faker"
import { expect, test } from "@playwright/test"

test("Customer creation flow", async ({ page }) => {
  let productName: string | null = null

  await test.step("Admin logs in", async () => {
    await page.goto("http://localhost:8888/login")
    await page.getByTestId("username").fill("AdminMs")
    await page.getByTestId("password").fill("786M@ster313")
    await page.getByTestId("submit").click()
  })

  await test.step("Goes to manage products page", async () => {
    const link = page.getByRole("link", { name: /مدیریت محصولات/i })
    await link.click()
  })

  await test.step("Opens create product modal", async () => {
    const modalBtn = page.getByTitle(/ایجاد محصول جدید/i)
    await modalBtn.click()
  })

  await test.step("Fills required stuff, then submits it", async () => {
    productName = faker.commerce.product()

    await page.getByLabel(/نام/i).nth(0).fill(productName)
    await page.getByLabel(/وضعیت خرید و فروش/i).selectOption("قابل خرید و فروش")
    await page.waitForTimeout(3000)
    await page.getByLabel(/منبع قیمت/i).selectOption("نیم سکه")
    await page.getByRole("button", { name: /ایجاد/i }).click()
  })

  await test.step("Check if product is created or not!", async () => {
    if (typeof productName !== "string") return
    await expect(page.getByText(productName)).toBeVisible()
  })
})
