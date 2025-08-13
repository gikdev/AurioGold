import type { StockDtoForMaster } from "@repo/api-client/client"
import { formatPersianPrice } from "@repo/shared/utils"
import { PriceController } from "./PriceController"
import { PriceHr } from "./PriceHr"

interface PriceControllersContainerProps {
  price: StockDtoForMaster["price"]
  diffBuyPrice: StockDtoForMaster["diffBuyPrice"]
  diffSellPrice: StockDtoForMaster["diffSellPrice"]
}

export function PriceControllersContainer({
  diffBuyPrice,
  diffSellPrice,
  price,
}: PriceControllersContainerProps) {
  return (
    <div className="flex flex-col items-center gap-2 p-2 xl:flex-row xl:*:flex-1 xl:gap-4">
      <PriceController
        onDownBtnClick={() => {}}
        onUpBtnClick={() => {}}
        price={formatPersianPrice(price ?? 0)}
        priceNumberColor="text-slate-12"
        title="قیمت (ریال)"
      />

      <PriceHr hideOnLargeScreens />

      <PriceController
        onDownBtnClick={() => {}}
        onUpBtnClick={() => {}}
        price={formatPersianPrice(diffSellPrice ?? 0)}
        priceNumberColor="text-red-11"
        title="اختلاف فروش"
      />

      <PriceHr hideOnLargeScreens />

      <PriceController
        onDownBtnClick={() => {}}
        onUpBtnClick={() => {}}
        price={formatPersianPrice(diffBuyPrice ?? 0)}
        priceNumberColor="text-green-11"
        title="اختلاف خرید"
      />
    </div>
  )
}
