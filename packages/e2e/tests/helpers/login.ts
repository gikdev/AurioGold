import type { Page } from "@playwright/test"

export async function loginAdmin(adminPage: Page) {
  await adminPage.goto("http://localhost:8888/login")
  await adminPage.getByTestId("username").fill("AdminMs")
  await adminPage.getByTestId("password").fill("1qazxsw23edc")
  await adminPage.getByTestId("submit").click()
}