import { PlusIcon } from "@phosphor-icons/react"
import { skins } from "@repo/shared/forms"
import { HeadingLine } from "@repo/shared/layouts"

const intents = ["success", "error", "warning", "info", "primary", "neutral"] as const
const styles = ["filled", "outline"] as const
const sizes = ["small", "medium", "large"] as const

export default function Test() {
  return (
    <HeadingLine title="تست">
      <div className="flex flex-col gap-4 p-4" dir="ltr" lang="en">
        {sizes.map(size => (
          <div key={size}>
            <h3 className="mb-2 font-bold">{size}</h3>
            <div className="flex flex-wrap gap-2">
              {styles.map(style =>
                intents.map(intent => (
                  <button
                    key={`${intent}-${style}`}
                    type="button"
                    className={skins.btn({ intent, style, size, isIcon: false })}
                  >
                    <PlusIcon weight="bold" />
                    {intent} {style}
                  </button>
                )),
              )}
            </div>
          </div>
        ))}

        {sizes.map(size => (
          <div key={size}>
            <h3 className="mb-2 font-bold">{size} - iconOnly</h3>
            <div className="flex flex-wrap gap-2">
              {styles.map(style =>
                intents.map(intent => (
                  <button
                    key={`${intent}-${style}`}
                    type="button"
                    className={skins.btn({ intent, style, size, isIcon: true })}
                    title={`${intent} ${style}`}
                  >
                    <PlusIcon weight="bold" />
                  </button>
                )),
              )}
            </div>
          </div>
        ))}
      </div>
    </HeadingLine>
  )
}
