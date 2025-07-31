import { forwardRef, type Ref, type SelectHTMLAttributes } from "react"
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

export function createSelectWithOptions<T>() {
  return forwardRef(
    (
      {
        options,
        placeholder = "انتخاب کنید",
        loadingLabel = "در حال بارگذاری...",
        isLoading = false,
        keys,
        value = "",
        ...rest
      }: SelectWithOptionsProps<T>,
      ref: Ref<HTMLSelectElement>,
    ) => (
      <Select {...rest} value={value} ref={ref} disabled={isLoading || rest.disabled}>
        <option value="" disabled>
          {isLoading ? loadingLabel : placeholder}
        </option>
        {options?.map(option => (
          <option key={String(option[keys.id])} value={String(option[keys.value])}>
            {String(option[keys.text])}
          </option>
        ))}
      </Select>
    ),
  )
}

/*
@example

import { SelectWithOptions } from "./SelectWithOptions"

// Example type for your options
type City = {
  code: string
  name: string
  population: number
}

const cities: City[] = [
  { code: "THR", name: "تهران", population: 9000000 },
  { code: "MHD", name: "مشهد", population: 3000000 },
  { code: "ESF", name: "اصفهان", population: 2000000 },
]

export default function CitySelector() {
  return (
    <SelectWithOptions<City>
      options={cities}
      keys={{
        id: "code",      // Unique identifier for React key
        value: "code",   // Value submitted with the form
        text: "name",    // What the user sees in the dropdown
      }}
      placeholder="شهر خود را انتخاب کنید"
    />
  )
}

*/
