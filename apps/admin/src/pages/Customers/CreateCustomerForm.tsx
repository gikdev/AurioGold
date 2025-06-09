import { apiRequest, useApiRequest } from "@gikdev/react-datapi/src"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRightIcon, UserPlusIcon } from "@phosphor-icons/react"
import type {
  CustomerGroupDto,
  CustomerGroupIntDto,
  OutFileModel,
  PostApiMasterAddCustomerData,
} from "@repo/api-client/client"
import {
  Btn,
  DrawerSheet,
  FileInput,
  Input,
  Labeler,
  LabelerLine,
  Switch,
  type UploadResult,
  createSelectWithOptions,
  useDrawerSheet,
} from "@repo/shared/components"
import { createControlledAsyncToast, createFieldsWithLabels } from "@repo/shared/helpers"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { v4 as uuid } from "uuid"
import { z } from "zod"
import genDatApiConfig from "#/shared/datapi-config"
import { queryStateKeys } from "."

const imageNotes = [
  FileInput.helpers.generateAllowedExtensionsNote(["png", "jpg", "jpeg"]),
  FileInput.helpers.generateFileSizeNote(5),
  FileInput.helpers.generateFileTypeNote("تصویر"),
]

const convertPersianToEnglish = (str: string) => {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹"
  const englishDigits = "0123456789"

  return str.replace(/[۰-۹]/g, char => englishDigits[persianDigits.indexOf(char)])
}

const { fields, labels } = createFieldsWithLabels({
  displayName: "نام کامل *",
  phone: "شماره تلفن *",
  nationalId: "کد ملی: ",
  city: "شهر: ",
  address: "آدرس: ",
  maxAllowedDevices: "تعداد دستگاه‌های هم‌زمان مجاز *",
  groupId: "گروه مشتری گرمی *",
  numericGroupId: "گروه مشتری عددی *",
  nationalCard: "کارت ملی: ",
  businessLicense: "جواز کسب: ",
  isActive: "فعال هست: ",
  isBlocked: "معامله مسدود شود: ",
  password: "گذرواژه *",
  passwordRepeat: "تکرار گذرواژه *",
  accountingId: "آی‌دی حساب‌داری: ",
})

const iranianPhoneRegex = /^09\d{9}$/
const onlyDigits = /^\d*$/

const commonErrors = {
  required_error: "این ورودی باید پر شود",
  invalid_type_error: "مقدار واردشده معتبر نیست",
}
const errMsgThisShouldBeChosen = "این گزینه باید انتخاب شده باشد"

const CreateCustomerSchema = z
  .object({
    [fields.displayName]: z.string(commonErrors).min(1, { message: commonErrors.required_error }),
    [fields.phone]: z
      .string(commonErrors)
      .transform(convertPersianToEnglish)
      .pipe(
        z
          .string()
          .regex(
            iranianPhoneRegex,
            `${commonErrors.invalid_type_error} (باید فقط شامل اعداد باشد و ۱۱ رقم باشد و با ۰۹ شروع شود)`,
          ),
      ),
    [fields.nationalId]: z
      .string(commonErrors)
      .transform(convertPersianToEnglish)
      .pipe(z.string().regex(onlyDigits, commonErrors.invalid_type_error))
      .nullable()
      .default(null),
    [fields.accountingId]: z.string().nullable().default(null),
    [fields.passwordRepeat]: z.string(commonErrors),
    [fields.password]: z.string(commonErrors),
    [fields.isBlocked]: z.coerce.boolean(),
    [fields.isActive]: z.coerce.boolean(),
    [fields.businessLicense]: z.string().nullable().default(null),
    [fields.nationalCard]: z.string().nullable().default(null),
    [fields.numericGroupId]: z.coerce
      .number({
        required_error: errMsgThisShouldBeChosen,
        invalid_type_error: errMsgThisShouldBeChosen,
      })
      .positive(errMsgThisShouldBeChosen),
    [fields.groupId]: z.coerce
      .number({
        required_error: errMsgThisShouldBeChosen,
        invalid_type_error: errMsgThisShouldBeChosen,
      })
      .positive(errMsgThisShouldBeChosen),
    [fields.maxAllowedDevices]: z.coerce.number(commonErrors),
    [fields.address]: z.string().nullable().default(null),
    [fields.city]: z.string().nullable().default(null),
  })
  .refine(data => data.password === data.passwordRepeat, {
    message: `${labels.passwordRepeat} با ${labels.password} مطابقت ندارد.`,
    path: [fields.passwordRepeat],
  })

