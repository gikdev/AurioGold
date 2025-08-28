import type { StockDtoForMaster } from "@repo/api-client/client"
import { deleteApiTyStocksByIdMutation, getApiTyStocksQueryKey } from "@repo/api-client/tanstack"
import { getHeaderTokenOnly } from "@repo/shared/auth"
import { BtnTemplates, Modal } from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { ProductId } from "./store"

interface DeleteProductModalProps {
  onClose: () => void
  productId: ProductId
}

const deleteStockMutationOptions = deleteApiTyStocksByIdMutation(getHeaderTokenOnly())
const useDeleteStockMutation = () => useMutation(deleteStockMutationOptions)

export function DeleteProductModal({ onClose, productId }: DeleteProductModalProps) {
  const { mutate: deleteStock } = useDeleteStockMutation()
  const queryClient = useQueryClient()

  const handleDelete = async () => {
    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال حذف محصول...",
      success: "محصول با موفقیت حذف شد",
    })

    const onSuccess = () => {
      queryClient.setQueryData<StockDtoForMaster[] | undefined>(
        getApiTyStocksQueryKey(getHeaderTokenOnly()),
        oldData => oldData?.filter(item => item.id !== productId),
      )

      resolve()
      onClose()
    }

    deleteStock({ path: { id: productId } }, { onSuccess, onError: reject })
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
