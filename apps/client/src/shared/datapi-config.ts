import type { GlobalConfigOptions } from "@gikdev/react-datapi/src"
import { currentProfile } from "@repo/profile-manager"
import { notifManager, storageManager } from "@repo/shared/adapters"
import routes from "#/pages/routes"

function logOut() {
  storageManager.remove("ttkk", "sessionStorage")
  location.href = routes.login
}

const genDatApiConfig: () => GlobalConfigOptions = () => ({
  baseUrl: `${currentProfile.apiBaseUrl}/api`,
  token: storageManager.get("ttkk", "sessionStorage") || undefined,
  handle401: logOut,
  handleFallbackErrorMsg: msg =>
    notifManager.notify(msg || "مشکل ناشناخته پیش آمده! (NotCaughtError)", "toast", {
      status: "error",
    }),
})

export default genDatApiConfig
