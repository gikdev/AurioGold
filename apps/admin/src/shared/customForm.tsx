import { apiRequest } from "@gikdev/react-datapi/src"
import { zodResolver } from "@hookform/resolvers/zod"
import type { OutFileModel } from "@repo/api-client/client"
import type { UploadResult } from "@repo/shared/components"
import { useEffect } from "react"
import { type UseFormReturn, useForm } from "react-hook-form"
import { v4 as uuid } from "uuid"
import type { ZodTypeAny, z } from "zod"
import genDatApiConfig from "./datapi-config"

export function useCustomForm<TSchema extends ZodTypeAny>(
  schema: TSchema,
  emptyValues: z.input<TSchema>,
  isEditMode?: boolean,
  defaultValues?: Partial<z.input<TSchema>>,
): UseFormReturn<z.input<TSchema>> {
  const form = useForm<z.input<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: isEditMode ? (defaultValues as z.input<TSchema>) : emptyValues,
  })

  const { formState, setFocus } = form
  const { errors } = formState

  // Auto-focus first error field
  useEffect(() => {
    const firstError = (Object.keys(errors) as Array<keyof typeof errors>).reduce<
      keyof typeof errors | null
    >((field, a) => {
      const fieldKey = field as keyof typeof errors
      return errors[fieldKey] ? fieldKey : a
    }, null)

    if (firstError) setFocus(firstError as Parameters<typeof setFocus>[0])
  }, [errors, setFocus])

  return form
}

export const validationPatterns = {
  iranianPhone: /^09\d{9}$/,
  onlyDigits: /^\d*$/,
}

export const commonErrors = {
  required_error: "این ورودی باید پر شود",
  invalid_type_error: "مقدار واردشده معتبر نیست",
}

export const convertPersianToEnglish = (str: string) => {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹"
  const englishDigits = "0123456789"
  return str.replace(/[۰-۹]/g, char => englishDigits[persianDigits.indexOf(char)])
}

export async function uploadFile(file: File, isPrivate: boolean): Promise<UploadResult> {
  const formData = new FormData()
  const fileName = file.name
  const lastDotPosition = fileName.lastIndexOf(".")
  const fileExt = fileName.slice(lastDotPosition, fileName.length)

  formData.append("File", file)
  formData.append("Name", uuid() + fileExt)
  formData.append("Description", "")
  formData.append("IsPrivate", isPrivate.toString())

  const res = await apiRequest<OutFileModel>({
    config: genDatApiConfig(),
    options: {
      url: "/TyFiles/upload",
      body: formData,
      method: "POST",
      skipContentType: true,
    },
  })

  if (res.success)
    return {
      success: true,
      fileStr: isPrivate ? res.data?.id || "" : res.data?.adress || "",
    }

  return { success: false, errorMsg: "یه مشکلی موقع آپلود فایل پیش‌اومد..." }
}
