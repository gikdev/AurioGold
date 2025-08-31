import type { StockPriceSourceResponse } from "@repo/api-client/client"
import {
  postApiStockPriceSourceAddStockPriceSourceMutation,
  postApiStockPriceSourceEditStockPriceSourceMutation,
} from "@repo/api-client/tanstack"
import { getHeaderTokenOnly } from "@repo/shared/auth"
import { createFieldsWithLabels, isUndefinedOrNull } from "@repo/shared/helpers"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import z from "zod/v4"
import { formErrors } from "#/shared/customForm"
import type { Assignable, Expect } from "#/shared/types"
import { type PriceSourceId, priceSourcesOptions } from "../shared"

export const priceSourceFormFields = createFieldsWithLabels({
  name: "نام *",
  code: "کد *",
  price: "قیمت *",
  sourceUrl: "لینک منبع *",
})

const { fields } = priceSourceFormFields

export const PriceSourceFormSchema = z.object({
  [fields.name]: z.string(formErrors.requiredField),
  [fields.code]: z.string(formErrors.requiredField),
  [fields.sourceUrl]: z.string(formErrors.requiredField),
  [fields.price]: z.number(formErrors.requiredField).default(0),
})

export type PriceSourceFormValues = z.input<typeof PriceSourceFormSchema>

type _Test_FormValuesMatchApi = Expect<Assignable<PriceSourceFormValues, StockPriceSourceResponse>>
const _test_formValuesMatchApi: _Test_FormValuesMatchApi = true
_test_formValuesMatchApi

export const emptyPriceSourceFieldValues: PriceSourceFormValues = {
  name: "",
  sourceUrl: ",",
  code: "",
  price: 0,
}

export function useCreateSourceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    ...postApiStockPriceSourceAddStockPriceSourceMutation(getHeaderTokenOnly("admin")),
    onSuccess: (_, { body }) => {
      if (!body) return

      queryClient.setQueryData<StockPriceSourceResponse[]>(priceSourcesOptions.queryKey, old => [
        ...(old ?? []),
        body,
      ])
    },
  })
}

export function useUpdateSourceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    ...postApiStockPriceSourceEditStockPriceSourceMutation(getHeaderTokenOnly("admin")),
    onSuccess: (_, { body }) => {
      queryClient.setQueryData<StockPriceSourceResponse[]>(priceSourcesOptions.queryKey, old =>
        old?.map(item =>
          item.id === body?.id
            ? {
                ...item,
                ...body,
                price: body?.price ?? 0,
              }
            : item,
        ),
      )
    },
  })
}

export function formValuesToApiPayload(
  values: PriceSourceFormValues,
  sourceId: PriceSourceId = 0,
): Required<StockPriceSourceResponse> {
  return {
    id: sourceId,
    name: values.name,
    code: values.code,
    price: values.price ?? 0,
    sourceUrl: values.sourceUrl,
  }
}

export function partialDtoToFormValues(
  dto: Partial<StockPriceSourceResponse>,
): PriceSourceFormValues {
  const values: PriceSourceFormValues = {
    ...emptyPriceSourceFieldValues,
  }

  if (!isUndefinedOrNull(dto.name)) values.name = dto.name
  if (!isUndefinedOrNull(dto.code)) values.code = dto.code
  if (!isUndefinedOrNull(dto.sourceUrl)) values.sourceUrl = dto.sourceUrl
  if (!isUndefinedOrNull(dto.price)) values.price = dto.price

  return values
}
