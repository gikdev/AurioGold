import { PackageIcon } from "@phosphor-icons/react"
import type { StockPriceSourceResponse } from "@repo/api-client/client"
import {
  getApiStockPriceSourceGetStockPriceSourcesOptions,
  getApiTyStocksOptions,
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
import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "../navigation"
import {
  emptyProductFormValues,
  ProductFormSchema,
  productFormFields,
  type TransactionMethods,
  type TransactionStatuses,
  type TransactionType,
  transactionMethods,
  transactionStatuses,
  transactionTypes,
} from "../productFormShared"
import { extractError, getHeaderTokenOnly } from "../shared"
import {
  convertFormValuesToApiPayload,
  convertPartialCustomerDtoToFormValues,
  useUpdateStockMutation,
} from "./utils"

const { labels } = productFormFields

const keysConfig = { id: "id", text: "name", value: "id" } as const

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
