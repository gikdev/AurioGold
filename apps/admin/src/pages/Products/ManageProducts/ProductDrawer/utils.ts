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
import { createFieldsWithLabels } from "@repo/shared/helpers"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import z from "zod"
import { commonErrors } from "#/shared/customForm"
import { getHeaderTokenOnly } from "#/shared/forms"
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

type ProductFormValues = z.input<typeof ProductFormSchema>

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
    priceSourceID: values.priceSource,
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

  if (dto?.accountCode) obj.accountingCode = dto.accountCode
  if (dto?.name) obj.name = dto.name
  if (dto?.decimalNumber) obj.numOfDecimals = dto.decimalNumber
  if (dto?.description) obj.description = dto.description
  if (dto?.diffBuyPrice) obj.customerBuyingDiff = dto.diffBuyPrice
  if (dto?.diffPriceStep) obj.priceDiffStep = dto.diffPriceStep
  if (dto?.diffSellPrice) obj.customerSellingDiff = dto.diffSellPrice
  if (dto?.maxAutoMin) obj.maxAutoTime = dto.maxAutoMin
  if (dto?.maxValue) obj.maxProductValue = dto.maxValue
  if (dto?.maxVoume) obj.maxTransactionVolume = dto.maxVoume
  if (dto?.minValue) obj.minProductValue = dto.minValue
  if (dto?.minVoume) obj.minTransactionVolume = dto.minVoume
  if (dto?.mode) obj.transactionType = dto.mode.toString() as "0" | "1" | "2"
  if (dto?.price) obj.price = dto.price
  if (dto?.priceSourceID) obj.priceSource = dto.priceSourceID
  if (dto?.priceStep) obj.priceStep = dto.priceStep
  if (dto?.status) obj.transactionStatus = dto.status.toString() as "0" | "1" | "2" | "3"
  if (dto?.unit) obj.transactionMethod = dto.unit.toString() as "0" | "1" | "2"
  if (dto?.unitPriceRatio) obj.priceToGramRatio = dto.unitPriceRatio

  return obj
}
