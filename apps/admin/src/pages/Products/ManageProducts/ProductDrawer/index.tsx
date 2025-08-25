import { PackageIcon, PencilSimpleIcon, PlusIcon } from "@phosphor-icons/react"
import type { StockDtoForMaster } from "@repo/api-client/client"
import {
  getApiStockPriceSourceGetStockPriceSourcesOptions,
  getApiTyStocksOptions,
} from "@repo/api-client/tanstack"
import { DrawerSheet } from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useQuery } from "@tanstack/react-query"
import { useCallback, useEffect, useMemo } from "react"
import { getHeaderTokenOnly, useAppForm } from "#/shared/forms"
import { skins } from "#/shared/forms/skins"
import {
  refetchStocks,
  TransactionMethod,
  transactionMethods,
  transactionStatuses,
  transactionTypes,
} from "../shared"
import type { ProductId } from "../store"
import {
  convertFormValuesToApiPayload,
  convertPartialCustomerDtoToFormValues,
  emptyProductFormValues,
  ProductFormSchema,
  productFormFields,
  useCreateStockMutation,
  useUpdateStockMutation,
} from "./utils"

const { labels } = productFormFields

interface ProductDrawerProps {
  onClose: () => void
  mode: "create" | "edit"
  productId?: ProductId
}

export function ProductDrawer({ mode, onClose, productId }: ProductDrawerProps) {
  const isCreateMode = mode === "create"
  const isEditMode = mode === "edit"

  const createStockMutation = useCreateStockMutation()
  const updateStockMutation = useUpdateStockMutation()

  const select = useCallback(
    (stocks: StockDtoForMaster[]) => stocks?.find(s => s.id === productId),
    [productId],
  )
  const { data: stock } = useQuery({
    ...getApiTyStocksOptions(getHeaderTokenOnly()),
    select,
    enabled: isEditMode && typeof productId === "number",
  })

  const { data: sources = [], isPending: areSourcesLoading } = useQuery(
    getApiStockPriceSourceGetStockPriceSourcesOptions(getHeaderTokenOnly()),
  )

  const sourcesOptions = useMemo(
    () =>
      sources.map(s => ({
        id: s.id ? s.id.toString() : "0",
        text: s.name ?? "---",
        value: s.id ? s.id.toString() : "0",
      })),
    [sources],
  )

  const defaultValues =
    isEditMode && stock ? convertPartialCustomerDtoToFormValues(stock) : emptyProductFormValues

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: ProductFormSchema,
      onBlur: ProductFormSchema,
    },

    onSubmit({ value, formApi }) {
      const body = convertFormValuesToApiPayload(value, productId)

      const { reject, resolve } = createControlledAsyncToast({
        pending: isCreateMode ? "در حال ایجاد محصول..." : "در حال ویرایش محصول...",
        success: isCreateMode ? "محصول با موفقیت ایجاد شد!" : "محصول با موفقیت ویرایش شد!",
      })

      const onError = reject
      const onSuccess = () => {
        resolve()
        refetchStocks()
        formApi.reset(emptyProductFormValues)
        onClose()
      }

      if (mode === "edit" && typeof productId === "number") {
        updateStockMutation.mutate({ path: { id: productId }, body }, { onError, onSuccess })
      } else {
        createStockMutation.mutate({ body }, { onError, onSuccess })
      }
    },
  })

  useEffect(() => {
    if (isEditMode && typeof productId !== "number") {
      console.warn("Provided productId is not NUMBER!")
    }
  }, [isEditMode, productId])

  return (
    <DrawerSheet
      open
      title={isCreateMode ? "ایجاد محصول" : "ویرایش محصول"}
      icon={PackageIcon}
      onClose={onClose}
      btns={
        <form.AppForm>
          <form.Btn
            testId="product-drawer-submit-btn"
            Icon={isCreateMode ? PlusIcon : PencilSimpleIcon}
            title={isCreateMode ? "ایجاد محصول" : "ویرایش محصول"}
            className={skins.btn({
              intent: isCreateMode ? "success" : "warning",
              style: "filled",
              className: "col-span-2",
            })}
          />
        </form.AppForm>
      }
    >
      <form className="min-h-full flex flex-col py-4 gap-5" autoComplete="off">
        <form.AppField name="name">
          {field => <field.SimpleText label={labels.name} />}
        </form.AppField>

        <form.AppField name="description">
          {field => <field.MultilineText label={labels.description} />}
        </form.AppField>

        <form.AppField name="price">
          {field => <field.SimpleNumber label={labels.price} />}
        </form.AppField>

        <form.AppField name="priceStep">
          {field => <field.SimpleNumber label={labels.priceStep} />}
        </form.AppField>

        <form.AppField name="priceDiffStep">
          {field => <field.SimpleNumber label={labels.priceDiffStep} />}
        </form.AppField>

        <form.AppField name="customerBuyingDiff">
          {field => <field.SimpleNumber label={labels.customerBuyingDiff} />}
        </form.AppField>

        <form.AppField name="customerSellingDiff">
          {field => <field.SimpleNumber label={labels.customerSellingDiff} />}
        </form.AppField>

        <form.AppField name="minTransactionVolume">
          {field => <field.SimpleNumber label={labels.minTransactionVolume} />}
        </form.AppField>

        <form.AppField name="maxTransactionVolume">
          {field => <field.SimpleNumber label={labels.maxTransactionVolume} />}
        </form.AppField>

        <form.AppField name="transactionStatus">
          {field => (
            <field.SimpleSelect label={labels.transactionStatus} options={transactionStatuses} />
          )}
        </form.AppField>

        <form.AppField
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
            <field.SimpleSelect label={labels.transactionMethod} options={transactionMethods} />
          )}
        </form.AppField>

        <form.AppField name="priceSource">
          {field => (
            <field.SimpleSelect
              label={labels.priceSource}
              options={sourcesOptions}
              isLoading={areSourcesLoading}
            />
          )}
        </form.AppField>

        <form.AppField name="minProductValue">
          {field => <field.SimpleNumber label={labels.minProductValue} />}
        </form.AppField>

        <form.AppField name="maxProductValue">
          {field => <field.SimpleNumber label={labels.maxProductValue} />}
        </form.AppField>

        <form.AppField name="transactionType">
          {field => (
            <field.SimpleSelect label={labels.transactionType} options={transactionTypes} />
          )}
        </form.AppField>

        <form.AppField name="priceToGramRatio">
          {field => <field.SimpleNumber label={labels.priceToGramRatio} readOnly />}
        </form.AppField>

        <form.AppField name="numOfDecimals">
          {field => <field.SimpleNumber label={labels.numOfDecimals} />}
        </form.AppField>

        <form.AppField name="maxAutoTime">
          {field => <field.SimpleNumber label={labels.maxAutoTime} />}
        </form.AppField>

        <form.AppField name="accountingCode">
          {field => <field.SimpleText label={labels.accountingCode} />}
        </form.AppField>
      </form>
    </DrawerSheet>
  )
}
