import styled from "@master/styled.react"
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react"
import { notifManager, storageManager } from "@repo/shared/adapters"
import { Btn, useDrawerSheetNumber } from "@repo/shared/components"
import { formatPersianPrice } from "@repo/shared/utils"
import { useAtom, useAtomValue } from "jotai"
import { memo, useCallback } from "react"
import tw from "tailwind-styled-components"
import { connectionRefAtom } from "#/atoms"
import { productsAtom } from "."
import { QUERY_KEYS } from "./navigation"

const CardContainer = styled.div`
  bg-slate-2 border border-slate-6
  rounded-md p-2 flex flex-col gap-5
`

const StyledIconBtn = tw(Btn)`
  min-h-8 w-8 p-1
`

const StyledPrice = styled.p`
  font-bold text-2xl text-slate-12
`

const adminToken = storageManager.get("ttkk", "sessionStorage") || ""

function _DetailsCardsSection() {
  const connection = useAtomValue(connectionRefAtom)
  const [products, setProducts] = useAtom(productsAtom)
  const [productId] = useDrawerSheetNumber(QUERY_KEYS.productId)
  const product = products.find(p => p.id === productId)

  const areAllBtnsEnabled = !!connection

  if (!product || !productId) return

  const invoke = useCallback(
    (newPrice: number, priceType: "price" | "diffBuyPrice" | "diffSellPrice") => {
      if (!connection) return

      connection.invoke("UpdatePrice", adminToken, productId, newPrice, priceType).catch(err => {
        notifManager.notify(`یه مشکلی پیش آمد (E-BIO9465): ${String(err)}`, "toast", {
          status: "error",
        })
      })
    },
    [connection, productId],
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleAnyIncOrDec = useCallback(
    (priceType: "buy" | "sell" | "base", taskType: "inc" | "dec") =>
      setProducts(draft => {
        const idx = draft.findIndex(p => p.id === productId)
        if (idx === -1) return
        if (typeof draft[idx].diffBuyPrice !== "number") return
        if (typeof draft[idx].diffSellPrice !== "number") return
        if (typeof draft[idx].diffPriceStep !== "number") return
        if (typeof draft[idx].price !== "number") return
        if (typeof draft[idx].priceStep !== "number") return

        if (priceType === "base") {
          if (taskType === "inc") draft[idx].price += draft[idx].priceStep
          if (taskType === "dec") draft[idx].price -= draft[idx].priceStep
          invoke(draft[idx].price, "price")
        }

        if (priceType === "buy") {
          if (taskType === "inc") draft[idx].diffBuyPrice += draft[idx].diffPriceStep
          if (taskType === "dec") draft[idx].diffBuyPrice -= draft[idx].diffPriceStep
          invoke(draft[idx].diffBuyPrice, "diffBuyPrice")
        }

        if (priceType === "sell") {
          if (taskType === "inc") draft[idx].diffSellPrice += draft[idx].diffPriceStep
          if (taskType === "dec") draft[idx].diffSellPrice -= draft[idx].diffPriceStep
          invoke(draft[idx].diffSellPrice, "diffSellPrice")
        }
      }),
    [],
  )

  return (
    <div className="flex flex-col gap-2">
      <CardContainer>
        <div className="flex items-center gap-1">
          <p className="me-auto">اختلاف خرید</p>

          <StyledIconBtn
            disabled={!areAllBtnsEnabled}
            theme="error"
            onClick={() => handleAnyIncOrDec("buy", "dec")}
          >
            <CaretDownIcon size={20} />
          </StyledIconBtn>

          <StyledIconBtn
            disabled={!areAllBtnsEnabled}
            theme="success"
            onClick={() => handleAnyIncOrDec("buy", "inc")}
          >
            <CaretUpIcon size={20} />
          </StyledIconBtn>
        </div>

        <StyledPrice dir="ltr">{formatPersianPrice(product.diffBuyPrice ?? 0)}</StyledPrice>
      </CardContainer>

      <CardContainer>
        <div className="flex items-center gap-1">
          <p className="me-auto">قیمت پایه</p>

          <StyledIconBtn
            disabled={!areAllBtnsEnabled}
            theme="error"
            onClick={() => handleAnyIncOrDec("base", "dec")}
          >
            <CaretDownIcon size={20} />
          </StyledIconBtn>

          <StyledIconBtn
            disabled={!areAllBtnsEnabled}
            theme="success"
            onClick={() => handleAnyIncOrDec("base", "inc")}
          >
            <CaretUpIcon size={20} />
          </StyledIconBtn>
        </div>

        <StyledPrice dir="ltr">{formatPersianPrice(product.price ?? 0)}</StyledPrice>
      </CardContainer>

      <CardContainer>
        <div className="flex items-center gap-1">
          <p className="me-auto">اختلاف فروش</p>

          <StyledIconBtn
            disabled={!areAllBtnsEnabled}
            theme="error"
            onClick={() => handleAnyIncOrDec("sell", "dec")}
          >
            <CaretDownIcon size={20} />
          </StyledIconBtn>

          <StyledIconBtn
            disabled={!areAllBtnsEnabled}
            theme="success"
            onClick={() => handleAnyIncOrDec("sell", "inc")}
          >
            <CaretUpIcon size={20} />
          </StyledIconBtn>
        </div>

        <StyledPrice dir="ltr">{formatPersianPrice(product.diffSellPrice ?? 0)}</StyledPrice>
      </CardContainer>
    </div>
  )
}

const DetailsCardsSection = memo(_DetailsCardsSection)
export default DetailsCardsSection
