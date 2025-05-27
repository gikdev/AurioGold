import config from "./config.json"

interface Profile {
  displayName: string
  appId: string
  apiBaseUrl: string
  logoName: string
}

type ProfileKey = keyof typeof config.profiles

export const currentProfile: Profile = config.profiles[config.currentProfileKey as ProfileKey]

export { config }
