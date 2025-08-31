import { HeadingLine } from "@repo/shared/layouts"
import ManageOnlineUsers from "./ManageOnlineUsers"

export default function OnlineUsers() {
  return (
    <HeadingLine
      title="کاربران آنلاین"
      className="flex flex-col flex-1"
      containerClassName="flex flex-col flex-1"
    >
      <ManageOnlineUsers />
    </HeadingLine>
  )
}
