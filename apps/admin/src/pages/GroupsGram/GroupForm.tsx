import { Input, Labeler, TextArea } from "@repo/shared/components"
import type { UseFormReturn } from "react-hook-form"
import { type GroupFormValues, groupFormFields } from "./groupFormShared"

const { fields, labels } = groupFormFields

interface GroupFormProps {
  form: UseFormReturn<GroupFormValues>
}

export default function GroupForm({ form }: GroupFormProps) {
  const { formState, register } = form
  const { errors } = formState

  return (
    <form className="min-h-full flex flex-col py-4 gap-5" autoComplete="off">
      <Labeler labelText={labels.name} errorMsg={errors.name?.message}>
        <Input {...register(fields.name)} />
      </Labeler>

      <Labeler labelText={labels.description} errorMsg={errors.description?.message}>
        <TextArea {...register(fields.description)} />
      </Labeler>

      <Labeler labelText={labels.diffBuyPrice} errorMsg={errors.diffBuyPrice?.message}>
        <Input
          dir="ltr"
          type="number"
          {...register(fields.diffBuyPrice, { valueAsNumber: true })}
        />
      </Labeler>

      <Labeler labelText={labels.diffSellPrice} errorMsg={errors.diffSellPrice?.message}>
        <Input
          dir="ltr"
          type="number"
          {...register(fields.diffSellPrice, { valueAsNumber: true })}
        />
      </Labeler>
    </form>
  )
}
