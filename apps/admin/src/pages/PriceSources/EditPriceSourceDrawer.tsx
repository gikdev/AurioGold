import { apiRequest } from "@gikdev/react-datapi/src"
import { UserPlusIcon } from "@phosphor-icons/react"
import type { StockPriceSourceEditRequest, StockPriceSourceResponse } from "@repo/api-client/client"
import { BtnTemplates, DrawerSheet, useDrawerSheetNumber } from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useEffect } from "react"
import { EntityNotFoundCard } from "#/components"
import { useCustomForm } from "#/shared/customForm"
import genDatApiConfig from "#/shared/datapi-config"
import { queryStateKeys } from "."
import PriceSourceForm from "./PriceSourceForm"
import {
  type PriceSourceFormValues,
  emptyPriceSourceValues,
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (defaultValues) reset(defaultValues)
  }, [reset, priceSource])

  const onSubmit = async (data: PriceSourceFormValues) => {
    if (priceSourceId == null) return
    const dataToSend = convertFormValuesToApiPayload(data, priceSourceId)

    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال ویرایش منبع قیمت...",
      success: "منبع قیمت با موفقیت ویرایش شد!",
    })

    await apiRequest({
      config: genDatApiConfig(),
      options: {
        url: "/StockPriceSource/EditStockPriceSource",
        method: "POST",
        body: JSON.stringify(dataToSend),
        onError: msg => reject(msg),
        onSuccess: () => {
          resolve()
          reloadPriceSources()
          setPriceSourceId(null)
          reset()
        },
      },
    })
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

function convertFormValuesToApiPayload(
  values: PriceSourceFormValues,
  priceSourceId: number,
): Required<StockPriceSourceEditRequest> {
  return {
    id: priceSourceId,
    name: values.name,
    code: values.code,
    price: values.price ?? 0,
    sourceUrl: values.sourceUrl,
  }
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
