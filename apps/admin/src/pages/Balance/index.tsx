import { HeadingLine } from "@repo/shared/layouts"
import ManageBalance from "./ManageBalance"

export default function Balance() {
  return (
    <HeadingLine
      title="مانده حساب"
      className="flex flex-col flex-1"
      containerClassName="flex flex-col flex-1"
    >
      <ManageBalance />
    </HeadingLine>
  )
}
