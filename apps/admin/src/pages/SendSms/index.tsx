import { apiRequest, useApiRequest } from "@gikdev/react-datapi/src"
import { zodResolver } from "@hookform/resolvers/zod"
import type { CustomerDto, SmsMsgDto } from "@repo/api-client/client"
import { notifManager } from "@repo/shared/adapters"
import { Btn, ErrorCardBoundary, Labeler, Switch, TextArea } from "@repo/shared/components"
import { HeadingLine } from "@repo/shared/layouts"
import type { SelectionChangedEvent } from "ag-grid-community"
import { type ComponentProps, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import genDatApiConfig from "#/shared/datapi-config"
import { TableMutliSelect } from "./table-mutliselect"

const columnDefs: ComponentProps<typeof TableMutliSelect>["columnDefs"] = [
  { field: "displayName" as never, headerName: "نام" },
  { field: "groupName" as never, headerName: "گروه گرمی" },
  { field: "groupIntName" as never, headerName: "گروه عددی" },
  { field: "mobile" as never, headerName: "موبایل" },
  { field: "codeMelli" as never, headerName: "کد ملی" },
  { field: "isActive" as never, headerName: "فعال هست؟" },
  { field: "isBlocked" as never, headerName: "مسدود کردن معامله" },
  { field: "allowedDevices" as never, headerName: "تعداد دستگاه های مجاز" },
]

const SendSmsFormSchema = z.object({
  smsText: z.string().min(1, { message: "پر کردن این ورودی الزامی‌است" }),
})
type SendSmsFormData = z.infer<typeof SendSmsFormSchema>

export default function SendSms() {
  const [toAll, setAll] = useState(false)
  const [userIds, setUserIds] = useState<number[]>([])
  const customersRes = useApiRequest<CustomerDto[]>(() => ({
    url: "/Master/GetCustomers",
    defaultValue: [],
    onFinally: () => console.log("did this!"),
  }))
  const { reset, register, handleSubmit, formState } = useForm<SendSmsFormData>({
    resolver: zodResolver(SendSmsFormSchema),
  })
  const { errors, isSubmitting } = formState

  useEffect(() => {
    console.log("userIds", userIds)
  }, [userIds])

  function onSelectionChanged(event: SelectionChangedEvent<Required<CustomerDto>>) {
    const selectedItems = event.api.getSelectedRows()
    setUserIds(selectedItems.map(i => i.id))
  }

  async function onSubmit(data: Required<SendSmsFormData>) {
    const dataToSend: Required<SmsMsgDto> = {
      toAll,
      receivers: userIds,
      message: data.smsText,
    }

    await apiRequest({
      config: genDatApiConfig(),
      options: {
        method: "POST",
        url: "/Master/sms/broadcast",
        body: JSON.stringify(dataToSend),
        onSuccess: () => {
          notifManager.notify("با موفقیت انجام شد", "toast", { status: "success" })
          reset()
        },
      },
    })
  }

  return (
    <HeadingLine title="ارسال پیامک" className="flex flex-col gap-8">
      <ErrorCardBoundary>
        <div className="h-[40rem] relative">
          {toAll && (
            <div className="absolute bg-slate-1/50 top-0 bottom-0 right-0 left-0 w-auto h-auto z-40 rounded-lg" />
          )}

          <TableMutliSelect
            onSelectionChanged={
              onSelectionChanged as ComponentProps<typeof TableMutliSelect>["onSelectionChanged"]
            }
            rowData={customersRes.data}
            columnDefs={columnDefs}
          />
        </div>

        <form
          className="flex flex-col gap-5 max-w-[40rem] w-full xl:max-w-auto mx-auto xl:mx-0 p-5 bg-slate-2 rounded-md border border-slate-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label className="flex gap-2 items-center select-none cursor-pointer hover:bg-slate-3 p-1 rounded-md">
            <Switch checked={toAll} onCheckedChange={setAll} />
            <span>ارسال به تمام کاربران</span>
          </label>

          {!toAll && userIds.length === 0 && (
            <p className="text-red-10 text-xs">
              لطفا حداقل یه کاربر انتخاب کنید یا گزینه «ارسال به تمام کاربران» را انتخاب کنید
            </p>
          )}

          <Labeler labelText="پیغام" errorMsg={errors?.smsText?.message}>
            <TextArea className="h-40" {...register("smsText")} />
          </Labeler>

          <p className="text-red-10 text-xs">{errors.root?.message}</p>

          <Btn
            className="flex gap-2 items-center font-bold"
            disabled={isSubmitting}
            themeType="filled"
            theme="primary"
            type="submit"
          >
            ارسال
          </Btn>
        </form>
      </ErrorCardBoundary>
    </HeadingLine>
  )
}
