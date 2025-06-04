import { type ReactNode, useState } from "react"

interface VersionTagProps {
  children: ReactNode
}

export function VersionTag({ children }: VersionTagProps) {
  const [isOn, setOn] = useState(false)

  const classes = `
    fixed bottom-5 font-[monospace] opacity-50 cursor-pointer
    bg-blue-3 text-blue-11 px-2 py-1
    hover:opacity-100 active:scale-90 hover:text-lg transition-all 
    ${isOn ? "end-5" : "start-5"}
  `

  return (
    <button type="button" dir="ltr" onClick={() => setOn(p => !p)} className={classes}>
      {children}
    </button>
  )
}
