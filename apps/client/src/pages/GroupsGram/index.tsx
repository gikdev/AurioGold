import type { CustomerGroupDto } from "@repo/api-client/client"
import { HeadingLine } from "@repo/shared/layouts"
import routes from "../routes"
import ManageGroupsGram from "./ManageGroupsGram"

export const queryStateKeys = {
  createNew: "create-new",
  edit: "edit",
  delete: "delete",
  details: "details",
}

export const queryStateUrls = {
  createNew: () => `${routes.groupsGram}?${queryStateKeys.createNew}=true`,
  edit: (id: NonNullable<CustomerGroupDto["id"]>) =>
    `${routes.groupsGram}?${queryStateKeys.edit}=${id}`,
  delete: (id: NonNullable<CustomerGroupDto["id"]>) =>
    `${routes.groupsGram}?${queryStateKeys.delete}=${id}`,
  details: (id: NonNullable<CustomerGroupDto["id"]>) =>
    `${routes.groupsGram}?${queryStateKeys.details}=${id}`,
}

export default function GroupsGram() {
  return (
    <HeadingLine title="مدیریت گروه گرمی">
      <ManageGroupsGram />
    </HeadingLine>
  )
}
