import { apiRequest } from "@gikdev/react-datapi/src"
import { UserPlusIcon } from "@phosphor-icons/react"
import type { CustomerDto, CustomerGroupIntDto } from "@repo/api-client/client"
import { BtnTemplates, DrawerSheet, useDrawerSheetNumber } from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useEffect } from "react"
import { EntityNotFoundCard } from "#/components"
import { useCustomForm } from "#/shared/customForm"
import genDatApiConfig from "#/shared/datapi-config"
import { queryStateKeys } from "."
import GroupForm from "./GroupForm"
import { type GroupFormValues, emptyGroupValues, groupSchema } from "./groupFormShared"

interface EditGroupDrawerProps {
  reloadGroups: () => void
  groups: CustomerDto[]
}

export default function EditGroupDrawer({ reloadGroups, groups }: EditGroupDrawerProps) {
  const [groupId, setGroupId] = useDrawerSheetNumber(queryStateKeys.edit)
  const group = groups.find(g => g.id === groupId)

  const defaultValues = group ? convertPartialGroupDtoToFormValues(group) : undefined

  const form = useCustomForm(groupSchema, emptyGroupValues, true, defaultValues)
  const { formState, trigger, reset, handleSubmit } = form
  const { isSubmitting } = formState

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (defaultValues) reset(defaultValues)
  }, [reset, group])

  const onSubmit = async (data: GroupFormValues) => {
    if (groupId == null) return
    const dataToSend = convertFormValuesToApiPayload(data, groupId)

    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال ویرایش گروه...",
      success: "گروه با موفقیت ویرایش شد!",
    })

    await apiRequest({
      config: genDatApiConfig(),
      options: {
        url: `/TyCustomerGroupIntInts/${groupId}`,
        method: "PUT",
        body: JSON.stringify(dataToSend),
        onError: msg => reject(msg),
        onSuccess: () => {
          resolve()
          reloadGroups()
          setGroupId(null)
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
      open={groupId != null}
      title="ویرایش گروه"
      icon={UserPlusIcon}
      onClose={() => setGroupId(null)}
      btns={
        <>
          <BtnTemplates.Cancel onClick={() => setGroupId(null)} />
          <BtnTemplates.Edit
            disabled={isSubmitting}
            themeType="filled"
            onClick={submitTheFormManually}
          />
        </>
      }
    >
      {group === undefined ? <EntityNotFoundCard entity="گروه" /> : <GroupForm form={form} />}
    </DrawerSheet>
  )
}

function convertFormValuesToApiPayload(
  values: GroupFormValues,
  groupId: number,
): Required<CustomerGroupIntDto> {
  return {
    id: groupId,
    name: values.name,
    description: values.description ?? null,
    diffBuyPrice: values.diffBuyPrice ?? 0,
    diffSellPrice: values.diffSellPrice ?? 0,
  }
}

function convertPartialGroupDtoToFormValues(
  dto: Partial<CustomerGroupIntDto>,
): Partial<GroupFormValues> {
  const obj: Partial<GroupFormValues> = {}

  if (dto?.name) obj.name = dto.name
  if (dto?.description) obj.description = dto.description
  if (typeof dto?.diffBuyPrice === "number") obj.diffBuyPrice = dto.diffBuyPrice
  if (typeof dto?.diffSellPrice === "number") obj.diffSellPrice = dto.diffSellPrice

  return obj
}
