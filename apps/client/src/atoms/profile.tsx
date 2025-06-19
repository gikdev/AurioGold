import { useApiRequest } from "@gikdev/react-datapi/src"
import type { CustomerLoginModel } from "@repo/api-client/client"
import { useAtom, useSetAtom } from "jotai"
import { atom } from "jotai"
import { useCallback, useRef } from "react"

export const emptyProfile: Required<CustomerLoginModel> = {
  userID: 0,
  customerID: 0,
  masterID: null,
  username: null,
  displayName: null,
  mobile: null,
  codeMelli: null,
  address: null,
  city: null,
  groupID: null,
  melliID: null,
  kasbsID: null,
  diffBuyPrice: 0,
  diffSellPrice: 0,
  diffBuyPriceInt: 0,
  diffSellPriceInt: 0,
  isActive: false,
  isBlock: false,
  ttkk: null,
}
export const profileAtom = atom<Required<CustomerLoginModel>>(emptyProfile)
export const useProfileAtom = () => useAtom(profileAtom)

export function useGetProfileUpdater() {
  const permissionRef = useRef(false)
  const setProfile = useSetAtom(profileAtom)

  const res = useApiRequest<Required<CustomerLoginModel>>(() => ({
    endpoint: "/Customer/GetProfile",
    defaultValue: emptyProfile,
    permissionGiver: () => !!permissionRef.current,
    onSuccess: data => setProfile(data),
  }))

  const reload = useCallback(() => {
    permissionRef.current = true
    res.reload()
  }, [res.reload])

  return reload
}
