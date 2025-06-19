import { createFieldsWithLabels } from "@repo/shared/helpers"
import z from "zod"
import { commonErrors } from "#/shared/customForm"

export const groupFormFields = createFieldsWithLabels({
  name: "نام *",
  description: "توضیحات: ",
  diffSellPrice: "اختلاف قیمت فروش مشتری *",
  diffBuyPrice: "اختلاف قیمت خرید مشتری *",
})

const { fields } = groupFormFields

export const groupSchema = z.object({
  [fields.name]: z.string(commonErrors).min(1, { message: commonErrors.required_error }),
  [fields.description]: z.string().nullable().default(null),
  [fields.diffBuyPrice]: z.coerce.number({ invalid_type_error: "باید عدد باشد" }).default(0),
  [fields.diffSellPrice]: z.coerce.number({ invalid_type_error: "باید عدد باشد" }).default(0),
})

export type GroupFormValues = z.input<typeof groupSchema>

export const emptyGroupValues: GroupFormValues = {
  name: "",
  diffSellPrice: 0,
  diffBuyPrice: 0,
  description: null,
}
