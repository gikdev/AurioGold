import styled from "@master/styled.react"
import type { HubConnection } from "@microsoft/signalr"
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react"
import type { StockDtoForMaster } from "@repo/api-client/client"
import { getApiTyStocksQueryKey } from "@repo/api-client/tanstack"
import { notifManager } from "@repo/shared/adapters"
import { Btn, useDrawerSheetNumber } from "@repo/shared/components"
import { formatPersianPrice } from "@repo/shared/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { produce } from "immer"
import { useAtomValue } from "jotai"
import { memo, useCallback } from "react"
import tw from "tailwind-styled-components"
import { connectionRefAtom } from "#/atoms"
import genDatApiConfig from "#/shared/datapi-config"
import { QUERY_KEYS } from "./navigation"
import { useStocksQuery } from "./shared"

const CardContainer = styled.div`
  bg-slate-2 border border-slate-6
  rounded-md p-2 flex flex-col gap-5
`
const StyledIconBtn = tw(Btn)`min-h-8 w-8 p-1`
const StyledPrice = styled.p`font-bold text-2xl text-slate-12`

interface PriceCardProps {
  label: string
  value: number | null | undefined
  disabled?: boolean
  onInc: () => void
  onDec: () => void
}

function _PriceCard({ label, value, disabled, onInc, onDec }: PriceCardProps) {
  return (
    <CardContainer>
      <div className="flex items-center gap-1">
        <p className="me-auto">{label}</p>

        <StyledIconBtn disabled={!!disabled} theme="error" onClick={onDec}>
          <CaretDownIcon size={20} />
        </StyledIconBtn>

        <StyledIconBtn disabled={!!disabled} theme="success" onClick={onInc}>
          <CaretUpIcon size={20} />
        </StyledIconBtn>
      </div>

      <StyledPrice dir="ltr">{formatPersianPrice(value ?? 0)}</StyledPrice>
    </CardContainer>
  )
}

const PriceCard = memo(_PriceCard)

async function updatePrice(opts: {
  connection: HubConnection | null
  productId: NonNullable<StockDtoForMaster["id"]>
  newPrice: number
  priceType: "price" | "diffBuyPrice" | "diffSellPrice"
}) {
  const { connection, productId, newPrice, priceType } = opts

  if (!connection || typeof connection.invoke !== "function") {
    throw new Error("No connection")
  }

  const adminToken = genDatApiConfig().token
  return connection.invoke("UpdatePrice", adminToken, productId, newPrice, priceType)
}

function _DetailsCardsSection() {
  const queryClient = useQueryClient()
  const connection = useAtomValue(connectionRefAtom)
  const { data: stocks = [] } = useStocksQuery()
  const [productId] = useDrawerSheetNumber(QUERY_KEYS.productId)
  const product = stocks.find(p => p.id === productId)

  const areAllBtnsEnabled = !!connection && !!product

  const stocksKey = getApiTyStocksQueryKey()

  const updatePriceMutation = useMutation({
    mutationFn: updatePrice,

    /**
     * Pessimistic cache update
     * - Wait for server to confirm success
     * - Then update cache manually
     */
    onSuccess: (_data, vars) => {
      queryClient.setQueryData<StockDtoForMaster[] | undefined>(stocksKey, old =>
        produce(old, draft => {
          if (!draft) return

          const stock = draft.find(p => p.id === vars.productId)
          if (stock) {
            stock[vars.priceType] = vars.newPrice
            stock.dateUpdate = new Date().toISOString()
          }
        }),
      )
    },

    onError: err => {
      notifManager.notify(`یه مشکلی پیش آمد (E-BIO9465): ${String(err)}`, "toast", {
        status: "error",
      })
    },
  })

  const change = useCallback(
    (field: "price" | "diffBuyPrice" | "diffSellPrice", dir: "inc" | "dec") => {
      if (!product || productId == null) return

      const isBase = field === "price"
      const step = isBase ? (product.priceStep ?? 0) : (product.diffPriceStep ?? 0)
      const current = (product as Record<typeof field, number | undefined>)[field] ?? 0
      const newPrice = dir === "inc" ? current + step : current - step

      updatePriceMutation.mutate({
        connection,
        productId: productId as NonNullable<StockDtoForMaster["id"]>,
        newPrice,
        priceType: field,
      })
    },
    [connection, updatePriceMutation, product, productId],
  )

  if (!product || !productId) return null

  return (
    <div className="flex flex-col gap-2">
      <PriceCard
        label="اختلاف خرید"
        value={product.diffBuyPrice}
        disabled={!areAllBtnsEnabled || updatePriceMutation.isPending}
        onInc={() => change("diffBuyPrice", "inc")}
        onDec={() => change("diffBuyPrice", "dec")}
      />

      <PriceCard
        label="قیمت پایه"
        value={product.price}
        disabled={!areAllBtnsEnabled || updatePriceMutation.isPending}
        onInc={() => change("price", "inc")}
        onDec={() => change("price", "dec")}
      />

      <PriceCard
        label="اختلاف فروش"
        value={product.diffSellPrice}
        disabled={!areAllBtnsEnabled || updatePriceMutation.isPending}
        onInc={() => change("diffSellPrice", "inc")}
        onDec={() => change("diffSellPrice", "dec")}
      />
    </div>
  )
}

const DetailsCardsSection = memo(_DetailsCardsSection)
export default DetailsCardsSection
