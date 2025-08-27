import { apiRequest } from "@gikdev/react-datapi/src"
import { ArrowsLeftRightIcon } from "@phosphor-icons/react"
import type { CustomerDto, PostApiMasterAddAndAcceptDocsData } from "@repo/api-client/client"
import {
  BtnTemplates,
  DrawerSheet,
  EntityNotFoundCard,
  FileInput,
  Input,
  Labeler,
  LabelerLine,
  Radio,
  useDrawerSheet,
  useDrawerSheetNumber,
} from "@repo/shared/components"
import { createControlledAsyncToast, createFieldsWithLabels } from "@repo/shared/helpers"
import { MAX_FILE_SIZE_FOR_UPLOAD } from "@repo/shared/lib"
import { useAtomValue } from "jotai"
import { memo } from "react"
import type { UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { uploadFile, useCustomForm } from "#/shared/customForm"
import genDatApiConfig from "#/shared/datapi-config"
import { customersAtom } from "."
import { QUERY_KEYS } from "./navigation"

// import { useWriteJsonToastContent } from "./useJsonToast"

const fileNotes = [
  FileInput.helpers.generateAllowedExtensionsNote(["png", "jpg", "jpeg", "pdf"]),
  FileInput.helpers.generateFileSizeNote(MAX_FILE_SIZE_FOR_UPLOAD),
  FileInput.helpers.generateFileTypeNote(["تصویر", "پی‌دی‌اف"]),
]

const { fields, labels } = createFieldsWithLabels({
  mode: "حالت *",
  title: "عنوان *",
  docStr: "فایل سند *",
  amount: "مقدار (ریال) *",
})

const customerDocFormSchema = z.object({
  [fields.mode]: z.enum(["receive", "give"]),
  [fields.title]: z.string().min(1, "این گزینه باید پر شود!"),
  [fields.docStr]: z.string().min(1, "باید حتما فایلی آپلود کنید!"),
  [fields.amount]: z.number().min(1, "مقدار وارد شده باید بیشتر از ۰ باشد!"),
})
type CustomerDocFormValues = z.input<typeof customerDocFormSchema>

const emptyCustomerDocFormValues: CustomerDocFormValues = {
  mode: "receive",
  title: "",
  docStr: "",
  amount: 0,
}

function _CustomerDocDrawer() {
  const customers = useAtomValue(customersAtom)
  const [customerId, setCustomerId] = useDrawerSheetNumber(QUERY_KEYS.customerId)
  const [showDocDrawer, setShowDocDrawer] = useDrawerSheet(QUERY_KEYS.doc)
  const customer = customers.find(c => c.id === customerId)

  const form = useCustomForm(customerDocFormSchema, emptyCustomerDocFormValues)
  const { formState, trigger, reset, handleSubmit } = form
  const { isSubmitting } = formState

  // const writeJsonToast = useWriteJsonToastContent()

  const handleClose = () => {
    setShowDocDrawer(false)
    setCustomerId(null)
  }

  const onSubmit = async (data: CustomerDocFormValues) => {
    // writeJsonToast({ ...data, customerId })

    if (customerId == null) return
    const dataToSend = convertFormValuesToApiPayload(data, customerId)

    // writeJsonToast(dataToSend)
    // return;

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
      open={customerId !== null && showDocDrawer}
      title="دریافت و پرداخت ریالی"
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

const CustomerDocDrawer = memo(_CustomerDocDrawer)
export default CustomerDocDrawer

////////////////////////////////////

interface CustomerDocFormProps {
  form: UseFormReturn<CustomerDocFormValues>
}

function CustomerDocForm({ form }: CustomerDocFormProps) {
  const { formState, register, setValue } = form
  const { errors } = formState

  return (
    <form className="min-h-full flex flex-col py-4 gap-5" autoComplete="off">
      <Labeler labelText={labels.title} errorMsg={errors.title?.message}>
        <Input {...register(fields.title)} />
      </Labeler>

      <Labeler as="div" labelText={labels.mode} errorMsg={errors.mode?.message}>
        <div className="grid grid-cols-2 gap-2">
          <LabelerLine
            labelText="دریافتی"
            className="bg-green-3 hover:bg-green-4 p-2 rounded-md cursor-pointer border border-green-7"
          >
            <Radio {...register(fields.mode)} value="receive" />
          </LabelerLine>

          <LabelerLine
            labelText="پرداختی"
            className="bg-red-3 hover:bg-red-4 p-2 rounded-md cursor-pointer border border-red-7"
          >
            <Radio {...register(fields.mode)} value="give" />
          </LabelerLine>
        </div>
      </Labeler>

      <FileInput
        mode="file"
        errorMsg={errors.docStr?.message}
        label={labels.docStr}
        allowedTypes={["image/jpg", "image/png", "image/jpeg", "application/pdf"]}
        notes={fileNotes}
        uploadFn={file => uploadFile(file, true)}
        onRemove={() => setValue(fields.docStr, "")}
        onUploaded={fileStr => setValue(fields.docStr, fileStr)}
      />

      <Labeler labelText={labels.amount} errorMsg={errors.amount?.message}>
        <Input dir="ltr" type="number" {...register(fields.amount, { valueAsNumber: true })} />
      </Labeler>
    </form>
  )
}

function convertFormValuesToApiPayload(
  values: CustomerDocFormValues,
  customerId: NonNullable<CustomerDto["id"]>,
): NonNullable<Required<PostApiMasterAddAndAcceptDocsData["body"]>> {
  return {
    docId: values.docStr,
    title: values.title,
    tyCustomerID: customerId,
    tyOrderID: null,
    value: values.mode === "give" ? -values.amount : values.amount,
  }
}
