import { DeleteGroupModal } from "./DeleteGroupModal"
import { GroupDetailsDrawer } from "./GroupDetailsDrawer"
import { GroupDrawer } from "./GroupDrawer"
import { ManagementCard } from "./ManagementCard"
import { useGramGroupsStore } from "./shared"

export function ManageGramGroups() {
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

const handleClose = () => useGramGroupsStore.getState().reset()

function GroupDetailsDrawerWrapper() {
  const groupId = useGramGroupsStore(s => s.groupId)
  const mode = useGramGroupsStore(s => s.mode)

  const shouldBeOpen = mode === "details" && typeof groupId === "number"

  return shouldBeOpen && <GroupDetailsDrawer groupId={groupId} onClose={handleClose} />
}

function DeleteGroupModalWrapper() {
  const groupId = useGramGroupsStore(s => s.groupId)
  const mode = useGramGroupsStore(s => s.mode)

  const shouldBeOpen = mode === "remove" && typeof groupId === "number"

  return shouldBeOpen && <DeleteGroupModal groupId={groupId} onClose={handleClose} />
}

function CreateGroupDrawer() {
  const mode = useGramGroupsStore(s => s.mode)

  const shouldBeOpen = mode === "create"

  return shouldBeOpen && <GroupDrawer mode="create" onClose={handleClose} />
}

function EditGroupDrawer() {
  const groupId = useGramGroupsStore(s => s.groupId)
  const mode = useGramGroupsStore(s => s.mode)

  const shouldBeOpen = mode === "edit" && typeof groupId === "number"

  return shouldBeOpen && <GroupDrawer mode="edit" onClose={handleClose} groupId={groupId} />
}
