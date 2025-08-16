import { PackageIcon } from "@phosphor-icons/react"
import type {
  AutoMode,
  PutApiTyStocksByIdData,
  StockDtoForMaster,
  StockPriceSourceResponse,
  StockStatus,
  StockUnit,
} from "@repo/api-client/client"
import {
  getApiStockPriceSourceGetStockPriceSourcesOptions,
  getApiTyStocksOptions,
  getApiTyStocksQueryKey,
  putApiTyStocksByIdMutation,
} from "@repo/api-client/tanstack"
import {
  BtnTemplates,
  createSelectWithOptions,
  DrawerSheet,
  EntityNotFoundCard,
  Input,
  Labeler,
  TextArea,
  useDrawerSheet,
  useDrawerSheetNumber,
} from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "../navigation"
import {
  emptyProductFormValues,
  ProductFormSchema,
  type ProductFormValues,
  productFormFields,
  type TransactionMethods,
  type TransactionStatuses,
  type TransactionType,
  toSafeNumber,
  transactionMethods,
  transactionStatuses,
  transactionTypes,
} from "../productFormShared"
import { extractError, getHeaderTokenOnly } from "../shared"

const { labels } = productFormFields

const keysConfig = { id: "id", text: "name", value: "id" } as const

function useUpdateStockMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    ...putApiTyStocksByIdMutation(getHeaderTokenOnly()),
    onSuccess: (_, { body, path: { id } }) => {
      queryClient.setQueryData<StockDtoForMaster[]>(
        getApiTyStocksQueryKey(getHeaderTokenOnly()),
        old => old?.map(stock => (stock.id === id ? { ...stock, ...body } : stock)),
      )
    },
  })
}

function useShow() {
  return useDrawerSheet(QUERY_KEYS.edit)
}

