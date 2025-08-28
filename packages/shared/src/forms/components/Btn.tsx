import { CircleNotchIcon, type Icon, PencilSimpleIcon } from "@phosphor-icons/react"
import type { ComponentProps } from "react"
import { skins } from "../skins"
import { useFormContext } from "./shared"

interface BtnProps {
  title?: string
  loadingTitle?: string
  isIconOnly?: boolean
  Icon?: Icon
  LoadingIcon?: Icon
  className?: string
  onClick?: () => void
  btnType?: ComponentProps<"button">["type"]
  testId?: string
}

export function Btn({
  title = "ثبت",
  isIconOnly = false,
  Icon = PencilSimpleIcon,
  className,
  LoadingIcon = CircleNotchIcon,
  loadingTitle = "در حال بارگذاری...",
  btnType = "button",
  onClick,
  testId,
}: BtnProps) {
  const defaultClassName = skins.btn({
    intent: "success",
    style: "filled",
    isIcon: isIconOnly,
  })

  const form = useFormContext()

  return (
    <form.Subscribe selector={s => [s.canSubmit, s.isSubmitting]}>
      {([canSubmit, isSubmitting]) => {
        const FinalIcon = isSubmitting ? LoadingIcon : Icon
        const defaultClickHandler = () => form.handleSubmit()
        const finalClickHandler = onClick ?? defaultClickHandler

        return (
          <button
            data-testid={testId}
            type={btnType}
            onClick={finalClickHandler}
            disabled={!canSubmit || isSubmitting}
            className={className || defaultClassName}
          >
            <FinalIcon />
            {!isIconOnly && <span>{isSubmitting ? loadingTitle : title}</span>}
          </button>
        )
      }}
    </form.Subscribe>
  )
}
