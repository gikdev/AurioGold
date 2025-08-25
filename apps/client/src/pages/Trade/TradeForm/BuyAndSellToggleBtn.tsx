import { CheckCircleIcon, CircleIcon } from "@phosphor-icons/react"
import { useEffect } from "react"
import { cx } from "#/shared/cva.config"
import { useProductContext } from "./ProductFetcher"
import { type Side, useGetProductSideEnabled, useTradeFormStore } from "./shared"

export function BuyAndSellToggleBtn() {
  const product = useProductContext()
  const side = useTradeFormStore(s => s.side)
  const { isBuyingEnabled, isSellingEnabled } = useGetProductSideEnabled(product.status)

  useHandleInvalidSide(side, isBuyingEnabled, isSellingEnabled)

  const containerStyles = cx(`
    rounded-md flex flex-wrap items-center
    border border-slate-7 p-1 gap-1
  `)

  return (
    <div className={containerStyles}>
      <SideButton
        isSelected={side === "buy"}
        isEnabled={isBuyingEnabled}
        onSelect={() => useTradeFormStore.getState().setSide("buy")}
        label="خرید"
      />
      <SideButton
        isSelected={side === "sell"}
        isEnabled={isSellingEnabled}
        onSelect={() => useTradeFormStore.getState().setSide("sell")}
        label="فروش"
      />
    </div>
  )
}

function useHandleInvalidSide(side: Side, isBuyingEnabled: boolean, isSellingEnabled: boolean) {
  useEffect(() => {
    const defaultSide = calcDefaultSide(isBuyingEnabled, isSellingEnabled)
    if (defaultSide && defaultSide !== side) useTradeFormStore.getState().setSide(defaultSide)
  }, [side, isBuyingEnabled, isSellingEnabled])
}

function calcDefaultSide(isBuyingEnabled: boolean, isSellingEnabled: boolean) {
  if (isBuyingEnabled && !isSellingEnabled) return "buy"
  if (!isBuyingEnabled && isSellingEnabled) return "sell"
  return undefined
}

interface SideButtonProps {
  isSelected: boolean
  isEnabled: boolean
  onSelect: () => void
  label: string
}

function SideButton({ isSelected, isEnabled, onSelect, label }: SideButtonProps) {
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
    isSelected ? "bg-brand-9 text-slate-1 font-bold" : "",
  )

  return (
    <label className={btnStyles}>
      <input type="radio" checked={isSelected} className="hidden" onChange={onSelect} />
      {isSelected ? <CheckCircleIcon weight="fill" /> : <CircleIcon />}
      <span>{label}</span>
    </label>
  )
}
