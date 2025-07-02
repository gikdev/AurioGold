import { fakerFA as faker } from "@faker-js/faker"
import { expect, test } from "@playwright/test"

test("Customer creation flow", async ({ page }) => {
  let fullName: string | null = null

  await test.step("Admin logs in", async () => {
    await page.goto("http://localhost:8888/login")
    await page.getByTestId("username").fill("AdminMs")
    await page.getByTestId("password").fill("786M@ster313")
    await page.getByTestId("submit").click()
  })

  await test.step("Go to manage customers page", async () => {
    const customersLink = page.getByRole("link", { name: /مدیریت مشتریان/i })
    await customersLink.click()
  })

  await test.step("Open create customer modal", async () => {
    const openCreateCustomerModalBtn = page.getByTitle(/ایجاد مشتری جدید/i)
    await openCreateCustomerModalBtn.click()
  })

  await test.step("Fill required, submit", async () => {
    fullName = faker.person.fullName()
    const phone = force09Start(faker.phone.number({ style: "national" }).split(" ").join(""))
    const pw = faker.internet.password()
    const gramGroup = "گروه صفر"
    const numericGroup = "پشمکیان"

    await page.getByLabel(/نام کامل/i).fill(fullName)
    await page.getByLabel(/تلفن/i).fill(phone)
    await page
      .getByLabel(/گذرواژه/i)
      .nth(0)
      .fill(pw)
    await page.getByLabel(/تکرار گذرواژه/i).fill(pw)
    await page.getByLabel(/گروه مشتری گرمی/i).selectOption(gramGroup)
    await page.getByLabel(/گروه مشتری عددی/i).selectOption(numericGroup)
    await page.getByRole("button", { name: /ایجاد/i }).click()
  })

  await test.step("Check if user is created or not!", async () => {
    if (typeof fullName !== "string") return
    await expect(page.getByText(fullName)).toBeVisible()
  })
})

function force09Start(phone: string) {
  return `09${phone.slice(2)}`
}
