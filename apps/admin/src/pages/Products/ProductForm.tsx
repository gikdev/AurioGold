import { useApiRequest } from "@gikdev/react-datapi/src"
import type { StockPriceSourceResponse } from "@repo/api-client/client"
import { Input, Labeler, TextArea, createSelectWithOptions } from "@repo/shared/components"
import type { UseFormReturn } from "react-hook-form"
import {
  type ProductFormValues,
  productFormFields,
  transactionMethods,
  transactionStatuses,
  transactionTypes,
} from "./productFormShared"

const { fields, labels } = productFormFields

const keysConfig = { id: "id", text: "name", value: "id" } as const

interface ProductFormProps {
  form: UseFormReturn<ProductFormValues>
}

export default function ProductForm({ form }: ProductFormProps) {
  const { formState, register } = form
  const { errors } = formState

  const SelectWithTransactionStatus =
    createSelectWithOptions<(typeof transactionStatuses)[number]>()
  const SelectWithTransactionMethod = createSelectWithOptions<(typeof transactionMethods)[number]>()
  const SelectWithTransactionType = createSelectWithOptions<(typeof transactionTypes)[number]>()
  const resPriceSources = useApiRequest<Required<StockPriceSourceResponse>[]>(() => ({
    url: "/StockPriceSource/GetStockPriceSources",
    defaultValue: [],
  }))
  const SelectWithPriceSources = createSelectWithOptions<Required<StockPriceSourceResponse>>()

  return (
    <form className="min-h-full flex flex-col py-4 gap-5" autoComplete="off">
      <Labeler labelText={labels.name} errorMsg={errors.name?.message}>
        <Input {...register(fields.name)} />
      </Labeler>

      <Labeler labelText={labels.description} errorMsg={errors.description?.message}>
        <TextArea {...register(fields.description)} />
      </Labeler>

      <Labeler labelText={labels.price} errorMsg={errors.price?.message}>
        <Input type="number" dir="ltr" {...register(fields.price)} />
      </Labeler>

      <Labeler labelText={labels.priceStep} errorMsg={errors.priceStep?.message}>
        <Input type="number" dir="ltr" {...register(fields.priceStep)} />
      </Labeler>

      <Labeler labelText={labels.priceDiffStep} errorMsg={errors.priceDiffStep?.message}>
        <Input type="number" dir="ltr" {...register(fields.priceDiffStep)} />
      </Labeler>

      <Labeler labelText={labels.customerBuyingDiff} errorMsg={errors.customerBuyingDiff?.message}>
        <Input type="number" dir="ltr" {...register(fields.customerBuyingDiff)} />
      </Labeler>

      <Labeler
        labelText={labels.customerSellingDiff}
        errorMsg={errors.customerSellingDiff?.message}
      >
        <Input type="number" dir="ltr" {...register(fields.customerSellingDiff)} />
      </Labeler>

      <Labeler
        labelText={labels.minTransactionVolume}
        errorMsg={errors.minTransactionVolume?.message}
      >
        <Input type="number" dir="ltr" {...register(fields.minTransactionVolume)} />
      </Labeler>

      <Labeler
        labelText={labels.maxTransactionVolume}
        errorMsg={errors.maxTransactionVolume?.message}
      >
        <Input type="number" dir="ltr" {...register(fields.maxTransactionVolume)} />
      </Labeler>

      <Labeler labelText={labels.transactionStatus} errorMsg={errors.transactionStatus?.message}>
        <SelectWithTransactionStatus options={transactionStatuses} keys={keysConfig} />
      </Labeler>

      <Labeler labelText={labels.transactionMethod} errorMsg={errors.transactionMethod?.message}>
        <SelectWithTransactionMethod options={transactionMethods} keys={keysConfig} />
      </Labeler>

      <Labeler
        labelText={labels.priceSource}
        errorMsg={errors.priceSource?.message || resPriceSources.error || ""}
      >
        <SelectWithPriceSources
          {...register(fields.priceSource, { valueAsNumber: true })}
          isLoading={resPriceSources.loading}
          options={resPriceSources.data || []}
          keys={keysConfig}
        />
      </Labeler>

      <Labeler labelText={labels.minProductValue} errorMsg={errors.minProductValue?.message}>
        <Input type="number" dir="ltr" {...register(fields.minProductValue)} />
      </Labeler>

      <Labeler labelText={labels.maxProductValue} errorMsg={errors.maxProductValue?.message}>
        <Input type="number" dir="ltr" {...register(fields.maxProductValue)} />
      </Labeler>

      <Labeler labelText={labels.transactionType} errorMsg={errors.transactionType?.message}>
        <SelectWithTransactionType options={transactionTypes} keys={keysConfig} />
      </Labeler>

      <Labeler labelText={labels.priceToGramRatio} errorMsg={errors.priceToGramRatio?.message}>
        <Input type="number" dir="ltr" {...register(fields.priceToGramRatio)} />
      </Labeler>

      <Labeler labelText={labels.numOfDecimals} errorMsg={errors.numOfDecimals?.message}>
        <Input type="number" dir="ltr" {...register(fields.numOfDecimals)} />
      </Labeler>

      <Labeler labelText={labels.maxAutoTime} errorMsg={errors.maxAutoTime?.message}>
        <Input type="number" dir="ltr" {...register(fields.maxAutoTime)} />
      </Labeler>

      <Labeler labelText={labels.accountingCode} errorMsg={errors.accountingCode?.message}>
        <Input dir="auto" {...register(fields.accountingCode)} />
      </Labeler>
    </form>
  )
}
