import { InfoIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react"
import type { CustomerGroupDto } from "@repo/api-client/client"
import {
  DrawerSheet,
  EntityNotFoundCard,
  KeyValueDetail,
  KeyValueDetailsContainer,
} from "@repo/shared/components"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { generateLabelPropertyGetter } from "#/shared/customForm"
import { skins } from "#/shared/forms/skins"
import { groupFormFields } from "./GroupDrawer/stuff"
import { type GroupId, gramGroupsOptions, useGramGroupsStore } from "./shared"

interface GroupDetailsProps {
  groupId: GroupId
  onClose: () => void
}

export function GroupDetailsDrawer({ groupId, onClose }: GroupDetailsProps) {
  const { data: groups = [] } = useQuery(gramGroupsOptions)
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
      onClick={() => useGramGroupsStore.getState().edit(groupId)}
    >
      <PencilSimpleIcon />
      <span>ویرایش</span>
    </button>

    <button
      type="button"
      className={skins.btn({ intent: "error" })}
      onClick={() => useGramGroupsStore.getState().remove(groupId)}
    >
      <TrashIcon />
      <span>حذف</span>
    </button>
  </>
)

const getLabelProperty = generateLabelPropertyGetter(groupFormFields.labels)

const GroupDetails = ({ group }: { group: CustomerGroupDto }) => (
  <KeyValueDetailsContainer>
    <KeyValueDetail title={getLabelProperty("name")} value={group.name} />
    <KeyValueDetail title={getLabelProperty("description")} value={group.description} />
    <KeyValueDetail ltr title={getLabelProperty("diffBuyPrice")} value={group.diffBuyPrice} />
    <KeyValueDetail ltr title={getLabelProperty("diffSellPrice")} value={group.diffSellPrice} />
    <KeyValueDetail ltr title="آی‌دی" value={group.id} />
  </KeyValueDetailsContainer>
)
