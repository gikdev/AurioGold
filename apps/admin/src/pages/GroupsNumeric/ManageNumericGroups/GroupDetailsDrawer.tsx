import { InfoIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react"
import type { CustomerGroupIntDto } from "@repo/api-client/client"
import {
  DrawerSheet,
  EntityNotFoundCard,
  KeyValueDetail,
  KeyValueDetailsContainer,
} from "@repo/shared/components"
import { skins } from "@repo/shared/forms"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { generateLabelPropertyGetter } from "#/shared/customForm"
import { groupFormFields } from "./GroupDrawer/stuff"
import { type GroupId, numericGroupsOptions, useNumericGroupsStore } from "./shared"

interface GroupDetailsProps {
  groupId: GroupId
  onClose: () => void
}

export function GroupDetailsDrawer({ groupId, onClose }: GroupDetailsProps) {
  const { data: groups = [] } = useQuery(numericGroupsOptions)
  const group = useMemo(() => groups.find(g => g.id === groupId), [groups, groupId])

  return (
    <DrawerSheet
      open
      icon={InfoIcon}
      onClose={onClose}
      title="مشخصات گروه"
      btns={<Btns groupId={groupId} />}
    >
      {group ? <GroupDetails group={group} /> : <EntityNotFoundCard entity="گروه" />}
    </DrawerSheet>
  )
}

const Btns = ({ groupId }: { groupId: GroupId }) => (
  <>
    <button
      type="button"
      className={skins.btn({ intent: "warning" })}
      onClick={() => useNumericGroupsStore.getState().edit(groupId)}
    >
      <PencilSimpleIcon />
      <span>ویرایش</span>
    </button>

    <button
      type="button"
      className={skins.btn({ intent: "error" })}
      onClick={() => useNumericGroupsStore.getState().remove(groupId)}
    >
      <TrashIcon />
      <span>حذف</span>
    </button>
  </>
)

const getLabelProperty = generateLabelPropertyGetter(groupFormFields.labels)

const GroupDetails = ({ group }: { group: CustomerGroupIntDto }) => (
  <KeyValueDetailsContainer>
    <KeyValueDetail title={getLabelProperty("name")} value={group.name} />
    <KeyValueDetail title={getLabelProperty("description")} value={group.description} />
    <KeyValueDetail ltr title={getLabelProperty("diffBuyPrice")} value={group.diffBuyPrice} />
    <KeyValueDetail ltr title={getLabelProperty("diffSellPrice")} value={group.diffSellPrice} />
    <KeyValueDetail ltr title="آی‌دی" value={group.id} />
  </KeyValueDetailsContainer>
)
