import { InfoIcon, ReceiptXIcon } from "@phosphor-icons/react"
import type { CustomerGroupDto } from "@repo/api-client/client"
import { BtnTemplates, DrawerSheet, useDrawerSheetNumber } from "@repo/shared/components"
import { Link } from "react-router"
import { KeyValueDetail, KeyValueDetailsContainer } from "#/components"
import { generateLabelPropertyGetter } from "#/shared/customForm"
import { queryStateKeys, queryStateUrls } from "."
import { groupFormFields } from "./groupFormShared"

interface GroupDetailsProps {
  groups: CustomerGroupDto[]
}

const getLabelProperty = generateLabelPropertyGetter(groupFormFields.labels)

export default function GroupDetails({ groups }: GroupDetailsProps) {
  const [groupId, setGroupId] = useDrawerSheetNumber(queryStateKeys.details)
  const group = groups.find(g => g.id === groupId)

  const btns = (
    <>
      <BtnTemplates.Edit as={Link} to={queryStateUrls.edit(groupId!)} />
      <BtnTemplates.Delete as={Link} to={queryStateUrls.delete(groupId!)} />
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
          <KeyValueDetail title={getLabelProperty("name")} value={group.name} />
          <KeyValueDetail title={getLabelProperty("description")} value={group.description} />
          <KeyValueDetail ltr title={getLabelProperty("diffBuyPrice")} value={group.diffBuyPrice} />
          <KeyValueDetail
            ltr
            title={getLabelProperty("diffSellPrice")}
            value={group.diffSellPrice}
          />
          <KeyValueDetail ltr title="آی‌دی" value={group.id} />
        </KeyValueDetailsContainer>
      )}
    </DrawerSheet>
  )
}
