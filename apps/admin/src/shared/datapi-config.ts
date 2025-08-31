import type { GlobalConfigOptions } from "@gikdev/react-datapi/src"
import { currentProfile } from "@repo/profile-manager"
import { notifManager, storageManager } from "@repo/shared/adapters"
import { logout } from "#/atoms"

const genDatApiConfig: () => GlobalConfigOptions = () => ({
  baseUrl: `${currentProfile.apiBaseUrl}/api`,
  token: storageManager.get("admin_ttkk", "sessionStorage") || undefined,
  handle401: logout,
  handleFallbackErrorMsg: msg =>
    notifManager.notify(msg || "مشکل ناشناخته پیش آمده! (NotCaughtError)", "toast", {
      status: "error",
    }),
})

export default genDatApiConfig
