import CurrencyInput, { type CurrencyInputProps } from "react-currency-input-field"
import { toSafeNumber } from "#shared/utils"
import { skins } from "../skins"
import { FieldInfo } from "./FieldInfo"
import { useFieldContext } from "./shared"

interface CurrencyFieldProps extends CurrencyInputProps {
  label: string
  readOnly?: boolean
  dir?: "auto" | "ltr" | "rtl"
}
export function CurrencyField({
  label,
  readOnly = false,
  dir = "ltr",
  ...other
}: CurrencyFieldProps) {
  const field = useFieldContext<number>()

  return (
    <div className={skins.labelerContainer()}>
      <label htmlFor={field.name}>{label}</label>

      <CurrencyInput
        step={1}
        {...other}
        id={field.name}
        dir={dir}
        name={field.name}
        readOnly={readOnly}
        className={skins.input()}
        value={field.state.value}
        onBlur={field.handleBlur}
        onValueChange={v => field.handleChange(toSafeNumber(v, 0))}
      />

      <FieldInfo field={field} />
    </div>
  )
}
