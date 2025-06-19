import { InfoIcon } from "@phosphor-icons/react"
import type { CustomerGroupDto } from "@repo/api-client/client"
import {
  BtnTemplates,
  DrawerSheet,
  EntityNotFoundCard,
  KeyValueDetail,
  KeyValueDetailsContainer,
  useDrawerSheetNumber,
} from "@repo/shared/components"
import { Link } from "react-router"
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
      {group === undefined && <EntityNotFoundCard entity="گروه" />}

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
