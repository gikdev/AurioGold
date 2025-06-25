import configJson from "../config.json"

export interface Profile {
  displayName: string
  appId: string
  apiBaseUrl: string
}

const profileKeys = ["deploy", "vahedi", "eimani", "asazar"] as const

export type ProfileKey = (typeof profileKeys)[number]

export const currentProfileKey = profileKeys.includes(configJson.currentProfileKey as ProfileKey)
  ? (configJson.currentProfileKey as ProfileKey)
  : "deploy"

export interface Config {
  profiles: Record<ProfileKey, Profile>
  currentProfileKey: ProfileKey
}

export const config: Config = {
  profiles: {
    deploy: {
      displayName: "اوریوگلد",
      appId: "ir.auriogold.auriogold_",
      apiBaseUrl: "https://dag.vahedigold.ir",
    },
    eimani: {
      displayName: "ایمانی",
      appId: "ir.eimani.auriogold_",
      apiBaseUrl: "http://192.168.10.61:4567",
    },
    vahedi: {
      displayName: "واحدی",
      appId: "ir.vahedigold.auriogold_",
      apiBaseUrl: "https://tapi.vahedigold.ir",
    },
    asazar: {
      displayName: "آسازر",
      appId: "ir.asazar.auriogold_",
      apiBaseUrl: "https://aapi.asazar.ir",
    },
  },
  currentProfileKey,
}

export const currentProfile: Profile = config.profiles[config.currentProfileKey]
