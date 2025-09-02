import { TrashIcon, XIcon } from "@phosphor-icons/react"
import { postApiStockPriceSourceDeleteStockMutation } from "@repo/api-client"
import { Modal } from "@repo/shared/components"
import { skins } from "@repo/shared/forms"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type PriceSourceId, priceSourcesOptions } from "./shared"

interface DeletePriceSourceModalProps {
  onClose: () => void
  sourceId: PriceSourceId
}

export function DeletePriceSourceModal({ sourceId, onClose }: DeletePriceSourceModalProps) {
  const queryClient = useQueryClient()
  const { mutate: deleteSource } = useMutation(postApiStockPriceSourceDeleteStockMutation())

  const handleDelete = async () => {
    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال حذف منبع...",
      success: "منبع با موفقیت حذف شد",
    })

    deleteSource(
      { body: { id: sourceId } },
      {
        onSuccess: () => {
          queryClient.setQueryData(priceSourcesOptions.queryKey, (oldItems = []) =>
            oldItems.filter(i => i.id !== sourceId),
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
      title="حذف منبع"
      description="آیا از حذف این منبع مطمئن هستید؟"
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
