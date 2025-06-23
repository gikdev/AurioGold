import { type ChangeEvent, type InputHTMLAttributes, useEffect, useState } from "react"

interface PriceInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: number
  setValue: (val: number) => void
  maxDecimalsCount?: number
}

export default function PriceInput({
  setValue,
  value,
  maxDecimalsCount = 0,
  ...other
}: PriceInputProps) {
  const [innerValue, setInnerValue] = useState(value)
  const step = calcStep(maxDecimalsCount)

  useEffect(() => {
    setInnerValue(value)
  }, [value])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const trimmed = Number(e.target.value).toFixed(maxDecimalsCount)
    const converted = Number(trimmed)
    const isNan = Number.isNaN(converted)
    setInnerValue(isNan ? 0 : converted)
  }

  const handleBlur = () => {
    const converted = Number(innerValue)
    const isNan = Number.isNaN(converted)
    setValue(isNan ? 0 : converted)
  }

  return (
    <input
      {...other}
      dir="ltr"
      type="number"
      step={step}
      value={innerValue}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  )
}

function calcStep(maxDecimalsCount: number) {
  return maxDecimalsCount > 0
    ? `0.${Array(maxDecimalsCount - 1)
        .fill("0")
        .join("")}1`
    : undefined
}
