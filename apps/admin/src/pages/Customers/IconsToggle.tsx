import { motion } from "motion/react"
import { cn } from "@repo/shared/helpers"
import type { Icon } from "@phosphor-icons/react"

export function createViewModes<const T extends IconsToggleItem[]>(items: T) {
  type Id = T[number]["id"]

  return {
    items,
    ids: items.map(i => i.id) as Id[],
    default: items[0].id as Id,
    type: null as unknown as Id, // for inference
  }
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
