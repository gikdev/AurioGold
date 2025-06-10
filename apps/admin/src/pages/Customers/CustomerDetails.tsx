import { InfoIcon, PenIcon, ReceiptXIcon, TrashIcon } from "@phosphor-icons/react"
import type { CustomerDto } from "@repo/api-client/client"
import { Btn, DrawerSheet, useDrawerSheetNumber } from "@repo/shared/components"
import { Link } from "react-router"
import { KeyValueDetail, KeyValueDetailsContainer } from "#/components"
import { queryStateKeys, queryStateUrls } from "."

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
        to={queryStateUrls.edit(customerId!)}
        theme="warning"
        className="flex-1 h-8 text-sm"
      >
        <PenIcon size={20} />
        <span>ویرایش مشتری</span>
      </Btn>

      <Btn
        as={Link}
        to={queryStateUrls.delete(customerId!)}
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
        <KeyValueDetailsContainer
          className="flex flex-col gap-3"
          data-testid="customer-details-section"
        >
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
        </KeyValueDetailsContainer>
      )}
    </DrawerSheet>
  )
}
