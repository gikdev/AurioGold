import { skins } from "../skins"
import { FieldInfo } from "./FieldInfo"
import { useFieldContext } from "./shared"

interface SimplePasswordProps {
  label: string
  dir?: "auto" | "ltr" | "rtl"
}
export function SimplePassword({ label, dir = "auto" }: SimplePasswordProps) {
  const field = useFieldContext<string>()

  return (
    <div className={skins.labelerContainer()}>
      <label htmlFor={field.name}>{label}</label>

      <input
        type="password"
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
