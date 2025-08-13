import configJson from "../config.json"

export interface Profile {
  displayName: string
  appId: string
  apiBaseUrl: string
  appTitleAdmin: string
  appTitleClient: string
}

const profileKeys = ["deploy", "vahedi", "asazar", "hgold"] as const

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
      appTitleAdmin: "ادمین اوریوگلد",
      appTitleClient: "اوریوگلد",
    },
    vahedi: {
      displayName: "واحدی",
      appId: "ir.vahedigold.auriogold_",
      apiBaseUrl: "https://tapi.vahedigold.ir",
      appTitleAdmin: "ادمین واحدی",
      appTitleClient: "طلای واحدی",
    },
    asazar: {
      displayName: "آسازر",
      appId: "ir.asazar.auriogold_",
      apiBaseUrl: "https://aapi.asazar.ir",
      appTitleAdmin: "ادمین آسازر",
      appTitleClient: "آسازر",
    },
    hgold: {
      displayName: "ایچ‌گلد",
      appId: "ir.hgoldzar.auriogold_",
      apiBaseUrl: "https://hapi.hgoldzar.ir",
      appTitleAdmin: "ادمین ایچ‌گلد",
      appTitleClient: "ایچ‌گلد",
    },
  },
  currentProfileKey,
}

export const currentProfile: Profile = config.profiles[config.currentProfileKey]
