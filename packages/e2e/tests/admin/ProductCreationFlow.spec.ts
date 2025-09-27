import { fakerFA as faker } from "@faker-js/faker"
import { expect, test } from "@playwright/test"
import { loginAdmin } from "../helpers/login"

test("Customer creation flow", async ({ page }) => {
  let productName: string | null = null

  await loginAdmin(page)

  // Goes to manage products page
  await page.getByRole("link", { name: /مدیریت محصولات/i }).click()

  // Opens create product modal
  await page.getByTitle(/ایجاد محصول جدید/i).click()

  await test.step("Fills required stuff, then submits it", async () => {
    productName = faker.commerce.product()

    await page.getByLabel(/نام/i).nth(0).fill(productName)
    await page.getByLabel(/وضعیت خرید و فروش/i).selectOption("قابل خرید و فروش")
    await page.waitForTimeout(3000)
    await page.getByLabel(/منبع قیمت/i).selectOption("نیم سکه")
    await page.getByLabel(/نحوه معامله/i).selectOption("تعدادی")
    await page.getByLabel(/نوع معامله/i).selectOption("عادی")
    await page.getByRole("button", { name: /ایجاد محصول/i }).nth(0).click()
  })

  await test.step("Check if product is created or not!", async () => {
    if (typeof productName !== "string") return
    await expect(page.getByText(productName)).toBeVisible()
  })
})
