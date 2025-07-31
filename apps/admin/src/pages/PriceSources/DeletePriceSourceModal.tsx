import { apiRequest } from "@gikdev/react-datapi/src"
import type { PostApiStockPriceSourceDeleteStockData } from "@repo/api-client/client"
import { BtnTemplates, Modal, useDrawerSheetNumber } from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import genDatApiConfig from "#/shared/datapi-config"
import { queryStateKeys } from "."

interface DeletePriceSourceModalProps {
  reloadPriceSources: () => void
}

export default function DeletePriceSourceModal({
  reloadPriceSources,
}: DeletePriceSourceModalProps) {
  const [priceSourceId, setPriceSourceId] = useDrawerSheetNumber(queryStateKeys.delete)

  const handleClose = () => setPriceSourceId(null)

  const handleDelete = async () => {
    if (typeof priceSourceId !== "number") return

    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال حذف منبع قیمت...",
      success: "منبع قیمت با موفقیت حذف شد",
    })

    const dataToSend = convertToApiPayload(priceSourceId)

    await apiRequest({
      config: genDatApiConfig(),
      options: {
        url: "/StockPriceSource/DeleteStock",
        body: JSON.stringify(dataToSend),
        method: "POST",
        onSuccess: () => resolve(),
        onError: msg => reject(msg),
        onFinally: () => {
          handleClose()
          reloadPriceSources()
        },
      },
    })
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

function convertToApiPayload(
  priceSourceId: number,
): NonNullable<Required<PostApiStockPriceSourceDeleteStockData["body"]>> {
  return {
    id: priceSourceId,
  }
}
