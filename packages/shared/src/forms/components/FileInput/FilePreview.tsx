interface FilePreviewProps {
  file: File | null
}

export function FilePreview({ file }: FilePreviewProps) {
  return (
    <div className="flex flex-col gap-2">
      <p>
        <span className="font-bold text-slate-12">اسم فایل: </span>
        <span className="text-xs">{file ? <code>{file.name}</code> : "فایلی انتخاب نشده"}</span>
      </p>
    </div>
  )
}
