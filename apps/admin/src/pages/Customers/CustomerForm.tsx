import { useApiRequest } from "@gikdev/react-datapi/src"
import type { CustomerGroupDto, CustomerGroupIntDto } from "@repo/api-client/client"
import {
  createSelectWithOptions,
  FileInput,
  Input,
  Labeler,
  LabelerLine,
  Switch,
} from "@repo/shared/components"
import { MAX_FILE_SIZE_FOR_UPLOAD } from "@repo/shared/lib"
import type { UseFormReturn } from "react-hook-form"
import { uploadFile } from "#/shared/customForm"
import {
  type CreateCustomerFormValues,
  customerFormFields,
  type EditCustomerFormValues,
} from "./customerFormShared"

const imageNotes = [
  FileInput.helpers.generateAllowedExtensionsNote(["png", "jpg", "jpeg"]),
  FileInput.helpers.generateFileSizeNote(MAX_FILE_SIZE_FOR_UPLOAD),
  FileInput.helpers.generateFileTypeNote("تصویر"),
]

const { fields, labels } = customerFormFields

interface CustomerFormProps {
  form: UseFormReturn<EditCustomerFormValues> | UseFormReturn<CreateCustomerFormValues>
  isEditMode?: boolean
}

export default function CustomerForm({ form, isEditMode = false }: CustomerFormProps) {
  const { setValue, formState, register } = form
  const { errors } = formState

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

  return (
    <form className="min-h-full flex flex-col py-4 gap-5" autoComplete="off">
      {/* Dummy hidden inputs to trick Chrome autofill behavior... */}
      <input type="text" name="fake-username" autoComplete="username" className="hidden" />
      <input type="password" name="fake-password" autoComplete="new-password" className="hidden" />

      <Labeler labelText={labels.displayName} errorMsg={errors.displayName?.message}>
        <Input {...register(fields.displayName)} />
      </Labeler>

      <Labeler labelText={labels.phone} errorMsg={errors.phone?.message}>
        <Input readOnly={isEditMode} dir="ltr" {...register(fields.phone)} />
      </Labeler>

      <Labeler labelText={labels.nationalId} errorMsg={errors.nationalId?.message}>
        <Input dir="ltr" {...register(fields.nationalId)} />
      </Labeler>

      <Labeler labelText={labels.accountingId} errorMsg={errors.accountingId?.message}>
        <Input dir="auto" {...register(fields.accountingId)} />
      </Labeler>

      <Labeler labelText={labels.password} errorMsg={errors.password?.message}>
        <Input readOnly={isEditMode} dir="ltr" type="password" {...register(fields.password)} />
      </Labeler>

      <Labeler labelText={labels.passwordRepeat} errorMsg={errors.passwordRepeat?.message}>
        <Input
          readOnly={isEditMode}
          dir="ltr"
          type="password"
          {...register(fields.passwordRepeat)}
        />
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
  )
}
