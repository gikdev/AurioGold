import type { StockStatus } from "@repo/api-client"
import { getApiTyStocksOptions, putApiTyStocksByIdMutation } from "@repo/api-client"
import { BtnTemplates, Modal, Radio } from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { queryClient } from "#/shared"
import { calcA11yStuff } from "./calcA11yStuff"

const productStatuses: StockStatus[] = [0, 1, 2, 3]

const allStocksQueryKey = getApiTyStocksOptions().queryKey
const useUpdateStockMutation = () => useMutation(putApiTyStocksByIdMutation())

interface ChangeA11yModalProps {
  onClose: () => void
  productId: number
  initialStatus: StockStatus | undefined
}

export function ChangeA11yModal({
  onClose: handleClose,
  initialStatus,
  productId,
}: ChangeA11yModalProps) {
  const [status, setStatus] = useState<StockStatus | undefined>(initialStatus)
  const updateStockMutation = useUpdateStockMutation()

  const handleChange = async () => {
    if (typeof status !== "number") return
    if (typeof productId !== "number") return

    const stocks = queryClient.getQueryData(allStocksQueryKey)
    if (!stocks) return

    const newStocks = stocks.map(s => (s.id === productId ? { ...s, status } : s))

    const stock = newStocks.find(s => s.id === productId)
    if (!stock) return

    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال تغییر وضعیت...",
      success: "وضعیت با موفقیت تغییر کرد",
    })

    updateStockMutation.mutate(
      { path: { id: productId }, body: stock },
      {
        onError: error => reject(`${error.name} ${error.message}`),
        onSuccess() {
          queryClient.setQueryData(allStocksQueryKey, newStocks)
          resolve()
          handleClose()
        },
      },
    )
  }

  return (
    <Modal
      isOpen
      title="تغییر وضعیت خرید و فروش"
      onClose={handleClose}
      btns={<BtnTemplates.Edit className="text-base" themeType="filled" onClick={handleChange} />}
    >
      <div className="flex flex-col gap-2 text-base">
        {productStatuses.map(code => (
          <A11yItem key={code} code={code} setStatus={setStatus} status={status} />
        ))}
      </div>
    </Modal>
  )
}

interface A11yItemProps {
  code: StockStatus
  status: StockStatus | undefined
  setStatus: (status: StockStatus | undefined) => void
}

function A11yItem({ code, setStatus, status }: A11yItemProps) {
  const { Icon, classes, name } = calcA11yStuff(code)

  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: it's in <Radio /> !!!
    <label
      key={code}
      className="flex gap-2 items-center hover:bg-slate-3 min-h-12 px-2 -mx-2 rounded-sm cursor-pointer"
    >
      <Radio checked={status === code} onChange={() => setStatus(code)} />
      <span className="flex-1">{name}</span>
      <Icon size={24} className={classes} />
    </label>
  )
}

const useModal = () => useState(false)
ChangeA11yModal.useModal = useModal
