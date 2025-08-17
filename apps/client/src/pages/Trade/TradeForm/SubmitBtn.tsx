import { CoinsIcon } from "@phosphor-icons/react"
import type { OrderSide, RequestOrderMode } from "@repo/api-client/client"
import { postApiCustomerReqOrderMutation } from "@repo/api-client/tanstack"
import { Btn } from "@repo/shared/components"
import { useMutation } from "@tanstack/react-query"
import { useAtomValue } from "jotai"
import { useNavigate } from "react-router"
import { getHeaderTokenOnly } from "#/shared"
import { TradeNavigation } from "../navigation"
import { notesStatusAtom } from "./MainInput/Notes"
import { calcOutputRial, calcOutputWeight, transactionMethods } from "./MainInput/shared"
import {
  useFinalProductPrices,
  useGetProductSideEnabled,
  useProductId,
  useProductSide,
  useStockByIdQuery,
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
  const setCurrentValue = useTradeFormStore(s => s.setCurrentValue)
  const [side] = useProductSide()
  const isRialMode = useTradeFormStore(s => s.isRialMode)
  const [productId] = useProductId()
  const { data: product } = useStockByIdQuery(productId)
  const navigate = useNavigate()
  const notesStatus = useAtomValue(notesStatusAtom)
  const priceToUnitRatio = product?.unitPriceRatio ?? 1
  const transactionMethod = transactionMethods[product?.unit ?? 0]
  const noDecimalSituation = transactionMethod.name === "count" || isRialMode
  const maxAutoTime = product?.maxAutoMin ?? 0
  const isAutoMode = product?.mode !== ProductAutoMode.Normal && maxAutoTime !== 0
  const maxDecimalsCount = noDecimalSituation ? 0 : (product?.decimalNumber ?? 0)
  const basePrice = product?.price ?? 0
  const { isDisabled } = useGetProductSideEnabled(product?.status ?? 0)
  const { totalBuyPrice, totalSellPrice } = useFinalProductPrices()
  const reqOrderMutation = useSubmitOrderMutation()

  const isBtnDisabled =
    reqOrderMutation.isPending ||
    isDisabled ||
    product === null ||
    currentValue <= 0 ||
    Object.values(notesStatus).includes("error")

  const handleSubmit = () => {
    if (!product) return
    if (isDisabled) return

    const convertedValue = isRialMode
      ? calcOutputWeight(
          currentValue,
          basePrice,
          priceToUnitRatio,
          isRialMode ? 0 : maxDecimalsCount,
        )
      : calcOutputRial(
          currentValue,
          side === "buy" ? totalBuyPrice : totalSellPrice,
          priceToUnitRatio,
        )

    reqOrderMutation.mutate(
      {
        body: {
          tyStockID: product.id,
          mode: isRialMode ? ProductPurchaseModes.Value : ProductPurchaseModes.Volume,
          price: side === "buy" ? totalBuyPrice : totalSellPrice,
          side: side === "buy" ? OrderSides.Buy : OrderSides.Sell,
          value: isRialMode ? currentValue : convertedValue,
          volume: isRialMode ? convertedValue : currentValue,
        },
      },
      {
        onSuccess: data => {
          setCurrentValue(0)
          if (typeof data.id !== "number") return
          navigate(TradeNavigation.openOrderModal(data.id, isAutoMode ? maxAutoTime : 0))
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
