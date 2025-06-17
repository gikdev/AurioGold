import { CardsIcon, type Icon, TableIcon } from "@phosphor-icons/react"
import { cn } from "@repo/shared/helpers"
import { useAtom, useAtomValue } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { motion } from "motion/react"
import { Btn } from "./Btn"

type ViewMode = "cards" | "table"

const viewModeAtom = atomWithStorage<ViewMode>("VIEW_MODE", "cards")

export function useViewModes() {
  const modes: IconsToggleItem<ViewMode>[] = [
    { id: "cards", icon: CardsIcon },
    { id: "table", icon: TableIcon },
  ]

  const [viewMode, setMode] = useAtom(viewModeAtom)

  const renderedIconsToggle = (
    <IconsToggle items={modes} activeItemId={viewMode} onChange={setMode} />
  )

  return { renderedIconsToggle, viewMode }
}

export function useCurrentViewMode() {
  const viewMode = useAtomValue(viewModeAtom)

  return viewMode
}

export const ViewModesToggle = () => {
  const [viewMode, setMode] = useAtom(viewModeAtom)
  const modes: IconsToggleItem<ViewMode>[] = [
    { id: "cards", icon: CardsIcon },
    { id: "table", icon: TableIcon },
  ]

  return <IconsToggle items={modes} activeItemId={viewMode} onChange={setMode} />
}

export interface IconsToggleItem<T extends string = string> {
  id: T
  icon: Icon
}

interface IconsToggleProps<T extends string = string> {
  items: IconsToggleItem<T>[]
  activeItemId: T
  onChange: (id: T) => void
}

export function IconsToggle<T extends string = string>({
  items,
  activeItemId,
  onChange,
}: IconsToggleProps<T>) {
  return (
    <div className="inline-flex items-center bg-slate-3 rounded-md overflow-hidden">
      {items.map(({ id, icon: Icon }) => {
        const isActive = id === activeItemId

        return (
          <Btn
            key={id}
            onClick={() => onChange(id)}
            className="w-10 p-1 rounded-none border-none"
            theme={isActive ? "info" : "neutral"}
          >
            <Icon size={24} weight={isActive ? "fill" : "regular"} />
          </Btn>
        )
      })}
    </div>
  )
}
