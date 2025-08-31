import styled from "@master/styled.react"
import { ListIcon } from "@phosphor-icons/react"
import { getApiCustomerGetMasterOptions } from "@repo/api-client/tanstack"
import { currentProfile } from "@repo/profile-manager"
import { getHeaderTokenOnly } from "@repo/shared/auth"
import { Btn } from "@repo/shared/components"
import { useBooleanishQueryState } from "@repo/shared/hooks"
import { useQuery } from "@tanstack/react-query"
import { useSetAtom } from "jotai"
import { useEffect, useMemo } from "react"
import { Link } from "react-router"
import { type AdminInfo, adminInfoAtom, emptyAdminInfo } from "#/atoms"
import routes from "#/pages/routes"

const fallbackImageUrl = "/shared/fallback-400.jpg"
const StyledAdminChip = styled(Link)`
  flex gap-1 items-center justify-center
  hover:bg-slate-3 cursor-pointer p-2
  transition-colors rounded-md font-bold
`

function getProfileImageUrl(logoUrl: string | undefined | null) {
  let finalLogoUrl = logoUrl
  if (!finalLogoUrl) finalLogoUrl = fallbackImageUrl
  if (!finalLogoUrl.startsWith("http")) finalLogoUrl = `${currentProfile.apiBaseUrl}/${logoUrl}`
  return finalLogoUrl
}

export function Nav() {
  const setAdminInfo = useSetAtom(adminInfoAtom)
  const { data } = useQuery({
    ...getApiCustomerGetMasterOptions(getHeaderTokenOnly("client")),
    staleTime: 5 * 60 * 1000,
  })
  const masterInfo = useMemo(
    () => (data as { result: AdminInfo } | undefined)?.result || emptyAdminInfo,
    [data],
  )
  const [, setSidebarOpen] = useBooleanishQueryState("menu")
  const profileImageUrl = getProfileImageUrl(masterInfo.logoUrl)

  useEffect(() => {
    setAdminInfo(masterInfo)
  }, [setAdminInfo, masterInfo])

  return (
    <nav className="flex items-center justify-between p-2 rounded-md bg-slate-1">
      <StyledAdminChip to={routes.about}>
        <img
          src={profileImageUrl}
          alt=""
          className="size-6 object-cover rounded-full"
          onError={e => {
            e.currentTarget.src = fallbackImageUrl
          }}
        />

        <p>{masterInfo.name}</p>
      </StyledAdminChip>

      <Btn
        className="w-10 p-1 flex md:hidden bg-transparent hover:bg-slate-3 border-transparent"
        onClick={() => setSidebarOpen(true)}
      >
        <ListIcon size={24} />
      </Btn>
    </nav>
  )
}
