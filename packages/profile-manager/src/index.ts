export interface Profile {
  displayName: string
  appId: string
  apiBaseUrl: string
  logoName: string
}

export type ProfileKey = "deploy" | "vahedi" | "eimani" | "asazar"

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
      logoName: "auriogold.png",
    },
    eimani: {
      displayName: "ایمانی",
      appId: "ir.eimani.auriogold_",
      apiBaseUrl: "http://192.168.10.61:4567",
      logoName: "auriogold.png",
    },
    vahedi: {
      displayName: "واحدی",
      appId: "ir.vahedigold.auriogold_",
      apiBaseUrl: "https://tapi.vahedigold.ir",
      logoName: "vahedi-logo.jpg",
    },
    asazar: {
      displayName: "آسازر",
      appId: "ir.asazar.auriogold_",
      apiBaseUrl: "https://aapi.asazar.ir",
      logoName: "auriogold.png",
    },
  },
  currentProfileKey: "deploy",
}

export const currentProfile: Profile = config.profiles[config.currentProfileKey]
