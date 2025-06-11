import {
  ArrowClockwiseIcon,
  FloppyDiskIcon,
  InfoIcon,
  PenIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon,
} from "@phosphor-icons/react"
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

type BtnTemplateSaveProps = BtnPropsOmitted
function BtnTemplateSave({ ...other }: BtnTemplateSaveProps) {
  return (
    <Btn className="flex-1" {...other} theme="success">
      <FloppyDiskIcon size={24} />
      <span>ذخیره</span>
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

type BtnTemplateIconReloadProps = BtnPropsOmitted
function BtnTemplateIconReload({ ...other }: BtnTemplateIconReloadProps) {
  return (
    <Btn className="w-10 p-1" {...other} theme="neutral">
      <ArrowClockwiseIcon size={24} />
    </Btn>
  )
}

type BtnTemplateIconCreateProps = BtnPropsOmitted
function BtnTemplateIconCreate({ ...other }: BtnTemplateIconCreateProps) {
  return (
    <Btn className="w-10 p-1" {...other} theme="success">
      <PlusIcon size={24} />
    </Btn>
  )
}

type BtnTemplateIconEditProps = BtnPropsOmitted
function BtnTemplateIconEdit({ ...other }: BtnTemplateIconEditProps) {
  return (
    <Btn className="w-10 p-1" {...other} theme="warning">
      <PenIcon size={24} />
    </Btn>
  )
}

type BtnTemplateIconDeleteProps = BtnPropsOmitted
function BtnTemplateIconDelete({ ...other }: BtnTemplateIconDeleteProps) {
  return (
    <Btn className="w-10 p-1" {...other} theme="error">
      <TrashIcon size={24} />
    </Btn>
  )
}

type BtnTemplateIconInfoProps = BtnPropsOmitted
function BtnTemplateIconInfo({ ...other }: BtnTemplateIconInfoProps) {
  return (
    <Btn className="w-10 p-1" {...other} theme="neutral">
      <InfoIcon size={24} />
    </Btn>
  )
}

export const BtnTemplates = {
  Create: BtnTemplateCreate,
  Save: BtnTemplateSave,
  Edit: BtnTemplateEdit,
  Cancel: BtnTemplateCancel,
  Delete: BtnTemplateDelete,

  IconReload: BtnTemplateIconReload,
  IconCreate: BtnTemplateIconCreate,
  IconEdit: BtnTemplateIconEdit,
  IconDelete: BtnTemplateIconDelete,
  IconInfo: BtnTemplateIconInfo,
}
