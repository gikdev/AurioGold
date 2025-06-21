const routes = {
  base: "/",
  home: "/",
  trade: "/",
  trade_productById: (id: number | string) => `/product/${id}`,
  login: "/login",
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
