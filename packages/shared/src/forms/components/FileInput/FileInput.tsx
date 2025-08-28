import { type ComponentProps, useEffect, useState } from "react"
import { notifManager } from "#shared/adapters"
import { uploadFile } from "#shared/api"
import { parseError } from "#shared/helpers"
import { FieldInfo } from "../FieldInfo"
import { useFieldContext } from "../shared"
import { Container } from "./Container"
import { Core } from "./Core"
import { FilePreview } from "./FilePreview"
import { ImagePreview } from "./ImagePreview"
import { Notes } from "./Notes"

interface FileInputProps {
  label: string
  mode: "image" | "file"
  allowedTypes: ComponentProps<typeof Core>["allowedTypes"]
  maxSizeMB?: ComponentProps<typeof Core>["maxSizeMB"]
  notes: ComponentProps<typeof Notes>["notes"]
  isPrivate: boolean
}

export function FileInput({
  label,
  mode,
  allowedTypes,
  maxSizeMB,
  notes,
  isPrivate,
}: FileInputProps) {
  const field = useFieldContext<string>()
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    if (!file) return
    let cancelled = false

    uploadFile(file, isPrivate)
      .then(fileStr => {
        if (cancelled) return

        field.handleChange(fileStr)
      })
      .catch(err => {
        if (cancelled) return

        setFile(null)
        notifyError(err)
      })

    return () => {
      cancelled = true
    }
  }, [file, field.handleChange, isPrivate])

  return (
    <Container title={label}>
      {mode === "image" && <ImagePreview file={file} />}
      {mode === "file" && <FilePreview file={file} />}

      {notes.length > 0 && <Notes notes={notes} />}

      <Core
        file={file}
        setFile={setFile}
        allowedTypes={allowedTypes}
        maxSizeMB={maxSizeMB}
        onRemove={() => field.handleChange("")}
        onInvalidFile={notifyError}
        fileInputProps={{ onBlur: field.handleBlur, id: field.name, name: field.name }}
      />

      <FieldInfo field={field} />
    </Container>
  )
}

function notifyError(err: unknown) {
  notifManager.notify(parseError(err), "toast", { status: "error" })
}
