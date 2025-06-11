import { PenIcon, PlusIcon, TrashIcon, XCircleIcon } from "@phosphor-icons/react"
import type { ComponentProps } from "react"
import { Btn } from "./Btn"

type BtnPropsOmitted = Omit<ComponentProps<typeof Btn>, "children" | "theme">

type BtnTemplateEditProps = BtnPropsOmitted
function BtnTemplateEdit({ ...other }: BtnTemplateEditProps) {
  return (
    <Btn className="flex-1" {...other} theme="warning">
      <PenIcon size={24} />
      <span>ویرایش</span>
    </Btn>
  )
}

type BtnTemplateCreateProps = BtnPropsOmitted
function BtnTemplateCreate({ ...other }: BtnTemplateCreateProps) {
  return (
    <Btn className="flex-1" {...other} theme="success">
      <PlusIcon size={24} />
      <span>ایجاد</span>
    </Btn>
  )
}

type BtnTemplateDeleteProps = BtnPropsOmitted
function BtnTemplateDelete({ ...other }: BtnTemplateDeleteProps) {
  return (
    <Btn className="flex-1" {...other} theme="error">
      <TrashIcon size={24} />
      <span>حذف</span>
    </Btn>
  )
}

type BtnTemplateCancelProps = BtnPropsOmitted
function BtnTemplateCancel({ ...other }: BtnTemplateCancelProps) {
  return (
    <Btn className="flex-1" {...other} theme="neutral">
      <XCircleIcon size={24} />
      <span>انصراف</span>
    </Btn>
  )
}

export const BtnTemplates = {
  Create: BtnTemplateCreate,
  Edit: BtnTemplateEdit,
  Cancel: BtnTemplateCancel,
  Delete: BtnTemplateDelete,
}
