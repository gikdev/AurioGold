import { CaretDownIcon, CaretUpIcon, EyeIcon, EyeSlashIcon } from "@phosphor-icons/react"
import { Btn } from "@repo/shared/components"
import { parseAsBoolean, useQueryState } from "nuqs"
import { useCallback, useState } from "react"
import { useWindowSize } from "react-haiku"
import { cn } from "#shared/helpers"

export function useIsMobile() {
  const TARGET_WIDTH = 768
  const { width } = useWindowSize()

  return width < TARGET_WIDTH
}

export function getIsMobile() {
  const TARGET_WIDTH = 768
  return window.innerWidth < TARGET_WIDTH
}

export function usePasswordEyeBtn() {
  const [arePasswordsVisible, setPasswordsVisible] = useState(false)

  const inputType = arePasswordsVisible ? "text" : "password"
  const IconToRender = arePasswordsVisible ? EyeSlashIcon : EyeIcon
  const title = arePasswordsVisible ? "پنهان کردن گذرواژه" : "نمایش گذرواژه"

  const handleClick = useCallback(() => {
    setPasswordsVisible(p => !p)
  }, [])

  const ChangePasswordVisibilityBtn = useCallback(
    () => (
      <abbr title={title} className="contents">
        <Btn onClick={handleClick} className="ms-auto p-1 w-10">
          <IconToRender size={24} />
        </Btn>
      </abbr>
    ),
    [IconToRender, handleClick, title],
  )

  return { ChangePasswordVisibilityBtn, arePasswordsVisible, inputType }
}

export function useToggleLessOrMoreBtn(defaultValue = false) {
  const [isOpen, setOpen] = useState(defaultValue)

  const IconToRender = isOpen ? CaretUpIcon : CaretDownIcon
  const title = isOpen ? "بستن" : "باز کردن"

  const handleClick = useCallback(() => {
    setOpen(p => !p)
  }, [])

  const ToggleLessOrMoreBtn = useCallback(
    ({ className }: { className?: string }) => (
      <abbr title={title} className="contents">
        <Btn onClick={handleClick} className={cn("p-1 w-10", className)}>
          <IconToRender size={24} />
        </Btn>
      </abbr>
    ),
    [IconToRender, handleClick, title],
  )

  return { ToggleLessOrMoreBtn, isOpen, setOpen }
}

export function useBooleanishQueryState(id: string) {
  const [isOpen, setOpen] = useQueryState(
    id,
    parseAsBoolean.withDefault(false).withOptions({ history: "push" }),
  )

  return [isOpen, setOpen] as const
}
