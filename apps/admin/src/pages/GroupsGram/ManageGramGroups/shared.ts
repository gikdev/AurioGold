import type { CustomerGroupDto } from "@repo/api-client/client"
import { getApiTyCustomerGroupsOptions } from "@repo/api-client/tanstack"
import { create } from "zustand"
import { queryClient } from "#/shared"
import { getHeaderTokenOnly } from "#/shared/forms"

export const gramGroupsOptions = getApiTyCustomerGroupsOptions(getHeaderTokenOnly())

export function refetchGramGroups() {
  queryClient.refetchQueries(gramGroupsOptions)
}

export type GroupId = NonNullable<CustomerGroupDto["id"]>

interface GramGroupsStore {
  mode: "initial" | "create" | "edit" | "remove" | "details"
  groupId: GroupId | null

  close: () => void
  createNew: () => void
  edit: (groupId: GroupId) => void
  remove: (groupId: GroupId) => void
  details: (groupId: GroupId) => void

  reset: () => void
}

export const useGramGroupsStore = create<GramGroupsStore>()(set => ({
  mode: "initial",
  groupId: null,

  close: () => set({ mode: "initial" }),
  createNew: () => set({ mode: "create" }),
  edit: groupId => set({ mode: "edit", groupId }),
  details: groupId => set({ mode: "details", groupId }),
  remove: groupId => set({ mode: "remove", groupId }),

  reset: () => set({ groupId: null, mode: "initial" }),
}))
