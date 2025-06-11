import { HeadingLine } from "@repo/shared/layouts"
import ManageBalance from "./ManageBalance"

export default function Balance() {
  return (
    <HeadingLine title="مانده حساب">
      <ManageBalance />
    </HeadingLine>
  )
}
