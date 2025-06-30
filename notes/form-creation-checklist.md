# Form Creation Checklist  

## 1. Setup & Structure  

### Query State & Shared Form Logic  
- [ ] Define a `queryStateKey` object to hold query state keys (for `nuqs` usage).  
- [ ] Create `xyzFormShared.tsx`:  
  - [ ] Define `xyzFormFields` using `createFieldsWithLabels()`.  
  - [ ] Define schemas:  
    - Base schema (`baseXyzSchema`), extended for `createXyzSchema` and `editXyzSchema`.  
    - Use `commonErrors`, e.g., `z.string(commonErrors)`.  
    - Apply transformations (`.transform(convertPersianToEnglish)`).  
    - Use regex validation (`.pipe(z.string().regex(validationPatterns.onlyDigits, commonErrors.invalid_type_error))`).  
    - [ ] Add `.refine()` if needed.  
  - Infer input types with `z.input<typeof schema>`.  
  - Define `emptyXyzValues`:  
    - Can combine all schema types (e.g., `const emptyXyzValues: CreateXyzFormValues & EditXyzFormValues`).  

### Form Component (`XyzForm.tsx`)  

Sample structure (copy-paste friendly):  

```typescript
const { fields, labels } = xyzFormFields

interface XyzFormProps {
  form: UseFormReturn<EditXyzFormValues> | UseFormReturn<CreateXyzFormValues>
  isEditMode?: boolean
}

export default function XyzForm({ form, isEditMode = false }: XyzFormProps) {
  const { setValue, formState, register } = form
  const { errors } = formState

  // Example API hooks for dropdowns
  const resGroup = useApiRequest<XyzGroupDto[]>(() => ({
    url: "/TyXyzGroups",
    defaultValue: [],
  }))
  const SelectWithGroups = createSelectWithOptions<XyzGroupDto>()

  return (
    <form
      className="min-h-full flex flex-col py-4 gap-5"
      autoComplete="off"
    >
      {/* Hidden inputs to prevent Chrome autofill */}
      <input type="text" name="fake-username" autoComplete="username" className="hidden" />
      <input type="password" name="fake-password" autoComplete="new-password" className="hidden" />

      <Labeler labelText={labels.displayName} errorMsg={errors.displayName?.message}>
        <Input {...register(fields.displayName)} />
      </Labeler>

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
    </form>
  )
}
```

### `CreateXyzDrawer.tsx`

Sample structure (copy-paste friendly):  

```typescript
interface CreateXyzFormProps {
  reloadXyzs: () => void
}

export default function CreateXyzDrawer({ reloadXyzs }: CreateXyzFormProps) {
  const [isOpen, setOpen] = useDrawerSheet(queryStateKeys.createNew)

  const form = useCustomForm(createXyzSchema, emptyXyzValues)
  const { formState, trigger, reset, handleSubmit } = form
  const { isSubmitting } = formState

  const onSubmit = async (data: CreateXyzFormValues) => {
    const dataToSend = convertFormValuesToApiPayload(data)

    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال ایجاد xyz...",
      success: "xyz با موفقیت ایجاد شد!",
    })

    await apiRequest({
      config: genDatApiConfig(),
      options: {
        url: "/Master/AddXyz",
        method: "POST",
        body: JSON.stringify(dataToSend),
        onError: msg => reject(msg),
        onSuccess: () => {
          resolve()
          reloadXyzs()
          setOpen(false)
          reset()
        },
      },
    })
  }

  const submitTheFormManually = async () => {
    const isValid = await trigger()
    if (isValid) handleSubmit(onSubmit)()
  }

  return (
    <DrawerSheet
      open={isOpen}
      title="ایجاد xyz جدید"
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
            onClick={submitTheFormManually}
          >
            <UserPlusIcon size={24} />
            <span>ایجاد</span>
          </Btn>
        </>
      }
    >
      <XyzForm form={form} />
    </DrawerSheet>
  )
}

function convertFormValuesToApiPayload(
  values: CreateXyzFormValues,
): Required<PostApiMasterAddXyzData["body"]> {
  // Do the conversion/mapping
}

```
### `EditXyzDrawer.tsx`

Sample structure (copy-paste friendly):  

```typescript
interface EditXyzDrawerProps {
  reloadXyzs: () => void
  xyzs: XyzDto[]
}

export default function EditXyzDrawer({
  reloadXyzs,
  xyzs,
}: EditXyzDrawerProps) {
  const [xyzId, setXyzId] = useDrawerSheetNumber(queryStateKeys.edit)
  const xyz = xyzd.find(x => x.id === xyzId)

  const defaultValues = xyz ? convertPartialXyzDtoToFormValues(xyz) : undefined

  const form = useCustomForm(editXyzSchema, emptyXyzValues, true, defaultValues)
  const { formState, trigger, reset, handleSubmit } = form
  const { isSubmitting } = formState

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (defaultValues) reset(defaultValues)
  }, [reset, xyz])

  const onSubmit = async (data: EditXyzFormValues) => {
    if (xyzId == null) return
    const dataToSend = convertFormValuesToApiPayload(data, xyzId)

    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال ویرایش xyz...",
      success: "xyz با موفقیت ویرایش شد!",
    })

    await apiRequest({
      config: genDatApiConfig(),
      options: {
        url: "/Master/UpdateXyz",
        method: "PUT",
        body: JSON.stringify(dataToSend),
        onError: msg => reject(msg),
        onSuccess: () => {
          resolve()
          reloadXyzs()
          setXyzId(null)
          reset()
        },
      },
    })
  }

  const submitTheFormManually = async () => {
    const isValid = await trigger()
    if (isValid) handleSubmit(onSubmit)()
  }

  return (
    <DrawerSheet
      open={xyzId != null}
      title="ویرایش xyz"
      icon={XyzPlusIcon}
      onClose={() => setXyzId(null)}
      btns={
        <>
          <Btn className="flex-1" onClick={() => setXyzId(null)}>
            <ArrowRightIcon size={24} />
            <span>انصراف</span>
          </Btn>

          <Btn
            className="flex-1"
            disabled={isSubmitting}
            theme="warning"
            themeType="filled"
            onClick={submitTheFormManually}
          >
            <PenIcon size={24} />
            <span>ویرایش</span>
          </Btn>
        </>
      }
    >
      {xyz === undefined ? (
        <EntityNotFoundCard entity="xyz" />
      ) : (
        <XyzForm form={form} isEditMode />
      )}
    </DrawerSheet>
  )
}

function convertFormValuesToApiPayload(
  values: EditXyzFormValues,
  xyzId: number,
): Required<PostApiMasterUpdateXyzData["body"]> {
  // do the conversion/mapping
}

function convertPartialXyzDtoToFormValues(
  dto: Partial<XyzDto>,
): Partial<EditXyzFormValues> {
  const obj: Partial<EditXyzFormValues> = {}

  // if (dto?.displayName) obj.displayName = dto.displayName
  // Do more if needed

  return obj
}
```

### Validation
- [ ] All required fields properly validated
- [ ] Custom validation rules (phone, national ID, etc.)
- [ ] Password confirmation if applicable
- [ ] Proper error messages in Persian

### UX
- [ ] Auto-focus first error field
- [ ] Loading states during submission
- [ ] Success/error toast notifications
- [ ] Form reset after successful create

## 7. Testing Considerations
- [ ] Test both create and edit modes
- [ ] Test validation error states
- [ ] Test API success/error scenarios
- [ ] Test file upload functionality
