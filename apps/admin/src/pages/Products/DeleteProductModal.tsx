import { apiRequest } from "@gikdev/react-datapi/src"
import { BtnTemplates, useDrawerSheet, useDrawerSheetNumber } from "@repo/shared/components"
import { Modal } from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { memo } from "react"
import genDatApiConfig from "#/shared/datapi-config"
import { QUERY_KEYS } from "./navigation"

interface DeleteProductModalProps {
  reloadProducts: () => void
}

function _DeleteProductModal({ reloadProducts }: DeleteProductModalProps) {
  const [productId, setCustomerId] = useDrawerSheetNumber(QUERY_KEYS.productId)
  const [showDeleteModal, setShowDeleteModal] = useDrawerSheet(QUERY_KEYS.delete)

  const handleClose = () => {
    setCustomerId(null)
    setShowDeleteModal(false)
  }

  const handleDelete = async () => {
    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال حذف محصول...",
      success: "محصول با موفقیت حذف شد",
    })

    await apiRequest({
      config: genDatApiConfig(),
      options: {
        url: `/TyStocks/${productId}`,
        method: "DELETE",
        onSuccess: () => resolve(),
        onError: msg => reject(msg),
        onFinally: () => {
          handleClose()
          reloadProducts()
        },
      },
    })
  }

  return (
    <Modal
      isOpen={productId != null && showDeleteModal}
      title="حذف محصول"
      description="آیا از حذف این محصول مطمئن هستید؟"
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

const DeleteProductsModal = memo(_DeleteProductModal)
export default DeleteProductsModal
