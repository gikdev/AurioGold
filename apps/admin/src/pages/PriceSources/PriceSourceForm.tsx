import { Input, Labeler } from "@repo/shared/components"
import type { UseFormReturn } from "react-hook-form"
import { type PriceSourceFormValues, priceSourceFormFields } from "./priceSourceFormShared"

const { fields, labels } = priceSourceFormFields

interface PriceSourceFormProps {
  form: UseFormReturn<PriceSourceFormValues>
}

export default function PriceSourceForm({ form }: PriceSourceFormProps) {
  const { formState, register } = form
  const { errors } = formState

  return (
    <form className="min-h-full flex flex-col py-4 gap-5" autoComplete="off">
      <Labeler labelText={labels.name} errorMsg={errors.name?.message}>
        <Input {...register(fields.name)} />
      </Labeler>

      <Labeler labelText={labels.code} errorMsg={errors.code?.message}>
        <Input dir="ltr" {...register(fields.code)} />
      </Labeler>

      <Labeler labelText={labels.sourceUrl} errorMsg={errors.sourceUrl?.message}>
        <Input dir="ltr" {...register(fields.sourceUrl)} />
      </Labeler>

      <Labeler labelText={labels.price} errorMsg={errors.price?.message}>
        <Input dir="ltr" type="number" {...register(fields.price, { valueAsNumber: true })} />
      </Labeler>
    </form>
  )
}
