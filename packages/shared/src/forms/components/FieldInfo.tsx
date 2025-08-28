import { CheckIcon, CircleNotchIcon, XIcon } from "@phosphor-icons/react"
import type { AnyFieldApi } from "@tanstack/react-form"
import { parseError } from "#shared/helpers"
import { skins } from "../skins"

export function FieldInfo({ field }: { field: AnyFieldApi }) {
  const { isValid, isValidating } = field.state.meta
  const showError = !isValid

  const errorMsg = field.state.meta.errors.map(e => parseError(e, "یه مشکلی پیش اومده")).join("، ")

  if (isValidating)
    return (
      <p className={skins.hint()}>
        <CircleNotchIcon className="inline me-1 animate-spin" />
        <span>در حال بررسی...</span>
      </p>
    )

  if (showError)
    return (
      <p className={skins.errorMsg()}>
        <XIcon className="inline me-1" />
        <span>{errorMsg}</span>
      </p>
    )

  return (
    <p className="bg-green-1 text-green-10 text-xs p-1 rounded-sm">
      <CheckIcon className="inline me-1" />
      <span>صحیح</span>
    </p>
  )
}
