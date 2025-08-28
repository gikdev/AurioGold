import { PencilSimpleIcon, PlusIcon } from "@phosphor-icons/react"
import type { CustomerGroupDto } from "@repo/api-client/client"
import { DrawerSheet } from "@repo/shared/components"
import { skins, useAppForm } from "@repo/shared/forms"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useQuery } from "@tanstack/react-query"
import { useCallback, useEffect } from "react"
import { type GroupId, numericGroupsOptions, refetchNumericGroups } from "../shared"
import {
  emptyGroupFormValues,
  formValuesToApiPayload,
  GroupFormSchema,
  groupFormFields,
  partialDtoToFormValues,
  useCreateGroupMutation,
  useUpdateGroupMutation,
} from "./stuff"

const { labels } = groupFormFields

interface GroupDrawerProps {
  onClose: () => void
  mode: "create" | "edit"
  groupId?: GroupId
}

export function GroupDrawer({ mode, onClose, groupId }: GroupDrawerProps) {
  const isCreateMode = mode === "create"
  const isEditMode = mode === "edit"

  const { mutate: createGroup } = useCreateGroupMutation()
  const { mutate: updateGroup } = useUpdateGroupMutation()

  const select = useCallback(
    (groups: CustomerGroupDto[]) => groups?.find(s => s.id === groupId),
    [groupId],
  )
  const { data: group } = useQuery({
    ...numericGroupsOptions,
    enabled: isEditMode && typeof groupId === "number",
    select,
  })

  const defaultValues = isEditMode && group ? partialDtoToFormValues(group) : emptyGroupFormValues

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: GroupFormSchema,
    },

    onSubmit({ value, formApi }) {
      const body = formValuesToApiPayload(value, groupId)

      const { reject, resolve } = createControlledAsyncToast({
        pending: isCreateMode ? "در حال ایجاد گروه..." : "در حال ویرایش گروه...",
        success: isCreateMode ? "گروه با موفقیت ایجاد شد!" : "گروه با موفقیت ویرایش شد!",
      })

      const onError = reject
      const onSuccess = () => {
        resolve()
        refetchNumericGroups()
        formApi.reset(emptyGroupFormValues)
        onClose()
      }

      if (mode === "edit" && typeof groupId === "number") {
        updateGroup({ path: { id: groupId }, body }, { onError, onSuccess })
      } else {
        createGroup({ body }, { onError, onSuccess })
      }
    },
  })

  useEffect(() => {
    if (isEditMode && typeof groupId !== "number") {
      console.warn("Provided groupId is not NUMBER!")
    }
  }, [isEditMode, groupId])

  return (
    <DrawerSheet
      open
      title={isCreateMode ? "ایجاد گروه عددی" : "ویرایش گروه عددی"}
      icon={isCreateMode ? PlusIcon : PencilSimpleIcon}
      onClose={onClose}
      btns={
        <form.AppForm>
          <form.Btn
            testId="numeric-group-drawer-submit-btn"
            Icon={isCreateMode ? PlusIcon : PencilSimpleIcon}
            title={isCreateMode ? "ایجاد گروه" : "ویرایش گروه"}
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

        <form.AppField name="diffBuyPrice">
          {field => <field.SimpleNumber label={labels.diffBuyPrice} />}
        </form.AppField>

        <form.AppField name="diffSellPrice">
          {field => <field.SimpleNumber label={labels.diffSellPrice} />}
        </form.AppField>
      </form>
    </DrawerSheet>
  )
}
