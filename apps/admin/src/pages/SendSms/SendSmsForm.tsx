import { apiRequest, useApiRequest } from "@gikdev/react-datapi/src"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChatTextIcon } from "@phosphor-icons/react"
import type { CustomerDto, SmsMsgDto } from "@repo/api-client/client"
import { notifManager } from "@repo/shared/adapters"
import {
  Btn,
  ErrorCardBoundary,
  FormCard,
  Labeler,
  TextArea,
  createTypedTableFa,
} from "@repo/shared/components"
import { createFieldsWithLabels } from "@repo/shared/helpers"
import type { ColDef, GetRowIdFunc, SelectionChangedEvent } from "ag-grid-community"
import type { AgGridReact } from "ag-grid-react"
import { useCallback, useRef } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { multiRowSelectionOptions } from "#/shared/agGrid"
import genDatApiConfig from "#/shared/datapi-config"

const columnDefs: ColDef<CustomerDto>[] = [
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
    [fields.receivers]: z.number().array().nullable().optional(),
    [fields.toAll]: z.boolean(),
  })
  .refine(data => data.toAll === true || (data.receivers?.length ?? 0) > 0, {
    message: `باید حداقل یک گیرنده انتخاب شود یا گزینه ${labels.toAll} فعال باشد.`,
    path: [fields.toAll],
  })

type SendSmsFormData = z.infer<typeof SendSmsFormSchema>

const getRowId: GetRowIdFunc<CustomerDto> = params => (params.data as { id: number }).id.toString()

const Table = createTypedTableFa<CustomerDto>()

export default function SendSmsForm() {
  const gridRef = useRef<AgGridReact<CustomerDto>>(null)
  const customersRes = useApiRequest<CustomerDto[]>(() => ({
    url: "/Master/GetCustomers",
    defaultValue: [],
  }))

  const { reset, handleSubmit, setValue, register, formState, watch } = useForm<SendSmsFormData>({
    resolver: zodResolver(SendSmsFormSchema),
    mode: "onChange",
  })
  const { isSubmitting, errors } = formState

  const isToAll = watch(fields.toAll)

  const onSelectionChanged = useCallback(
    (event: SelectionChangedEvent) => {
      const selectedItemsIds: number[] | undefined = event.selectedNodes?.map(
        i => (i.data as { id: number }).id,
      )
      setValue(fields.receivers, selectedItemsIds ?? [])
    },
    [setValue],
  )

  async function onSubmit(data: SendSmsFormData) {
    const dataToSend: Required<SmsMsgDto> = {
      toAll: data.toAll,
      receivers: data.receivers || null,
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

  const selectAllSwitch = (
    <label className="text-xs flex gap-1 items-center ms-auto hover:bg-slate-3 py-1 px-2 rounded-sm cursor-pointer">
      <span>{labels.toAll}</span>
      <input type="checkbox" {...register(fields.toAll)} className="accent-brand-9" />
    </label>
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
          className="h-120"
          as="div"
          errorMsg={errors.receivers?.message}
          titleSlot={selectAllSwitch}
        >
          <div className="relative h-full">
            {isToAll && (
              <span className="absolute top-0 left-0 right-0 bottom-0 bg-black/75 w-full h-full block z-10" />
            )}

            <Table
              rowSelection={multiRowSelectionOptions}
              onSelectionChanged={onSelectionChanged}
              rowData={customersRes.data ?? []}
              loading={!customersRes.data}
              columnDefs={columnDefs}
              getRowId={getRowId}
              ref={gridRef}
            />
          </div>
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
