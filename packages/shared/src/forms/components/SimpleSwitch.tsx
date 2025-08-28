import { skins } from "../skins"
import { FieldInfo } from "./FieldInfo"
import { Switch } from "./Switch"
import { useFieldContext } from "./shared"

interface SimpleSwitchProps {
  label: string
}
export function SimpleSwitch({ label }: SimpleSwitchProps) {
  const field = useFieldContext<boolean>()

  return (
    <div className={skins.labelerContainer()}>
      <div className="flex items-center justify-between">
        <label htmlFor={field.name}>{label}</label>

        <Switch
          id={field.name}
          name={field.name}
          checked={field.state.value}
          onBlur={field.handleBlur}
          onChange={e => field.handleChange(e.target.checked)}
        />
      </div>

      <FieldInfo field={field} />
    </div>
  )
}
