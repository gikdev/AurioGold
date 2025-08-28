import { type SyntheticEvent, useEffect, useMemo, useRef } from "react"
import { cx } from "#shared/lib/cva.config"

const fallbackImageUrl = "/shared/fallback-400.jpg"

interface ImagePreviewProps {
  file: File | null
  className?: string
}

export function ImagePreview({ file, className = "" }: ImagePreviewProps) {
  const objectUrlRef = useRef<string | null>(null)

  const imageUrl = useMemo(() => {
    if (!file) return fallbackImageUrl

    const url = URL.createObjectURL(file)
    objectUrlRef.current = url
    return url
  }, [file])

  useEffect(() => {
    return () => {
      if (!objectUrlRef.current) return
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <p className="text-slate-12 font-bold">پیش‌نمایش فایل:</p>

      <img
        src={imageUrl}
        alt="پیش‌نمایش فایل / عکس انتخاب‌شده"
        className={cx("w-full max-w-60 block rounded-md", className)}
        onError={handleError}
      />

      <p>
        <span className="font-bold text-slate-12">اسم فایل: </span>
        <span className="text-xs">{file ? <code>{file.name}</code> : "فایلی انتخاب نشده"}</span>
      </p>
    </div>
  )
}

function handleError(e: SyntheticEvent<HTMLImageElement, Event>) {
  e.currentTarget.onerror = null
  e.currentTarget.src = fallbackImageUrl
}
