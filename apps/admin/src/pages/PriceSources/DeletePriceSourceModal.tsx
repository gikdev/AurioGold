import { postApiStockPriceSourceDeleteStockMutation } from "@repo/api-client/tanstack"
import { BtnTemplates, Modal, useDrawerSheetNumber } from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useMutation } from "@tanstack/react-query"
import { getHeaderTokenOnly } from "#/shared/react-query"
import { queryStateKeys } from "."

interface DeletePriceSourceModalProps {
  reloadPriceSources: () => void
}

export default function DeletePriceSourceModal({
  reloadPriceSources,
}: DeletePriceSourceModalProps) {
  const [priceSourceId, setPriceSourceId] = useDrawerSheetNumber(queryStateKeys.delete)

  const { mutate: deleteSource } = useMutation(
    postApiStockPriceSourceDeleteStockMutation(getHeaderTokenOnly()),
  )

  const handleClose = () => setPriceSourceId(null)

  const handleDelete = async () => {
    if (typeof priceSourceId !== "number") return

    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال حذف منبع قیمت...",
      success: "منبع قیمت با موفقیت حذف شد",
    })

    deleteSource(
      { body: { id: priceSourceId } },
      {
        onSuccess: () => resolve(),
        onError: err => reject(err.message || String(err)),
        onSettled() {
          handleClose()
          reloadPriceSources()
        },
      },
    )
  }

  return (
    <Modal
      isOpen={priceSourceId != null}
      title="حذف منبع قیمت"
      description="آیا از حذف این منبع قیمت مطمئن هستید؟"
      onClose={handleClose}
      btns={
        <>
          <BtnTemplates.Cancel onClick={handleClose} />
          <BtnTemplates.Delete onClick={handleDelete} themeType="filled" />
        </>
      }
    />
  )
}
