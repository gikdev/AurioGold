import { CoinsIcon } from "@phosphor-icons/react"
import type { OrderSide, RequestOrderMode } from "@repo/api-client"
import { postApiCustomerReqOrderMutation } from "@repo/api-client"
import { notifManager } from "@repo/shared/adapters"
import { Btn } from "@repo/shared/components"
import { parseError } from "@repo/shared/helpers"
import { useMutation } from "@tanstack/react-query"
import { useAtomValue } from "jotai"
import { useProfileAtom } from "#/atoms"
import { openOrderModal } from "../OrderModal/store"
import { priceInputErrorMsgAtom } from "./MainInput/PriceInput"
import { useProductContext } from "./ProductFetcher"
import { calcFinalProductPrices, useGetProductSideEnabled, useTradeFormStore } from "./shared"

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

const useSubmitOrderMutation = () => useMutation(postApiCustomerReqOrderMutation())

export default function SubmitBtn() {
  const side = useTradeFormStore(s => s.side)
  const rial = useTradeFormStore(s => s.rial)
  const weight = useTradeFormStore(s => s.weight)
  const [profile] = useProfileAtom()
  const product = useProductContext()
  const priceInputerrorMsg = useAtomValue(priceInputErrorMsgAtom)

  const { isDisabled } = useGetProductSideEnabled(product.status)
  const { isPending, mutate: reqOrder } = useSubmitOrderMutation()

  const isBtnDisabled =
    isPending || isDisabled || priceInputerrorMsg !== "" || rial === 0 || weight === 0

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

    reqOrder(
      {
        body: {
          tyStockID: product.id,
          mode: mode === "rial" ? ProductPurchaseModes.Value : ProductPurchaseModes.Volume,
          price: side === "buy" ? totalBuyPrice : totalSellPrice,
          side: side === "buy" ? OrderSides.Buy : OrderSides.Sell,
          value: rial,
          volume: weight,
        },
      },
      {
        onError: err => notifManager.notify(parseError(err), "toast", { status: "error" }),
        onSuccess: data => {
          useTradeFormStore.getState().setWeight(0)
          useTradeFormStore.getState().setRial(0)
          const id = Number(data.id)
          if (Number.isNaN(id)) return
          openOrderModal(id, isAutoMode ? product.maxAutoMin : 0)
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
