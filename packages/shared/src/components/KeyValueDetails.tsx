import { CaretLeftIcon, CheckIcon, XIcon } from "@phosphor-icons/react"
import type { HTMLProps, ReactNode } from "react"
import { cn } from "#shared/helpers"

export function KeyValueDetailsContainer({ className, ...other }: HTMLProps<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-3", className)} {...other} />
}

interface KeyValueDetailProps {
  title: string
  value?: number | string | null | undefined | boolean
  ltr?: boolean
  cellRendered?: ReactNode
  bottomSlot?: ReactNode
}

export function KeyValueDetail({
  title: key,
  value,
  cellRendered,
  ltr = false,
  bottomSlot,
}: KeyValueDetailProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="flex items-center justify-between hover:bg-slate-2 p-2 rounded-md gap-2 flex-wrap">
        <span className="inline-flex gap-1 items-center">
          <CaretLeftIcon className="shrink-0" />
          <span>{key}:</span>
        </span>

        {bottomSlot ? (
          <span />
        ) : (
          <span className="text-slate-12 font-bold" dir={ltr ? "ltr" : "rtl"}>
            {cellRendered ? cellRendered : <RenderAValue value={value} />}
          </span>
        )}
      </p>

      {bottomSlot}
    </div>
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
