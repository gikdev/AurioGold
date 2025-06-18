import { expect, test } from "@playwright/test"

test.describe("Customer page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8888")

    const usernameInput = page.getByTestId("username")
    const passwordInput = page.getByTestId("password")
    const submitBtn = page.getByTestId("submit")

    await usernameInput.fill("AdminMs")
    await passwordInput.fill("786M@ster313")
    await submitBtn.click()

    const customerPageLink = page.getByRole("link", { name: /مشتریان/ })
    await customerPageLink.click()

    await expect(page).toHaveURL(/customers/)
  })

  test("should have the section", async ({ page }) => {
    await expect(page.getByText("مدیریت مشتریان").nth(0)).toBeVisible()
  })

  test("should open the create new customer drawer", async ({ page }) => {
    const createCustomerBtn = page.getByTestId("create-customer-btn")

    await createCustomerBtn.click()

    const createCustomerForm = page.getByTestId("create-customer-form")

    await expect(createCustomerForm).toBeVisible()
  })

  test.fixme("should have at least one customer", async ({ page }) => {
    const firstViewCustomerBtn = page.getByTestId("view-customer-btn").nth(0)
    await expect(firstViewCustomerBtn).toBeVisible()
  })

  test("should open the customer details", async ({ page }) => {
    const viewCustomerBtn = page.getByTestId("view-customer-btn").nth(0)
    await viewCustomerBtn.click()

    const createCustomerForm = page.getByTestId("customer-details-section")
    await expect(createCustomerForm).toBeVisible()
  })
})
