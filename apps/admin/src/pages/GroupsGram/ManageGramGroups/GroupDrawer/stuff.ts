import type { CustomerGroupDto } from "@repo/api-client/client"
import {
  postApiTyCustomerGroupsMutation,
  putApiTyCustomerGroupsByIdMutation,
} from "@repo/api-client/tanstack"
import { getHeaderTokenOnly } from "@repo/shared/auth"
import { createFieldsWithLabels, isUndefinedOrNull } from "@repo/shared/helpers"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import z from "zod/v4"
import { formErrors } from "#/shared/customForm"
import type { Assignable, Expect } from "#/shared/types"
import { type GroupId, gramGroupsOptions } from "../shared"

export const groupFormFields = createFieldsWithLabels({
  name: "نام *",
  description: "توضیحات: ",
  diffSellPrice: "اختلاف قیمت فروش مشتری *",
  diffBuyPrice: "اختلاف قیمت خرید مشتری *",
})

const { fields } = groupFormFields

export const GroupFormSchema = z.object({
  [fields.name]: z.string().min(1, formErrors.requiredField),
  [fields.description]: z.string().nullable().default(null),
  [fields.diffBuyPrice]: z.number().default(0),
  [fields.diffSellPrice]: z.number().default(0),
})

export type GroupFormValues = z.input<typeof GroupFormSchema>

type _Test_FormValuesMatchApi = Expect<Assignable<GroupFormValues, CustomerGroupDto>>
const _test_formValuesMatchApi: _Test_FormValuesMatchApi = true
_test_formValuesMatchApi

export const emptyGroupFormValues: GroupFormValues = {
  name: "",
  diffSellPrice: 0,
  diffBuyPrice: 0,
  description: null,
}

export function useCreateGroupMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    ...postApiTyCustomerGroupsMutation(getHeaderTokenOnly()),
    onSuccess: (_, { body }) => {
      if (!body) return

      queryClient.setQueryData<CustomerGroupDto[]>(gramGroupsOptions.queryKey, old => [
        ...(old ?? []),
        body,
      ])
    },
  })
}

export function useUpdateGroupMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    ...putApiTyCustomerGroupsByIdMutation(getHeaderTokenOnly()),
    onSuccess: (_, { body, path: { id } }) => {
      queryClient.setQueryData<CustomerGroupDto[]>(gramGroupsOptions.queryKey, old =>
        old?.map(item => (item.id === id ? { ...item, ...body } : item)),
      )
    },
  })
}

export function formValuesToApiPayload(
  values: GroupFormValues,
  groupId: GroupId = 0,
): Required<CustomerGroupDto> {
  return {
    id: groupId,
    name: values.name,
    description: values.description ?? null,
    diffBuyPrice: values.diffBuyPrice ?? 0,
    diffSellPrice: values.diffSellPrice ?? 0,
  }
}

export function partialDtoToFormValues(dto: Partial<CustomerGroupDto>): GroupFormValues {
  const values: GroupFormValues = {
    ...emptyGroupFormValues,
  }

  if (!isUndefinedOrNull(dto.name)) values.name = dto.name
  if (!isUndefinedOrNull(dto.description)) values.description = dto.description
  if (!isUndefinedOrNull(dto.diffBuyPrice)) values.diffBuyPrice = dto.diffBuyPrice
  if (!isUndefinedOrNull(dto.diffSellPrice)) values.diffSellPrice = dto.diffSellPrice

  return values
}
