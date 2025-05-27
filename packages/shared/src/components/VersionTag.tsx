import { type ReactNode, useState } from "react"
import { styled } from "#shared/helpers"

interface VersionTagProps {
  children: ReactNode
}

export function VersionTag({ children }: VersionTagProps) {
  const [isOn, setOn] = useState(false)

  const StyledBtn = styled(
    "button",
    `
      fixed bottom-5 font-[monospace] opacity-50 cursor-pointer
      bg-blue-3 text-blue-11 px-2 py-1
      hover:opacity-100 active:scale-90 hover:text-lg transition-all 
      ${isOn ? "end-5" : "start-5"}
    `,
  )

  return (
    <StyledBtn type="button" dir="ltr" onClick={() => setOn(p => !p)}>
      {children}
    </StyledBtn>
  )
}
