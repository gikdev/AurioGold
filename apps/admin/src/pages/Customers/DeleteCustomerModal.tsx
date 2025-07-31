import { postApiMasterRemoveCustomer } from "@repo/api-client/client"
import { BtnTemplates, Modal, useDrawerSheet, useDrawerSheetNumber } from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useMutation } from "@tanstack/react-query"
import { memo } from "react"
import { getHeaderTokenOnly } from "#/shared/react-query"
import { QUERY_KEYS } from "./navigation"

interface DeleteCustomerModalProps {
  reloadCustomers: () => void
}

function _DeleteCustomerModal({ reloadCustomers }: DeleteCustomerModalProps) {
  const [customerId, setCustomerId] = useDrawerSheetNumber(QUERY_KEYS.customerId)
  const [showDeleteModal, setShowDeleteModal] = useDrawerSheet(QUERY_KEYS.delete)
  const { mutate: deleteCustomer } = useDeleteCustomerMutation()

  const handleClose = () => {
    setCustomerId(null)
    setShowDeleteModal(false)
  }

  const handleDelete = () => {
    if (typeof customerId !== "number") return

    deleteCustomer(customerId, {
      onSettled() {
        handleClose()
        reloadCustomers()
      },
    })
  }

  return (
    <Modal
      isOpen={customerId != null && showDeleteModal}
      title="حذف مشتری"
      description="آیا از حذف این مشتری مطمئن هستید؟"
      onClose={handleClose}
      btns={
        <>
          <BtnTemplates.Cancel onClick={handleClose} />
          <BtnTemplates.Delete themeType="filled" onClick={handleDelete} />
        </>
      }
    />
  )
}

const DeleteCustomerModal = memo(_DeleteCustomerModal)
export default DeleteCustomerModal

function useDeleteCustomerMutation() {
  return useMutation({
    mutationFn: async (id: number) => {
      const { reject, resolve } = createControlledAsyncToast({
        pending: "در حال حذف مشتری...",
        success: "مشتری با موفقیت حذف شد",
      })

      try {
        await postApiMasterRemoveCustomer({
          ...getHeaderTokenOnly(),
          body: {
            id,
            gid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            str: "string",
            tf: true,
          },
        })
        resolve()
      } catch (err) {
        reject(err instanceof Error ? err.message : String(err))
        throw err
      }
    },
  })
}
