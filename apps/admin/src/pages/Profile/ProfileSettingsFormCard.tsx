import { zodResolver } from "@hookform/resolvers/zod"
import { CircleNotchIcon, FloppyDiskBackIcon, GearSixIcon } from "@phosphor-icons/react"
import { Btn, FileInput, Input, Labeler, type UploadResult } from "@repo/shared/components"
import { createFieldsWithLabels } from "@repo/shared/helpers"
import { useForm } from "react-hook-form"
import * as z from "zod"
import FormCard from "./FormCard"

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

export default function ProfileSettingsFormCard() {
  const { register, formState, handleSubmit, setValue } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  })
  const { errors } = formState
  const { generateFileTypeNote, generateFileSizeNote, generateAllowedExtensionsNote } =
    FileInput.useHelpers()

  async function onSubmit(data: ProfileFormValues) {
    console.log("Form submitted with:", data)
    // You'll get the fileStr from the FileInput's onUploaded callback
    // No need to handle file upload here as FileInput handles it
  }

  // Handle the uploaded file string
  const handleFileUploaded = (fileStr: string) => {
    setValue(fields.profileImageGuid, fileStr, { shouldValidate: true })
  }

  // Handle file removal
  const handleFileRemoved = () => {
    setValue(fields.profileImageGuid, "", { shouldValidate: true })
  }

  // Mock upload function - replace with your actual API call
  const uploadFile = async (file: File): Promise<UploadResult> => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      // Replace with your actual API call
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
        notes={[
          generateFileTypeNote(["تصویر"]),
          generateFileSizeNote(MAX_FILE_SIZE_IN_MB),
          generateAllowedExtensionsNote(["png", "jpeg", "jpg", "gif"]),
        ]}
      />

      <Labeler labelText={labels.fullName} errorMsg={errors.fullName?.message}>
        <Input {...register(fields.fullName)} className={errors.fullName ? "border-red-7" : ""} />
      </Labeler>

      <Btn type="submit" themeType="filled" theme="primary" disabled={formState.isSubmitting}>
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

// CONTINUE
