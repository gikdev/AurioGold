import { apiRequest } from "@gikdev/react-datapi/src"
import { notifManager } from "@repo/shared/adapters"
import { MAX_FILE_SIZE_FOR_UPLOAD } from "@repo/shared/lib"
import { useCallback, useEffect, useRef, useState } from "react"
import genDatApiConfig from "#/shared/datapi-config"
import {
  allowedTypes,
  cleanupBlobUrl,
  createPreviewUrl,
  getCurrentProfileImageUrl,
  objToKeyVal,
  saveProfileImageUrl,
  uploadFile,
} from "./profileImageUtils"

export function useProfileImageUpload() {
  const initialImageUrl = getCurrentProfileImageUrl()
  const [imageUrl, setImageUrl] = useState(initialImageUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
        .then(() => uploadFile(file))
        .then(result => {
          if (!result.success) {
            throw new Error(result.errorMsg)
          }

          return result.fileStr
        })
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
                saveProfileImageUrl(fileStr)

                // TODO
                location.reload()
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
    [imageUrl, validateFile, handleUploadError, revertToSavedImage],
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
