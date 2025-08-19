import type { StockDto } from "@repo/api-client/client"
import { create } from "zustand"

export type ProductId = NonNullable<StockDto["id"]>

interface ProductsStore {
  mode: "initial" | "create" | "edit" | "delete" | "details" | "changeA11y"
  productId: ProductId | null

  createNew: () => void
  edit: (productId: ProductId) => void
  delete: (productId: ProductId) => void
  details: (productId: ProductId) => void
  changeA11y: (productId: ProductId) => void
  close: () => void

  reset: () => void
}

export const useProductsStore = create<ProductsStore>()(set => ({
  mode: "initial",
  productId: null,

  createNew: () => set({ mode: "create" }),
  changeA11y: productId => set({ mode: "changeA11y", productId }),
  edit: productId => set({ mode: "edit", productId }),
  details: productId => set({ mode: "details", productId }),
  delete: productId => set({ mode: "delete", productId }),
  close: () => set({ mode: "initial" }),

  reset: () => set({ mode: "initial", productId: null }),
}))
