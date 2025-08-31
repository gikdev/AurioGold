import { HeadingLine } from "@repo/shared/layouts"
import { ManageGramGroups } from "./ManageGramGroups"

export default function GroupsGram() {
  return (
    <HeadingLine
      title="مدیریت گروه گرمی"
      containerClassName="flex flex-col flex-1"
      className="flex flex-col flex-1"
    >
      <ManageGramGroups />
    </HeadingLine>
  )
}
