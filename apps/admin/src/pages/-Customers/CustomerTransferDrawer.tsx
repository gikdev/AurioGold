import { apiRequest } from "@gikdev/react-datapi/src"
import { ArrowsLeftRightIcon } from "@phosphor-icons/react"
import type {
  CustomerDto,
  PostApiMasterAddAndAcceptTransferData,
  StockDto,
} from "@repo/api-client/client"
import {
  BtnTemplates,
  DrawerSheet,
  EntityNotFoundCard,
  Input,
  Labeler,
  LabelerLine,
  Radio,
  TextArea,
  useDrawerSheet,
  useDrawerSheetNumber,
  useDrawerSheetString,
} from "@repo/shared/components"
import { createControlledAsyncToast, createFieldsWithLabels } from "@repo/shared/helpers"
import { useAtomValue } from "jotai"
import { memo } from "react"
import type { UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { useCustomForm } from "#/shared/customForm"
import genDatApiConfig from "#/shared/datapi-config"
import { customersAtom } from "."
import { QUERY_KEYS } from "./navigation"

// import { useWriteJsonToastContent } from "./useJsonToast"

const { fields, labels } = createFieldsWithLabels({
  mode: "حالت *",
  description: "توضیحات: ",
  volume: "مقدار *",
})

const customerTransferFormSchema = z.object({
  [fields.mode]: z.enum(["receive", "give"]),
  [fields.description]: z.string().nullable().default(null),
  [fields.volume]: z
    .number({
      invalid_type_error: "حتما باید عدد وارد شود!",
      required_error: "این ورودی باید حتما پر شود!",
    })
    .min(1, "مقدار وارد شده باید بیشتر از ۰ باشد!"),
})
type CustomerTransferFormValues = z.input<typeof customerTransferFormSchema>

const emptyCustomerTransferFormValues: CustomerTransferFormValues = {
  mode: "receive",
  description: "",
  volume: 0,
}

function _CustomerTransferDrawer() {
  const customers = useAtomValue(customersAtom)
  const [customerId, setCustomerId] = useDrawerSheetNumber(QUERY_KEYS.customerId)
  const [showTransferDrawer, setShowTransferDrawer] = useDrawerSheet(QUERY_KEYS.transfer)
  const [defaultMobile, setDefaultMobile] = useDrawerSheetString(QUERY_KEYS.defaultMobile)
  const [stockId, setStockId] = useDrawerSheetNumber(QUERY_KEYS.stockId)
  const customer = customers.find(c => c.id === customerId)

  const form = useCustomForm(customerTransferFormSchema, emptyCustomerTransferFormValues)
  const { formState, trigger, reset, handleSubmit } = form
  const { isSubmitting } = formState

  // const writeJsonToast = useWriteJsonToastContent()

  const isOpen =
    defaultMobile !== null && customerId !== null && showTransferDrawer && stockId !== null

  const handleClose = () => {
    setShowTransferDrawer(false)
    setCustomerId(null)
    setDefaultMobile(null)
    setStockId(null)
  }

  const onSubmit = async (data: CustomerTransferFormValues) => {
    // writeJsonToast({ ...data, customerId })

    if (customerId == null) return
    if (stockId == null) return
    if (defaultMobile == null) return

    const dataToSend = convertFormValuesToApiPayload(data, customerId, stockId, defaultMobile)

    // writeJsonToast(dataToSend)
    // return

    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال ثبت...",
      success: "با موفقیت ثبت شد!",
    })

    await apiRequest({
      config: genDatApiConfig(),
      options: {
        url: "/Master/AddAndAcceptDocs",
        method: "POST",
        body: JSON.stringify(dataToSend),
        onError: msg => reject(msg),
        onSuccess: () => {
          resolve()
          handleClose()
          reset()
        },
      },
    })
  }

  const submitTheFormManually = async () => {
    const isValid = await trigger()
    if (isValid) handleSubmit(onSubmit)()
  }

  const btns = (
    <>
      <BtnTemplates.Cancel onClick={handleClose} />
      <BtnTemplates.Save
        onClick={submitTheFormManually}
        disabled={isSubmitting}
        themeType="filled"
      />
    </>
  )

  return (
    <DrawerSheet
      onClose={handleClose}
      open={isOpen}
      title="دریافت و پرداخت طلایی"
      icon={ArrowsLeftRightIcon}
      btns={btns}
    >
      {customer === undefined ? (
        <EntityNotFoundCard entity="مشتری" />
      ) : (
        <CustomerDocForm form={form} />
      )}
    </DrawerSheet>
  )
}

const CustomerTransferDrawer = memo(_CustomerTransferDrawer)
export default CustomerTransferDrawer

////////////////////////////////////

interface CustomerDocFormProps {
  form: UseFormReturn<CustomerTransferFormValues>
}

function CustomerDocForm({ form }: CustomerDocFormProps) {
  const { formState, register } = form
  const { errors } = formState

  return (
    <form className="min-h-full flex flex-col py-4 gap-5" autoComplete="off">
      <Labeler labelText={labels.volume} errorMsg={errors.volume?.message}>
        <Input dir="ltr" type="number" {...register(fields.volume, { valueAsNumber: true })} />
      </Labeler>

      <Labeler as="div" labelText={labels.mode} errorMsg={errors.mode?.message}>
        <div className="grid grid-cols-2 gap-2">
          <LabelerLine
            labelText="دریافتی"
            className="bg-red-3 hover:bg-red-4 p-2 rounded-md cursor-pointer border border-red-7"
          >
            <Radio {...register(fields.mode)} value="receive" />
          </LabelerLine>

          <LabelerLine
            labelText="پرداختی"
            className="bg-green-3 hover:bg-green-4 p-2 rounded-md cursor-pointer border border-green-7"
          >
            <Radio {...register(fields.mode)} value="give" />
          </LabelerLine>
        </div>
      </Labeler>

      <Labeler labelText={labels.description} errorMsg={errors.description?.message}>
        <TextArea {...register(fields.description)} />
      </Labeler>
    </form>
  )
}

function convertFormValuesToApiPayload(
  values: CustomerTransferFormValues,
  customerId: NonNullable<CustomerDto["id"]>,
  stockId: NonNullable<StockDto["id"]>,
  mobile: string,
): NonNullable<Required<PostApiMasterAddAndAcceptTransferData["body"]>> {
  return {
    tyStockID: stockId,
    volume: values.mode === "give" ? values.volume : -values.volume,
    tyCustomerID: customerId,
    description: values.description ?? null,
    mobile,
  }
}
