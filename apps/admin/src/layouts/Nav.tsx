import styled from "@master/styled.react"
import { ListIcon } from "@phosphor-icons/react"
import { currentProfile } from "@repo/profile-manager"
import { storageManager } from "@repo/shared/adapters"
import { Btn } from "@repo/shared/components"
import { useBooleanishQueryState } from "@repo/shared/hooks"
import { Link } from "react-router"
import routes from "#/pages/routes"

const fallbackImageUrl = "/shared/fallback-400.jpg"
const StyledAdminChip = styled(Link)`
  flex gap-1 items-center justify-center
  hover:bg-slate-3 cursor-pointer p-2
  transition-colors rounded-md font-bold
`

function getProfileImageUrl() {
  const logoUrl = storageManager.get("logoUrl", "sessionStorage")
  let finalLogoUrl = logoUrl
  if (!finalLogoUrl) finalLogoUrl = fallbackImageUrl
  if (!finalLogoUrl.startsWith("http")) finalLogoUrl = `${currentProfile.apiBaseUrl}/${logoUrl}`
  return finalLogoUrl
}

export function Nav() {
  const [, setSidebarOpen] = useBooleanishQueryState("menu")
  const displayName = storageManager.get("name", "sessionStorage") ?? "طلا فروشی ناکجاآباد"
  const profileImageUrl = getProfileImageUrl()

  return (
    <nav className="flex items-center justify-between p-2 rounded-md bg-slate-1">
      <StyledAdminChip to={routes.profile}>
        <img
          src={profileImageUrl}
          alt=""
          className="size-6 object-cover rounded-full"
          onError={e => {
            e.currentTarget.src = fallbackImageUrl
          }}
        />

        <p>{displayName || "---"}</p>
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
