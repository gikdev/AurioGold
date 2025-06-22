const routes = {
  base: "/",
  home: "/",
  products: "/",
  trade: "/trade",
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
