import {
  ArrowClockwiseIcon,
  CopyIcon,
  FloppyDiskIcon,
  InfoIcon,
  PenIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon,
} from "@phosphor-icons/react"
import type { ComponentProps } from "react"
import { Btn } from "./Btn"

type BtnPropsOmitted = Omit<ComponentProps<typeof Btn>, "children" | "theme"> & {
  iconSize?: number
}

type BtnTemplateEditProps = BtnPropsOmitted
function BtnTemplateEdit({ iconSize = 24, ...other }: BtnTemplateEditProps) {
  return (
    <Btn className="flex-1" {...other} theme="warning">
      <PenIcon size={iconSize} />
      <span>ویرایش</span>
    </Btn>
  )
}

type BtnTemplateCreateProps = BtnPropsOmitted
function BtnTemplateCreate({ iconSize = 24, ...other }: BtnTemplateCreateProps) {
  return (
    <Btn className="flex-1" {...other} theme="success">
      <PlusIcon size={iconSize} />
      <span>ایجاد</span>
    </Btn>
  )
}

type BtnTemplateSaveProps = BtnPropsOmitted
function BtnTemplateSave({ iconSize = 24, ...other }: BtnTemplateSaveProps) {
  return (
    <Btn className="flex-1" {...other} theme="success">
      <FloppyDiskIcon size={iconSize} />
      <span>ذخیره</span>
    </Btn>
  )
}

type BtnTemplateDeleteProps = BtnPropsOmitted
function BtnTemplateDelete({ iconSize = 24, ...other }: BtnTemplateDeleteProps) {
  return (
    <Btn className="flex-1" {...other} theme="error">
      <TrashIcon size={iconSize} />
      <span>حذف</span>
    </Btn>
  )
}

type BtnTemplateCancelProps = BtnPropsOmitted
function BtnTemplateCancel({ iconSize = 24, ...other }: BtnTemplateCancelProps) {
  return (
    <Btn className="flex-1" {...other} theme="neutral">
      <XCircleIcon size={iconSize} />
      <span>انصراف</span>
    </Btn>
  )
}

type BtnTemplateCloseProps = BtnPropsOmitted
function BtnTemplateClose({ iconSize = 24, ...other }: BtnTemplateCloseProps) {
  return (
    <Btn className="flex-1" {...other} theme="neutral">
      <XCircleIcon size={iconSize} />
      <span>بستن</span>
    </Btn>
  )
}

type BtnTemplateIconReloadProps = BtnPropsOmitted
function BtnTemplateIconReload({ iconSize = 24, ...other }: BtnTemplateIconReloadProps) {
  return (
    <Btn className="w-10 p-1" {...other} theme="neutral">
      <ArrowClockwiseIcon size={iconSize} />
    </Btn>
  )
}

type BtnTemplateIconCreateProps = BtnPropsOmitted
function BtnTemplateIconCreate({ iconSize = 24, ...other }: BtnTemplateIconCreateProps) {
  return (
    <Btn className="w-10 p-1" {...other} theme="success">
      <PlusIcon size={iconSize} />
    </Btn>
  )
}

type BtnTemplateIconEditProps = BtnPropsOmitted
function BtnTemplateIconEdit({ iconSize = 24, ...other }: BtnTemplateIconEditProps) {
  return (
    <Btn className="w-10 p-1" {...other} theme="warning">
      <PenIcon size={iconSize} />
    </Btn>
  )
}

type BtnTemplateIconDeleteProps = BtnPropsOmitted
function BtnTemplateIconDelete({ iconSize = 24, ...other }: BtnTemplateIconDeleteProps) {
  return (
    <Btn className="w-10 p-1" {...other} theme="error">
      <TrashIcon size={iconSize} />
    </Btn>
  )
}

type BtnTemplateIconInfoProps = BtnPropsOmitted
function BtnTemplateIconInfo({ iconSize = 24, ...other }: BtnTemplateIconInfoProps) {
  return (
    <Btn className="w-10 p-1" {...other} theme="info">
      <InfoIcon size={iconSize} />
    </Btn>
  )
}

type BtnTemplateIconCopyProps = BtnPropsOmitted
function BtnTemplateIconCopy({ iconSize = 24, ...other }: BtnTemplateIconCopyProps) {
  return (
    <Btn className="w-10 p-1" {...other} theme="neutral">
      <CopyIcon size={iconSize} />
    </Btn>
  )
}

export const BtnTemplates = {
  Create: BtnTemplateCreate,
  Save: BtnTemplateSave,
  Edit: BtnTemplateEdit,
  Cancel: BtnTemplateCancel,
  Close: BtnTemplateClose,
  Delete: BtnTemplateDelete,

  IconReload: BtnTemplateIconReload,
  IconCreate: BtnTemplateIconCreate,
  IconEdit: BtnTemplateIconEdit,
  IconDelete: BtnTemplateIconDelete,
  IconInfo: BtnTemplateIconInfo,
  IconCopy: BtnTemplateIconCopy,
}
