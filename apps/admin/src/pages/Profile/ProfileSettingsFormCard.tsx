import { zodResolver } from "@hookform/resolvers/zod"
import { CircleNotchIcon, FloppyDiskBackIcon, GearSixIcon } from "@phosphor-icons/react"
import {
  Btn,
  FileInput,
  FormCard,
  Input,
  Labeler,
  type UploadResult,
} from "@repo/shared/components"
import { createFieldsWithLabels } from "@repo/shared/helpers"
import { useCallback } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const { fields, labels } = createFieldsWithLabels({
  fullName: "نام",
  profileImageGuid: "عکس پروفایل",
})

const MAX_FILE_SIZE_IN_MB = 2

const profileSchema = z.object({
  [fields.fullName]: z.string().min(1, "نام نباید خالی باشد"),
  [fields.profileImageGuid]: z.string().min(1, "عکس پروفایل الزامی است"),
})

type ProfileFormValues = z.infer<typeof profileSchema>

const notes = [
  FileInput.helpers.generateFileTypeNote(["تصویر"]),
  FileInput.helpers.generateFileSizeNote(MAX_FILE_SIZE_IN_MB),
  FileInput.helpers.generateAllowedExtensionsNote(["png", "jpeg", "jpg", "gif"]),
]

export default function ProfileSettingsFormCard() {
  const { register, formState, handleSubmit, setValue } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  })
  const { errors } = formState

  async function onSubmit(data: ProfileFormValues) {
    console.log("Form submitted with:", data)
  }

  const handleFileUploaded = useCallback(
    (fileStr: string) => setValue(fields.profileImageGuid, fileStr, { shouldValidate: true }),
    [setValue],
  )

  const handleFileRemoved = useCallback(
    () => setValue(fields.profileImageGuid, "", { shouldValidate: true }),
    [setValue],
  )

  return (
    <FormCard onSubmit={handleSubmit(onSubmit)} icon={GearSixIcon} title="تنظیمات پروفایل">
      <FileInput
        label={labels.profileImageGuid}
        mode="image"
        onUploaded={handleFileUploaded}
        allowedTypes={["image/png", "image/jpeg", "image/jpg", "image/gif"]}
        maxSizeMB={MAX_FILE_SIZE_IN_MB}
        onRemove={handleFileRemoved}
        uploadFn={uploadFile}
        notes={notes}
      />

      <Labeler labelText={labels.fullName} errorMsg={errors.fullName?.message}>
        <Input {...register(fields.fullName)} className={errors.fullName ? "border-red-7" : ""} />
      </Labeler>

      <Btn
        type="submit"
        themeType="filled"
        theme="primary"
        // TODO
        // disabled={formState.isSubmitting}
        disabled
      >
        {formState.isSubmitting ? (
          <CircleNotchIcon size={20} className="animate-spin" />
        ) : (
          <FloppyDiskBackIcon size={20} />
        )}
        <span>ذخیره</span>
      </Btn>
    </FormCard>
  )
}

async function uploadFile(file: File): Promise<UploadResult> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) throw new Error("Upload failed")

    const data = await response.json()
    return { success: true, fileStr: data.fileUrl }
  } catch (error) {
    return { success: false, errorMsg: "آپلود فایل ناموفق بود" }
  }
}
