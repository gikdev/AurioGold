import styled from "@master/styled.react"
import { PowerIcon, ProhibitIcon, UserCircleIcon } from "@phosphor-icons/react"
import type { CustomerDto } from "@repo/api-client"
import { skins } from "@repo/shared/forms"
import { useCustomersStore } from "../store"

export function CustomerCards({ customers }: { customers: CustomerDto[] }) {
  return (
    <CustomerCardsContainer>
      {customers.map(c => (
        <CustomerCard
          key={`${c.id}-${c.displayName}`}
          displayName={c.displayName}
          id={c.id}
          isActive={c.isActive}
          isBlocked={c.isBlocked}
        />
      ))}
    </CustomerCardsContainer>
  )
}

const CustomerCardsContainer = styled.div`flex flex-wrap gap-5 items-center justify-center`

interface CustomerCardProps {
  id: CustomerDto["id"]
  displayName: CustomerDto["displayName"]
  isBlocked: CustomerDto["isBlocked"]
  isActive: CustomerDto["isActive"]
}

function CustomerCard({ displayName, id, isActive, isBlocked }: CustomerCardProps) {
  const isBlockedTitle = `کاربر ${displayName} مسدود ${isBlocked ? "شده‌است" : "نشده‌است"}`
  const isActiveTitle = `کاربر ${displayName} فعال ${isActive ? "است" : "نیست"}`

  return (
    <button
      type="button"
      onClick={() => {
        if (typeof id !== "number") return
        useCustomersStore.getState().details(id)
      }}
      className={skins.btn({
        className: "flex flex-col w-32 bg-slate-3 p-2 items-center gap-2 text-slate-11 h-auto",
      })}
    >
      <UserCircleIcon size={32} />
      <p>{displayName}</p>

      <div className="flex items-center gap-1">
        <abbr title={isBlockedTitle} dir="rtl">
          <ProhibitIcon className={isBlocked ? "text-red-10" : "text-slate-11"} size={20} />
        </abbr>

        <abbr title={isActiveTitle} dir="rtl">
          <PowerIcon className={isActive ? "text-green-10" : "text-slate-11"} size={20} />
        </abbr>
      </div>
    </button>
  )
}
