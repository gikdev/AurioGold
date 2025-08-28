import { PencilSimpleIcon, PlusIcon } from "@phosphor-icons/react"
import type { CustomerGroupDto } from "@repo/api-client/client"
import {
  getApiTyCustomerGroupIntIntsOptions,
  getApiTyCustomerGroupsOptions,
} from "@repo/api-client/tanstack"
import { getHeaderTokenOnly } from "@repo/shared/auth"
import { DrawerSheet } from "@repo/shared/components"
import { notesHelpers, skins, useAppForm } from "@repo/shared/forms"
import { createControlledAsyncToast } from "@repo/shared/helpers"
import { MAX_FILE_SIZE_FOR_UPLOAD } from "@repo/shared/lib"
import { useQuery } from "@tanstack/react-query"
import { useCallback, useEffect, useMemo } from "react"
import { apiGetCustomersOptions } from "../shared"
import type { CustomerId } from "../store"
import {
  CreateCustomerFormSchema,
  customerFormFields,
  EditCustomerFormSchema,
  emptyCustomerFormValues,
  formValuesToCreateApiPayload,
  formValuesToEditApiPayload,
  partialDtoToFormValues,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
} from "./stuff"

const imageNotes = [
  notesHelpers.generateAllowedExtensionsNote(["png", "jpg", "jpeg"]),
  notesHelpers.generateFileSizeNote(MAX_FILE_SIZE_FOR_UPLOAD),
  notesHelpers.generateFileTypeNote("تصویر"),
]
const allowedTypes = ["image/jpg", "image/png", "image/jpeg"]

const { labels } = customerFormFields

interface CustomerDrawerProps {
  onClose: () => void
  mode: "create" | "edit"
  customerId?: CustomerId
}

