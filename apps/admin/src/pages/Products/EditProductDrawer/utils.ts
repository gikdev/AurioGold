import type {
  AutoMode,
  PutApiTyStocksByIdData,
  StockDtoForMaster,
  StockStatus,
  StockUnit,
} from "@repo/api-client/client"
import { getApiTyStocksQueryKey, putApiTyStocksByIdMutation } from "@repo/api-client/tanstack"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { emptyProductFormValues, type ProductFormValues, toSafeNumber } from "../productFormShared"
import { getHeaderTokenOnly } from "../shared"

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
  productId: NonNullable<StockDtoForMaster["id"]>,
): Required<PutApiTyStocksByIdData["body"]> {
  return {
    id: productId,
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
