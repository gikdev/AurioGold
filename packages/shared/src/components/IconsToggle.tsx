import { CardsIcon, type Icon, TableIcon } from "@phosphor-icons/react"
import { cn } from "@repo/shared/helpers"
import { motion } from "motion/react"
import { atomWithStorage } from "jotai/utils"
import { useAtom, useAtomValue } from "jotai"

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
    <div className="inline-flex items-center bg-slate-3 rounded-md overflow-clip">
      {items.map(({ id, icon: Icon }) => {
        const isActive = id === activeItemId

        return (
          <motion.button
            key={id}
            onClick={() => onChange(id)}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className={cn(
              "w-10 h-10 flex items-center justify-center transition-colors cursor-pointer",
              isActive ? "bg-blue-9 text-blue-1" : "bg-transparent text-blue-11 hover:bg-blue-4",
            )}
          >
            <Icon size={24} weight={isActive ? "fill" : "regular"} />
          </motion.button>
        )
      })}
    </div>
  )
}
