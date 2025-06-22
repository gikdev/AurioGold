import { ccn } from "@repo/shared/helpers"
import { useLiteralQueryState } from "@repo/shared/hooks"
import { motionPresets } from "@repo/shared/lib"
import { useAtomValue } from "jotai"
import { motion } from "motion/react"
import { useEffect } from "react"
import { selectedProductAtom } from "."
import { useGetProductSideEnabled } from "../ProductShared"

function calcDefaultSide(
  isBuyingEnabled: boolean,
  isSellingEnabled: boolean,
): (typeof sides)[number] | undefined {
  if (isBuyingEnabled && !isSellingEnabled) return "buy"
  if (!isBuyingEnabled && isSellingEnabled) return "sell"
  return undefined
}

export const sides = ["buy", "sell"] as const

export default function BuyAndSellToggleBtn() {
  const selectedProduct = useAtomValue(selectedProductAtom)
  const { isBuyingEnabled, isSellingEnabled } = useGetProductSideEnabled(
    selectedProduct?.status ?? 0,
  )
  const [side, setSide] = useLiteralQueryState("side", sides)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setSide(calcDefaultSide(isBuyingEnabled, isSellingEnabled) ?? null)
  }, [isBuyingEnabled, isSellingEnabled])

  return (
    <div className="rounded-md flex items-center">
      {isBuyingEnabled ? (
        <motion.label
          {...motionPresets.btn}
          {...ccn(
            "flex-1 flex p-2 text-center justify-center rounded-s-md",
            "items-center cursor-pointer bg-slate-3",
            { "bg-green-9 text-slate-12 font-bold": side === "buy" },
          )}
        >
          <input
            checked={side === "buy"}
            className="hidden"
            type="radio"
            onChange={() => setSide("buy")}
          />
          <span>خرید</span>
        </motion.label>
      ) : (
        <div className="flex-1 flex p-2 justify-center bg-slate-5 text-slate-10 rounded-s-md">
          خرید
        </div>
      )}

      {isSellingEnabled ? (
        <motion.label
          {...motionPresets.btn}
          {...ccn(
            "flex-1 flex p-2 text-center justify-center rounded-e-md",
            "items-center cursor-pointer bg-slate-3",
            { "bg-red-9 text-slate-12 font-bold": side === "sell" },
          )}
        >
          <input
            checked={side === "sell"}
            className="hidden"
            type="radio"
            onChange={() => setSide("sell")}
          />
          <span>فروش</span>
        </motion.label>
      ) : (
        <div className="flex-1 flex p-2 justify-center bg-slate-5 text-slate-10 rounded-e-md">
          فروش
        </div>
      )}
    </div>
  )
}
