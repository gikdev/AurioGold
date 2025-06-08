import type { CustomerDto } from "@repo/api-client/client"

const routes = {
  base: "/",
  home: "/",
  login: "/login",
  profile: "/profile",
  profile_changePassword: "/profile/change-password",
  onlineCount: "/online-count",
  sendSms: "/send-sms",
  customers: "/customers",
  customers_createNew: "/customers?create-new=true",
  customers_viewDetailsById: (id: CustomerDto["id"]) => `/customers?details=${id}`,
  customers_editById: (id: CustomerDto["id"]) => `/customers?edit=${id}`,
  customers_deleteById: (id: CustomerDto["id"]) => `/customers?delete=${id}`,

  /** ⚠️ FOR DEV TEST ONLY! */
  test: "/test",
} as const

export default routes
