import { apiRequest } from "@gikdev/react-datapi/src"
import type { PostApiMasterRemoveCustomerData } from "@repo/api-client/client"
import { BtnTemplates, Modal, useDrawerSheet, useDrawerSheetNumber } from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { memo } from "react"
import genDatApiConfig from "#/shared/datapi-config"
import { QUERY_KEYS } from "./navigation"

interface DeleteCustomerModalProps {
  reloadCustomers: () => void
}

function _DeleteCustomerModal({ reloadCustomers }: DeleteCustomerModalProps) {
  const [customerId, setCustomerId] = useDrawerSheetNumber(QUERY_KEYS.customerId)
  const [showDeleteModal, setShowDeleteModal] = useDrawerSheet(QUERY_KEYS.delete)

  const handleClose = () => {
    setCustomerId(null)
    setShowDeleteModal(false)
  }

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
