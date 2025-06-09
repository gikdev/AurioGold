import { expect, test } from "@playwright/test"

test.describe("Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8888")
  })

  test("has title", async ({ page }) => {
    await expect(page).toHaveTitle(/ادمین/)
  })

  test("should automatically redirect to login page", async ({ page }) => {
    await expect(page).toHaveURL(/login/)
  })

  test("should be displaying the login form", async ({ page }) => {
    const loginForm = page.getByTestId("login-form")
    await expect(loginForm).toBeVisible()
  })

  test("should not go to home page if credentials are wrong", async ({ page }) => {
    const usernameInput = page.getByTestId("username")
    const passwordInput = page.getByTestId("password")
    const submitBtn = page.getByTestId("submit")

    await usernameInput.fill("I don't say blah blah blah!")
    await passwordInput.fill("trash@cycle.com")
    await submitBtn.click()

    await expect(page).toHaveURL(/login/)
  })
  // test("", async ({page})=>{})
})
