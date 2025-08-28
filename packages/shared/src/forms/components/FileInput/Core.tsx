import { FilePlusIcon, TrashIcon } from "@phosphor-icons/react"
import { type InputHTMLAttributes, useRef } from "react"
import { skins } from "#shared/forms/skins"
import { MAX_FILE_SIZE_FOR_UPLOAD } from "#shared/lib"

interface CoreProps {
  file: File | null
  setFile: (file: File | null) => void

  fileInputProps?: InputHTMLAttributes<HTMLInputElement>

  allowedTypes: string[]
  maxSizeMB?: number

  onInvalidFile: (reason: string) => void
  onRemove: () => void
}

export function Core({
  file,
  setFile,

  fileInputProps,

  allowedTypes,
  maxSizeMB = MAX_FILE_SIZE_FOR_UPLOAD,

  onInvalidFile,
  onRemove,
}: CoreProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChooseBtnClick = () => {
    if (!fileInputRef.current) return
    fileInputRef.current.click()
  }

  const deleteFile = () => {
    if (!fileInputRef.current) return
    fileInputRef.current.value = ""
    setFile(null)
    onRemove()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const file = input.files?.[0]

    if (!file) {
      deleteFile()
      return
    }

    // Validate format
    if (!allowedTypes.includes(file.type)) {
      onInvalidFile("فرمت فایل پشتیبانی نمی‌شود.")
      deleteFile()
      return
    }

    // Validate size
    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > maxSizeMB) {
      onInvalidFile(`حجم فایل بیشتر از ${maxSizeMB} مگابایت است.`)
      deleteFile()
      return
    }

    setFile(file)
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleChooseBtnClick}
        className={skins.btn({ intent: "primary", style: "filled", className: "flex-1" })}
        disabled={file instanceof File}
      >
        <FilePlusIcon size={24} />
        <span>انتخاب فایل</span>
      </button>

      <button
        type="button"
        onClick={deleteFile}
        className={skins.btn({ intent: "error", className: "flex-1" })}
        disabled={file == null}
      >
        <TrashIcon size={24} />
        <span>حذف فایل</span>
      </button>

      <input
        {...fileInputProps}
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(",")}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
