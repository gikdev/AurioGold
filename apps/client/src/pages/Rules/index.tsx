import { HeadingLine } from "@repo/shared/layouts"
import Markdown from "markdown-to-jsx"
import { useGetMasterInfo } from "../About/useGetMasterInfo"

export default function About() {
  const [rules] = useGetMasterInfo(["rulls"])

  return (
    <HeadingLine title="شرایط و قوانین" className="text-center">
      <Markdown>{rules ? rules.toString() : ""}</Markdown>
    </HeadingLine>
  )
}
