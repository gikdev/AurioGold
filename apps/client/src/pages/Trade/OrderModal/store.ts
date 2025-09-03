import { create } from "zustand"
import type { ProductId } from "../navigation"

interface OrderModalStore {
  orderId: ProductId | null
  setOrderId: (orderId: ProductId | null) => void

  autoMinutes: number
  setAutoMinutes: (autoMinutes: number) => void

  close: () => void
}

export const useOrderModalStore = create<OrderModalStore>()(set => ({
  orderId: null,
  setOrderId: orderId => set({ orderId }),

  autoMinutes: 0,
  setAutoMinutes: autoMinutes => set({ autoMinutes }),

  close: () => set({ autoMinutes: 0, orderId: null }),
}))

export function useIsOrderModalOpen() {
  const orderId = useOrderModalStore(s => s.orderId)
  return typeof orderId === "number"
}

export function openOrderModal(orderId: ProductId, autoMinutes: number) {
  useOrderModalStore.setState({ autoMinutes, orderId })
}
