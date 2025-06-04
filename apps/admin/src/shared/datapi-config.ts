import type { GlobalConfigOptions } from "@gikdev/react-datapi/src"
import { currentProfile } from "@repo/profile-manager"
import { storageManager } from "@repo/shared/adapters"

const genDatApiConfig: () => GlobalConfigOptions = () => ({
  baseUrl: `${currentProfile.apiBaseUrl}/api`,
  token: storageManager.get("ttkk", "sessionStorage") || undefined,
})

export default genDatApiConfig
