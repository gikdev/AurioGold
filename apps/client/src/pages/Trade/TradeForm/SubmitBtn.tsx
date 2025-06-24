import { apiRequest } from "@gikdev/react-datapi/src"
import { CoinsIcon } from "@phosphor-icons/react"
import type { OrderFc, OrderSide, ReqOrderDto, RequestOrderMode } from "@repo/api-client/client"
import { Btn } from "@repo/shared/components"
import {
  useBooleanishQueryState,
  useIntegerQueryState,
  useLiteralQueryState,
} from "@repo/shared/hooks"
import { useAtomValue } from "jotai"
import { useState } from "react"
import { useNavigate } from "react-router"
import genDatApiConfig from "#/shared/datapi-config"
import { QUERY_KEYS, TradeNavigation } from "../navigation"
import { useFinalProductPrices, useGetProductSideEnabled } from "../shared"
import { notesStatusAtom } from "./MainInput/Notes"
import { calcOutputRial, calcOutputWeight, transactionMethods } from "./MainInput/shared"
import { selectedProductAtom, sides } from "./shared"

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

export default function SubmitBtn() {
  const [isLoading, setLoading] = useState(false)
  const [value, setValue] = useIntegerQueryState(QUERY_KEYS.currentValue, 0)
  const [side] = useLiteralQueryState(QUERY_KEYS.side, sides)
  const [isRialMode] = useBooleanishQueryState(QUERY_KEYS.rialMode)
  const navigate = useNavigate()
  const notesStatus = useAtomValue(notesStatusAtom)
  const selectedProduct = useAtomValue(selectedProductAtom)
  const priceToUnitRatio = selectedProduct?.unitPriceRatio ?? 1
  const transactionMethod = transactionMethods[selectedProduct?.unit ?? 0]
  const noDecimalSituation = transactionMethod.name === "count" || isRialMode
  const maxAutoTime = selectedProduct?.maxAutoMin ?? 0
  const isAutoMode = selectedProduct?.mode !== ProductAutoMode.Normal && maxAutoTime !== 0
  const maxDecimalsCount = noDecimalSituation ? 0 : (selectedProduct?.decimalNumber ?? 0)
  const basePrice = selectedProduct?.price ?? 0
  const { isDisabled } = useGetProductSideEnabled(selectedProduct?.status ?? 0)
  const { totalBuyPrice, totalSellPrice } = useFinalProductPrices({
    productUnit: selectedProduct?.unit ?? 0,
    productBasePrice: selectedProduct?.price ?? 0,
    productDiffBuyPrice: selectedProduct?.diffBuyPrice ?? 0,
    productDiffSellPrice: selectedProduct?.diffSellPrice ?? 0,
  })
  const convertedValue = isRialMode
    ? calcOutputWeight(value, basePrice, priceToUnitRatio, isRialMode ? 0 : maxDecimalsCount)
    : calcOutputRial(value, side === "buy" ? totalBuyPrice : totalSellPrice, priceToUnitRatio)

  const verb = side === "buy" ? "خرید" : "فروش"

  console.log(notesStatus)

  const isBtnDisabled =
    isLoading || isDisabled || value <= 0 || Object.values(notesStatus).includes("error")

  const handleSubmit = () => {
    if (!selectedProduct) return
    if (isDisabled) return

    setLoading(true)

    const dataToSend: Required<ReqOrderDto> = {
      tyStockID: selectedProduct.id,
      mode: isRialMode ? ProductPurchaseModes.Value : ProductPurchaseModes.Volume,
      price: side === "buy" ? totalBuyPrice : totalSellPrice,
      side: side === "buy" ? OrderSides.Buy : OrderSides.Sell,
      value: isRialMode ? value : convertedValue,
      volume: isRialMode ? convertedValue : value,
    }

    apiRequest<OrderFc>({
      config: genDatApiConfig(),
      options: {
        url: "/Customer/ReqOrder",
        method: "POST",
        body: JSON.stringify(dataToSend),
        onSuccess(data) {
          setValue(0)

          if (data.id) {
            navigate(TradeNavigation.openOrderModal(data.id, isAutoMode ? maxAutoTime : 0))
          }
        },
        onFinally: () => setLoading(false),
      },
    })
  }

  return (
    <Btn
      type="submit"
      theme={side === "buy" ? "success" : "error"}
      themeType="filled"
      disabled={isBtnDisabled}
      onClick={handleSubmit}
    >
      <CoinsIcon size={20} weight="fill" />
      <span>{verb}</span>
    </Btn>
  )
}
