import { TrashIcon, XIcon } from "@phosphor-icons/react"
import { deleteApiTyCustomerGroupsByIdMutation } from "@repo/api-client/tanstack"
import { getHeaderTokenOnly } from "@repo/shared/auth"
import { Modal } from "@repo/shared/components"
import { skins } from "@repo/shared/forms"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type GroupId, numericGroupsOptions } from "./shared"

interface DeleteGroupModalProps {
  onClose: () => void
  groupId: GroupId
}

export function DeleteGroupModal({ groupId, onClose }: DeleteGroupModalProps) {
  const queryClient = useQueryClient()
  const { mutate: deleteGroup } = useMutation(
    deleteApiTyCustomerGroupsByIdMutation(getHeaderTokenOnly("admin")),
  )

  const handleDelete = async () => {
    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال حذف گروه...",
      success: "گروه با موفقیت حذف شد",
    })

    deleteGroup(
      { path: { id: groupId } },
      {
        onSuccess: () => {
          queryClient.setQueryData(numericGroupsOptions.queryKey, (oldGroups = []) =>
            oldGroups.filter(g => g.id !== groupId),
          )

          resolve()
          onClose()
        },
        onError: msg => reject(msg),
      },
    )
  }

  return (
    <Modal
      isOpen
      title="حذف گروه"
      description="آیا از حذف این گروه مطمئن هستید؟"
      onClose={onClose}
      btns={
        <>
          <button type="button" className={skins.btn({ style: "filled" })} onClick={onClose}>
            <XIcon />
            <span>انصراف</span>
          </button>

          <button type="button" className={skins.btn({ intent: "error" })} onClick={handleDelete}>
            <TrashIcon />
            <span>بله، حذفش کن</span>
          </button>
        </>
      }
    />
  )
}