type CreateCustomerFormValues = z.input<typeof CreateCustomerSchema>

const emptyValues: CreateCustomerFormValues = {
  maxAllowedDevices: 1,
  isActive: true,
  isBlocked: false,
  nationalId: null,
  city: null,
  address: null,
  nationalCard: null,
  businessLicense: null,
  accountingId: null,
  password: "",
  passwordRepeat: "",
  displayName: "",
  groupId: -1,
  numericGroupId: -1,
  phone: "",
}

interface CreateCustomFormProps {
  reloadCustomers: () => void
}

export default function CreateCustomerForm({ reloadCustomers }: CreateCustomFormProps) {
  const [isOpen, setOpen] = useDrawerSheet(queryStateKeys.createNew)

  const resGroup = useApiRequest<CustomerGroupDto[]>(() => ({
    url: "/TyCustomerGroups",
    defaultValue: [],
  }))
  const SelectWithGroups = createSelectWithOptions<CustomerGroupDto>()

  const resGroupInt = useApiRequest<CustomerGroupIntDto[]>(() => ({
    url: "/TyCustomerGroupIntInts",
    defaultValue: [],
  }))
  const SelectWithIntGroups = createSelectWithOptions<CustomerGroupIntDto>()

  const { register, formState, trigger, reset, handleSubmit, setValue, setFocus } =
    useForm<CreateCustomerFormValues>({
      resolver: zodResolver(CreateCustomerSchema),
      mode: "onBlur",
      defaultValues: emptyValues,
    })
  const { errors, isSubmitting } = formState

  const onSubmit = async (data: CreateCustomerFormValues) => {
    const dataToSend = convertFormValuesToApiPayload(data)

    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال ایجاد مشتری...",
      success: "مشتری با موفقیت ایجاد شد!",
    })

    console.log(dataToSend)

    await apiRequest({
      config: genDatApiConfig(),
      options: {
        url: "/Master/AddCustomer",
        method: "POST",
        body: JSON.stringify(dataToSend),
        onError: msg => reject(msg),
        onSuccess: () => {
          resolve()
          reloadCustomers()
          setOpen(false)
          reset()
        },
      },
    })
  }

  useEffect(() => {
    const firstError = (Object.keys(errors) as Array<keyof typeof errors>).reduce<
      keyof typeof errors | null
    >((field, a) => {
      const fieldKey = field as keyof typeof errors
      return errors[fieldKey] ? fieldKey : a
    }, null)

    if (firstError) setFocus(firstError as Parameters<typeof setFocus>[0])
  }, [errors, setFocus])

  const submitTheFormManulaly = async () => {
    const isValid = await trigger()
    if (isValid) handleSubmit(onSubmit)()
  }

  return (
    <DrawerSheet
      open={isOpen}
      title="ایجاد مشتری جدید"
      icon={UserPlusIcon}
      onClose={() => setOpen(false)}
      btns={
        <>
          <Btn className="flex-1" onClick={() => setOpen(false)}>
            <ArrowRightIcon size={24} />
            <span>انصراف</span>
          </Btn>

          <Btn
            className="flex-1"
            disabled={isSubmitting}
            theme="success"
            themeType="filled"
            onClick={submitTheFormManulaly}
          >
            <UserPlusIcon size={24} />
            <span>ایجاد</span>
          </Btn>
        </>
      }
    >
      <form
        className="min-h-full flex flex-col py-4 gap-5"
        autoComplete="off"
        data-testid="create-customer-form"
      >
        {/* Dummy hidden inputs to trick Chrome autofill behavior... */}
        <input type="text" name="fake-username" autoComplete="username" className="hidden" />
        <input
          type="password"
          name="fake-password"
          autoComplete="new-password"
          className="hidden"
        />

        <Labeler labelText={labels.displayName} errorMsg={errors.displayName?.message}>
          <Input {...register(fields.displayName)} />
        </Labeler>

        <Labeler labelText={labels.phone} errorMsg={errors.phone?.message}>
          <Input dir="ltr" {...register(fields.phone)} />
        </Labeler>

        <Labeler labelText={labels.nationalId} errorMsg={errors.nationalId?.message}>
          <Input dir="ltr" {...register(fields.nationalId)} />
        </Labeler>

        <Labeler labelText={labels.accountingId} errorMsg={errors.accountingId?.message}>
          <Input dir="auto" {...register(fields.accountingId)} />
        </Labeler>

        <Labeler labelText={labels.password} errorMsg={errors.password?.message}>
          <Input dir="ltr" type="password" {...register(fields.password)} />
        </Labeler>

        <Labeler labelText={labels.passwordRepeat} errorMsg={errors.passwordRepeat?.message}>
          <Input dir="ltr" type="password" {...register(fields.passwordRepeat)} />
        </Labeler>

        <LabelerLine labelText={labels.isBlocked} errorMsg={errors.isBlocked?.message}>
          <Switch {...register(fields.isBlocked)} />
        </LabelerLine>

        <LabelerLine labelText={labels.isActive} errorMsg={errors.isActive?.message}>
          <Switch {...register(fields.isActive)} />
        </LabelerLine>

        <FileInput
          errorMsg={errors.businessLicense?.message}
          label={labels.businessLicense}
          mode="file"
          allowedTypes={["image/jpg", "image/png", "image/jpeg"]}
          notes={imageNotes}
          uploadFn={file => uploadFile(file, true)}
          onUploaded={fileStr => {
            setValue(fields.businessLicense, fileStr)
          }}
        />

        <FileInput
          errorMsg={errors.nationalCard?.message}
          label={labels.nationalCard}
          mode="file"
          allowedTypes={["image/jpg", "image/png", "image/jpeg"]}
          notes={imageNotes}
          uploadFn={file => uploadFile(file, true)}
          onUploaded={fileStr => {
            setValue(fields.nationalCard, fileStr)
          }}
        />

        <Labeler
          labelText={labels.groupId}
          errorMsg={errors.groupId?.message || resGroup.error || ""}
        >
          <SelectWithGroups
            {...register(fields.groupId, { valueAsNumber: true })}
            isLoading={resGroup.loading}
            options={resGroup.data || []}
            keys={{
              id: "id",
              text: "name",
              value: "id",
            }}
          />
        </Labeler>

        <Labeler
          labelText={labels.numericGroupId}
          errorMsg={errors.numericGroupId?.message || resGroupInt.error || ""}
        >
          <SelectWithIntGroups
            {...register(fields.numericGroupId, { valueAsNumber: true })}
            options={resGroupInt.data || []}
            isLoading={resGroupInt.loading}
            keys={{
              id: "id",
              text: "name",
              value: "id",
            }}
          />
        </Labeler>

        <Labeler labelText={labels.maxAllowedDevices} errorMsg={errors.maxAllowedDevices?.message}>
          <Input
            dir="ltr"
            type="number"
            {...register(fields.maxAllowedDevices, { valueAsNumber: true })}
          />
        </Labeler>

        <Labeler labelText={labels.address} errorMsg={errors.address?.message}>
          <Input {...register(fields.address)} />
        </Labeler>

        <Labeler labelText={labels.city} errorMsg={errors.city?.message}>
          <Input {...register(fields.city)} />
        </Labeler>
      </form>
    </DrawerSheet>
  )
}

