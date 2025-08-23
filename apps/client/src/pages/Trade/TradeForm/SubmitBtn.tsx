import { CoinsIcon } from "@phosphor-icons/react"
import type { OrderSide, RequestOrderMode } from "@repo/api-client/client"
import { postApiCustomerReqOrderMutation } from "@repo/api-client/tanstack"
import { notifManager } from "@repo/shared/adapters"
import { Btn } from "@repo/shared/components"
import { parseError } from "@repo/shared/helpers"
import { useMutation } from "@tanstack/react-query"
import { useAtomValue } from "jotai"
import { useProfileAtom } from "#/atoms"
import { getHeaderTokenOnly } from "#/shared"
import { useOpenOrderModal } from "../OrderModal"
import { notesStatusAtom } from "./MainInput/Notes"
import { useProductContext } from "./ProductFetcher"
import {
  calcFinalProductPrices,
  useGetProductSideEnabled,
  useProductSide,
  useTradeFormStore,
} from "./shared"

const ProductAutoMode = {
  Normal: 0,
  AutoAccept: 1,
  AutoReject: 2,
} as const

const ProductPurchaseModes = {
  Value: 1,
  Volume: 2,
} as const satisfies Record<string, RequestOrderMode>

const OrderSides = {
  Buy: 1,
  Sell: 2,
} as const satisfies Record<string, OrderSide>

const useSubmitOrderMutation = () =>
  useMutation(postApiCustomerReqOrderMutation(getHeaderTokenOnly()))

export default function SubmitBtn() {
  const currentValue = useTradeFormStore(s => s.currentValue)
  const [side] = useProductSide()
  const product = useProductContext()
  const notesStatus = useAtomValue(notesStatusAtom)
  const [profile] = useProfileAtom()

  const { isDisabled } = useGetProductSideEnabled(product.status)
  const reqOrderMutation = useSubmitOrderMutation()
  const { setAutoMin, setCurrentOrderId } = useOpenOrderModal()

  const isBtnDisabled =
    reqOrderMutation.isPending ||
    isDisabled ||
    currentValue <= 0 ||
    Object.values(notesStatus).includes("error")

  const handleSubmit = () => {
    if (!product) {
      notifManager.notify(
        "`product` is not defined, so I can't continue with form submission",
        ["console", "toast"],
        { status: "dev-only" },
      )
      return
    }

    if (isDisabled) {
      notifManager.notify(
        "Bro! The btn is disabled! How did u click it??? I'm sorry but I can't continue with form submission",
        ["console", "toast"],
        { status: "dev-only" },
      )
      return
    }

    const mode = useTradeFormStore.getState().mode
    const rial = useTradeFormStore.getState().rial
    const weight = useTradeFormStore.getState().weight
    const isAutoMode = product.mode !== ProductAutoMode.Normal && product.maxAutoMin !== 0
    const { totalBuyPrice, totalSellPrice } = calcFinalProductPrices({ product, profile })

    reqOrderMutation.mutate(
      {
        body: {
          tyStockID: product.id,
          mode: mode === "rial" ? ProductPurchaseModes.Value : ProductPurchaseModes.Volume,
          price: side === "buy" ? totalBuyPrice : totalSellPrice,
          side: side === "buy" ? OrderSides.Buy : OrderSides.Sell,
          value: mode === "rial" ? rial : weight,
          volume: mode === "weight" ? weight : rial,
        },
      },
      {
        onError: err => notifManager.notify(parseError(err), "toast", { status: "error" }),
        onSuccess: data => {
          useTradeFormStore.getState().setCurrentValue(0)
          const id = Number(data.id)
          if (Number.isNaN(id)) return
          setCurrentOrderId(id)
          setAutoMin(isAutoMode ? product.maxAutoMin : 0)
        },
      },
    )
  }

  return (
    <Btn
      type="submit"
      theme={side === "buy" ? "success" : "error"}
      themeType="filled"
      data-testid="trade-submit-btn"
      disabled={isBtnDisabled}
      onClick={handleSubmit}
    >
      <CoinsIcon size={20} weight="fill" />
      <span>{side === "buy" ? "خرید" : "فروش"}</span>
    </Btn>
  )
}
