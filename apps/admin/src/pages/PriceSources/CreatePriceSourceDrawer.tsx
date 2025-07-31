import { apiRequest } from "@gikdev/react-datapi/src"
import { UserPlusIcon } from "@phosphor-icons/react"
import type { StockPriceSourceAddRequest } from "@repo/api-client/client"
import { BtnTemplates, DrawerSheet, useDrawerSheet } from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useCustomForm } from "#/shared/customForm"
import genDatApiConfig from "#/shared/datapi-config"
import { queryStateKeys } from "."
import PriceSourceForm from "./PriceSourceForm"
import {
  emptyPriceSourceValues,
  type PriceSourceFormValues,
  priceSourceSchema,
} from "./priceSourceFormShared"

interface CreatePriceSourceFormProps {
  reloadPriceSources: () => void
}

export default function CreatePriceSourceDrawer({
  reloadPriceSources,
}: CreatePriceSourceFormProps) {
  const [isOpen, setOpen] = useDrawerSheet(queryStateKeys.createNew)

  const form = useCustomForm(priceSourceSchema, emptyPriceSourceValues)
  const { formState, trigger, reset, handleSubmit } = form
  const { isSubmitting } = formState

  const onSubmit = async (data: PriceSourceFormValues) => {
    const dataToSend = convertFormValuesToApiPayload(data)

    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال ایجاد منبع قیمت...",
      success: "منبع قیمت با موفقیت ایجاد شد!",
    })

    await apiRequest({
      config: genDatApiConfig(),
      options: {
        url: "/StockPriceSource/AddStockPriceSource",
        method: "POST",
        body: JSON.stringify(dataToSend),
        onError: msg => reject(msg),
        onSuccess: () => {
          resolve()
          reloadPriceSources()
          setOpen(false)
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
      open={isOpen}
      title="ایجاد منبع قیمت جدید"
      icon={UserPlusIcon}
      onClose={() => setOpen(false)}
      btns={
        <>
          <BtnTemplates.Cancel onClick={() => setOpen(false)} />
          <BtnTemplates.Create
            disabled={isSubmitting}
            themeType="filled"
            onClick={submitTheFormManually}
          />
        </>
      }
    >
      <PriceSourceForm form={form} />
    </DrawerSheet>
  )
}

function convertFormValuesToApiPayload(
  values: PriceSourceFormValues,
): Required<StockPriceSourceAddRequest> {
  return {
    name: values.name,
    code: values.code,
    price: values.price ?? 0,
    sourceUrl: values.sourceUrl,
  }
}