function convertFormValuesToApiPayload(
  values: CreateCustomerFormValues,
): Required<PostApiMasterAddCustomerData["body"]> {
  return {
    displayName: values[fields.displayName],
    mobile: values[fields.phone],
    password: values[fields.password],
    codeMelli: values[fields.nationalId] || "",
    groupID: values[fields.groupId],
    groupIntID: values[fields.numericGroupId],
    address: values[fields.address] || "",
    city: values[fields.city] || "",
    // TODO
    diffPrice: 0,
    melliID: values[fields.nationalCard] || null,
    kasbsID: values[fields.businessLicense] || null,
    isActive: values[fields.isActive],
    isBlocked: values[fields.isBlocked],
    allowedDevices: values[fields.maxAllowedDevices] || 1,
    accountingID: values[fields.accountingId] || "",
  }
}

/** Uploads a file to the API */
async function uploadFile(file: File, isPrivate: boolean): Promise<UploadResult> {
  const formData = new FormData()
  const fileName = file.name
  const lastDotPosition = fileName.lastIndexOf(".")
  const fileExt = fileName.slice(lastDotPosition, fileName.length)

  formData.append("File", file)
  formData.append("Name", uuid() + fileExt)
  formData.append("Description", "")
  formData.append("IsPrivate", isPrivate.toString())

  const res = await apiRequest<OutFileModel>({
    config: genDatApiConfig(),
    options: {
      url: "/TyFiles/upload",
      body: formData,
      method: "POST",
      skipContentType: true,
    },
  })

  if (res.success)
    return {
      success: true,
      fileStr: isPrivate ? res.data?.id || "" : res.data?.adress || "",
    }

  return { success: false, errorMsg: "یه مشکلی موقع آپلود فایل پیش‌اومد..." }
}
