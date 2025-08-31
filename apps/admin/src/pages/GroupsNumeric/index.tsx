import { HeadingLine } from "@repo/shared/layouts"
import { ManageNumericGroups } from "./ManageNumericGroups"

export default function GroupsGram() {
  return (
    <HeadingLine
      title="مدیریت گروه عددی"
      className="flex flex-col flex-1"
      containerClassName="flex flex-col flex-1"
    >
      <ManageNumericGroups />
    </HeadingLine>
  )
}
