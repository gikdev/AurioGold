import { InfoIcon } from "@phosphor-icons/react"
import { useBooleanishQueryState } from "#shared/hooks"
import { Modal } from "./Modal"

interface AppInfoBtnProps {
  version: string
}

export function AppInfoBtn({ version }: AppInfoBtnProps) {
  const [isOpen, setOpen] = useBooleanishQueryState("about")

  const handleClose = () => setOpen(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hover:bg-blue-3 text-slate-11 hover:text-blue-12 px-2 h-full cursor-pointer flex items-center gap-1"
        aria-label="درباره برنامه"
        title="درباره برنامه"
      >
        <InfoIcon size={20} weight="bold" />
        <code className="relative">{version}</code>
      </button>

      <Modal title="درباره برنامه:" isOpen={isOpen} onClose={handleClose}>
        <div className="flex flex-col gap-2">
          <p>
            <strong>نسخه: </strong>
            <code className="bg-blue-2 text-blue-11 rounded-md px-2 py-1">{version}</code>
          </p>
        </div>
      </Modal>
    </>
  )
}
