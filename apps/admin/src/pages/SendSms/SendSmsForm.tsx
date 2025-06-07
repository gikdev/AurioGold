import { apiRequest, useApiRequest } from "@gikdev/react-datapi/src"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChatTextIcon, CheckSquareOffsetIcon } from "@phosphor-icons/react"
import type { CustomerDto, SmsMsgDto } from "@repo/api-client/client"
import { notifManager } from "@repo/shared/adapters"
import { Btn, ErrorCardBoundary, Labeler, TextArea } from "@repo/shared/components"
import { createFieldsWithLabels } from "@repo/shared/helpers"
import type { ColDef, GetRowIdFunc, SelectionChangedEvent } from "ag-grid-community"
import type { AgGridReact } from "ag-grid-react"
import { useCallback, useRef } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import genDatApiConfig from "#/shared/datapi-config"
import FormCard from "../Profile/FormCard"
import { TableMultiSelect } from "./table-mutliselect"

const columnDefs: ColDef[] = [
  { field: "displayName", headerName: "نام" },
  { field: "groupName", headerName: "گروه گرمی" },
  { field: "groupIntName", headerName: "گروه عددی" },
  { field: "mobile", headerName: "موبایل" },
  { field: "codeMelli", headerName: "کد ملی" },
  { field: "isActive", headerName: "فعال هست؟" },
  { field: "isBlocked", headerName: "مسدود کردن معامله" },
  { field: "allowedDevices", headerName: "تعداد دستگاه های مجاز" },
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

export default function SendSmsForm() {
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

  const selectAll = useCallback(() => {
    gridRef.current?.api.selectAll("all")
  }, [])

  const selectAllBtn = (
    <Btn type="button" className="ms-auto text-xs px-2 h-8" theme="info" onClick={selectAll}>
      <CheckSquareOffsetIcon size={16} />
      <span>انتخاب همه</span>
    </Btn>
  )

  return (
    <ErrorCardBoundary>
      <FormCard
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        title="ارسال پیامک"
        icon={ChatTextIcon}
      >
        <Labeler
          labelText={labels.receivers}
          className="h-120 relative"
          as="div"
          errorMsg={errors.receivers?.message}
          titleSlot={selectAllBtn}
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
  )
}
