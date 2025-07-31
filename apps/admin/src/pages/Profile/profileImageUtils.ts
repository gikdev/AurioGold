import type { Ufm } from "@repo/api-client/client"
import { currentProfile } from "@repo/profile-manager"
import type { UploadResult } from "@repo/shared/components"
import type { SyntheticEvent } from "react"
import { useProfileImageUrlValue } from "#/atoms"
import genDatApiConfig from "#/shared/datapi-config"

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

function randomString(length = 20) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const charsLenght = chars.length
  let result = ""
  for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * charsLenght))
  return result
}

export async function uploadFile(file: File): Promise<UploadResult> {
  try {
    const formData = new FormData()
    const fileName = file.name
    const lastDotPosition = fileName.lastIndexOf(".")
    const fileExt = fileName.slice(lastDotPosition, fileName.length)

    formData.append("File", file)
    formData.append("Name", randomString() + fileExt)
    formData.append("Description", "")
    formData.append("IsPrivate", "false")

    const response = await fetch(`${genDatApiConfig().baseUrl}/TyFiles/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Upload failed")

    const data = await response.json()
    return { success: true, fileStr: data.adress }
  } catch (_error) {
    return { success: false, errorMsg: "آپلود فایل ناموفق بود" }
  }
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
