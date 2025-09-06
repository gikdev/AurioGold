import type { AddCustomerDto, CustomerDto, UpdateCustomerForMasterDto } from "@repo/api-client"
import {
  postApiMasterAddCustomerMutation,
  postApiMasterUpdateCustomerMutation,
} from "@repo/api-client"
import { createFieldsWithLabels, isUndefinedOrNull } from "@repo/shared/helpers"
import { toSafeNumber } from "@repo/shared/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import z from "zod/v4"
import { convertPersianToEnglish, formErrors, validationPatterns } from "#/shared/customForm"
import { apiGetCustomersOptions } from "../shared"
import type { CustomerId } from "../store"

export const customerFormFields = createFieldsWithLabels({
  displayName: "نام کامل *",
  phone: "شماره تلفن *",
  nationalId: "کد ملی: ",
  city: "شهر: ",
  address: "آدرس: ",
  maxAllowedDevices: "تعداد دستگاه‌های هم‌زمان مجاز *",
  gramGroupId: "گروه مشتری گرمی *",
  numericGroupId: "گروه مشتری عددی *",
  nationalCard: "کارت ملی: ",
  businessLicense: "جواز کسب: ",
  isActive: "فعال هست: ",
  isBlocked: "معامله مسدود شود: ",
  password: "گذرواژه *",
  passwordRepeat: "تکرار گذرواژه *",
  accountingId: "آی‌دی حساب‌داری: ",
})

const { fields } = customerFormFields

const BaseCustomerFormSchema = z.object({
  [fields.displayName]: z.string(formErrors.requiredField).min(1, formErrors.requiredField),
  [fields.phone]: z
    .string(formErrors.requiredField)
    .transform(convertPersianToEnglish)
    .pipe(
      z
        .string()
        .regex(
          validationPatterns.iranianPhone,
          `${formErrors.invalidInputType} (باید فقط شامل اعداد باشد و ۱۱ رقم باشد و با ۰۹ شروع شود)`,
        ),
    ),
  [fields.nationalId]: z
    .string(formErrors.requiredField)
    .transform(convertPersianToEnglish)
    .pipe(z.string().regex(validationPatterns.onlyDigits, formErrors.invalidInputType))
    .nullable(),
  [fields.accountingId]: z.string().nullable(),
  [fields.isBlocked]: z.boolean(),
  [fields.isActive]: z.boolean(),
  [fields.businessLicense]: z.string().nullable(),
  [fields.nationalCard]: z.string().nullable(),
  [fields.gramGroupId]: z.string(formErrors.invalidInputType).min(1, formErrors.requiredField),
  [fields.numericGroupId]: z.string(formErrors.invalidInputType).min(1, formErrors.requiredField),
  [fields.maxAllowedDevices]: z.number(formErrors.requiredField).positive("عدد باید مثبت باشد!"),
  [fields.address]: z.string().nullable(),
  [fields.city]: z.string().nullable(),
})

export const CreateCustomerFormSchema = BaseCustomerFormSchema.extend({
  [fields.password]: z.string(formErrors.requiredField).min(1, formErrors.requiredField),
  [fields.passwordRepeat]: z.string(formErrors.requiredField).min(1, formErrors.requiredField),
}).refine(data => data.password === data.passwordRepeat, {
  message: "گذرواژه و تکرار آن تطابق ندارند!",
  path: [fields.passwordRepeat],
})

export const EditCustomerFormSchema = BaseCustomerFormSchema.extend({
  [fields.password]: z.string(),
  [fields.passwordRepeat]: z.string(),
}).refine(data => data.password === data.passwordRepeat, {
  message: "گذرواژه و تکرار آن تطابق ندارند!",
  path: [fields.passwordRepeat],
})

export type CreateCustomerFormValues = z.input<typeof CreateCustomerFormSchema>
export type EditCustomerFormValues = z.input<typeof EditCustomerFormSchema>

