import Markdown from "markdown-to-jsx"
import { useGetMasterInfo } from "../About/useGetMasterInfo"

export function MainPageContent() {
  const [mainPage] = useGetMasterInfo(["mainPage"])

  return (
    <div className="bg-slate-3 border border-slate-7 rounded-md py-6 px-3 text-center mx-auto max-w-96 mb-5">
      <Markdown>{(mainPage ? mainPage.toString() : "")?.replaceAll("\n", "<br>")}</Markdown>
    </div>
  )
}
