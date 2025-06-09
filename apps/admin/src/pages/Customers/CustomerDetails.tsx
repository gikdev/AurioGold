import {
  CaretLeftIcon,
  CheckIcon,
  InfoIcon,
  PenIcon,
  ReceiptXIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react"
import type { CustomerDto } from "@repo/api-client/client"
import { Btn, DrawerSheet, useDrawerSheetNumber } from "@repo/shared/components"
import { Link } from "react-router"
import { queryStateKeys } from "."
import routes from "../routes"

interface CustomerDetailsProps {
  customers: CustomerDto[]
}

export default function CustomerDetails({ customers }: CustomerDetailsProps) {
  const [customerId, setCustomerId] = useDrawerSheetNumber(queryStateKeys.details)
  const customer = customers.find(c => c.id === customerId)

  const btns = (
    <>
      <Btn
        as={Link}
        to={routes.customers_editById(customerId!)}
        theme="warning"
        className="flex-1 h-8 text-sm"
      >
        <PenIcon size={20} />
        <span>ویرایش مشتری</span>
      </Btn>

      <Btn
        as={Link}
        to={routes.customers_deleteById(customerId!)}
        theme="error"
        className="flex-1 h-8 text-sm"
      >
        <TrashIcon size={20} />
        <span>حذف مشتری</span>
      </Btn>
    </>
  )

  return (
    <DrawerSheet
      onClose={() => setCustomerId(null)}
      open={customerId !== null}
      title="مشخصات مشتری"
      icon={InfoIcon}
      btns={btns}
    >
      {customer === undefined && (
        <div className="bg-red-2 border border-red-6 text-red-11 p-4 flex flex-col gap-2 items-center rounded-md">
          <ReceiptXIcon size={64} />
          <p className="text-xl font-bold text-red-12">پیدا نشد!</p>
          <p>مشتری مورد نظر پیدا نشد!</p>
        </div>
      )}
      {customer && (
        <div className="flex flex-col gap-3" data-testid="customer-details-section">
          <KeyValueDetail title="آی‌دی حساب‌داری" value={customer.accountingID} />
          <KeyValueDetail title="آدرس" value={customer.address} />
          <KeyValueDetail title="تعداد دستگاه‌های مجاز" value={customer.allowedDevices} />
          <KeyValueDetail title="شهر" value={customer.city} />
          <KeyValueDetail title="کد ملی" value={customer.codeMelli} />
          <KeyValueDetail title="دستگاه‌های متصل" value={customer.connectedDevices} />
          <KeyValueDetail title="نام" value={customer.displayName} />
          <KeyValueDetail title="آی‌دی گروه گرمی" value={customer.groupID} />
          <KeyValueDetail title="نام گروه گرمی" value={customer.groupName} />
          <KeyValueDetail title="آی‌دی گروه عددی" value={customer.groupIntID} />
          <KeyValueDetail title="نام گروه عددی" value={customer.groupIntName} />
          <KeyValueDetail title="آی‌دی مشتری" value={customer.id} />
          <KeyValueDetail title="فعال هست؟" value={customer.isActive} />
          <KeyValueDetail title="مسدود است؟" value={customer.isBlocked} />
          <KeyValueDetail title="آی‌دی کسب" value={customer.kasbsID} />
          <KeyValueDetail title="آی‌دی ملی" value={customer.melliID} />
          <KeyValueDetail title="آی‌دی مستر" value={customer.masterID} />
          <KeyValueDetail title="موبایل" value={customer.mobile} />
        </div>
      )}
    </DrawerSheet>
  )
}

interface KeyValueDetailProps {
  title: string
  value: number | string | null | undefined | boolean
}

function KeyValueDetail({ title: key, value }: KeyValueDetailProps) {
  return (
    <p className="flex items-center justify-between hover:bg-slate-2 p-2 rounded-md">
      <span className="font-bold inline-flex gap-1 items-center">
        <CaretLeftIcon />
        <span>{key}:</span>
      </span>

      <span className="">
        <RenderAValue value={value} />
      </span>
    </p>
  )
}

interface RenderAValueProps {
  value: unknown
}

function RenderAValue({ value }: RenderAValueProps) {
  if (value == null || value === undefined || value === "") return "-"
  if (typeof value === "string") return value
  if (typeof value === "number") return value
  if (typeof value === "object") return JSON.stringify(value)
  if (typeof value === "boolean" && value.toString() === "false")
    return <XIcon size={24} className="text-red-10" />
  if (typeof value === "boolean" && value.toString() === "true")
    return <CheckIcon size={24} className="text-green-10" />

  return "?؟?"
}
