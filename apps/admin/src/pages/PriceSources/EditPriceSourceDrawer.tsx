import { UserPlusIcon } from "@phosphor-icons/react"
import type { StockPriceSourceEditRequest, StockPriceSourceResponse } from "@repo/api-client/client"
import { postApiStockPriceSourceEditStockPriceSourceMutation } from "@repo/api-client/tanstack"
import {
  BtnTemplates,
  DrawerSheet,
  EntityNotFoundCard,
  useDrawerSheetNumber,
} from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"
import { useCustomForm } from "#/shared/customForm"
import { getHeaderTokenOnly } from "#/shared/react-query"
import { queryStateKeys } from "."
import PriceSourceForm from "./PriceSourceForm"
import {
  emptyPriceSourceValues,
  type PriceSourceFormValues,
  priceSourceSchema,
} from "./priceSourceFormShared"

interface EditPriceSourceDrawerProps {
  reloadPriceSources: () => void
  priceSources: StockPriceSourceResponse[]
}

export default function EditPriceSourceDrawer({
  reloadPriceSources,
  priceSources,
}: EditPriceSourceDrawerProps) {
  const [priceSourceId, setPriceSourceId] = useDrawerSheetNumber(queryStateKeys.edit)
  const priceSource = priceSources.find(g => g.id === priceSourceId)

  const defaultValues = priceSource ? convertPartialEditRequestToFormValues(priceSource) : undefined

  const form = useCustomForm(priceSourceSchema, emptyPriceSourceValues, true, defaultValues)
  const { formState, trigger, reset, handleSubmit } = form
  const { isSubmitting } = formState

  const { mutate: editSource } = useMutation(
    postApiStockPriceSourceEditStockPriceSourceMutation(getHeaderTokenOnly()),
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    if (defaultValues) reset(defaultValues)
  }, [reset, priceSource])

  const onSubmit = (data: PriceSourceFormValues) => {
    if (priceSourceId == null) return

    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال ویرایش منبع قیمت...",
      success: "منبع قیمت با موفقیت ویرایش شد!",
    })

    editSource(
      { body: data },
      {
        onError: err => reject(err.message || String(err)),
        onSuccess: () => {
          resolve()
          reloadPriceSources()
          setPriceSourceId(null)
          reset()
        },
      },
    )
  }

  const submitTheFormManually = async () => {
    const isValid = await trigger()
    if (isValid) handleSubmit(onSubmit)()
  }

  return (
    <DrawerSheet
      open={priceSourceId != null}
      title="ویرایش منبع قیمت"
      icon={UserPlusIcon}
      onClose={() => setPriceSourceId(null)}
      btns={
        <>
          <BtnTemplates.Cancel onClick={() => setPriceSourceId(null)} />
          <BtnTemplates.Edit
            disabled={isSubmitting}
            themeType="filled"
            onClick={submitTheFormManually}
          />
        </>
      }
    >
      {priceSource === undefined ? (
        <EntityNotFoundCard entity="منبع قیمت" />
      ) : (
        <PriceSourceForm form={form} />
      )}
    </DrawerSheet>
  )
}

function convertPartialEditRequestToFormValues(
  dto: Partial<StockPriceSourceEditRequest>,
): Partial<PriceSourceFormValues> {
  const obj: Partial<PriceSourceFormValues> = {}

  if (dto?.name) obj.name = dto.name
  if (dto?.code) obj.code = dto.code
  if (dto?.sourceUrl) obj.sourceUrl = dto.sourceUrl
  if (typeof dto?.price === "number") obj.price = dto.price

  return obj
}
