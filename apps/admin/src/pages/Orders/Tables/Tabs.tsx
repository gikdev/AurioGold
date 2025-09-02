import { type ReactNode, useState } from "react"
import { cx } from "#/shared/cva.config"

interface TabsProps {
  tab1Title: string
  tab1Content: ReactNode

  tab2Title: string
  tab2Content: ReactNode

  btns?: ReactNode
}

export function Tabs({ tab1Content, tab1Title, tab2Content, tab2Title, btns }: TabsProps) {
  const [activeTab, setActiveTab] = useState<1 | 2>(1)

  return (
    <div className="flex-1 flex flex-col rounded-md gap-2">
      <div className="flex items-center gap-1">
        <div className="flex gap-1 me-auto">
          <Tab isActive={activeTab === 1} onClick={() => setActiveTab(1)}>
            {tab1Title}
          </Tab>
          <Tab isActive={activeTab === 2} onClick={() => setActiveTab(2)}>
            {tab2Title}
          </Tab>
        </div>

        {btns}
      </div>

      <div className="flex-1 min-h-80">
        {activeTab === 1 && tab1Content}
        {activeTab === 2 && tab2Content}
      </div>
    </div>
  )
}

interface TabProps {
  children: ReactNode
  onClick: () => void
  isActive: boolean
}

function Tab({ children, onClick, isActive }: TabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "flex items-center justify-center px-4 h-10 border-b-2 hover:text-slate-12 cursor-pointer",
        isActive ? "font-bold text-brand-10 border-current" : "border-transparent",
      )}
    >
      {children}
    </button>
  )
}
