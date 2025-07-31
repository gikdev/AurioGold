import { FilePlusIcon, TrashIcon } from "@phosphor-icons/react"
import { type InputHTMLAttributes, type ReactNode, useEffect, useRef, useState } from "react"
import { notifManager } from "#shared/adapters"
import { cn } from "#shared/helpers"
import { Btn } from "./Btn"

interface FileInputContainerProps {
  title: string
  children: ReactNode
}

function FileInputContainer({ children, title }: FileInputContainerProps) {
  return (
    <fieldset className="border border-slate-6 rounded-md p-4 flex flex-col gap-5">
      <legend className="px-2 -ms-2 text-slate-12 font-bold text-lg">{title}</legend>
      {children}
    </fieldset>
  )
}

interface FileInputFilePreviewerProps {
  file: File | null
}

function FileInputFilePreviewer({ file }: FileInputFilePreviewerProps) {
  return (
    <div className="flex flex-col gap-2">
      <p>
        <span className="font-bold text-slate-12">اسم فایل: </span>
        <span className="text-xs">{file ? <code>{file.name}</code> : "فایلی انتخاب نشده"}</span>
      </p>
    </div>
  )
}

interface FileInputImagePreviewerProps {
  file: File | null
  className?: string
}

function FileInputImagePreviewer({ file, className = "" }: FileInputImagePreviewerProps) {
  const fallbackImageUrl = "/shared/fallback-400.jpg"
  const [imageUrl, setImageUrl] = useState<string>(fallbackImageUrl)

  useEffect(() => {
    if (!file) {
      setImageUrl(fallbackImageUrl)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setImageUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  return (
    <div className="flex flex-col gap-2">
      <p className="text-slate-12 font-bold">پیش‌نمایش فایل:</p>
      <img
        src={imageUrl}
        alt="پیش‌نمایش فایل / عکس انتخاب‌شده"
        className={cn("w-full max-w-60 block rounded-md", className)}
        onError={e => {
          e.currentTarget.onerror = null
          e.currentTarget.src = fallbackImageUrl
        }}
      />
      <p>
        <span className="font-bold text-slate-12">اسم فایل: </span>
        <span className="text-xs">{file ? <code>{file.name}</code> : "فایلی انتخاب نشده"}</span>
      </p>
    </div>
  )
}

interface FileInputNotesProps {
  notes: string[]
}

function FileInputNotes({ notes }: FileInputNotesProps) {
  if (!notes.length) return null

  return (
    <div className="">
      <p className="text-slate-12 font-bold">نکات:</p>
      <ul className="ps-2">
        {notes.map(n => (
          <li className="" key={n}>
            - {n}
          </li>
        ))}
      </ul>
    </div>
  )
}

interface FileInputFileInputProps {
  file: File | null
  setFile: (file: File | null) => void
  fileInputProps?: InputHTMLAttributes<HTMLInputElement>
  allowedTypes: string[]
  maxSizeMB?: number
  onInvalidFile?: (reason: string) => void
  onRemove?: () => void
}

function FileInputFileInput({
  file,
  setFile,
  fileInputProps,
  allowedTypes,
  maxSizeMB = 2,
  onInvalidFile,
  onRemove,
}: FileInputFileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChooseBtnClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileDeletion = () => {
    if (!fileInputRef.current) return
    fileInputRef.current.value = ""
    setFile(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) {
      setFile?.(null)
      return
    }

    // Validate format
    if (!allowedTypes.includes(file.type)) {
      onInvalidFile?.("فرمت فایل پشتیبانی نمی‌شود.")
      setFile?.(null)
      return
    }

    // Validate size
    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > maxSizeMB) {
      onInvalidFile?.(`حجم فایل بیشتر از ${maxSizeMB} مگابایت است.`)
      setFile?.(null)
      return
    }

    setFile?.(file)
  }

  useEffect(() => {
    if (file || !fileInputRef.current) return
    fileInputRef.current.value = ""
    onRemove?.()
  }, [file, onRemove])

  return (
    <div className="flex gap-2">
      <Btn
        type="button"
        onClick={handleChooseBtnClick}
        theme="primary"
        themeType="filled"
        className="flex-1"
        disabled={!!file}
      >
        <FilePlusIcon size={24} />
        <span>انتخاب فایل</span>
      </Btn>

      <Btn
        type="button"
        onClick={handleFileDeletion}
        theme="error"
        className="flex-1"
        disabled={!file}
      >
        <TrashIcon size={24} />
        <span>حذف فایل</span>
      </Btn>

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

export type UploadResult = { success: true; fileStr: string } | { success: false; errorMsg: string }

interface FileInputProps {
  label: string
  mode: "image" | "file"
  allowedTypes: FileInputFileInputProps["allowedTypes"]
  maxSizeMB?: FileInputFileInputProps["maxSizeMB"]
  notes: FileInputNotesProps["notes"]
  onUploaded: (fileStr: string) => void
  onRemove?: FileInputFileInputProps["onRemove"]
  uploadFn: (file: File) => Promise<UploadResult>
  errorMsg?: string
}

function FileInput({
  label,
  mode,
  allowedTypes,
  maxSizeMB,
  notes,
  onUploaded,
  uploadFn,
  onRemove,
  errorMsg,
}: FileInputProps) {
  const [file, setFile] = useState<File | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    if (!file) return
    let cancelled = false

    uploadFn(file)
      .then(result => {
        if (cancelled) return
        if (result.success) {
          onUploaded(result.fileStr)
        } else {
          setFile(null)
          notifManager.notify(result.errorMsg, "toast", { status: "error" })
        }
      })
      .catch(err => {
        if (cancelled) return
        setFile(null)
        notifManager.notify(typeof err === "string" ? err : String(err), "toast", {
          status: "error",
        })
      })

    return () => {
      cancelled = true
    }
  }, [file])

  return (
    <FileInputContainer title={label}>
      {mode === "image" && <FileInputImagePreviewer file={file} />}
      {mode === "file" && <FileInputFilePreviewer file={file} />}

      <FileInputNotes notes={notes} />

      <FileInputFileInput
        file={file}
        allowedTypes={allowedTypes}
        maxSizeMB={maxSizeMB}
        setFile={setFile}
        onRemove={onRemove}
        onInvalidFile={msg => notifManager.notify(msg, "toast", { status: "error" })}
      />

      {errorMsg && <p className="text-xs text-start text-red-10">{errorMsg}</p>}
    </FileInputContainer>
  )
}

function generateAllowedExtensionsNote(formats: string[]) {
  return `فرمت‌های جایز: ${formats.join(" ،")}`
}

function generateFileSizeNote(maxFileSizeInMb: number) {
  return `حداکثر حجم مجاز فایل ${maxFileSizeInMb} مگابایت هست`
}

function generateFileTypeNote(fileTypes: string | string[]) {
  if (typeof fileTypes === "string") return `فقط میتوانید «${fileTypes}» انتخاب کنید`
  if (Array.isArray(fileTypes) && fileTypes.length === 1)
    return `فقط میتوانید «${fileTypes[0]}» انتخاب کنید`

  const fileTypesString = fileTypes
    .map((f, i) => (i >= fileTypes.length - 1 ? `و «${f}»` : `«${f}»، `))
    .join("")

  return `فقط میتوانید ${fileTypesString} انتخاب کنید`
}

const helpers = {
  generateAllowedExtensionsNote,
  generateFileSizeNote,
  generateFileTypeNote,
}

FileInput.helpers = helpers

export { FileInput }
