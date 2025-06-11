const routes = {
  base: "/",
  home: "/",
  login: "/login",
  profile: "/profile",
  profile_changePassword: "/profile/change-password",
  sendSms: "/send-sms",
  customers: "/customers",
  groupsGram: "/groups-gram",
  groupsNumeric: "/groups-numeric",
  onlineUsers: "/online-users",
  priceSources: "/price-sources",
  settings: "/settings",

  /** ⚠️ FOR DEV TEST ONLY! */
  test: "/test",
} as const

export default routes
