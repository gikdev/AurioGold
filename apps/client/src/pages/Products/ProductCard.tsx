import { CaretLeftIcon, ClockIcon, PackageIcon } from "@phosphor-icons/react"
import type { StockDto } from "@repo/api-client/client"
import { cellRenderers } from "@repo/shared/lib"
import { formatPersianPrice } from "@repo/shared/utils"
import { useAtomValue } from "jotai"
import { useNavigate } from "react-router"
import { profileAtom } from "#/atoms"
import { cx } from "#/shared/cva.config"
import routes from "../routes"
import { useGetProductSideEnabled } from "../Trade/TradeForm/shared"

const containerStyle = cx(`
  border-slate-7 bg-slate-3 hover:bg-slate-4
  rounded-md p-2 cursor-pointer flex-col
  flex gap-2 border flex-1 min-w-40 min-w-max
`)

interface ProductCardProps {
  product: StockDto
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate()
  const { isBuyingEnabled, isSellingEnabled, isDisabled } = useGetProductSideEnabled(product.status)
  const { totalBuyPrice, totalSellPrice } = useCalcFinalProductPrices({
    diffBuyPrice: product.diffBuyPrice,
    diffSellPrice: product.diffSellPrice,
    unit: product.unit,
    price: product.price,
  })

  const handleProductClick = () => {
    if (typeof product.id !== "number") return
    navigate(routes.tradeById(product.id))
  }

  if (isDisabled) return null

  return (
    <button
      type="button"
      className={containerStyle}
      onClick={handleProductClick}
      data-testid="product-card"
    >
      <Header name={product.name} />

      <div className="flex items-center gap-2 justify-between w-full">
        <p
          dir="ltr"
          title="قیمت خرید (ریال)"
          className={isBuyingEnabled ? "text-green-10" : "text-slate-10"}
        >
          {isBuyingEnabled ? formatPersianPrice(totalBuyPrice) : "-"}
        </p>

        <p
          dir="ltr"
          title="قیمت فروش (ریال)"
          className={isSellingEnabled ? "text-red-10" : "text-slate-10"}
        >
          {isSellingEnabled ? formatPersianPrice(totalSellPrice) : "-"}
        </p>
      </div>

      <LastUpdated dateUpdate={product.dateUpdate} />
    </button>
  )
}

const Header = ({ name = "---" }: { name: StockDto["name"] }) => (
  <p className="flex gap-1 items-center justify-between w-full">
    <PackageIcon size={20} />
    <span data-testid="product-card-title">{name}</span>

    <CaretLeftIcon size={20} className="inline-block ms-auto" />
  </p>
)

const LastUpdated = ({ dateUpdate }: { dateUpdate: StockDto["dateUpdate"] }) => (
  <p
    dir="ltr"
    title="آخرین آپدیت"
    className="text-slate-10 text-xs text-start flex items-center gap-0.5 w-full"
  >
    <ClockIcon />
    {dateUpdate ? <cellRenderers.DateAndTime value={dateUpdate} /> : <span>-</span>}
  </p>
)

throw new Error("TODO! 👇🏻")
function useCalcFinalProductPrices({
  diffBuyPrice,
  diffSellPrice,
  price,
  unit,
}: {
  price: StockDto["price"]
  diffBuyPrice: StockDto["diffBuyPrice"]
  diffSellPrice: StockDto["diffSellPrice"]
  unit: StockDto["unit"]
}) {
  price = typeof price === "number" ? price : 0
  diffBuyPrice = typeof diffBuyPrice === "number" ? diffBuyPrice : 0
  diffSellPrice = typeof diffSellPrice === "number" ? diffSellPrice : 0
  unit = typeof unit === "number" ? unit : 0

  const profile = useAtomValue(profileAtom)

  const groupDiffBuyPrice = Number(profile.diffBuyPrice)
  const groupDiffSellPrice = Number(profile.diffSellPrice)
  const groupIntDiffBuyPrice = Number(profile.diffBuyPriceInt)
  const groupIntDiffSellPrice = Number(profile.diffSellPriceInt)

  const isGroupModeInt = unit === 1
  const selectedGroupDiffBuyPrice = isGroupModeInt ? groupIntDiffBuyPrice : groupDiffBuyPrice
  const selectedGroupDiffSellPrice = isGroupModeInt ? groupIntDiffSellPrice : groupDiffSellPrice

  const totalBuyPrice = price + selectedGroupDiffBuyPrice + diffBuyPrice
  const totalSellPrice = price - selectedGroupDiffSellPrice - diffSellPrice

  return { totalBuyPrice, totalSellPrice }
}
