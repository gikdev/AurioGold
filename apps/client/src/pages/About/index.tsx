import { HeadingLine } from "@repo/shared/layouts"
import Markdown from "markdown-to-jsx"
import { useGetMasterInfo } from "./useGetMasterInfo"

export default function About() {
  const [aboutUs] = useGetMasterInfo(["aboutUs"])

  return (
    <HeadingLine title="درباره ما" className="text-center">
      <Markdown>{aboutUs ? aboutUs.toString() : ""}</Markdown>
    </HeadingLine>
  )
}
