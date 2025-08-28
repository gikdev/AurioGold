import { skins } from "../skins"
import { FieldInfo } from "./FieldInfo"
import { useFieldContext } from "./shared"

interface MultilineTextProps {
  label: string
  dir?: "auto" | "ltr" | "rtl"
}
export function MultilineText({ label, dir = "auto" }: MultilineTextProps) {
  const field = useFieldContext<string>()

  return (
    <div className={skins.labelerContainer()}>
      <label htmlFor={field.name}>{label}</label>

      <textarea
        id={field.name}
        name={field.name}
        className={skins.textarea()}
        value={field.state.value ?? ""}
        dir={dir}
        onBlur={field.handleBlur}
        onChange={e => field.handleChange(e.target.value)}
      />

      <FieldInfo field={field} />
    </div>
  )
}
