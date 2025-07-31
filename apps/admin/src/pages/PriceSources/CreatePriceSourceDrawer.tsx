import { UserPlusIcon } from "@phosphor-icons/react"
import { postApiStockPriceSourceAddStockPriceSourceMutation } from "@repo/api-client/tanstack"
import { BtnTemplates, DrawerSheet, useDrawerSheet } from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useMutation } from "@tanstack/react-query"
import { useCustomForm } from "#/shared/customForm"
import { getHeaderTokenOnly } from "#/shared/react-query"
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

  const { mutate: createPriceSource } = useMutation(
    postApiStockPriceSourceAddStockPriceSourceMutation(),
  )

  const onSubmit = async (data: PriceSourceFormValues) => {
    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال ایجاد منبع قیمت...",
      success: "منبع قیمت با موفقیت ایجاد شد!",
      error: "یه مشکلی پیش آمد...",
    })

    createPriceSource(
      { ...getHeaderTokenOnly(), body: data, throwOnError: true },
      {
        onError: err => reject(err?.message || "یه مشکلی پیش آمده..."),
        onSuccess() {
          resolve()
          reloadPriceSources()
          setOpen(false)
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
