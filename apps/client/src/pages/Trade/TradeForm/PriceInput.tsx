import { useState } from "react"

interface PriceInputProps {
  value: number
  setValue: (val: number) => void
  className?: string
}

export default function PriceInput({ setValue, value, className }: PriceInputProps) {
  const [innerValue, setInnerValue] = useState(value.toString())

  return (
    <input
      dir="ltr"
      type="text"
      value={innerValue}
      className={className}
      onChange={e => setInnerValue(e.target.value)}
      onBlur={() => {
        const converted = Number(innerValue)
        setValue(Number.isNaN(converted) ? 0 : converted)
      }}
    />
  )
}
