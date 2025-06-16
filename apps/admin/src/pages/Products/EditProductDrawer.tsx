import { apiRequest } from "@gikdev/react-datapi/src"
import { PackageIcon } from "@phosphor-icons/react"
import type {
  AutoMode,
  PutApiTyStocksByIdData,
  StockDtoForMaster,
  StockStatus,
  StockUnit,
} from "@repo/api-client/client"
import {
  BtnTemplates,
  DrawerSheet,
  useDrawerSheet,
  useDrawerSheetNumber,
} from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { memo, useEffect } from "react"
import { EntityNotFoundCard } from "#/components"
import { useCustomForm } from "#/shared/customForm"
import genDatApiConfig from "#/shared/datapi-config"
import ProductForm from "./ProductForm"
import { QUERY_KEYS } from "./navigation"
import {
  type ProductFormValues,
  emptyProductFormValues,
  productFormSchema,
  toSafeNumber,
} from "./productFormShared"

interface EditProductDrawerProps {
  reloadProducts: () => void
  products: Required<StockDtoForMaster>[]
}

function _EditProductDrawer({ reloadProducts, products }: EditProductDrawerProps) {
  const [productId, setProductId] = useDrawerSheetNumber(QUERY_KEYS.productId)
  const [showEditDrawer, setShowEditDrawer] = useDrawerSheet(QUERY_KEYS.edit)
  const product = products.find(p => p.id === productId)

  const defaultValues = product ? convertPartialCustomerDtoToFormValues(product) : undefined

  const handleClose = () => {
    setProductId(null)
    setShowEditDrawer(false)
  }

  const form = useCustomForm(productFormSchema, emptyProductFormValues, true, defaultValues)
  const { formState, trigger, reset, handleSubmit } = form
  const { isSubmitting } = formState

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (defaultValues) reset(defaultValues)
  }, [reset, products])

  const onSubmit = async (data: ProductFormValues) => {
    if (productId == null) return
    const dataToSend = convertFormValuesToApiPayload(data, productId)

    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال ویرایش محصول...",
      success: "محصول با موفقیت ویرایش شد!",
    })

    await apiRequest({
      config: genDatApiConfig(),
      options: {
        url: `/TyStocks/${productId}`,
        method: "POST",
        body: JSON.stringify(dataToSend),
        onError: msg => reject(msg),
        onSuccess: () => {
          resolve()
          reloadProducts()
          handleClose()
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
      open={productId != null && showEditDrawer}
      title="ویرایش محصول"
      icon={PackageIcon}
      onClose={handleClose}
      btns={
        <>
          <BtnTemplates.Cancel onClick={handleClose} />
          <BtnTemplates.Edit
            disabled={isSubmitting}
            onClick={submitTheFormManually}
            themeType="filled"
          />
        </>
      }
    >
      {product === undefined ? <EntityNotFoundCard entity="محصول" /> : <ProductForm form={form} />}
    </DrawerSheet>
  )
}

function convertFormValuesToApiPayload(
  values: ProductFormValues,
  productId: NonNullable<StockDtoForMaster["id"]>,
): Required<PutApiTyStocksByIdData["body"]> {
  return {
    id: productId,
    name: values.name,
    description: values.description ?? null,
    price: values.price,
    diffBuyPrice: values.customerBuyingDiff,
    diffSellPrice: values.customerSellingDiff,
    priceStep: values.priceStep,
    diffPriceStep: values.priceDiffStep,
    status: toSafeNumber(values.transactionStatus) as StockStatus,
    mode: toSafeNumber(values.transactionType) as AutoMode,
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
    unit: toSafeNumber(values.transactionMethod) as StockUnit,
  }
}

function convertPartialCustomerDtoToFormValues(
  dto: Partial<StockDtoForMaster>,
): Partial<ProductFormValues> {
  const obj: Partial<ProductFormValues> = {}

  if (dto?.accountCode) obj.accountingCode = dto.accountCode
  if (dto?.name) obj.name = dto.name
  if (dto?.decimalNumber) obj.numOfDecimals = dto.decimalNumber
  if (dto?.description) obj.description = dto.description
  if (dto?.diffBuyPrice) obj.customerBuyingDiff = dto.diffBuyPrice
  if (dto?.diffPriceStep) obj.customerBuyingDiff = dto.diffPriceStep
  if (dto?.diffSellPrice) obj.customerSellingDiff = dto.diffSellPrice
  if (dto?.maxAutoMin) obj.maxAutoTime = dto.maxAutoMin
  if (dto?.maxValue) obj.maxProductValue = dto.maxValue
  if (dto?.maxVoume) obj.maxTransactionVolume = dto.maxVoume
  if (dto?.minValue) obj.minProductValue = dto.minValue
  if (dto?.minVoume) obj.minTransactionVolume = dto.minVoume
  if (dto?.mode) obj.transactionType = dto.mode.toString() as "0" | "1" | "2"
  if (dto?.price) obj.price = dto.price
  if (dto?.priceSourceID) obj.priceSource = dto.priceSourceID
  if (dto?.priceStep) obj.priceStep = dto.priceStep
  if (dto?.status) obj.transactionStatus = dto.status.toString() as "0" | "1" | "2" | "3"
  if (dto?.unit) obj.transactionMethod = dto.unit.toString() as "0" | "1" | "2"
  if (dto?.unitPriceRatio) obj.priceToGramRatio = dto.unitPriceRatio

  return obj
}

const EditProductDrawer = memo(_EditProductDrawer)
export default EditProductDrawer
