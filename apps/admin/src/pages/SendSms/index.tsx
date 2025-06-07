import { apiRequest, useApiRequest } from "@gikdev/react-datapi/src"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChatTextIcon } from "@phosphor-icons/react"
import type { CustomerDto, SmsMsgDto } from "@repo/api-client/client"
import { notifManager } from "@repo/shared/adapters"
import { Btn, ErrorCardBoundary, Labeler, Switch, TextArea } from "@repo/shared/components"
import { createFieldsWithLabels } from "@repo/shared/helpers"
import { HeadingLine } from "@repo/shared/layouts"
import type { GetRowIdFunc, SelectionChangedEvent } from "ag-grid-community"
import type { AgGridReact } from "ag-grid-react"
import { type ComponentProps, useCallback, useRef } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import genDatApiConfig from "#/shared/datapi-config"
import FormCard from "../Profile/FormCard"
import { TableMultiSelect } from "./table-mutliselect"

const columnDefs: ComponentProps<typeof TableMultiSelect>["columnDefs"] = [
  { field: "displayName" as never, headerName: "نام" },
  { field: "groupName" as never, headerName: "گروه گرمی" },
  { field: "groupIntName" as never, headerName: "گروه عددی" },
  { field: "mobile" as never, headerName: "موبایل" },
  { field: "codeMelli" as never, headerName: "کد ملی" },
  { field: "isActive" as never, headerName: "فعال هست؟" },
  { field: "isBlocked" as never, headerName: "مسدود کردن معامله" },
  { field: "allowedDevices" as never, headerName: "تعداد دستگاه های مجاز" },
]

const { fields, labels } = createFieldsWithLabels({
  message: "پیغام",
  receivers: "گیرنده‌ها",
  toAll: "ارسال به همه",
})

const SendSmsFormSchema = z
  .object({
    [fields.message]: z.string().min(1, { message: `پر کردن ${labels.message} الزامی‌است` }),
    [fields.receivers]: z.number().array().nullable(),
    [fields.toAll]: z.boolean(),
  })
  .refine(data => data.toAll === true || (data.receivers?.length ?? 0) > 0, {
    message: `باید حداقل یک گیرنده انتخاب شود یا گزینه ${labels.toAll} فعال باشد.`,
    path: [fields.toAll],
  })

type SendSmsFormData = z.infer<typeof SendSmsFormSchema>

const getRowId: GetRowIdFunc<unknown> = params => (params.data as { id: number }).id.toString()

export default function SendSms() {
  const gridRef = useRef<AgGridReact<CustomerDto>>(null)
  const customersRes = useApiRequest<CustomerDto[]>(() => ({
    url: "/Master/GetCustomers",
    defaultValue: [],
    onFinally: () => console.log("did this!"),
  }))

  const { reset, handleSubmit, setValue, register, formState } = useForm<SendSmsFormData>({
    resolver: zodResolver(SendSmsFormSchema),
    mode: "onChange",
  })
  const { isSubmitting, errors } = formState

  const onSelectionChanged = useCallback(
    (event: SelectionChangedEvent) => {
      const selectedItemsIds: number[] | undefined = event.selectedNodes?.map(
        i => (i.data as { id: number }).id,
      )
      setValue(fields.receivers, selectedItemsIds ?? [])
    },
    [setValue],
  )

  async function onSubmit(data: Required<SendSmsFormData>) {
    const dataToSend: Required<SmsMsgDto> = {
      toAll: data.toAll,
      receivers: data.receivers,
      message: data.message,
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
        <FormCard
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          title="ارسال پیامک"
          icon={ChatTextIcon}
        >
          {/* <label className="flex gap-2 items-center select-none cursor-pointer hover:bg-slate-3 p-1 rounded-md">
            <Switch {...register(fields.toAll)} />
            <span className="font-bold text-slate-12">{labels.toAll}</span>
          </label>
          {errors.message?.message && <p>{errors.message.message}</p>} */}
          <Btn
            type="button"
            onClick={() => {
              if (!gridRef.current) return
              gridRef.current.api.selectAll("all", "api")
            }}
          >
            انتخاب همه
          </Btn>

          <Labeler
            labelText={labels.receivers}
            className="h-100 relative"
            errorMsg={errors.receivers?.message}
          >
            <TableMultiSelect
              onSelectionChanged={onSelectionChanged}
              rowData={customersRes.data}
              columnDefs={columnDefs}
              getRowId={getRowId}
              ref={gridRef}
            />
          </Labeler>

          <Labeler labelText={labels.message} errorMsg={errors.message?.message}>
            <TextArea className="h-40" {...register(fields.message)} />
          </Labeler>

          <Btn
            className="flex gap-2 items-center font-bold"
            disabled={isSubmitting}
            themeType="filled"
            theme="primary"
            type="submit"
          >
            ارسال
          </Btn>
        </FormCard>
      </ErrorCardBoundary>
    </HeadingLine>
  )
}
