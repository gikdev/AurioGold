import { HeadingLine } from "@repo/shared/layouts"
import Markdown from "markdown-to-jsx"
import { useGetMasterInfo } from "../About/useGetMasterInfo"
import ManageProducts from "./ManageProducts"

export default function Products() {
  const [mainPage] = useGetMasterInfo(["mainPage"])

  return (
    <HeadingLine title="محصولات">
      <div className="bg-slate-3 border border-slate-7 rounded-md py-6 px-3 text-center mx-auto max-w-96 mb-5">
        <Markdown>{(mainPage ? mainPage.toString() : "")?.replaceAll("\n", "<br>")}</Markdown>
      </div>

      <ManageProducts />
    </HeadingLine>
  )
}
