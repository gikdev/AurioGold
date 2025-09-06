import { useEffect, useState } from "react"
import CurrencyInput, { type CurrencyInputProps } from "react-currency-input-field"
import { toSafeNumber } from "#shared/utils"
import { skins } from "../skins"
import { FieldInfo } from "./FieldInfo"
import { useFieldContext } from "./shared"

interface CommaFieldProps extends CurrencyInputProps {
  label: string
  readOnly?: boolean
  dir?: "auto" | "ltr" | "rtl"
}
export function CommaField({ label, readOnly = false, dir = "ltr", ...other }: CommaFieldProps) {
  const field = useFieldContext<number>()
  const [innerValue, setInnerValue] = useState("")

  useEffect(() => {
    setInnerValue(field.state.value.toString())
  }, [field.state.value])

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
        value={innerValue}
        onBlur={e => {
          field.handleBlur()
          field.setValue(toSafeNumber(e.target.value, 0))
        }}
        onValueChange={v => setInnerValue(v ?? "")}
      />

      <FieldInfo field={field} />
    </div>
  )
}
