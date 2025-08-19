import { PackageIcon } from "@phosphor-icons/react"
import type { StockDtoForMaster, StockPriceSourceResponse } from "@repo/api-client/client"
import {
  getApiStockPriceSourceGetStockPriceSourcesOptions,
  getApiTyStocksOptions,
} from "@repo/api-client/tanstack"
import {
  BtnTemplates,
  createSelectWithOptions,
  DrawerSheet,
  Input,
  Labeler,
  TextArea,
} from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useForm } from "@tanstack/react-form"
import { useQuery } from "@tanstack/react-query"
import { useCallback, useEffect } from "react"
import {
  emptyProductFormValues,
  ProductFormSchema,
  productFormFields,
  TransactionMethod,
  type TransactionStatus,
  type TransactionType,
  transactionMethods,
  transactionStatuses,
  transactionTypes,
} from "../productFormShared"
import { extractError, getHeaderTokenOnly } from "../shared"
import type { ProductId } from "../store"
import {
  convertFormValuesToApiPayload,
  convertPartialCustomerDtoToFormValues,
  useCreateStockMutation,
  useUpdateStockMutation,
} from "./utils"

const { labels } = productFormFields

const keysConfig = { id: "id", text: "name", value: "id" } as const

interface ProductDrawerProps {
  onClose: () => void
  mode: "create" | "edit"
  productId?: ProductId
}

export function ProductDrawer({ mode, onClose, productId }: ProductDrawerProps) {
  const SubmitBtn = mode === "create" ? BtnTemplates.Create : BtnTemplates.Edit

  const createStockMutation = useCreateStockMutation()
  const updateStockMutation = useUpdateStockMutation()

  const select = useCallback(
    (stocks: StockDtoForMaster[]) => stocks?.find(s => s.id === productId),
    [productId],
  )
  const { data: stock } = useQuery({
    ...getApiTyStocksOptions(getHeaderTokenOnly()),
    select,
    enabled: mode === "edit" && typeof productId === "number",
  })

  const SelectWithTransactionStatus =
    createSelectWithOptions<(typeof transactionStatuses)[number]>()
  const SelectWithTransactionMethod = createSelectWithOptions<(typeof transactionMethods)[number]>()
  const SelectWithTransactionType = createSelectWithOptions<(typeof transactionTypes)[number]>()

  const SelectWithPriceSources = createSelectWithOptions<StockPriceSourceResponse>()
  const resSources = useQuery(
    getApiStockPriceSourceGetStockPriceSourcesOptions(getHeaderTokenOnly()),
  )

  const defaultValues =
    mode === "edit" && stock ? convertPartialCustomerDtoToFormValues(stock) : emptyProductFormValues

  const form = useForm({
    defaultValues,
    validators: {
      onChange: ProductFormSchema,
    },

    onSubmit({ value, formApi }) {
      const body = convertFormValuesToApiPayload(value, productId)

      const { reject, resolve } = createControlledAsyncToast({
        pending: mode === "create" ? "در حال ایجاد محصول..." : "در حال ویرایش محصول...",
        success: mode === "edit" ? "محصول با موفقیت ایجاد شد!" : "محصول با موفقیت ویرایش شد!",
      })

      const onError = reject
      const onSuccess = () => {
        resolve()
        formApi.reset(emptyProductFormValues)
        onClose()
      }

      if (mode === "edit" && typeof productId === "number") {
        updateStockMutation.mutate({ path: { id: productId } }, { onError, onSuccess })
      } else {
        createStockMutation.mutate({ body }, { onError, onSuccess })
      }
    },
  })

  useEffect(() => {
    if (mode === "edit" && typeof productId !== "number") {
      console.warn("Provided productId is not NUMBER!")
    }
  }, [mode, productId])

  return (
    <DrawerSheet
      open
      title={mode === "create" ? "ایجاد محصول" : "ویرایش محصول"}
      icon={PackageIcon}
      onClose={onClose}
      btns={
        <form.Subscribe selector={s => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <SubmitBtn
              disabled={!canSubmit || isSubmitting}
              onClick={form.handleSubmit}
              themeType="filled"
            />
          )}
        </form.Subscribe>
      }
    >
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
                onChange={e => field.handleChange(e.target.value as TransactionStatus)}
                options={transactionStatuses}
                keys={keysConfig}
              />
            </Labeler>
          )}
        </form.Field>

        <form.Field
          name="transactionMethod"
          listeners={{
            onChange: ({ value: method }) => {
              // if it's مثقال then the ratio should be 4.3318 otherwise should be 1
              form.setFieldValue(
                "priceToGramRatio",
                method === TransactionMethod.mithqal ? 4.3318 : 1,
              )
            },
          }}
        >
          {field => (
            <Labeler labelText={labels.transactionMethod} errorMsg={extractError(field)}>
              <SelectWithTransactionMethod
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value as TransactionMethod)}
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
              <Input type="number" dir="ltr" readOnly value={field.state.value} />
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
    </DrawerSheet>
  )
}
