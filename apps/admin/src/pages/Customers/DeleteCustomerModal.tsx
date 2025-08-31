import { TrashIcon, XIcon } from "@phosphor-icons/react"
import { postApiMasterRemoveCustomerMutation } from "@repo/api-client/tanstack"
import { getHeaderTokenOnly } from "@repo/shared/auth"
import { Modal } from "@repo/shared/components"
import { skins } from "@repo/shared/forms"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiGetCustomersOptions } from "./shared"
import type { CustomerId } from "./store"

interface DeleteCustomerModalProps {
  onClose: () => void
  customerId: CustomerId
}

export function DeleteCustomerModal({ customerId, onClose }: DeleteCustomerModalProps) {
  const queryClient = useQueryClient()
  const { mutate: removeCustomer } = useMutation(
    postApiMasterRemoveCustomerMutation(getHeaderTokenOnly("admin")),
  )

  const handleDelete = async () => {
    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال حذف مشتری...",
      success: "مشتری با موفقیت حذف شد",
    })

    removeCustomer(
      {
        body: {
          gid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          id: customerId,
          str: "string",
          tf: true,
        },
      },
      {
        onSuccess: () => {
          queryClient.setQueryData(apiGetCustomersOptions.queryKey, (oldCustomers = []) =>
            oldCustomers.filter(c => c.id !== customerId),
          )

          resolve()
          onClose()
        },
        onError: msg => reject(msg),
      },
    )
  }

  return (
    <Modal
      isOpen
      title="حذف مشتری"
      description="آیا از حذف این مشتری مطمئن هستید؟"
      onClose={onClose}
      btns={
        <>
          <button type="button" className={skins.btn({ style: "filled" })} onClick={onClose}>
            <XIcon />
            <span>انصراف</span>
          </button>

          <button type="button" className={skins.btn({ intent: "error" })} onClick={handleDelete}>
            <TrashIcon />
            <span>بله، حذفش کن</span>
          </button>
        </>
      }
    />
  )
}
