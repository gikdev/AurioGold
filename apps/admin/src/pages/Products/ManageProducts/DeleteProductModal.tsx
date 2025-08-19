import { deleteApiTyStocksByIdMutation } from "@repo/api-client/tanstack"
import { BtnTemplates, Modal } from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useMutation } from "@tanstack/react-query"
import { getHeaderTokenOnly } from "#/shared/forms"
import type { ProductId } from "./store"

interface DeleteProductModalProps {
  onClose: () => void
  productId: ProductId
}

export function DeleteProductModal({ onClose, productId }: DeleteProductModalProps) {
  const { mutate: deleteStock } = useMutation(deleteApiTyStocksByIdMutation(getHeaderTokenOnly()))

  const handleDelete = async () => {
    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال حذف محصول...",
      success: "محصول با موفقیت حذف شد",
    })

    deleteStock(
      { path: { id: productId } },
      {
        onSuccess: () => resolve(),
        onError: err => reject(err),
        onSettled: () => onClose(),
      },
    )
  }

  return (
    <Modal
      isOpen
      title="حذف محصول"
      description="آیا از حذف این محصول مطمئن هستید؟"
      onClose={onClose}
      btns={
        <>
          <BtnTemplates.Cancel onClick={onClose} />
          <BtnTemplates.Delete themeType="filled" onClick={handleDelete} />
        </>
      }
    />
  )
}