export function EditProductDrawer() {
  const [, setShowEditDrawer] = useShow()
  const [productId, setProductId] = useDrawerSheetNumber(QUERY_KEYS.productId)
  const updateStock = useUpdateStockMutation()
  const { data: stock } = useQuery({
    ...getApiTyStocksOptions(getHeaderTokenOnly()),
    select: stocks => stocks?.find(s => s.id === productId),
  })
  const SelectWithTransactionStatus =
    createSelectWithOptions<(typeof transactionStatuses)[number]>()
  const SelectWithTransactionMethod = createSelectWithOptions<(typeof transactionMethods)[number]>()
  const SelectWithTransactionType = createSelectWithOptions<(typeof transactionTypes)[number]>()
  const SelectWithPriceSources = createSelectWithOptions<StockPriceSourceResponse>()
  const resSources = useQuery(
    getApiStockPriceSourceGetStockPriceSourcesOptions(getHeaderTokenOnly()),
  )

  const defaultValues = stock ? convertPartialCustomerDtoToFormValues(stock) : undefined

  const form = useForm({
    defaultValues: defaultValues || emptyProductFormValues,
    validators: {
      onChange: ProductFormSchema,
    },

    onSubmit({ value, formApi }) {
      if (productId == null) return
      const dataToSend = convertFormValuesToApiPayload(value, productId)

      const { reject, resolve } = createControlledAsyncToast({
        pending: "در حال ویرایش محصول...",
        success: "محصول با موفقیت ویرایش شد!",
      })

      updateStock.mutate(
        { path: { id: productId }, body: dataToSend },
        {
          onError: msg => reject(msg),
          onSuccess() {
            resolve()
            handleClose()
            formApi.reset(emptyProductFormValues)
          },
        },
      )
    },
  })

  const handleClose = () => {
    setProductId(null)
    setShowEditDrawer(false)
  }

  return (
    <DrawerSheet
      open
      title="ویرایش محصول"
      icon={PackageIcon}
      onClose={handleClose}
      btns={
        <>
          <BtnTemplates.Cancel onClick={handleClose} />

          <form.Subscribe selector={s => [s.canSubmit, s.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <BtnTemplates.Edit
                disabled={!canSubmit || isSubmitting}
                onClick={form.handleSubmit}
                themeType="filled"
              />
            )}
          </form.Subscribe>
        </>
      }
    >
      {stock === undefined || productId === null ? (
        <EntityNotFoundCard entity="محصول" />
      ) : (
        <form className="min-h-full flex flex-col py-4 gap-5" autoComplete="off">
          <form.Field name="name">
            {field => (
              <Labeler labelText={labels.name} errorMsg={extractError(field)}>
                <Input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                />
              </Labeler>
            )}
          </form.Field>

          <form.Field name="description">
            {field => (
              <Labeler labelText={labels.description} errorMsg={extractError(field)}>
                <TextArea
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                />
              </Labeler>
            )}
          </form.Field>

          <form.Field name="price">
            {field => (
              <Labeler labelText={labels.price} errorMsg={extractError(field)}>
                <Input
                  type="number"
                  dir="ltr"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e =>
                    field.handleChange(
                      Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber,
                    )
                  }
                />
              </Labeler>
            )}
          </form.Field>

          <form.Field name="priceStep">
            {field => (
              <Labeler labelText={labels.priceStep} errorMsg={extractError(field)}>
                <Input
                  type="number"
                  dir="ltr"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e =>
                    field.handleChange(
                      Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber,
                    )
                  }
                />
              </Labeler>
            )}
          </form.Field>

          <form.Field name="priceDiffStep">
            {field => (
              <Labeler labelText={labels.priceDiffStep} errorMsg={extractError(field)}>
                <Input
                  type="number"
                  dir="ltr"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e =>
                    field.handleChange(
                      Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber,
                    )
                  }
                />
              </Labeler>
            )}
          </form.Field>

          <form.Field name="customerBuyingDiff">
            {field => (
              <Labeler labelText={labels.customerBuyingDiff} errorMsg={extractError(field)}>
                <Input
                  type="number"
                  dir="ltr"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e =>
                    field.handleChange(
                      Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber,
                    )
                  }
                />
              </Labeler>
            )}
          </form.Field>

          <form.Field name="customerSellingDiff">
            {field => (
              <Labeler labelText={labels.customerSellingDiff} errorMsg={extractError(field)}>
                <Input
                  type="number"
                  dir="ltr"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e =>
                    field.handleChange(
                      Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber,
                    )
                  }
                />
              </Labeler>
            )}
          </form.Field>

          <form.Field name="minTransactionVolume">
            {field => (
              <Labeler labelText={labels.minTransactionVolume} errorMsg={extractError(field)}>
                <Input
                  type="number"
                  dir="ltr"
                  value={field.state.value ?? 0}
                  onBlur={field.handleBlur}
                  onChange={e =>
                    field.handleChange(
                      Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber,
                    )
                  }
                />
              </Labeler>
            )}
          </form.Field>

          <form.Field name="maxTransactionVolume">
            {field => (
              <Labeler labelText={labels.maxTransactionVolume} errorMsg={extractError(field)}>
                <Input
                  type="number"
                  dir="ltr"
                  value={field.state.value ?? 0}
                  onBlur={field.handleBlur}
                  onChange={e =>
                    field.handleChange(
                      Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber,
                    )
                  }
                />
              </Labeler>
            )}
          </form.Field>

          <form.Field name="transactionStatus">
            {field => (
              <Labeler labelText={labels.transactionStatus} errorMsg={extractError(field)}>
                <SelectWithTransactionStatus
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value as TransactionStatuses)}
                  options={transactionStatuses}
                  keys={keysConfig}
                />
              </Labeler>
            )}
          </form.Field>

          <form.Field name="transactionMethod">
            {field => (
              <Labeler labelText={labels.transactionMethod} errorMsg={extractError(field)}>
                <SelectWithTransactionMethod
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value as TransactionMethods)}
                  options={transactionMethods}
                  keys={keysConfig}
                />
              </Labeler>
            )}
          </form.Field>

          <form.Field name="priceSource">
            {field => (
              <Labeler
                labelText={labels.priceSource}
                errorMsg={extractError(field) || resSources.error?.message || ""}
              >
                <SelectWithPriceSources
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e =>
                    field.handleChange(
                      Number.isNaN(Number(e.target.value)) ? 0 : Number(e.target.value),
                    )
                  }
                  isLoading={resSources.isLoading}
                  options={resSources.data || []}
                  keys={keysConfig}
                />
              </Labeler>
            )}
          </form.Field>

          <form.Field name="minProductValue">
            {field => (
              <Labeler labelText={labels.minProductValue} errorMsg={extractError(field)}>
                <Input
                  type="number"
                  dir="ltr"
                  value={field.state.value ?? 0}
                  onBlur={field.handleBlur}
                  onChange={e =>
                    field.handleChange(
                      Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber,
                    )
                  }
                />
              </Labeler>
            )}
          </form.Field>

          <form.Field name="maxProductValue">
            {field => (
              <Labeler labelText={labels.maxProductValue} errorMsg={extractError(field)}>
                <Input
                  type="number"
                  dir="ltr"
                  value={field.state.value ?? 0}
                  onBlur={field.handleBlur}
                  onChange={e =>
                    field.handleChange(
                      Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber,
                    )
                  }
                />
              </Labeler>
            )}
          </form.Field>

          <form.Field name="transactionType">
            {field => (
              <Labeler labelText={labels.transactionType} errorMsg={extractError(field)}>
                <SelectWithTransactionType
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value as TransactionType)}
                  options={transactionTypes}
                  keys={keysConfig}
                />
              </Labeler>
            )}
          </form.Field>

          <form.Field name="priceToGramRatio">
            {field => (
              <Labeler labelText={labels.priceToGramRatio} errorMsg={extractError(field)}>
                <Input
                  type="number"
                  dir="ltr"
                  value={field.state.value ?? 0}
                  onBlur={field.handleBlur}
                  onChange={e =>
                    field.handleChange(
                      Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber,
                    )
                  }
                />
              </Labeler>
            )}
          </form.Field>

          <form.Field name="numOfDecimals">
            {field => (
              <Labeler labelText={labels.numOfDecimals} errorMsg={extractError(field)}>
                <Input
                  type="number"
                  dir="ltr"
                  value={field.state.value ?? 0}
                  onBlur={field.handleBlur}
                  onChange={e =>
                    field.handleChange(
                      Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber,
                    )
                  }
                />
              </Labeler>
            )}
          </form.Field>

          <form.Field name="maxAutoTime">
            {field => (
              <Labeler labelText={labels.maxAutoTime} errorMsg={extractError(field)}>
                <Input
                  type="number"
                  dir="ltr"
                  value={field.state.value ?? 0}
                  onBlur={field.handleBlur}
                  onChange={e =>
                    field.handleChange(
                      Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber,
                    )
                  }
                />
              </Labeler>
            )}
          </form.Field>

          <form.Field name="accountingCode">
            {field => (
              <Labeler labelText={labels.accountingCode} errorMsg={extractError(field)}>
                <Input
                  dir="auto"
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                />
              </Labeler>
            )}
          </form.Field>
        </form>
      )}
    </DrawerSheet>
  )
}
EditProductDrawer.useShow = useShow

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

function convertPartialCustomerDtoToFormValues(dto: Partial<StockDtoForMaster>): ProductFormValues {
  const obj: ProductFormValues = {
    ...emptyProductFormValues,
  }

  if (dto?.accountCode) obj.accountingCode = dto.accountCode
  if (dto?.name) obj.name = dto.name
  if (dto?.decimalNumber) obj.numOfDecimals = dto.decimalNumber
  if (dto?.description) obj.description = dto.description
  if (dto?.diffBuyPrice) obj.customerBuyingDiff = dto.diffBuyPrice
  if (dto?.diffPriceStep) obj.priceDiffStep = dto.diffPriceStep
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
