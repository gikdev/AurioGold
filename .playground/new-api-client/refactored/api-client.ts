import { apiClientFetch } from "./core"
import { useAPIClientFetch } from "./hook"

export const apiClient = {
  fetch: apiClientFetch,
  useFetch: useAPIClientFetch,
}
