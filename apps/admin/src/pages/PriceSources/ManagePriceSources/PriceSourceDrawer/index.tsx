import { PencilSimpleIcon, PlusIcon } from "@phosphor-icons/react"
import type { StockPriceSourceResponse } from "@repo/api-client/client"
import { DrawerSheet } from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect } from "react"
import { useAppForm } from "#/shared/forms"
import { skins } from "#/shared/forms/skins"
import { type PriceSourceId, priceSourcesOptions } from "../shared"
import {
  emptyPriceSourceFieldValues,
  formValuesToApiPayload,
  PriceSourceFormSchema,
  partialDtoToFormValues,
  priceSourceFormFields,
  useCreateSourceMutation,
  useUpdateSourceMutation,
} from "./stuff"

const { labels } = priceSourceFormFields

interface PriceSourceDrawerProps {
  onClose: () => void
  mode: "create" | "edit"
  sourceId?: PriceSourceId
}

export function PriceSourceDrawer({ mode, onClose, sourceId }: PriceSourceDrawerProps) {
  const queryClient = useQueryClient()

  const isCreateMode = mode === "create"
  const isEditMode = mode === "edit"

  const { mutate: createSource } = useCreateSourceMutation()
  const { mutate: updateSource } = useUpdateSourceMutation()

  const select = useCallback(
    (groups: StockPriceSourceResponse[]) => groups?.find(s => s.id === sourceId),
    [sourceId],
  )
  const { data: group } = useQuery({
    ...priceSourcesOptions,
    enabled: isEditMode && typeof sourceId === "number",
    select,
  })

  const defaultValues =
    isEditMode && group ? partialDtoToFormValues(group) : emptyPriceSourceFieldValues

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: PriceSourceFormSchema,
    },

    onSubmit({ value, formApi }) {
      const body = formValuesToApiPayload(value, sourceId)

      const { reject, resolve } = createControlledAsyncToast({
        pending: isCreateMode ? "در حال ایجاد منبع..." : "در حال ویرایش منبع...",
        success: isCreateMode ? "منبع با موفقیت ایجاد شد!" : "منبع با موفقیت ویرایش شد!",
      })

      const onError = reject
      const onSuccess = () => {
        resolve()
        queryClient.refetchQueries(priceSourcesOptions)
        formApi.reset(emptyPriceSourceFieldValues)
        onClose()
      }

      if (mode === "edit" && typeof sourceId === "number") {
        updateSource({ body: { ...body, id: sourceId } }, { onError, onSuccess })
      } else {
        createSource({ body }, { onError, onSuccess })
      }
    },
  })

  useEffect(() => {
    if (isEditMode && typeof sourceId !== "number") {
      console.warn("Provided sourceId is not NUMBER!")
    }
  }, [isEditMode, sourceId])

  return (
    <DrawerSheet
      open
      title={isCreateMode ? "ایجاد منبع" : "ویرایش منبع"}
      icon={isCreateMode ? PlusIcon : PencilSimpleIcon}
      onClose={onClose}
      btns={
        <form.AppForm>
          <form.Btn
            testId="price-source-drawer-submit-btn"
            Icon={isCreateMode ? PlusIcon : PencilSimpleIcon}
            title={isCreateMode ? "ایجاد منبع" : "ویرایش منبع"}
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

        <form.AppField name="code">
          {field => <field.SimpleText label={labels.code} />}
        </form.AppField>

        <form.AppField name="sourceUrl">
          {field => <field.SimpleText label={labels.sourceUrl} />}
        </form.AppField>

        <form.AppField name="price">
          {field => <field.SimpleNumber label={labels.price} />}
        </form.AppField>
      </form>
    </DrawerSheet>
  )
}
