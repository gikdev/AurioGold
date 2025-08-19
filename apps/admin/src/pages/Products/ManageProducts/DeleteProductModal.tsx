import { apiRequest } from "@gikdev/react-datapi/src"
import { BtnTemplates, Modal } from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import genDatApiConfig from "#/shared/datapi-config"
import type { ProductId } from "./store"

interface DeleteProductModalProps {
  onClose: () => void
  productId: ProductId
}

export function DeleteProductModal({ onClose, productId }: DeleteProductModalProps) {
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
          onClose()
        },
      },
    })
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
