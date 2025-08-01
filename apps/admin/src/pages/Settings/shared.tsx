import { apiRequest } from "@gikdev/react-datapi/src"
import type { Ufm } from "@repo/api-client/client"
import { notifManager } from "@repo/shared/adapters"
import { BtnTemplates } from "@repo/shared/components"
import { motionPresets } from "@repo/shared/lib"
import { AnimatePresence, motion } from "motion/react"
import { memo } from "react"
import genDatApiConfig from "#/shared/datapi-config"

export interface MasterInfo {
  userID: never
  masterID: never
  username: never
  name: string
  rulls: string | null
  aboutUs: string | null
  mainPage: string | null
  logoUrl: string | null
  status: number
  ttkk: never
}

export function saveKey(key: string, content: string, cb: () => void) {
  const dataToSend: Ufm = {
    dataVal: [{ key, val: content }],
  }

  apiRequest({
    config: genDatApiConfig(),
    options: {
      url: "/Master/UpdateF",
      body: JSON.stringify(dataToSend),
      method: "POST",
      onSuccess: () => {
        cb?.()
        notifManager.notify("با موفقیت ذخیره شد", "toast", { status: "success" })
      },
    },
  })
}

export const MemoizedAnimatedReloadBtn = memo(function ReloadBtn({
  onClick,
}: {
  onClick: () => void
}) {
  return (
    <AnimatePresence initial>
      <motion.div {...motionPresets.slideBehind}>
        <BtnTemplates.IconReload onClick={onClick} />
      </motion.div>
    </AnimatePresence>
  )
})
