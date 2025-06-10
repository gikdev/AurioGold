import styled from "@master/styled.react"
import { CaretLeftIcon, CheckIcon, XIcon } from "@phosphor-icons/react"

export const KeyValueDetailsContainer = styled.div`
  flex flex-col gap-3
`

interface KeyValueDetailProps {
  title: string
  value: number | string | null | undefined | boolean
}

export function KeyValueDetail({ title: key, value }: KeyValueDetailProps) {
  return (
    <p className="flex items-center justify-between hover:bg-slate-2 p-2 rounded-md">
      <span className="font-bold inline-flex gap-1 items-center">
        <CaretLeftIcon />
        <span>{key}:</span>
      </span>

      <span className="">
        <RenderAValue value={value} />
      </span>
    </p>
  )
}

interface RenderAValueProps {
  value: unknown
}

function RenderAValue({ value }: RenderAValueProps) {
  if (value == null || value === undefined || value === "") return "-"
  if (typeof value === "string") return value
  if (typeof value === "number") return value
  if (typeof value === "object") return JSON.stringify(value)
  if (typeof value === "boolean" && value.toString() === "false")
    return <XIcon size={24} className="text-red-10" />
  if (typeof value === "boolean" && value.toString() === "true")
    return <CheckIcon size={24} className="text-green-10" />

  return "?؟?"
}
