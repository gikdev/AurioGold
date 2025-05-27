import { Btn, Switch, ConnectionIndicator } from "@repo/shared/components"
import { isSidebarOpenAtom } from "@repo/shared/atoms"
import { ArrowsClockwiseIcon, ListIcon } from "@phosphor-icons/react"
import { Link, useNavigate } from "react-router"
import { currentProfile } from "@repo/profile-manager"
import { styled } from "@repo/shared/helpers"
import { useAtomValue, useSetAtom } from "jotai"
import { storageManager } from "@repo/shared/adapters"
import { connectionStateAtom, isAdminOnlineAtom, onlineUsersCountAtom, useToggleAdminConnectivity } from "#/atoms"

const StyledNav = styled("nav", "flex items-center justify-between border-b border-slate-6 p-4")
const StyledAdminChip = styled(Link, "flex flex-row-reverse gap-2 items-center justify-center")

export function Nav() {
  const setSidebarOpen = useSetAtom(isSidebarOpenAtom)
  const connectionState = useAtomValue(connectionStateAtom)
  const isAdminOnline = useAtomValue(isAdminOnlineAtom)
  const onlineUsersCount = useAtomValue(onlineUsersCountAtom)
  const navigate = useNavigate()
  const toggleAdminConnectivity = useToggleAdminConnectivity()

  const displayName = storageManager.get("name", "sessionStorage") ?? "طلا فروشی ناکجاآباد"

  const ProfileWrapper = styled("div", "size-10 rounded-full relative", {
    "after:hidden after:size-4 after:rounded-full after:bg-jade-11 after:border-[2px] after:border-jade-3 after:top-0 after:start-0 after:absolute after:inline-block":
      connectionState === "connected" && isAdminOnline,
  })

  return (
    <StyledNav>
      <Link className="hidden md:inline-block" to="/">
        <img src={currentProfile.logoName} alt="" className="max-h-16" />
      </Link>
      <Btn className="w-10 p-0 flex md:hidden" onClick={() => setSidebarOpen(true)}>
        <ListIcon size={24} />
      </Btn>
      <div className="flex flex-row-reverse gap-2 items-center justify-center">
        <abbr title="عکس و نام فروشگاه" className="no-underline">
          <StyledAdminChip to="/profile">
            <ProfileWrapper>
              <img
                src={currentProfile.logoName}
                alt=""
                className="w-full h-full object-cover rounded-full"
              />
            </ProfileWrapper>
            <p className="text-sm">{displayName}</p>
          </StyledAdminChip>
        </abbr>
        <abbr title="آنلاین/آفلاین کردن فروشگاه">
          {connectionState === "connected" ? (
            <Switch onCheckedChange={toggleAdminConnectivity} checked={isAdminOnline} />
          ) : (
            <Switch onCheckedChange={() => {}} checked={false} className="animate-pulse" />
          )}
        </abbr>
        <ConnectionIndicator connectionState={connectionState} />
        <abbr title="تعداد تمام کاربران آنلاین" className="no-underline">
          {connectionState === "connected" ? (
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-jade-4 text-jade-11"
              type="button"
              onClick={() => navigate("/online-users")}
            >
              {onlineUsersCount}
            </button>
          ) : (
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-4 text-slate-11 animate-pulse"
              type="button"
            >
              -
            </button>
          )}
        </abbr>
        <a
          href={window.location.href}
          className="p-2 hover:bg-slate-3 rounded-full active:scale-90"
        >
          <ArrowsClockwiseIcon size={20} />
        </a>
      </div>
    </StyledNav>
  )
}
