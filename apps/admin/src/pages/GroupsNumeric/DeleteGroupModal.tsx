import { apiRequest } from "@gikdev/react-datapi/src"
import { ArrowRightIcon, TrashIcon } from "@phosphor-icons/react"
import { useDrawerSheetNumber } from "@repo/shared/components"
import { Btn, Modal } from "@repo/shared/components"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import genDatApiConfig from "#/shared/datapi-config"
import { queryStateKeys } from "."

interface DeleteGroupModalProps {
  reloadGroups: () => void
}

export default function DeleteGroupModal({ reloadGroups }: DeleteGroupModalProps) {
  const [groupId, setGroupId] = useDrawerSheetNumber(queryStateKeys.delete)

  const handleClose = () => setGroupId(null)

  const handleDelete = async () => {
    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال حذف گروه...",
      success: "گروه با موفقیت حذف شد",
    })

    await apiRequest({
      config: genDatApiConfig(),
      options: {
        url: `/TyCustomerGroupIntInts/${groupId}`,
        method: "DELETE",
        onSuccess: () => resolve(),
        onError: msg => reject(msg),
        onFinally: () => {
          handleClose()
          reloadGroups()
        },
      },
    })
  }

  return (
    <Modal
      isOpen={groupId != null}
      title="حذف گروه"
      description="آیا از حذف این گروه مطمئن هستید؟"
      onClose={handleClose}
      btns={
        <>
          <Btn className="flex-1" onClick={handleClose}>
            <ArrowRightIcon size={24} />
            <span>انصراف</span>
          </Btn>

          <Btn className="flex-1" theme="error" themeType="filled" onClick={handleDelete}>
            <TrashIcon size={24} />
            <span>حذف</span>
          </Btn>
        </>
      }
    />
  )
}
