import { CoinsIcon } from "@phosphor-icons/react"
import { Btn } from "@repo/shared/components"
import { useLiteralQueryState } from "@repo/shared/hooks"
import { useAtomValue } from "jotai"
import { QUERY_KEYS } from "../navigation"
import { useGetProductSideEnabled } from "../shared"
import { selectedProductAtom, sides } from "./shared"

export default function SubmitBtn() {
  const [side] = useLiteralQueryState(QUERY_KEYS.side, sides)
  const selectedProduct = useAtomValue(selectedProductAtom)
  const { isDisabled } = useGetProductSideEnabled(selectedProduct?.status ?? 0)
  const verb = side === "buy" ? "خرید" : "فروش"

  const isBtnDisabled = isDisabled

  return (
    <Btn
      type="submit"
      theme={side === "buy" ? "success" : "error"}
      themeType="filled"
      disabled={isBtnDisabled}
    >
      <CoinsIcon size={20} weight="fill" />
      <span>{verb}</span>
    </Btn>
  )
}
