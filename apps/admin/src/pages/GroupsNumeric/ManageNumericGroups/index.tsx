import { DeleteGroupModal } from "./DeleteGroupModal"
import { GroupDetailsDrawer } from "./GroupDetailsDrawer"
import { GroupDrawer } from "./GroupDrawer"
import { ManagementCard } from "./ManagementCard"
import { useNumericGroupsStore } from "./shared"

export function ManageNumericGroups() {
  return (
    <>
      <ManagementCard />
      <GroupDetailsDrawerWrapper />
      <DeleteGroupModalWrapper />
      <CreateGroupDrawer />
      <EditGroupDrawer />
    </>
  )
}

const handleClose = () => useNumericGroupsStore.getState().reset()

function GroupDetailsDrawerWrapper() {
  const groupId = useNumericGroupsStore(s => s.groupId)
  const mode = useNumericGroupsStore(s => s.mode)

  const shouldBeOpen = mode === "details" && typeof groupId === "number"

  return shouldBeOpen && <GroupDetailsDrawer groupId={groupId} onClose={handleClose} />
}

function DeleteGroupModalWrapper() {
  const groupId = useNumericGroupsStore(s => s.groupId)
  const mode = useNumericGroupsStore(s => s.mode)

  const shouldBeOpen = mode === "remove" && typeof groupId === "number"

  return shouldBeOpen && <DeleteGroupModal groupId={groupId} onClose={handleClose} />
}

function CreateGroupDrawer() {
  const mode = useNumericGroupsStore(s => s.mode)

  const shouldBeOpen = mode === "create"

  return shouldBeOpen && <GroupDrawer mode="create" onClose={handleClose} />
}

function EditGroupDrawer() {
  const groupId = useNumericGroupsStore(s => s.groupId)
  const mode = useNumericGroupsStore(s => s.mode)

  const shouldBeOpen = mode === "edit" && typeof groupId === "number"

  return shouldBeOpen && <GroupDrawer mode="edit" onClose={handleClose} groupId={groupId} />
}
