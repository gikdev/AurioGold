import { apiRequest } from "@gikdev/react-datapi/src"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRightIcon, UserPlusIcon } from "@phosphor-icons/react"
import type { PostApiMasterAddCustomerData } from "@repo/api-client/client"
import {
  Btn,
  DrawerSheet,
  Input,
  Labeler,
  LabelerLine,
  Switch,
  useDrawerSheet,
} from "@repo/shared/components"
import { createControlledAsyncToast, createFieldsWithLabels } from "@repo/shared/helpers"
import { useForm } from "react-hook-form"
import { z } from "zod"
import genDatApiConfig from "#/shared/datapi-config"
import { queryStateKeys } from "."

const { fields, labels } = createFieldsWithLabels({
  displayName: "نام کامل *",
  phone: "شماره تلفن *",
  nationalId: "کد ملی",
  city: "شهر",
  address: "آدرس",
  maxAllowedDevices: "تعداد دستگاه‌های هم‌زمان مجاز *",
  groupId: "گروه مشتری گرمی *",
  numericGroupId: "گروه مشتری عددی *",
  nationalCard: "کارت ملی",
  businessLicense: "جواز کسب",
  isActive: "فعال هست",
  isBlocked: "معامله مسدود شود",
  password: "گذرواژه *",
  passwordRepeat: "تکرار گذرواژه *",
  accountingId: "آی‌دی حساب‌داری",
})

const iranianPhoneRegex = /^09\d{9}$/

const CreateCustomerSchema = z.object({
  [fields.displayName]: z.string().min(1, { message: `${labels.displayName} باید پر شود!` }),
  [fields.phone]: z
    .string()
    .regex(iranianPhoneRegex, `${labels.phone} معتبر نیست (باید با ۰۹ شروع شده و ۱۱ رقم باشد!)`),
  [fields.nationalId]: z.string(),
  [fields.accountingId]: z.string(),
  [fields.passwordRepeat]: z.string({
    required_error: `لطفا ${labels.passwordRepeat} را وارد کنید`,
  }),
  [fields.password]: z.string({
    required_error: `لطفا ${labels.password} را وارد کنید`,
  }),
  [fields.isBlocked]: z.coerce.boolean(),
  [fields.isActive]: z.coerce.boolean(),
  [fields.businessLicense]: z.string(),
  [fields.nationalCard]: z.string(),
  [fields.numericGroupId]: z.coerce.number({
    required_error: `لطفا ${labels.numericGroupId} را انتخاب کنید`,
  }),
  [fields.groupId]: z.coerce.number({
    required_error: `لطفا ${labels.groupId} را انتخاب کنید`,
  }),
  [fields.maxAllowedDevices]: z.coerce.number({
    required_error: `لطفا ${labels.maxAllowedDevices} را وارد کنید`,
  }),
  [fields.address]: z.string(),
  [fields.city]: z.string(),
})
type CreateCustomerFormValues = z.infer<typeof CreateCustomerSchema>

interface CreateCustomFormProps {
  reloadCustomers: () => void
}

export default function CreateCustomerForm({ reloadCustomers }: CreateCustomFormProps) {
  const [isOpen, setOpen] = useDrawerSheet(queryStateKeys.createNew)
  const { register, formState, trigger, reset, handleSubmit } = useForm<CreateCustomerFormValues>({
    resolver: zodResolver(CreateCustomerSchema),
  })
  const { errors, isSubmitting } = formState

  const onSubmit = async (data: CreateCustomerFormValues) => {
    const dataToSend = convertFormValuesToApiPayload(data)

    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال ایجاد مشتری...",
      success: "مشتری با موفقیت ایجاد شد!",
    })

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
      <form className="min-h-full flex flex-col py-4 gap-5" autoComplete="off" data-testid="create-customer-form">
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
          <Input dir="auto" {...register(fields.accountingId, { valueAsNumber: true })} />
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

        <Labeler labelText={labels.businessLicense} errorMsg={errors.businessLicense?.message}>
          <Input {...register(fields.businessLicense)} />
        </Labeler>

        <Labeler labelText={labels.nationalCard} errorMsg={errors.nationalCard?.message}>
          <Input {...register(fields.nationalCard)} />
        </Labeler>

        <Labeler labelText={labels.numericGroupId} errorMsg={errors.numericGroupId?.message}>
          <Input type="number" {...register(fields.numericGroupId, { valueAsNumber: true })} />
        </Labeler>

        <Labeler labelText={labels.groupId} errorMsg={errors.groupId?.message}>
          <Input type="number" {...register(fields.groupId, { valueAsNumber: true })} />
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
    displayName: values[fields.password],
    mobile: values[fields.phone],
    password: values[fields.displayName],
    codeMelli: values[fields.nationalId],
    groupID: values[fields.groupId],
    groupIntID: values[fields.numericGroupId],
    address: values[fields.address],
    city: values[fields.city],
    // TODO
    diffPrice: 0,
    melliID: values[fields.nationalCard],
    kasbsID: values[fields.businessLicense],
    isActive: values[fields.isActive],
    isBlocked: values[fields.isBlocked],
    allowedDevices: values[fields.maxAllowedDevices],
    accountingID: values[fields.accountingId],
  }
}
