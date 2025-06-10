import { apiRequest } from "@gikdev/react-datapi/src"
import { ArrowRightIcon, PenIcon, ReceiptXIcon, UserPlusIcon } from "@phosphor-icons/react"
import type { CustomerDto, CustomerGroupIntDto } from "@repo/api-client/client"
import { Btn, DrawerSheet, useDrawerSheetNumber } from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useEffect } from "react"
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
          <Btn className="flex-1" onClick={() => setGroupId(null)}>
            <ArrowRightIcon size={24} />
            <span>انصراف</span>
          </Btn>

          <Btn
            className="flex-1"
            disabled={isSubmitting}
            theme="warning"
            themeType="filled"
            onClick={submitTheFormManually}
          >
            <PenIcon size={24} />
            <span>ویرایش</span>
          </Btn>
        </>
      }
    >
      {group === undefined ? (
        <div className="bg-red-2 border border-red-6 text-red-11 p-4 flex flex-col gap-2 items-center rounded-md">
          <ReceiptXIcon size={64} />
          <p className="text-xl font-bold text-red-12">پیدا نشد!</p>
          <p>گروه مورد نظر پیدا نشد!</p>
        </div>
      ) : (
        <GroupForm form={form} />
      )}
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
