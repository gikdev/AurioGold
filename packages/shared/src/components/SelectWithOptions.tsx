import { type Ref, type SelectHTMLAttributes, forwardRef } from "react"
import { Select } from "./Select"

// --- Generic props with constraint
interface SelectWithOptionsProps<T>
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  options: T[]
  placeholder?: string
  loadingLabel?: string
  isLoading?: boolean
  keys: {
    id: keyof T
    value: keyof T
    text: keyof T
  }
}

// --- Generic forwardRef wrapper
export const SelectWithOptions = forwardRef(
  <T,>(
    {
      options,
      placeholder = "انتخاب کنید",
      loadingLabel = "در حال بارگذاری...",
      isLoading = false,
      keys,
      ...rest
    }: SelectWithOptionsProps<T>,
    ref: Ref<string>,
  ) => (
    <Select {...rest} ref={ref} defaultValue="" disabled={isLoading || rest.disabled}>
      <option value="" disabled>
        {isLoading ? loadingLabel : placeholder}
      </option>
      {options.map(option => (
        <option key={String(option[keys.id])} value={String(option[keys.value])}>
          {String(option[keys.text])}
        </option>
      ))}
    </Select>
  ),
)
