import type { Ufm } from "@repo/api-client"
import { currentProfile } from "@repo/profile-manager"
import type { SyntheticEvent } from "react"
import { useProfileImageUrlValue } from "#/atoms"

export const fallbackImageUrl = "/shared/fallback-400.jpg"
export const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"]

export function getImageUrl(imgUrl: string | null | undefined): string {
  if (!imgUrl) return fallbackImageUrl
  if (!imgUrl.startsWith("http")) return `${currentProfile.apiBaseUrl}/${imgUrl}`
  return imgUrl
}

export function useCurrentProfileImageUrl(): string {
  const logoUrl = useProfileImageUrlValue()
  return getImageUrl(logoUrl)
}

export function cleanupBlobUrl(url: string): void {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url)
  }
}

export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file)
}

export function handleImageLoadError(e: SyntheticEvent<HTMLImageElement, Event>) {
  e.currentTarget.onerror = null
  e.currentTarget.src = fallbackImageUrl
}

export function objToKeyVal(obj: Record<string, string | null>) {
  return {
    dataVal: Object.keys(obj).map(key => ({
      key: capitalize(key),
      val: obj[key],
    })),
  } satisfies Ufm
}

export function capitalize(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1)
}

export function loweralize(input: string) {
  return input.charAt(0).toLowerCase() + input.slice(1)
}
