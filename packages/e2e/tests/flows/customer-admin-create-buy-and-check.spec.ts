import { faker } from "@faker-js/faker"
import { type BrowserContext, expect, type Page, test } from "@playwright/test"

/** Converts a Persian number string to an English number */
function persianToNumber(persianNumberString: string): number {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹"
  const englishDigits = "0123456789"

  const englishNumberString = persianNumberString
    .split("")
    .map(ch => {
      const index = persianDigits.indexOf(ch)
      return index !== -1 ? englishDigits[index] : ch
    })
    .join("")

  return Number(englishNumberString)
}

function fakeIranianishPhone() {
  return `09${faker.number.int({ min: 100000000, max: 999999999 })}`
}

function randomStupidPersianName(): string {
  const prefixes = ["مستر", "استاد", "دکتر", "جناب", "کاپیتان"]
  const funnyWords = [
    "پشمک",
    "پاندا",
    "بستنی",
    "شیرموز",
    "پفک",
    "لوبیا",
    "خیار",
    "لواشک",
    "خرگوش",
    "نارگیل",
    "کالباس",
    "کتلت",
    "سیب‌زمینی",
  ]

  const number = faker.number.int({ min: 1, max: 99 })
  const prefix = faker.helpers.arrayElement(prefixes)
  const word = faker.helpers.arrayElement(funnyWords)

  return `${prefix} ${word} ${number}`
}

function randomStupidProductName(): string {
  const funnyProducts = [
    "پشمک",
    "پاندا",
    "بستنی",
    "شیرموز",
    "پفک",
    "لوبیا",
    "خیار",
    "لواشک",
    "خرگوش",
    "نارگیل",
    "کالباس",
    "کتلت",
    "سیب‌زمینی",
    "کیک",
    "چای",
    "شکلات",
    "نوشابه",
    "موشک",
    "قورباغه",
    "خرس",
    "اسپرسو",
  ]

  const suffixes = ["پلاس", "پرو", "ایکس", "کلاسیک", "طلایی", "افسانه‌ای", "فانتزی", "ویژه", "مخصوص"]

  const product = faker.helpers.arrayElement(funnyProducts)
  const suffix = faker.helpers.arrayElement(suffixes)
  const number = faker.number.int({ min: 1, max: 99 })

  return `${product} ${suffix} ${number}`
}

const client = {
  context: undefined as BrowserContext | undefined,
  page: undefined as Page | undefined,
  fullName: randomStupidPersianName(),
  phone: fakeIranianishPhone(),
  password: "asdfasdf",
}

const admin = {
  context: undefined as BrowserContext | undefined,
  page: undefined as Page | undefined,
  username: "AdminMs",
  password: "786M@ster313",
}

const product = {
  name: randomStupidProductName(),
  price: 10_000,
  purchaseAmount: 10,
  buyAndSellStatus: "3",
  priceSource: "تست",
}

test.describe("Customer admin create and client login flow", () => {
  test.afterEach(async () => {
    await Promise.allSettled([
      client.page?.close(),
      client.context?.close(),
      admin.page?.close(),
      admin.context?.close(),
    ])
  })

  test("Create customer and client login", async ({ browser }) => {
    admin.context = await browser.newContext()
    admin.page = await admin.context.newPage()

    client.context = await browser.newContext()
    client.page = await client.context.newPage()

    // --- Admin login
    await client.page.goto("http://localhost:4444/")
    await admin.page.goto("http://localhost:8888/login")
    await admin.page.getByLabel(/نام کاربری/).fill("AdminMs")
    await admin.page.getByLabel(/گذرواژه/).fill("786M@ster313")
    await admin.page.getByRole("button", { name: /ورود/ }).click()

    // --- Admin creates new customer
    await admin.page.getByRole("link", { name: "مدیریت مشتریان" }).click()
    await admin.page.getByRole("button", { name: "ایجاد مشتری جدید" }).click()

    await admin.page.getByRole("textbox", { name: "نام کامل *" }).fill(client.fullName)
    await admin.page.getByRole("textbox", { name: "شماره تلفن *" }).fill(client.phone)
    await admin.page.getByRole("textbox", { name: "گذرواژه *", exact: true }).fill(client.password)
    await admin.page.getByRole("textbox", { name: "تکرار گذرواژه *" }).fill(client.password)

    await admin.page.getByLabel(/گروه مشتری گرمی/).selectOption("1")
    await admin.page.getByLabel(/گروه مشتری عددی/).selectOption("2")

    await admin.page.getByRole("button", { name: "ایجاد مشتری", exact: true }).click()
    await admin.page.waitForTimeout(2000)
    await expect(admin.page.getByRole("button", { name: client.fullName })).toBeVisible()

    // --- Client login
    await client.page.getByLabel(/شماره/).fill(client.phone)
    await client.page.getByLabel(/گذرواژه/).fill(client.password)
    await client.page.getByRole("button", { name: /ورود/ }).click()

    // --- Admin create new product
    await admin.page.getByRole("link", { name: "مدیریت محصولات" }).click()
    await admin.page.getByRole("button", { name: "ایجاد محصول جدید" }).click()

    await admin.page.getByRole("textbox", { name: "نام *" }).fill(product.name)
    await admin.page.getByLabel(/قیمت/).nth(0).fill(product.price.toString())
    await admin.page.getByLabel("حداکثر حجم معامله (گرم) *").fill(product.purchaseAmount.toString())
    await admin.page.getByLabel("وضعیت خرید و فروش *").selectOption(product.buyAndSellStatus)
    await admin.page.getByLabel("نحوه معامله *").selectOption("تعدادی")
    await admin.page.getByLabel("منبع قیمت:").selectOption({ label: product.priceSource })
    await admin.page.getByLabel("نوع معامله *").selectOption("عادی")
    await admin.page.getByLabel("حداکثر ارزش محصول *").fill("1000000000000")

    await admin.page.getByTestId("product-drawer-submit-btn").click()

    // --- Client purchase the new product
    await client.page.goto("http://localhost:4444/")
    await client.page.getByText(new RegExp(product.name)).click()
    await client.page.getByTestId("price-input").fill(product.purchaseAmount.toString())
    await client.page.getByRole("button", { name: "خرید", exact: true }).click()

    // --- Admin accepts the purchase
    ;(await admin.page.getByRole("button", { name: "تایید" }).all()).map(
      async btn => await btn.click(),
    )

    ;(await admin.page.getByRole("button", { name: "تایید" }).all()).map(
      async btn => await btn.click().catch(() => {}),
    )

    ;(await admin.page.getByRole("button", { name: "تایید" }).all()).map(
      async btn => await btn.click().catch(() => {}),
    )

    // --- Client sees accepted
    await expect(client.page.getByText(/تایید شد/)).toBeVisible({ timeout: 5000 })

    // --- Client checks to see if remaining is correct or not
    await client.page.goto("http://localhost:4444/balance")
    const card = client.page.locator('label[data-testid="portfolio-card"]', {
      has: client.page.locator(`span:text-is("${product.name}")`),
    })
    const priceLocator = card.locator('[data-testid="portfolio-card-price"]')
    const priceText = await priceLocator.textContent()
    if (!priceText) throw new Error("price text is null!")
    const price = persianToNumber(priceText)

    expect(price).toBe(product.purchaseAmount)
  })
})
