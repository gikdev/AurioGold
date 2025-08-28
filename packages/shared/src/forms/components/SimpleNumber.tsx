import { toSafeNumber } from "#shared/utils"
import { skins } from "../skins"
import { FieldInfo } from "./FieldInfo"
import { useFieldContext } from "./shared"

interface SimpleNumberProps {
  label: string
  fallbackValue?: number
  readOnly?: boolean
  dir?: "auto" | "ltr" | "rtl"
}
export function SimpleNumber({
  label,
  fallbackValue = 0,
  readOnly = false,
  dir = "ltr",
}: SimpleNumberProps) {
  const field = useFieldContext<number>()

  return (
    <div className={skins.labelerContainer()}>
      <label htmlFor={field.name}>{label}</label>

      <input
        id={field.name}
        dir={dir}
        name={field.name}
        type="number"
        readOnly={readOnly}
        className={skins.input()}
        value={toSafeNumber(field.state.value, fallbackValue)}
        onBlur={field.handleBlur}
        onChange={e => field.handleChange(toSafeNumber(e.target.valueAsNumber, fallbackValue))}
      />

      <FieldInfo field={field} />
    </div>
  )
}
