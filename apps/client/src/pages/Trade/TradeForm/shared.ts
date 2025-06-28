import type { StockDto } from "@repo/api-client/client"
import { atom } from "jotai"

export const selectedProductAtom = atom<Required<StockDto> | null>(null)

export const sides = ["buy", "sell"] as const
