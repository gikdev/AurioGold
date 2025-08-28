import type { ComponentProps } from "react"
import { skins } from "../skins"
import { FieldInfo } from "./FieldInfo"
import { useFieldContext } from "./shared"
import { TypedSelect } from "./TypedSelect"

interface SimpleSelectProps {
  label: string
  options: ComponentProps<typeof TypedSelect>["options"]
  isLoading?: boolean
  dir?: "auto" | "ltr" | "rtl"
}

export function SimpleSelect({
  label,
  options,
  dir = "auto",
  isLoading = false,
}: SimpleSelectProps) {
  const field = useFieldContext<string>()

  return (
    <div className={skins.labelerContainer()}>
      <label htmlFor={field.name}>{label}</label>

      <TypedSelect
        id={field.name}
        name={field.name}
        isLoading={isLoading}
        dir={dir}
        className={skins.select()}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={v => field.handleChange(v)}
        options={options}
      />

      <FieldInfo field={field} />
    </div>
  )
}
