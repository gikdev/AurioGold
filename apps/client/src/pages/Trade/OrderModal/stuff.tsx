import { atom } from "jotai"

export const OrderStatus = {
  Draft: 1,
  Processing: 2,
  Accepted: 3,
  Rejected: 4,
} as const

export const OrderModalStates = [
  "agreed",
  "waiting",
  "no-answer",
  "disagreed",
  "error",
  "loading",
] as const
export type OrderModalState = (typeof OrderModalStates)[number]
export const orderModalStateAtom = atom<OrderModalState>("loading")

export function calcTitle(state: OrderModalState) {
  if (state === "agreed") return "سفارش شما تایید شد"
  if (state === "waiting") return "متنظر پاسخ هستیم"
  if (state === "no-answer") return "پاسخی نیامد"
  if (state === "disagreed") return "سفارش شما رد شد"
  if (state === "error") return "خطایی رخ داد"
  if (state === "loading") return "درحال بارگذاری..."

  return "---"
}
