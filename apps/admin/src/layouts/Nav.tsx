import styled from "@master/styled.react"
import { ListIcon } from "@phosphor-icons/react"
import { currentProfile } from "@repo/profile-manager"
import { storageManager } from "@repo/shared/adapters"
import { Btn } from "@repo/shared/components"
import { useBooleanishQueryState } from "@repo/shared/hooks"
import { useAtomValue } from "jotai"
import { Link } from "react-router"
import { connectionStateAtom, isAdminOnlineAtom } from "#/atoms"
import routes from "#/pages/routes"

const StyledAdminChip = styled(Link)`flex flex-row-reverse gap-2 items-center justify-center`

export function Nav() {
  const connectionState = useAtomValue(connectionStateAtom)
  const isAdminOnline = useAtomValue(isAdminOnlineAtom)
  const [, setSidebarOpen] = useBooleanishQueryState("menu")

  const displayName = storageManager.get("name", "sessionStorage") ?? "طلا فروشی ناکجاآباد"

  const ProfileWrapper = styled.span("size-10 rounded-full relative", {
    "after:hidden after:size-4 after:rounded-full after:bg-jade-11 after:border-[2px] after:border-jade-3 after:top-0 after:start-0 after:absolute after:inline-block":
      connectionState === "connected" && isAdminOnline,
  })

  return (
    <nav className="h-16 flex items-center justify-between p-2 rounded-md bg-slate-1">
      <Link className="hidden md:inline-block" to="/">
        <img src={currentProfile.logoName} alt="" className="max-h-16" />
      </Link>

      <Btn className="w-10 p-0 flex md:hidden" onClick={() => setSidebarOpen(true)}>
        <ListIcon size={24} />
      </Btn>

      <div className="flex flex-row-reverse gap-2 items-center justify-center">
        <abbr title="عکس و نام فروشگاه" className="no-underline">
          <StyledAdminChip to={routes.profile}>
            <ProfileWrapper>
              <img
                src={currentProfile.logoName}
                alt=""
                className="w-full h-full object-cover rounded-full"
                onError={e => {
                  e.currentTarget.src = "https://placehold.co/200"
                }}
              />
            </ProfileWrapper>
            <p className="text-sm">{displayName}</p>
          </StyledAdminChip>
        </abbr>
      </div>
    </nav>
  )
}
