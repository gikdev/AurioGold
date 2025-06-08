import { apiRequest } from "@gikdev/react-datapi/src"
import { ArrowRightIcon, TrashIcon } from "@phosphor-icons/react"
import type { PostApiMasterRemoveCustomerData } from "@repo/api-client/client"
import { useDrawerSheetNumber } from "@repo/shared/components"
import { Btn, Modal } from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import genDatApiConfig from "#/shared/datapi-config"
import { queryStateKeys } from "."

interface DeleteCustomerModalProps {
  reloadCustomers: () => void
}

export default function DeleteCustomerModal({ reloadCustomers }: DeleteCustomerModalProps) {
  const [customerId, setCustomerId] = useDrawerSheetNumber(queryStateKeys.delete)

  const handleClose = () => setCustomerId(null)

  const handleDelete = async () => {
    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال حذف مشتری...",
      success: "مشتری با موفقیت حذف شد",
    })

    // Don't ask why I'm doin' it like this...
    // The back-end dev wanted me to...
    const dataToSend = {
      gid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      id: customerId,
      str: "string",
      tf: true,
    } satisfies Required<PostApiMasterRemoveCustomerData["body"]>

    await apiRequest({
      config: genDatApiConfig(),
      options: {
        url: "/Master/RemoveCustomer",
        method: "POST",
        body: JSON.stringify(dataToSend),
        onSuccess: () => resolve(),
        onError: msg => reject(msg),
        onFinally: () => {
          handleClose()
          reloadCustomers()
        },
      },
    })
  }

  return (
    <Modal
      isOpen={customerId != null}
      title="حذف مشتری"
      description="آیا از حذف این مشتری مطمئن هستید؟"
      onClose={handleClose}
      btns={
        <>
          <Btn className="flex-1" onClick={handleClose}>
            <ArrowRightIcon size={24} />
            <span>انصراف</span>
          </Btn>

          <Btn className="flex-1" theme="error" themeType="filled" onClick={handleDelete}>
            <TrashIcon size={24} />
            <span>حذف</span>
          </Btn>
        </>
      }
    />
  )
}
