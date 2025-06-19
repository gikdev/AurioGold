import { createFieldsWithLabels } from "@repo/shared/helpers"
import z from "zod"
import { commonErrors, convertPersianToEnglish, validationPatterns } from "#/shared/customForm"

export const customerFormFields = createFieldsWithLabels({
  displayName: "نام کامل *",
  phone: "شماره تلفن *",
  nationalId: "کد ملی: ",
  city: "شهر: ",
  address: "آدرس: ",
  maxAllowedDevices: "تعداد دستگاه‌های هم‌زمان مجاز *",
  groupId: "گروه مشتری گرمی *",
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

const baseCustomerSchema = z.object({
  [fields.displayName]: z.string(commonErrors).min(1, { message: commonErrors.required_error }),
  [fields.phone]: z
    .string(commonErrors)
    .transform(convertPersianToEnglish)
    .pipe(
      z
        .string()
        .regex(
          validationPatterns.iranianPhone,
          `${commonErrors.invalid_type_error} (باید فقط شامل اعداد باشد و ۱۱ رقم باشد و با ۰۹ شروع شود)`,
        ),
    ),
  [fields.nationalId]: z
    .string(commonErrors)
    .transform(convertPersianToEnglish)
    .pipe(z.string().regex(validationPatterns.onlyDigits, commonErrors.invalid_type_error))
    .nullable()
    .default(null),
  [fields.accountingId]: z.string().nullable().default(null),
  [fields.isBlocked]: z.coerce.boolean(),
  [fields.isActive]: z.coerce.boolean(),
  [fields.businessLicense]: z.string().nullable().default(null),
  [fields.nationalCard]: z.string().nullable().default(null),
  [fields.numericGroupId]: z.coerce
    .number({
      required_error: "این گزینه باید انتخاب شده باشد",
      invalid_type_error: "این گزینه باید انتخاب شده باشد",
    })
    .positive("این گزینه باید انتخاب شده باشد"),
  [fields.groupId]: z.coerce
    .number({
      required_error: "این گزینه باید انتخاب شده باشد",
      invalid_type_error: "این گزینه باید انتخاب شده باشد",
    })
    .positive("این گزینه باید انتخاب شده باشد"),
  [fields.maxAllowedDevices]: z.coerce.number(commonErrors),
  [fields.address]: z.string().nullable().default(null),
  [fields.city]: z.string().nullable().default(null),
})

export const createCustomerSchema = baseCustomerSchema
  .extend({
    [fields.password]: z.string(commonErrors),
    [fields.passwordRepeat]: z.string(commonErrors),
  })
  .refine(data => data.password === data.passwordRepeat, {
    message: "گذرواژه و تکرار آن تطابق ندارند!",
    path: [fields.passwordRepeat],
  })

export const editCustomerSchema = baseCustomerSchema.extend({
  [fields.password]: z.string().optional(),
  [fields.passwordRepeat]: z.string().optional(),
})

export type CreateCustomerFormValues = z.input<typeof createCustomerSchema>
export type EditCustomerFormValues = z.input<typeof editCustomerSchema>

export const emptyCustomerValues: CreateCustomerFormValues & EditCustomerFormValues = {
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
  groupId: -1,
  numericGroupId: -1,
  phone: "",
  password: "",
  passwordRepeat: "",
}
