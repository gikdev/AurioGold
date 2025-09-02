import type { StockDtoForMaster } from "@repo/api-client"
import { formatPersianPrice } from "@repo/shared/utils"
import { useStocksQuery } from "../../../shared"
import { usePriceUpdater } from "../../../usePriceUpdater"
import { PriceController } from "./PriceController"
import { PriceHr } from "./PriceHr"

interface PriceControllersContainerProps {
  id: StockDtoForMaster["id"]
  price: StockDtoForMaster["price"]
  diffBuyPrice: StockDtoForMaster["diffBuyPrice"]
  diffSellPrice: StockDtoForMaster["diffSellPrice"]
}

export function PriceControllersContainer({
  diffBuyPrice,
  diffSellPrice,
  price,
  id,
}: PriceControllersContainerProps) {
  const { data: stocks = [] } = useStocksQuery()
  const product = stocks.find(p => p.id === id)

  const { change, areAllBtnsEnabled } = usePriceUpdater(product)

  return (
    <div className="flex flex-col items-center gap-2 p-2 xl:flex-row xl:gap-4">
      <PriceController
        onUpBtnClick={() => change("price", "inc")}
        onDownBtnClick={() => change("price", "dec")}
        areAllBtnsEnabled={areAllBtnsEnabled}
        price={formatPersianPrice(price ?? 0)}
        priceNumberColor="text-slate-12"
        title="قیمت (ریال)"
      />

      <PriceHr hasVertical />

      <PriceController
        onUpBtnClick={() => change("diffSellPrice", "inc")}
        onDownBtnClick={() => change("diffSellPrice", "dec")}
        areAllBtnsEnabled={areAllBtnsEnabled}
        price={formatPersianPrice(diffSellPrice ?? 0)}
        priceNumberColor="text-red-11"
        title="اختلاف فروش (ریال)"
      />

      <PriceHr hasVertical />

      <PriceController
        onUpBtnClick={() => change("diffBuyPrice", "inc")}
        onDownBtnClick={() => change("diffBuyPrice", "dec")}
        areAllBtnsEnabled={areAllBtnsEnabled}
        price={formatPersianPrice(diffBuyPrice ?? 0)}
        priceNumberColor="text-green-11"
        title="اختلاف خرید (ریال)"
      />
    </div>
  )
}
