import type { GlobalConfigOptions } from "@gikdev/react-datapi/src"
import { currentProfile } from "@repo/profile-manager"
import { notifManager, storageManager } from "@repo/shared/adapters"

const genDatApiConfig: () => GlobalConfigOptions = () => ({
  baseUrl: `${currentProfile.apiBaseUrl}/api`,
  token: storageManager.get("ttkk", "sessionStorage") || undefined,
  handleFallbackErrorMsg: msg =>
    notifManager.notify(msg || "مشکل ناشناخته پیش آمده! (NotCaughtError)", "toast", {
      status: "error",
    }),
})

export default genDatApiConfig
