import { skins } from "../skins"
import { FieldInfo } from "./FieldInfo"
import { useFieldContext } from "./shared"

interface SimpleTextProps {
  label: string
  dir?: "auto" | "ltr" | "rtl"
}
export function SimpleText({ label, dir = "auto" }: SimpleTextProps) {
  const field = useFieldContext<string>()

  return (
    <div className={skins.labelerContainer()}>
      <label htmlFor={field.name}>{label}</label>

      <input
        id={field.name}
        name={field.name}
        dir={dir}
        className={skins.input()}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={e => field.handleChange(e.target.value)}
      />

      <FieldInfo field={field} />
    </div>
  )
}
