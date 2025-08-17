import { CheckCircleIcon, CircleIcon } from "@phosphor-icons/react"
import { useEffect } from "react"
import { cx } from "#/shared/cva.config"
import { useGetProductSideEnabled, useProductId, useProductSide, useStockByIdQuery } from "./shared"

function calcDefaultSide(isBuyingEnabled: boolean, isSellingEnabled: boolean) {
  if (isBuyingEnabled && !isSellingEnabled) return "buy"
  if (!isBuyingEnabled && isSellingEnabled) return "sell"
  return undefined
}

interface SideButtonProps {
  isActive: boolean
  isEnabled: boolean
  onSelect: () => void
  label: string
}

function SideButton({ isActive, isEnabled, onSelect, label }: SideButtonProps) {
  if (!isEnabled)
    return (
      <div className="flex-1 flex p-2 justify-center bg-slate-5 text-slate-10 rounded-md">
        {label}
      </div>
    )

  const btnStyles = cx(
    `
      flex-1 flex p-2 text-center justify-center rounded-md
      items-center cursor-pointer bg-transparent min-w-20 gap-1
    `,
    isActive ? "bg-brand-9 text-slate-1 font-bold" : "",
  )

  return (
    <label className={btnStyles}>
      <input type="radio" checked={isActive} className="hidden" onChange={onSelect} />
      {isActive ? <CheckCircleIcon weight="fill" /> : <CircleIcon />}
      <span>{label}</span>
    </label>
  )
}

function useHandleInvalidSide(isBuyingEnabled: boolean, isSellingEnabled: boolean) {
  const [side, setSide] = useProductSide()

  useEffect(() => {
    const defaultSide = calcDefaultSide(isBuyingEnabled, isSellingEnabled)
    if (defaultSide && defaultSide !== side) setSide(defaultSide)
  }, [side, setSide, isBuyingEnabled, isSellingEnabled])
}

export function BuyAndSellToggleBtn() {
  const [productId] = useProductId()
  const { data: product } = useStockByIdQuery(productId)
  const [side, setSide] = useProductSide()
  const { isBuyingEnabled, isSellingEnabled } = useGetProductSideEnabled(product?.status ?? 0)

  useHandleInvalidSide(isBuyingEnabled, isSellingEnabled)

  const containerStyles = cx(`
    rounded-md flex flex-wrap items-center
    border border-slate-7 p-1 gap-1
  `)

  return (
    <div className={containerStyles}>
      <SideButton
        isActive={side === "buy"}
        isEnabled={isBuyingEnabled}
        onSelect={() => setSide("buy")}
        label="خرید"
      />
      <SideButton
        isActive={side === "sell"}
        isEnabled={isSellingEnabled}
        onSelect={() => setSide("sell")}
        label="فروش"
      />
    </div>
  )
}
