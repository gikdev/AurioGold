import routes from "../routes"

export const QUERY_KEYS = {
  changePassword: "change-password",
  changeDisplayName: "change-display-name",
} as const

export class Navigation {
  private static readonly baseUrl = routes.profile

  private static build(params: Record<string, string | number | boolean>) {
    const searchParams = new URLSearchParams()

    for (const [key, value] of Object.entries(params))
      if (value !== undefined && value !== null && value !== "")
        searchParams.set(key, String(value))

    return `${Navigation.baseUrl}?${searchParams.toString()}`
  }

  static changePassword() {
    return Navigation.build({
      [QUERY_KEYS.changePassword]: true,
    })
  }

  static changeDisplayName() {
    return Navigation.build({
      [QUERY_KEYS.changeDisplayName]: true,
    })
  }
}
