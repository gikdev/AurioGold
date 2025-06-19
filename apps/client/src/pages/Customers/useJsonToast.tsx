import { CaretDownIcon, CaretUpIcon, XIcon } from "@phosphor-icons/react"
import { Btn } from "@repo/shared/components"
import { atom, useAtomValue, useSetAtom } from "jotai"
import { useState } from "react"

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const jsonToastContentAtom = atom<any>()

export const useWriteJsonToastContent = () => useSetAtom(jsonToastContentAtom)

export function JsonToastContainer() {
  const [isOpen, setOpen] = useState(false)
  const [isClosed, setClosed] = useState(false)
  const jsonToastContent = useAtomValue(jsonToastContentAtom)

  if (import.meta.env.PROD || isClosed || !jsonToastContent) return

  return (
    <div
      className="fixed bottom-4 right-4 max-w-lg w-[80vw] bg-slate-2/80 backdrop-blur-md border border-slate-6 text-slate-11 rounded-md overflow-hidden font-mono z-[1000] p-2"
      dir="ltr"
    >
      <div className="flex items-center gap-2">
        <p className="font-bold text-slate-12 me-auto">Code Viewer</p>

        <Btn className="w-8 min-h-8 p-1" theme="neutral" onClick={() => setOpen(p => !p)}>
          {isOpen ? <CaretDownIcon size={20} /> : <CaretUpIcon size={20} />}
        </Btn>

        <Btn className="w-8 min-h-8 p-1" theme="neutral" onClick={() => setClosed(true)}>
          <XIcon size={20} />
        </Btn>
      </div>

      {isOpen && (
        <div className="overflow-x-auto mt-2 max-h-[60vh]">
          <pre className="text-xs whitespace-pre px-1">
            <code>{JSON.stringify(jsonToastContent, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
