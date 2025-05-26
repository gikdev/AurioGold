import config from "./config.json"

interface Profile {
  displayName: string
  appId: string
  apiBaseUrl: string
  logoName: string
}

export const currentProfile: Profile = config.profiles[config.currentProfileKey]
export { config }
