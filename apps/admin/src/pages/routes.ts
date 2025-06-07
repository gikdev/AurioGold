const routes = {
  base: "/",
  home: "/",
  login: "/login",
  profile: "/profile",
  profile_changePassword: "/profile/change-password",
  onlineCount: "/online-count",
  sendSms: "/send-sms",
  customers: "/customers",

  /** ⚠️ FOR DEV TEST ONLY! */
  test: "/test",
} as const

export default routes
