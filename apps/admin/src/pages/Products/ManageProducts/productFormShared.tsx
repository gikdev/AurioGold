import { createFieldsWithLabels } from "@repo/shared/helpers"
import z from "zod"
import { commonErrors } from "#/shared/customForm"

export const productFormFields = createFieldsWithLabels({
  name: "نام *",
  description: "توضیح: ",
  price: "قیمت *",
  priceStep: "استپ قیمت *",
  priceDiffStep: "استپ اختلاف قیمت *",
  customerBuyingDiff: "اختلاف قیمت خرید مشتری *",
  customerSellingDiff: "اختلاف قیمت فروش مشتری *",
  minTransactionVolume: "حداقل حجم معامله (گرم) *",
  maxTransactionVolume: "حداکثر حجم معامله (گرم) *",
  transactionStatus: "وضعیت خرید و فروش *",
  transactionMethod: "نحوه معامله *",
  priceSource: "منبع قیمت: ",
  minProductValue: "حداقل ارزش محصول *",
  maxProductValue: "حداکثر ارزش محصول *",
  transactionType: "نوع معامله *",
  priceToGramRatio: "نسبت قیمت اعلام شده به گرم *",
  numOfDecimals: "تعداد اعشار در محاسبه *",
  maxAutoTime: "حداکثر زمان خودکار (دقیقه) *",
  accountingCode: "کد حسابداری: ",
})

const { fields } = productFormFields

export const ProductFormSchema = z.object({
  [fields.name]: z.string(commonErrors).min(1, { message: commonErrors.required_error }),
  [fields.description]: z.string().nullable().default(null),
  [fields.price]: z.coerce.number(commonErrors),
  [fields.priceStep]: z.coerce.number(commonErrors),
  [fields.priceDiffStep]: z.coerce.number(commonErrors),
  [fields.customerBuyingDiff]: z.coerce.number(commonErrors),
  [fields.customerSellingDiff]: z.coerce.number(commonErrors),
  [fields.minTransactionVolume]: z.coerce.number(commonErrors),
  [fields.maxTransactionVolume]: z.coerce.number(commonErrors),
  [fields.transactionStatus]: z.enum(["0", "1", "2", "3"], commonErrors),
  [fields.transactionMethod]: z.enum(["0", "1", "2"], commonErrors),
  [fields.priceSource]: z.coerce.number({
    required_error: "این گزینه باید انتخاب شده باشد",
    invalid_type_error: "این گزینه باید انتخاب شده باشد",
  }),
  [fields.minProductValue]: z.coerce.number(commonErrors),
  [fields.maxProductValue]: z.coerce.number(commonErrors),
  [fields.transactionType]: z.enum(["0", "1", "2"], commonErrors),
  [fields.priceToGramRatio]: z.coerce.number(commonErrors),
  [fields.numOfDecimals]: z.coerce.number(commonErrors),
  [fields.maxAutoTime]: z.coerce.number(commonErrors),
  [fields.accountingCode]: z.string().nullable().default(null),
})

export type ProductFormValues = z.input<typeof ProductFormSchema>

export const emptyProductFormValues: ProductFormValues = {
  name: "",
  price: 0,
  priceStep: 0,
  priceDiffStep: 0,
  customerBuyingDiff: 0,
  customerSellingDiff: 0,
  minTransactionVolume: 0,
  maxTransactionVolume: 0,
  transactionStatus: "0",
  transactionMethod: "0",
  priceSource: 0,
  minProductValue: 0,
  maxProductValue: 0,
  transactionType: "0",
  priceToGramRatio: 1,
  numOfDecimals: 0,
  maxAutoTime: 0,
}

export const transactionMethods = [
  { id: "0", name: "گرمی" },
  { id: "1", name: "تعدادی" },
  { id: "2", name: "مثقالی" },
]
export const TransactionMethod = {
  gram: "0",
  count: "1",
  mithqal: "2",
}
export type TransactionMethod = "0" | "1" | "2"

export const transactionTypes = [
  { id: "0", name: "عادی" },
  { id: "1", name: "تایید خودکار" },
  { id: "2", name: "رد خودکار" },
]
export type TransactionType = "0" | "1" | "2"

export const transactionStatuses = [
  { id: "0", name: "غیر فعال" },
  { id: "1", name: "قابل خرید توسط مشتری" },
  { id: "2", name: "قابل فروش توسط مشتری" },
  { id: "3", name: "قابل خرید و فروش" },
]
export type TransactionStatus = "0" | "1" | "2" | "3"

export function toSafeNumber(input: string | null | undefined): number {
  if (!input) return 0
  const convertedInput = Number(input)
  if (Number.isNaN(convertedInput)) return 0
  return convertedInput
}
