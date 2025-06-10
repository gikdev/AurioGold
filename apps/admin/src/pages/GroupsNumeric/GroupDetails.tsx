import { InfoIcon, PenIcon, ReceiptXIcon, TrashIcon } from "@phosphor-icons/react"
import type { CustomerGroupDto } from "@repo/api-client/client"
import { Btn, DrawerSheet, useDrawerSheetNumber } from "@repo/shared/components"
import { Link } from "react-router"
import { KeyValueDetail, KeyValueDetailsContainer } from "#/components"
import { queryStateKeys, queryStateUrls } from "."

interface GroupDetailsProps {
  groups: CustomerGroupDto[]
}

export default function GroupDetails({ groups }: GroupDetailsProps) {
  const [groupId, setGroupId] = useDrawerSheetNumber(queryStateKeys.details)
  const group = groups.find(g => g.id === groupId)

  const btns = (
    <>
      <Btn
        as={Link}
        to={queryStateUrls.edit(groupId!)}
        theme="warning"
        className="flex-1 h-8 text-sm"
      >
        <PenIcon size={20} />
        <span>ویرایش گروه</span>
      </Btn>

      <Btn
        as={Link}
        to={queryStateUrls.delete(groupId!)}
        theme="error"
        className="flex-1 h-8 text-sm"
      >
        <TrashIcon size={20} />
        <span>حذف گروه</span>
      </Btn>
    </>
  )

  return (
    <DrawerSheet
      onClose={() => setGroupId(null)}
      open={groupId !== null}
      title="مشخصات گروه"
      icon={InfoIcon}
      btns={btns}
    >
      {group === undefined && (
        <div className="bg-red-2 border border-red-6 text-red-11 p-4 flex flex-col gap-2 items-center rounded-md">
          <ReceiptXIcon size={64} />
          <p className="text-xl font-bold text-red-12">پیدا نشد!</p>
          <p>گروه مورد نظر پیدا نشد!</p>
        </div>
      )}

      {group && (
        <KeyValueDetailsContainer>
          <KeyValueDetail title="نام" value={group.name} />
          <KeyValueDetail title="توضیحات" value={group.description} />
          <KeyValueDetail title="تفاوت خرید مشتری" value={group.diffBuyPrice} />
          <KeyValueDetail title="تفاوت فروش مشتری" value={group.diffSellPrice} />
          <KeyValueDetail title="آی‌دی گروه" value={group.id} />
        </KeyValueDetailsContainer>
      )}
    </DrawerSheet>
  )
}