export function CustomerDrawer({ mode, onClose, customerId }: CustomerDrawerProps) {
  const isCreateMode = mode === "create"
  const isEditMode = mode === "edit"

  const { mutate: createCustomer } = useCreateCustomerMutation()
  const { mutate: updateCustomer } = useUpdateCustomerMutation()

  const select = useCallback(
    (groups: CustomerGroupDto[]) => groups?.find(s => s.id === customerId),
    [customerId],
  )
  const { data: customer } = useQuery({
    ...apiGetCustomersOptions,
    enabled: isEditMode && typeof customerId === "number",
    select,
  })

  const defaultValues =
    isEditMode && customer ? partialDtoToFormValues(customer) : emptyCustomerFormValues

  const { data: gramGroups = [], isPending: isGramGroupsPending } = useQuery({
    ...getApiTyCustomerGroupsOptions(getHeaderTokenOnly()),
    staleTime: 5 * 60 * 1000,
  })

  const gramGroupsOptions = useMemo(
    () =>
      gramGroups.map(g => ({
        id: g.id ? g.id.toString() : "0",
        text: g.name ?? "---",
        value: g.id ? g.id.toString() : "0",
      })),
    [gramGroups],
  )

  const { data: numericGroups = [], isPending: isNumericGroupsPending } = useQuery({
    ...getApiTyCustomerGroupIntIntsOptions(getHeaderTokenOnly()),
    staleTime: 5 * 60 * 1000,
  })

  const numericGroupsOptions = useMemo(
    () =>
      numericGroups.map(g => ({
        id: g.id ? g.id.toString() : "0",
        text: g.name ?? "---",
        value: g.id ? g.id.toString() : "0",
      })),
    [numericGroups],
  )

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: isCreateMode ? CreateCustomerFormSchema : EditCustomerFormSchema,
      onMount: isCreateMode ? CreateCustomerFormSchema : EditCustomerFormSchema,
    },

    onSubmit({ value, formApi }) {
      const { reject, resolve } = createControlledAsyncToast({
        pending: isCreateMode ? "در حال ایجاد مشتری..." : "در حال ویرایش مشتری...",
        success: isCreateMode ? "مشتری با موفقیت ایجاد شد!" : "مشتری با موفقیت ویرایش شد!",
      })

      const onError = reject
      const onSuccess = () => {
        resolve()
        formApi.reset(emptyCustomerFormValues)
        onClose()
      }

      if (mode === "edit" && typeof customerId === "number") {
        const body = formValuesToEditApiPayload(value, customerId)
        updateCustomer({ body }, { onError, onSuccess })
      } else {
        const body = formValuesToCreateApiPayload(value)
        createCustomer({ body }, { onError, onSuccess })
      }
    },
  })

  useEffect(() => {
    if (isEditMode && typeof customerId !== "number") {
      console.warn("Provided customerId is not NUMBER!")
    }
  }, [isEditMode, customerId])

  return (
    <DrawerSheet
      open
      title={isCreateMode ? "ایجاد مشتری" : "ویرایش مشتری"}
      icon={isCreateMode ? PlusIcon : PencilSimpleIcon}
      onClose={onClose}
      btns={
        <form.AppForm>
          <form.Btn
            testId="customer-drawer-submit-btn"
            Icon={isCreateMode ? PlusIcon : PencilSimpleIcon}
            title={isCreateMode ? "ایجاد مشتری" : "ویرایش مشتری"}
            className={skins.btn({
              intent: isCreateMode ? "success" : "warning",
              style: "filled",
              className: "col-span-2",
            })}
          />
        </form.AppForm>
      }
    >
      <form className="min-h-full flex flex-col py-4 gap-5" autoComplete="off">
        {/* Dummy hidden inputs to trick Google Chrome's autofill behavior... */}
        <input type="text" autoComplete="username" className="hidden" />
        <input type="password" autoComplete="new-password" className="hidden" />

        <form.AppField name="displayName">
          {field => <field.SimpleText label={labels.displayName} />}
        </form.AppField>

        <form.AppField name="phone">
          {field => <field.SimpleText label={labels.phone} />}
        </form.AppField>

        <form.AppField name="nationalId">
          {field => <field.SimpleText label={labels.nationalId} />}
        </form.AppField>

        <form.AppField name="accountingId">
          {field => <field.SimpleText label={labels.nationalId} />}
        </form.AppField>

        <form.AppField name="password">
          {field => <field.SimplePassword label={labels.password} />}
        </form.AppField>

        <form.AppField name="passwordRepeat">
          {field => <field.SimplePassword label={labels.passwordRepeat} />}
        </form.AppField>

        <form.AppField name="isActive">
          {field => <field.SimpleSwitch label={labels.isActive} />}
        </form.AppField>

        <form.AppField name="isBlocked">
          {field => <field.SimpleSwitch label={labels.isBlocked} />}
        </form.AppField>

        <form.AppField name="maxAllowedDevices">
          {field => <field.SimpleNumber label={labels.maxAllowedDevices} />}
        </form.AppField>

        <form.AppField name="gramGroupId">
          {field => (
            <field.SimpleSelect
              label={labels.gramGroupId}
              options={gramGroupsOptions}
              isLoading={isGramGroupsPending}
            />
          )}
        </form.AppField>

        <form.AppField name="numericGroupId">
          {field => (
            <field.SimpleSelect
              label={labels.numericGroupId}
              options={numericGroupsOptions}
              isLoading={isNumericGroupsPending}
            />
          )}
        </form.AppField>

        <form.AppField name="businessLicense">
          {field => (
            <field.FileInput
              label={labels.businessLicense}
              allowedTypes={allowedTypes}
              isPrivate
              mode="file"
              notes={imageNotes}
            />
          )}
        </form.AppField>

        <form.AppField name="nationalCard">
          {field => (
            <field.FileInput
              label={labels.nationalCard}
              allowedTypes={allowedTypes}
              isPrivate
              mode="file"
              notes={imageNotes}
            />
          )}
        </form.AppField>

        <form.AppField name="city">
          {field => <field.SimpleText label={labels.city} />}
        </form.AppField>

        <form.AppField name="address">
          {field => <field.MultilineText label={labels.address} />}
        </form.AppField>
      </form>
    </DrawerSheet>
  )
}
