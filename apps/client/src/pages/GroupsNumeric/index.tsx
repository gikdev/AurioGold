import type { CustomerGroupIntDto } from "@repo/api-client/client"
import { HeadingLine } from "@repo/shared/layouts"
import routes from "../routes"
import ManageGroupsNumeric from "./ManageGroupsNumeric"

export const queryStateKeys = {
  createNew: "create-new",
  edit: "edit",
  delete: "delete",
  details: "details",
}

export const queryStateUrls = {
  createNew: () => `${routes.groupsNumeric}?${queryStateKeys.createNew}=true`,
  edit: (id: CustomerGroupIntDto["id"]) => `${routes.groupsNumeric}?${queryStateKeys.edit}=${id}`,
  delete: (id: CustomerGroupIntDto["id"]) =>
    `${routes.groupsNumeric}?${queryStateKeys.delete}=${id}`,
  details: (id: CustomerGroupIntDto["id"]) =>
    `${routes.groupsNumeric}?${queryStateKeys.details}=${id}`,
}

export default function GroupsNumeric() {
  return (
    <HeadingLine title="مدیریت گروه عددی">
      <ManageGroupsNumeric />
    </HeadingLine>
  )
}
