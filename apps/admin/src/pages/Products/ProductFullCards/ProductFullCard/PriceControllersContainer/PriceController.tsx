import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react"
import { Btn } from "@repo/shared/components"
import { cx } from "#/shared/cva.config"

interface PriceControllerProps {
  title: string
  priceNumberColor: string
  price: string
  onUpBtnClick: () => void
  onDownBtnClick: () => void
}

export function PriceController({
  onDownBtnClick,
  onUpBtnClick,
  price,
  priceNumberColor,
  title,
}: PriceControllerProps) {
  return (
    <div className="flex gap-1 w-full">
      <div className="flex flex-col items-start justify-center gap-1 flex-1">
        <p className="text-xs">{title}</p>
        <p className={cx("font-bold text-lg", priceNumberColor)}>{price}</p>
      </div>

      <div className="flex gap-1">
        <Btn className="w-10 p-0" theme="error" onClick={onDownBtnClick}>
          <CaretDownIcon />
        </Btn>

        <Btn className="w-10 p-0" theme="success" onClick={onUpBtnClick}>
          <CaretUpIcon />
        </Btn>
      </div>
    </div>
  )
}
