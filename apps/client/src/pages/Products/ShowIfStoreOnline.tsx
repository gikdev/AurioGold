import { WifiSlashIcon } from "@phosphor-icons/react"
import { useAtomValue } from "jotai"
import type { PropsWithChildren } from "react"
import { isAdminOnlineAtom } from "#/atoms"

export default function ShowIfStoreOnline({ children }: PropsWithChildren) {
  const isStoreOnline = useAtomValue(isAdminOnlineAtom)

  return isStoreOnline ? (
    children
  ) : (
    <div className="flex flex-col items-center text-center p-4 gap-2 bg-yellow-2 border border-yellow-6 text-yellow-11 rounded-md max-w-max mx-auto my-5">
      <WifiSlashIcon size={64} />
      <p className="font-bold text-yellow-12">فروشگاه آفلاین هست</p>
      <p className="text-xs max-w-52">
        تا وقتی که فروشگاه آنلاین نشود، نمی‌توان خرید یا فروشی انجام داد...
      </p>
    </div>
  )
}
