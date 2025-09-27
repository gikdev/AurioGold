const routes = {
  base: "/",
  home: "/",
  products: "/",
  tradeById: (id: number | ":id" = ":id") => `/trade/${id}`,
  login: "/login",
  transactions: "/transactions",
  logout: "/logout",
  profile: "/profile",
  balance: "/balance",
  orders: "/orders",
  rules: "/rules",
  about: "/about",
  settings: "/settings",

  /** ⚠️ FOR DEV TEST ONLY! */
  test: "/test",
} as const

export default routes
