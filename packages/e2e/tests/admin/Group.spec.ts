import { fakerFA as faker } from "@faker-js/faker"
import test, { expect, type Page } from "@playwright/test"

type GroupMode = "gram" | "count"
const groupMode: GroupMode = "count" as GroupMode

let groupName: string = ""

const getRandomGroupName = () => ["اهل کتاب‌های", faker.book.genre()].join(" ")

async function logInAsAdmin(page: Page) {
  await page.goto("http://localhost:8888/login")
  await page.getByTestId("username").fill("AdminMs")
  await page.getByTestId("password").fill("1qazxsw23edc")
  await page.getByTestId("submit").click()
}

test.describe
  .serial(`${groupMode} group`, () => {
    test.beforeEach(async ({ page }) => {
      await logInAsAdmin(page)

      if (groupMode === "gram") {
        await page.getByRole("link", { name: "مدیریت گروه گرمی" }).click()
      }

      if (groupMode === "count") {
        await page.getByRole("link", { name: "مدیریت گروه عددی" }).click()
      }
    })

    test("Create group", async ({ page }) => {
      await page.getByRole("button", { name: "ایجاد گروه جدید" }).click()

      groupName = getRandomGroupName()
      await page.getByRole("textbox", { name: "نام *" }).fill(groupName)

      if (groupMode === "gram") {
        await page.getByTestId("gram-group-drawer-submit-btn").click()
      }

      if (groupMode === "count") {
        await page.getByTestId("numeric-group-drawer-submit-btn").click()
      }

      await expect(page.getByText("گروه با موفقیت ایجاد شد!")).toBeVisible()
      const newlyCreatedGroupCard = page.getByRole("button", { name: new RegExp(groupName) })
      await expect(newlyCreatedGroupCard).toBeVisible()
    })

    test("Edit group", async ({ page }) => {
      await page.getByRole("button", { name: new RegExp(groupName) }).click()
      await page.getByRole("button", { name: "ویرایش" }).click()

      const previousGroupName = groupName
      groupName = getRandomGroupName()

      await page.getByRole("textbox", { name: "نام *" }).fill(groupName)

      if (groupMode === "gram") {
        await page.getByTestId("gram-group-drawer-submit-btn").click()
      }

      if (groupMode === "count") {
        await page.getByTestId("numeric-group-drawer-submit-btn").click()
      }

      await expect(page.getByText("گروه با موفقیت ویرایش شد!")).toBeVisible()
      await expect(page.getByRole("button", { name: new RegExp(previousGroupName) })).toHaveCount(0)
    })

    test("Delete the group", async ({ page }) => {
      await page.getByRole("button", { name: new RegExp(groupName) }).click()

      await page.getByRole("button", { name: "حذف" }).click()
      await page.getByRole("button", { name: "بله، حذفش کن" }).click()

      await expect(page.getByText("گروه با موفقیت حذف شد")).toBeVisible()
      const newlyDeletedGroupCard = page.getByRole("button", { name: new RegExp(groupName) })
      await expect(newlyDeletedGroupCard).toHaveCount(0)
    })
  })
