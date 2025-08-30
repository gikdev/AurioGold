import { skins } from "../skins"
import { FieldInfo } from "./FieldInfo"
import { useFieldContext } from "./shared"

interface SimpleRadiosProps {
  label: string
  items: Array<{
    id: string
    value: string
    title: string
  }>
}
export function SimpleRadios({ label, items }: SimpleRadiosProps) {
  const field = useFieldContext<string>()

  return (
    <div className={skins.labelerContainer()}>
      <p>{label}</p>

      <div className="flex flex-col gap-2">
        {items.map(item => (
          <label key={item.id} className="flex items-center gap-2">
            <label className={skins.radioBtnRing()}>
              <input
                type="radio"
                name={field.name}
                className={skins.radioBtnInput()}
                value={item.value}
                checked={field.state.value === item.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
              />
              <span className={skins.radioBtnCenter()} />
            </label>

            <span>{item.title}</span>
          </label>
        ))}
      </div>

      <FieldInfo field={field} />
    </div>
  )
}
