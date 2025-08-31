import type { CustomerGroupDto } from "@repo/api-client/client"
import { getApiTyCustomerGroupIntIntsOptions } from "@repo/api-client/tanstack"
import { getHeaderTokenOnly } from "@repo/shared/auth"
import { create } from "zustand"
import { queryClient } from "#/shared"

export const numericGroupsOptions = getApiTyCustomerGroupIntIntsOptions(getHeaderTokenOnly("admin"))

export function refetchNumericGroups() {
  queryClient.refetchQueries(numericGroupsOptions)
}

export type GroupId = NonNullable<CustomerGroupDto["id"]>

interface NumericGroupsStore {
  mode: "initial" | "create" | "edit" | "remove" | "details"
  groupId: GroupId | null

  close: () => void
  createNew: () => void
  edit: (groupId: GroupId) => void
  remove: (groupId: GroupId) => void
  details: (groupId: GroupId) => void

  reset: () => void
}

export const useNumericGroupsStore = create<NumericGroupsStore>()(set => ({
  mode: "initial",
  groupId: null,

  close: () => set({ mode: "initial" }),
  createNew: () => set({ mode: "create" }),
  edit: groupId => set({ mode: "edit", groupId }),
  details: groupId => set({ mode: "details", groupId }),
  remove: groupId => set({ mode: "remove", groupId }),

  reset: () => set({ groupId: null, mode: "initial" }),
}))
