import { apiRequest } from "@gikdev/react-datapi/src"
import { CirclesThreePlusIcon } from "@phosphor-icons/react"
import type { AutoMode, PostApiTyStocksData, StockStatus, StockUnit } from "@repo/api-client/client"
import { BtnTemplates, DrawerSheet, useDrawerSheet } from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { memo } from "react"
import { useCustomForm } from "#/shared/customForm"
import genDatApiConfig from "#/shared/datapi-config"
import ProductForm from "./ProductForm"
import { QUERY_KEYS } from "./navigation"
import {
  type ProductFormValues,
  emptyProductFormValues,
  productFormSchema,
} from "./productFormShared"

interface CreateProductFormProps {
  reloadProducts: () => void
}

function _CreateProductDrawer({ reloadProducts }: CreateProductFormProps) {
  const [showCreateDrawer, setShowCreateDrawer] = useDrawerSheet(QUERY_KEYS.createNew)

  const form = useCustomForm(productFormSchema, emptyProductFormValues)
  const { formState, trigger, reset, handleSubmit } = form
  const { isSubmitting } = formState

  const handleClose = () => {
    reset()
    setShowCreateDrawer(false)
  }

  const onSubmit = async (data: ProductFormValues) => {
    const dataToSend = convertFormValuesToApiPayload(data)

    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال ایجاد محصول...",
      success: "محصول با موفقیت ایجاد شد!",
    })

    await apiRequest({
      config: genDatApiConfig(),
      options: {
        url: "/TyStocks",
        method: "POST",
        body: JSON.stringify(dataToSend),
        onError: msg => reject(msg),
        onSuccess: () => {
          resolve()
          reloadProducts()
          handleClose()
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
      open={showCreateDrawer}
      title="ایجاد محصول جدید"
      icon={CirclesThreePlusIcon}
      onClose={handleClose}
      btns={
        <>
          <BtnTemplates.Cancel onClick={handleClose} />

          <BtnTemplates.Create
            disabled={isSubmitting}
            themeType="filled"
            onClick={submitTheFormManually}
          />
        </>
      }
    >
      <ProductForm form={form} />
    </DrawerSheet>
  )
}

function convertFormValuesToApiPayload(
  values: ProductFormValues,
): Required<PostApiTyStocksData["body"]> {
  return {
    id: 0,
    name: values.name,
    description: values.description ?? null,
    price: values.price,
    diffBuyPrice: values.customerBuyingDiff,
    diffSellPrice: values.customerSellingDiff,
    priceStep: values.priceStep,
    diffPriceStep: values.priceDiffStep,
    status: Number(values.transactionStatus) as StockStatus,
    mode: Number(values.transactionType) as AutoMode,
    maxAutoMin: values.maxAutoTime,
    dateUpdate: new Date().toISOString(),
    minValue: values.minProductValue,
    maxValue: values.maxProductValue,
    minVoume: values.minTransactionVolume,
    maxVoume: values.maxTransactionVolume,
    isCountable: false,
    unitPriceRatio: values.priceToGramRatio,
    decimalNumber: values.numOfDecimals,
    supply: 0,
    priceSourceID: values.priceSource,
    accountCode: values.accountingCode ?? null,
    unit: Number(values.transactionMethod) as StockUnit,
  }
}

const CreateProductDrawer = memo(_CreateProductDrawer)
export default CreateProductDrawer
