import { type JSX, type Ref, type SelectHTMLAttributes, forwardRef } from "react"
import { StyledSelect } from "./Select"

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
function SelectInner<T>(
  {
    options,
    placeholder = "انتخاب کنید",
    loadingLabel = "در حال بارگذاری...",
    isLoading = false,
    keys,
    ...rest
  }: SelectWithOptionsProps<T>,
  ref: Ref<HTMLSelectElement>,
) {
  return (
    <StyledSelect {...rest} ref={ref} defaultValue="" disabled={isLoading || rest.disabled}>
      <option value="" disabled>
        {isLoading ? loadingLabel : placeholder}
      </option>
      {options.map(option => (
        <option key={String(option[keys.id])} value={String(option[keys.value])}>
          {String(option[keys.text])}
        </option>
      ))}
    </StyledSelect>
  )
}

// --- Wrap with forwardRef, preserve generic using a helper
export const SelectWithOptions = forwardRef(SelectInner) as unknown as <T>(
  props: SelectWithOptionsProps<T> & { ref?: Ref<HTMLSelectElement> },
) => JSX.Element
