import { CheckCircleIcon, CircleIcon } from "@phosphor-icons/react"
import { ccn } from "@repo/shared/helpers"
import { useLiteralQueryState } from "@repo/shared/hooks"
import { motionPresets } from "@repo/shared/lib"
import { useAtomValue } from "jotai"
import { motion } from "motion/react"
import { useEffect } from "react"
import { QUERY_KEYS } from "../navigation"
import { useGetProductSideEnabled } from "../shared"
import { selectedProductAtom, sides } from "./shared"

function calcDefaultSide(
  isBuyingEnabled: boolean,
  isSellingEnabled: boolean,
): (typeof sides)[number] | undefined {
  if (isBuyingEnabled && !isSellingEnabled) return "buy"
  if (!isBuyingEnabled && isSellingEnabled) return "sell"
  return undefined
}

export default function BuyAndSellToggleBtn() {
  const selectedProduct = useAtomValue(selectedProductAtom)
  const { isBuyingEnabled, isSellingEnabled } = useGetProductSideEnabled(
    selectedProduct?.status ?? 0,
  )
  const [side, setSide] = useLiteralQueryState(QUERY_KEYS.side, sides)

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    setSide(calcDefaultSide(isBuyingEnabled, isSellingEnabled) ?? null)
  }, [isBuyingEnabled, isSellingEnabled])

  return (
    <div {...styles.container}>
      {isBuyingEnabled ? (
        <motion.label
          {...motionPresets.btn}
          {...styles.btn(side === "buy")}
          data-testid="buy-sell-toggle-buy-toggle"
        >
          <input
            checked={side === "buy"}
            className="hidden"
            type="radio"
            onChange={() => setSide("buy")}
          />
          {side === "buy" ? <CheckCircleIcon weight="fill" /> : <CircleIcon />}
          <span>خرید</span>
        </motion.label>
      ) : (
        <div {...styles.btnDisabled}>خرید</div>
      )}

      {isSellingEnabled ? (
        <motion.label
          {...motionPresets.btn}
          {...styles.btn(side === "sell")}
          data-testid="buy-sell-toggle-sell-toggle"
        >
          <input
            checked={side === "sell"}
            className="hidden"
            type="radio"
            onChange={() => setSide("sell")}
          />
          {side === "sell" ? <CheckCircleIcon weight="fill" /> : <CircleIcon />}
          <span>فروش</span>
        </motion.label>
      ) : (
        <div {...styles.btnDisabled}>فروش</div>
      )}
    </div>
  )
}

const styles = {
  container: ccn(`
    rounded-md flex flex-wrap items-center
    border border-slate-7 p-1 gap-1
  `),

  btn: (isActive = false) =>
    ccn(
      `
        flex-1 flex p-2 text-center justify-center rounded-md
        items-center cursor-pointer bg-transparent min-w-20 gap-1
      `,
      { "bg-brand-9 text-slate-1 font-bold": isActive },
    ),

  btnDisabled: ccn(`
    flex-1 flex p-2 justify-center
    bg-slate-5 text-slate-10 rounded-md
  `),
}
