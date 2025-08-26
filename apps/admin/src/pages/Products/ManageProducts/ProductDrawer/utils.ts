import type {
  AutoMode,
  PutApiTyStocksByIdData,
  StockDtoForMaster,
  StockStatus,
  StockUnit,
} from "@repo/api-client/client"
import {
  getApiTyStocksQueryKey,
  postApiTyStocksMutation,
  putApiTyStocksByIdMutation,
} from "@repo/api-client/tanstack"
import { createFieldsWithLabels, isUndefinedOrNull } from "@repo/shared/helpers"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import z from "zod"
import { commonErrors, formErrors } from "#/shared/customForm"
import { getHeaderTokenOnly } from "#/shared/forms"
import type { Assignable, Expect } from "#/shared/types"
import { toSafeNumber } from "../shared"

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
  [fields.name]: z.string(commonErrors).min(1, { message: formErrors.requiredField }),
  [fields.description]: z.string().nullable().default(null),
  [fields.price]: z.coerce.number(commonErrors).nonnegative(formErrors.nonNegative),
  [fields.priceStep]: z.coerce.number(commonErrors).nonnegative(formErrors.nonNegative),
  [fields.priceDiffStep]: z.coerce.number(commonErrors).nonnegative(formErrors.nonNegative),
  [fields.customerBuyingDiff]: z.coerce.number(commonErrors),
  [fields.customerSellingDiff]: z.coerce.number(commonErrors),
  [fields.minTransactionVolume]: z.coerce.number(commonErrors).positive(formErrors.positive),
  [fields.maxTransactionVolume]: z.coerce.number(commonErrors).positive(formErrors.positive),
  [fields.transactionStatus]: z
    .enum(["", "0", "1", "2", "3"], {
      required_error: "این گزینه باید انتخاب شده باشد",
      invalid_type_error: "این گزینه درست انتخاب نشده",
      message: "این گزینه باید انتخاب شده باشد",
    })
    .refine(v => v !== "", "این گزینه باید انتخاب شده باشد!"),
  [fields.transactionMethod]: z
    .enum(["", "0", "1", "2"], {
      required_error: "این گزینه باید انتخاب شده باشد",
      invalid_type_error: "این گزینه درست انتخاب نشده",
      message: "این گزینه باید انتخاب شده باشد",
    })

    .refine(v => v !== "", "این گزینه باید انتخاب شده باشد!"),
  [fields.priceSource]: z.coerce
    .string({
      required_error: "این گزینه باید انتخاب شده باشد",
      invalid_type_error: "این گزینه درست انتخاب نشده",
      message: "این گزینه باید انتخاب شده باشد",
    })
    .refine(v => v !== "", "این گزینه باید انتخاب شده باشد!"),
  [fields.minProductValue]: z.coerce.number(commonErrors).positive(formErrors.positive),
  [fields.maxProductValue]: z.coerce.number(commonErrors).positive(formErrors.positive),
  [fields.transactionType]: z
    .enum(["", "0", "1", "2"], {
      required_error: "این گزینه باید انتخاب شده باشد",
      invalid_type_error: "این گزینه درست انتخاب نشده",
      message: "این گزینه باید انتخاب شده باشد",
    })
    .refine(v => v !== "", "این گزینه باید انتخاب شده باشد!"),
  [fields.priceToGramRatio]: z.coerce.number(commonErrors).positive(formErrors.positive),
  [fields.numOfDecimals]: z.coerce.number(commonErrors).nonnegative(formErrors.nonNegative),
  [fields.maxAutoTime]: z.coerce.number(commonErrors).nonnegative(formErrors.nonNegative),
  [fields.accountingCode]: z.string().nullable().default(null),
})

type ProductFormValues = z.input<typeof ProductFormSchema>

type _Test_FormValuesMatchApi = Expect<Assignable<ProductFormValues, StockDtoForMaster>>
const _test_formValuesMatchApi: _Test_FormValuesMatchApi = true
_test_formValuesMatchApi

export const emptyProductFormValues: ProductFormValues = {
  name: "",
  price: 0,
  priceStep: 0,
  priceDiffStep: 0,
  customerBuyingDiff: 0,
  customerSellingDiff: 0,
  minTransactionVolume: 1,
  maxTransactionVolume: 10,
  transactionStatus: "",
  transactionMethod: "",
  priceSource: "",
  minProductValue: 1,
  maxProductValue: 10,
  transactionType: "",
  priceToGramRatio: 1,
  numOfDecimals: 0,
  maxAutoTime: 0,
}

