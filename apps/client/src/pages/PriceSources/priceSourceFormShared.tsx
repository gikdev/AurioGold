import { createFieldsWithLabels } from "@repo/shared/helpers"
import z from "zod"
import { commonErrors } from "#/shared/customForm"

export const priceSourceFormFields = createFieldsWithLabels({
  name: "نام *",
  code: "کد *",
  price: "قیمت *",
  sourceUrl: "لینک منبع *",
})

const { fields } = priceSourceFormFields

export const priceSourceSchema = z.object({
  [fields.name]: z.string(commonErrors).min(1, { message: commonErrors.required_error }),
  [fields.code]: z.string(commonErrors).min(1, { message: commonErrors.required_error }),
  [fields.sourceUrl]: z.string(commonErrors).min(1, { message: commonErrors.required_error }),
  [fields.price]: z.coerce.number({ invalid_type_error: "باید عدد باشد" }).default(0),
})

export type PriceSourceFormValues = z.input<typeof priceSourceSchema>

export const emptyPriceSourceValues: PriceSourceFormValues = {
  name: "",
  code: "",
  sourceUrl: "",
  price: 0,
}
