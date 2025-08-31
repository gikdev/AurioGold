import { HeadingLine } from "@repo/shared/layouts"
import { ManagePriceSources } from "./ManagePriceSources"

export default function PriceSources() {
  return (
    <HeadingLine
      title="مدیریت منابع قیمت"
      containerClassName="flex flex-col flex-1"
      className="flex flex-col flex-1"
    >
      <ManagePriceSources />
    </HeadingLine>
  )
}
