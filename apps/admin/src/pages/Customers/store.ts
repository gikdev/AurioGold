import type { CustomerDto } from "@repo/api-client/client"
import { create } from "zustand"

export type CustomerId = NonNullable<CustomerDto["id"]>

interface CustomersStore {
  mode: "initial" | "create" | "edit" | "delete" | "details" | "doc" | "transfer" | "balance"
  customerId: CustomerId | null

  createNew: () => void
  edit: (customerId: CustomerId) => void
  delete: (customerId: CustomerId) => void
  details: (customerId: CustomerId) => void
  doc: (customerId: CustomerId) => void
  balance: (customerId: CustomerId) => void
  transfer: (customerId: CustomerId) => void
  close: () => void

  reset: () => void
}

export const useCustomersStore = create<CustomersStore>()(set => ({
  mode: "initial",
  customerId: null,

  createNew: () => set({ mode: "create" }),
  edit: customerId => set({ mode: "edit", customerId }),
  details: customerId => set({ mode: "details", customerId }),
  delete: customerId => set({ mode: "delete", customerId }),
  balance: customerId => set({ mode: "balance", customerId }),
  doc: customerId => set({ mode: "doc", customerId }),
  transfer: customerId => set({ mode: "transfer", customerId }),
  close: () => set({ mode: "initial" }),

  reset: () => set({ mode: "initial", customerId: null }),
}))
