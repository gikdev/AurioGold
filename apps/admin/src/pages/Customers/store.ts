import type { CustomerDto } from "@repo/api-client"
import { create } from "zustand"
import type { ProductId } from "../Products/ManageProducts/store"

export type CustomerId = NonNullable<CustomerDto["id"]>

interface CustomersStore {
  mode: "initial" | "create" | "edit" | "delete" | "details" | "doc" | "transfer" | "balance"
  customerId: CustomerId | null
  stockId: ProductId | null

  createNew: () => void
  edit: (customerId: CustomerId) => void
  delete: (customerId: CustomerId) => void
  details: (customerId: CustomerId) => void
  doc: (customerId: CustomerId) => void
  balance: (customerId: CustomerId) => void
  transfer: ({ customerId, stockId }: { customerId: CustomerId; stockId: ProductId }) => void
  close: () => void

  reset: () => void
}

export const useCustomersStore = create<CustomersStore>()(set => ({
  mode: "initial",
  customerId: null,
  stockId: null,

  createNew: () => set({ mode: "create" }),
  edit: customerId => set({ mode: "edit", customerId }),
  details: customerId => set({ mode: "details", customerId }),
  delete: customerId => set({ mode: "delete", customerId }),
  balance: customerId => set({ mode: "balance", customerId }),
  doc: customerId => set({ mode: "doc", customerId }),
  transfer: ({ customerId, stockId }) => set({ mode: "transfer", customerId, stockId }),
  close: () => set({ mode: "initial" }),

  reset: () => set({ mode: "initial", customerId: null, stockId: null }),
}))
