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

export const formErrors = {
  requiredField: "این ورودی باید پر شود",
  invalidInputType: "مقدار واردشده معتبر نیست",
  nonNegative: "عدد غیر منفی (۰ و بیشتر) وارد کنید",
  positive: "عدد مثبت وارد کنید (بیشتر از ۰)",
}

export const convertPersianToEnglish = (str: string) => {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹"
  const englishDigits = "0123456789"
  return str.replace(/[۰-۹]/g, char => englishDigits[persianDigits.indexOf(char)])
}

export const convertEnglishToPersian = (str: string) => {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹"
  const englishDigits = "0123456789"
  return str.replace(/[0-9]/g, char => persianDigits[englishDigits.indexOf(char)])
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

/**
 * Generates a function that retrieves labels from a provided labels object,
 * automatically removing the last two characters (typically used to trim formatting suffixes like " *" or ": ").
 *
 * @template T - The type of the labels object
 * @param labels - An object mapping keys to label strings
 * @returns A getter function that returns the trimmed label for a given key
 *
 * @example
 * // Basic usage
 * const formLabels = {
 *   username: 'Username: ',
 *   password: 'Password *',
 *   email: 'Email address: '
 * };
 *
 * const getLabel = generateLabelPropertyGetter(formLabels);
 *
 * console.log(getLabel('username')); // 'Username'
 * console.log(getLabel('password')); // 'Password'
 * console.log(getLabel('email'));   // 'Email address'
 */
export function generateLabelPropertyGetter<T extends Record<string, string>>(labels: T) {
  // .slice(0, -2) to remove " *" or ": " parts of form field labels!
  return (key: keyof typeof labels) => labels[key].slice(0, -2)
}