export function useCreateStockMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    ...postApiTyStocksMutation(getHeaderTokenOnly()),
    onSuccess: (_, { body }) => {
      if (!body) return

      queryClient.setQueryData<StockDtoForMaster[]>(
        getApiTyStocksQueryKey(getHeaderTokenOnly()),
        old => [...(old ?? []), body],
      )
    },
  })
}

export function useUpdateStockMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    ...putApiTyStocksByIdMutation(getHeaderTokenOnly()),
    onSuccess: (_, { body, path: { id } }) => {
      queryClient.setQueryData<StockDtoForMaster[]>(
        getApiTyStocksQueryKey(getHeaderTokenOnly()),
        old => old?.map(stock => (stock.id === id ? { ...stock, ...body } : stock)),
      )
    },
  })
}

export function convertFormValuesToApiPayload(
  values: ProductFormValues,
  productId: StockDtoForMaster["id"],
): Required<PutApiTyStocksByIdData["body"]> {
  return {
    id: productId ?? 0,
    name: values.name,
    description: values.description ?? null,
    price: values.price,
    diffBuyPrice: values.customerBuyingDiff,
    diffSellPrice: values.customerSellingDiff,
    priceStep: values.priceStep,
    diffPriceStep: values.priceDiffStep,
    status: toSafeNumber(values.transactionStatus) as StockStatus,
    mode: toSafeNumber(values.transactionType) as AutoMode,
    maxAutoMin: values.maxAutoTime,
    dateUpdate: new Date().toISOString(),
    minValue: values.minProductValue,
    maxValue: values.maxProductValue,
    minVoume: values.minTransactionVolume,
    maxVoume: values.maxTransactionVolume,
    isCountable: false,
    unitPriceRatio: values.priceToGramRatio,
    decimalNumber: values.numOfDecimals,
    supply: 0,
    priceSourceID: toSafeNumber(values.priceSource),
    accountCode: values.accountingCode ?? null,
    unit: toSafeNumber(values.transactionMethod) as StockUnit,
  }
}

export function convertPartialCustomerDtoToFormValues(
  dto: Partial<StockDtoForMaster>,
): ProductFormValues {
  const obj: ProductFormValues = {
    ...emptyProductFormValues,
  }

  if (!isUndefinedOrNull(dto.accountCode)) obj.accountingCode = dto.accountCode
  if (!isUndefinedOrNull(dto.name)) obj.name = dto.name
  if (!isUndefinedOrNull(dto.decimalNumber)) obj.numOfDecimals = dto.decimalNumber
  if (!isUndefinedOrNull(dto.description)) obj.description = dto.description
  if (!isUndefinedOrNull(dto.diffBuyPrice)) obj.customerBuyingDiff = dto.diffBuyPrice
  if (!isUndefinedOrNull(dto.diffPriceStep)) obj.priceDiffStep = dto.diffPriceStep
  if (!isUndefinedOrNull(dto.diffSellPrice)) obj.customerSellingDiff = dto.diffSellPrice
  if (!isUndefinedOrNull(dto.maxAutoMin)) obj.maxAutoTime = dto.maxAutoMin
  if (!isUndefinedOrNull(dto.maxValue)) obj.maxProductValue = dto.maxValue
  if (!isUndefinedOrNull(dto.maxVoume)) obj.maxTransactionVolume = dto.maxVoume
  if (!isUndefinedOrNull(dto.minValue)) obj.minProductValue = dto.minValue
  if (!isUndefinedOrNull(dto.minVoume)) obj.minTransactionVolume = dto.minVoume
  if (!isUndefinedOrNull(dto.mode)) obj.transactionType = dto.mode.toString() as "0" | "1" | "2"
  if (!isUndefinedOrNull(dto.price)) obj.price = dto.price
  if (!isUndefinedOrNull(dto.priceSourceID)) obj.priceSource = dto.priceSourceID.toString()
  if (!isUndefinedOrNull(dto.priceStep)) obj.priceStep = dto.priceStep
  if (!isUndefinedOrNull(dto.status))
    obj.transactionStatus = dto.status.toString() as "0" | "1" | "2" | "3"
  if (!isUndefinedOrNull(dto.unit)) obj.transactionMethod = dto.unit.toString() as "0" | "1" | "2"
  if (!isUndefinedOrNull(dto.unitPriceRatio)) obj.priceToGramRatio = dto.unitPriceRatio

  return obj
}
