import type { StockDto } from "@repo/api-client/client"
import { LabelerLine, Switch } from "@repo/shared/components"
import { ccn, createFieldsWithLabels } from "@repo/shared/helpers"
import { useBooleanishQueryState, useLiteralQueryState } from "@repo/shared/hooks"
import { motionPresets } from "@repo/shared/lib"
import { motion } from "motion/react"
import { useFinalProductPrices, useGetProductSideEnabled } from "./ProductShared"

const sides = ["buy", "sell"] as const

const { fields, labels } = createFieldsWithLabels({
  side: null,
  isRialMode: "میخواهم به صورت ریالی معامله کنم *",
})

interface ProductFormProps {
  product: Required<StockDto>
}

function calcDefaultSide(
  isBuyingEnabled: boolean,
  isSellingEnabled: boolean,
): (typeof sides)[number] | undefined {
  if (isBuyingEnabled && !isSellingEnabled) return "buy"
  if (!isBuyingEnabled && isSellingEnabled) return "sell"
  return undefined
}

export default function ProductForm({ product }: ProductFormProps) {
  const { isBuyingEnabled, isSellingEnabled } = useGetProductSideEnabled(product.status)
  const { totalBuyPrice, totalSellPrice } = useFinalProductPrices({
    productUnit: product.unit,
    productBasePrice: product.price ?? 0,
    productDiffBuyPrice: product.diffBuyPrice ?? 0,
    productDiffSellPrice: product.diffSellPrice ?? 0,
  })

  const [side, setSide] = useLiteralQueryState(
    "side",
    sides,
    calcDefaultSide(isBuyingEnabled, isSellingEnabled),
  )
  const [isRialMode, setRialMode] = useBooleanishQueryState("rial-mode")

  return (
    <form className="flex flex-col gap-2">
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

      <LabelerLine labelText={labels.isRialMode} className="cursor-pointer">
        <Switch checked={isRialMode} onChange={e => setRialMode(e.target.checked)} />
      </LabelerLine>
    </form>
  )
}
