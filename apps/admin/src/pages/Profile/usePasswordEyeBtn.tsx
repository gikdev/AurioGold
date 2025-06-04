import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react"
import { Btn } from "@repo/shared/components"
import { useCallback, useState } from "react"

export default function usePasswordEyeBtn() {
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
