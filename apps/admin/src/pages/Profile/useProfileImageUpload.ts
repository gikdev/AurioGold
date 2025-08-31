import { apiRequest } from "@gikdev/react-datapi/src"
import { notifManager } from "@repo/shared/adapters"
import { uploadFile } from "@repo/shared/api"
import { MAX_FILE_SIZE_FOR_UPLOAD } from "@repo/shared/lib"
import { useCallback, useEffect, useRef, useState } from "react"
import { useSetProfileImageUrl } from "#/atoms"
import genDatApiConfig from "#/shared/datapi-config"
import {
  allowedTypes,
  cleanupBlobUrl,
  createPreviewUrl,
  objToKeyVal,
  useCurrentProfileImageUrl,
} from "./profileImageUtils"

export function useProfileImageUpload() {
  const initialImageUrl = useCurrentProfileImageUrl()
  const [imageUrl, setImageUrl] = useState(initialImageUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const setProfileImageUrl = useSetProfileImageUrl()

  const revertToSavedImage = useCallback(() => {
    cleanupBlobUrl(imageUrl)
    setImageUrl(initialImageUrl)
  }, [imageUrl, initialImageUrl])

  const handleUploadError = useCallback(
    (errorMsg: string) => {
      revertToSavedImage()

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      notifManager.notify(errorMsg, "toast", { status: "error" })
    },
    [revertToSavedImage],
  )

  const validateFile = useCallback((file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return "فرمت فایل پشتیبانی نمی‌شود."
    }

    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > MAX_FILE_SIZE_FOR_UPLOAD) {
      return `حجم فایل بیشتر از ${MAX_FILE_SIZE_FOR_UPLOAD} مگابایت است.`
    }

    return null
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]

      if (!file) {
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }

        return
      }

      const validationError = validateFile(file)
      if (validationError) {
        handleUploadError(validationError)
        return
      }

      cleanupBlobUrl(imageUrl)
      const previewUrl = createPreviewUrl(file)
      setImageUrl(previewUrl)

      Promise.resolve()
        .then(() => uploadFile("admin", file, false))
        .then(fileStr => {
          const dataToSend = objToKeyVal({
            logoUrl: fileStr,
          })

          apiRequest({
            config: genDatApiConfig(),
            options: {
              url: "/Master/UpdateF",
              method: "POST",
              body: JSON.stringify(dataToSend),

              onSuccess() {
                cleanupBlobUrl(imageUrl)
                setProfileImageUrl(fileStr)
              },
            },
          })
        })
        .catch(err => {
          revertToSavedImage()
          const errorMsg = typeof err === "string" ? err : String(err)
          notifManager.notify(errorMsg, "toast", { status: "error" })
        })
    },
    [imageUrl, validateFile, handleUploadError, revertToSavedImage, setProfileImageUrl],
  )

  useEffect(() => {
    return () => {
      cleanupBlobUrl(imageUrl)
    }
  }, [imageUrl])

  return {
    imageUrl,
    fileInputRef,
    handleFileChange,
  }
}