export const emptyCustomerFormValues: CreateCustomerFormValues & EditCustomerFormValues = {
  maxAllowedDevices: 1,
  isActive: true,
  isBlocked: false,
  nationalId: null,
  city: null,
  address: null,
  nationalCard: null,
  businessLicense: null,
  accountingId: null,
  displayName: "",
  gramGroupId: "",
  numericGroupId: "",
  phone: "",
  password: "",
  passwordRepeat: "",
}

export function useCreateCustomerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    ...postApiMasterAddCustomerMutation(),
    onSuccess: (_, { body }) => {
      if (!body) return

      queryClient.setQueryData<CustomerDto[]>(apiGetCustomersOptions.queryKey, old => [
        ...(old ?? []),
        body,
      ])
    },
  })
}

export function useUpdateCustomerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    ...postApiMasterUpdateCustomerMutation(),
    onSuccess: (_, { body }) => {
      queryClient.setQueryData<CustomerDto[]>(apiGetCustomersOptions.queryKey, old =>
        old?.map(item => (item.id === body?.id ? { ...item, ...body } : item)),
      )
    },
  })
}

export function formValuesToCreateApiPayload(values: CreateCustomerFormValues): AddCustomerDto {
  return {
    displayName: values.displayName,
    mobile: values.phone,
    password: values.password || "",
    codeMelli: values.nationalId || "",
    groupID: toSafeNumber(values.gramGroupId),
    groupIntID: toSafeNumber(values.numericGroupId),
    address: values.address || "",
    city: values.city || "",
    diffPrice: 0,
    melliID: values.nationalCard || null,
    kasbsID: values.businessLicense || null,
    isActive: values.isActive,
    isBlocked: values.isBlocked,
    allowedDevices: values.maxAllowedDevices || 1,
    accountingID: values.accountingId || "",
  }
}

export function formValuesToEditApiPayload(
  values: CreateCustomerFormValues,
  customerId: CustomerId,
): UpdateCustomerForMasterDto {
  return {
    id: customerId,
    displayName: values.displayName,
    mobile: values.phone,
    password: values.password || "",
    codeMelli: values.nationalId || "",
    groupID: toSafeNumber(values.gramGroupId),
    groupIntID: toSafeNumber(values.numericGroupId),
    address: values.address || "",
    city: values.city || "",
    diffPrice: 0,
    melliID: values.nationalCard || null,
    kasbsID: values.businessLicense || null,
    isActive: values.isActive,
    isBlocked: values.isBlocked,
    allowedDevices: values.maxAllowedDevices || 1,
    accountingID: values.accountingId || "",
  }
}

export function partialDtoToFormValues(
  dto: CustomerDto,
): CreateCustomerFormValues & EditCustomerFormValues {
  const values: CreateCustomerFormValues & EditCustomerFormValues = {
    ...emptyCustomerFormValues,
  }

  if (!isUndefinedOrNull(dto.accountingID)) values.accountingId = dto.accountingID
  if (!isUndefinedOrNull(dto.address)) values.address = dto.address
  if (!isUndefinedOrNull(dto.allowedDevices)) values.maxAllowedDevices = dto.allowedDevices
  if (!isUndefinedOrNull(dto.city)) values.city = dto.city
  if (!isUndefinedOrNull(dto.codeMelli)) values.nationalId = dto.codeMelli
  if (!isUndefinedOrNull(dto.displayName)) values.displayName = dto.displayName
  if (!isUndefinedOrNull(dto.groupID)) values.gramGroupId = dto.groupID.toString()
  if (!isUndefinedOrNull(dto.groupIntID)) values.numericGroupId = dto.groupIntID.toString()
  if (!isUndefinedOrNull(dto.isActive)) values.isActive = dto.isActive
  if (!isUndefinedOrNull(dto.isBlocked)) values.isBlocked = dto.isBlocked
  if (!isUndefinedOrNull(dto.kasbsID)) values.businessLicense = dto.kasbsID
  if (!isUndefinedOrNull(dto.melliID)) values.nationalCard = dto.melliID
  if (!isUndefinedOrNull(dto.mobile)) values.phone = dto.mobile

  return values
}
