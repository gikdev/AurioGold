interface TypedSelectOption<T extends string = string> {
  id: string
  value: T
  text: string
}

interface TypedSelectProps<T extends string = string> {
  id: string
  name: string
  className?: string
  onBlur?: () => void
  onChange?: (item: T) => void
  value: T
  dir?: "auto" | "ltr" | "rtl"
  options: TypedSelectOption<T>[]
  isLoading?: boolean
  placeholder?: string
  loadingPlaceholder?: string
  disabled?: boolean
}

export function TypedSelect<T extends string = string>({
  options = [],
  dir = "auto",
  isLoading = false,
  loadingPlaceholder = "در حال بارگذاری...",
  placeholder = "انتخاب کنید",
  disabled = false,
  onChange,
  ...props
}: TypedSelectProps<T>) {
  return (
    <select
      {...props}
      disabled={isLoading || disabled}
      onChange={e => onChange?.(e.target.value as T)}
    >
      <option value="">{isLoading ? loadingPlaceholder : placeholder}</option>

      {options.map(option => (
        <option key={option.id} value={option.value}>
          {option.text}
        </option>
      ))}
    </select>
  )
}
