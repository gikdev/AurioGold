import { apiRequest } from "@gikdev/react-datapi/src"
import { ArrowRightIcon, UserPlusIcon } from "@phosphor-icons/react"
import type { CustomerGroupIntDto } from "@repo/api-client/client"
import { Btn, DrawerSheet, useDrawerSheet } from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useCustomForm } from "#/shared/customForm"
import genDatApiConfig from "#/shared/datapi-config"
import { queryStateKeys } from "."
import GroupForm from "./GroupForm"
import { type GroupFormValues, emptyGroupValues, groupSchema } from "./groupFormShared"

interface CreateGroupFormProps {
  reloadGroups: () => void
}

export default function CreateGroupDrawer({ reloadGroups }: CreateGroupFormProps) {
  const [isOpen, setOpen] = useDrawerSheet(queryStateKeys.createNew)

  const form = useCustomForm(groupSchema, emptyGroupValues)
  const { formState, trigger, reset, handleSubmit } = form
  const { isSubmitting } = formState

  const onSubmit = async (data: GroupFormValues) => {
    const dataToSend = convertFormValuesToApiPayload(data)

    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال ایجاد گروه...",
      success: "گروه با موفقیت ایجاد شد!",
    })

    await apiRequest({
      config: genDatApiConfig(),
      options: {
        url: "/TyCustomerGroupIntInts",
        method: "POST",
        body: JSON.stringify(dataToSend),
        onError: msg => reject(msg),
        onSuccess: () => {
          resolve()
          reloadGroups()
          setOpen(false)
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
      open={isOpen}
      title="ایجاد گروه جدید"
      icon={UserPlusIcon}
      onClose={() => setOpen(false)}
      btns={
        <>
          <Btn className="flex-1" onClick={() => setOpen(false)}>
            <ArrowRightIcon size={24} />
            <span>انصراف</span>
          </Btn>

          <Btn
            className="flex-1"
            disabled={isSubmitting}
            theme="success"
            themeType="filled"
            onClick={submitTheFormManually}
          >
            <UserPlusIcon size={24} />
            <span>ایجاد</span>
          </Btn>
        </>
      }
    >
      <GroupForm form={form} />
    </DrawerSheet>
  )
}

function convertFormValuesToApiPayload(values: GroupFormValues): Required<CustomerGroupIntDto> {
  return {
    id: 0,
    description: values.description ?? null,
    name: values.name,
    diffBuyPrice: values.diffBuyPrice ?? 0,
    diffSellPrice: values.diffSellPrice ?? 0,
  }
}
