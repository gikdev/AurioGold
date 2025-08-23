import { CircleNotchIcon, type Icon, PencilSimpleIcon } from "@phosphor-icons/react"
import { parseError } from "@repo/shared/helpers"
import { type AnyFieldApi, createFormHook, createFormHookContexts } from "@tanstack/react-form"
import type { ComponentProps } from "react"
import { skins } from "./skins"

export const extractError = (field: AnyFieldApi) =>
  field.state.meta.isValid ? undefined : field.state.meta.errors?.map(e => e?.message)?.join("، ")

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    SimpleNumber,
    SimpleText,
    MultilineText,
    SimpleSelect,
  },
  formComponents: {
    Btn,
  },
})

interface SimpleNumberProps {
  label: string
  fallbackValue?: number
  readOnly?: boolean
  dir?: "auto" | "ltr" | "rtl"
}
function SimpleNumber({
  label,
  fallbackValue = 0,
  readOnly = false,
  dir = "ltr",
}: SimpleNumberProps) {
  const field = useFieldContext<number>()

  return (
    <div className={skins.labelerContainer()}>
      <label htmlFor={field.name}>{label}</label>

      <input
        id={field.name}
        dir={dir}
        name={field.name}
        type="number"
        readOnly={readOnly}
        className={skins.input()}
        value={parseNumber(field.state.value, fallbackValue)}
        onBlur={field.handleBlur}
        onChange={e => field.handleChange(parseNumber(e.target.valueAsNumber, fallbackValue))}
      />

      <FieldInfo field={field} />
    </div>
  )
}

interface SimpleTextProps {
  label: string
  dir?: "auto" | "ltr" | "rtl"
}
function SimpleText({ label, dir = "auto" }: SimpleTextProps) {
  const field = useFieldContext<string>()

  return (
    <div className={skins.labelerContainer()}>
      <label htmlFor={field.name}>{label}</label>

      <input
        id={field.name}
        name={field.name}
        dir={dir}
        className={skins.input()}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={e => field.handleChange(e.target.value)}
      />

      <FieldInfo field={field} />
    </div>
  )
}

interface MultilineTextProps {
  label: string
  dir?: "auto" | "ltr" | "rtl"
}
function MultilineText({ label, dir = "auto" }: MultilineTextProps) {
  const field = useFieldContext<string>()

  return (
    <div className={skins.labelerContainer()}>
      <label htmlFor={field.name}>{label}</label>

      <textarea
        id={field.name}
        name={field.name}
        className={skins.textarea()}
        value={field.state.value ?? ""}
        dir={dir}
        onBlur={field.handleBlur}
        onChange={e => field.handleChange(e.target.value)}
      />

      <FieldInfo field={field} />
    </div>
  )
}

interface BtnProps {
  title?: string
  loadingTitle?: string
  isIconOnly?: boolean
  Icon?: Icon
  LoadingIcon?: Icon
  className?: string
  onClick?: () => void
  btnType?: ComponentProps<"button">["type"]
  testId?: string
}
function Btn({
  title = "ثبت",
  isIconOnly = false,
  Icon = PencilSimpleIcon,
  className,
  LoadingIcon = CircleNotchIcon,
  loadingTitle = "در حال بارگذاری...",
  btnType = "button",
  onClick,
  testId,
}: BtnProps) {
  const defaultClassName = skins.btn({
    intent: "success",
    style: "filled",
    isIcon: isIconOnly,
  })

  const form = useFormContext()

  return (
    <form.Subscribe selector={s => [s.canSubmit, s.isSubmitting]}>
      {([canSubmit, isSubmitting]) => {
        const FinalIcon = isSubmitting ? LoadingIcon : Icon
        const defaultClickHandler = () => form.handleSubmit()
        const finalClickHandler = onClick ?? defaultClickHandler

        return (
          <button
            data-testid={testId}
            type={btnType}
            onClick={finalClickHandler}
            disabled={!canSubmit || isSubmitting}
            className={className || defaultClassName}
          >
            <FinalIcon />
            {!isIconOnly && <span>{isSubmitting ? loadingTitle : title}</span>}
          </button>
        )
      }}
    </form.Subscribe>
  )
}

interface SimpleSelectProps {
  label: string
  options: TypedSelectProps["options"]
  isLoading?: boolean
  dir?: "auto" | "ltr" | "rtl"
}

function SimpleSelect({ label, options, dir = "auto", isLoading = false }: SimpleSelectProps) {
  const field = useFieldContext<string>()

  return (
    <div className={skins.labelerContainer()}>
      <label htmlFor={field.name}>{label}</label>

      <TypedSelect
        id={field.name}
        name={field.name}
        isLoading={isLoading}
        dir={dir}
        className={skins.select()}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={value => field.handleChange(value)}
        options={options}
      />

      <FieldInfo field={field} />
    </div>
  )
}

interface TypedSelectOption<T extends string = string> {
  id: string
  value: T
  text: string
}

interface TypedSelectProps<T extends string = string> {
  id: string
  name: string
  className?: string
  onBlur?: () => void
  onChange?: (item: T) => void
  value: T
  dir?: "auto" | "ltr" | "rtl"
  options: TypedSelectOption<T>[]
  isLoading?: boolean
  placeholder?: string
  loadingPlaceholder?: string
  disabled?: boolean
}

function TypedSelect<T extends string = string>({
  options = [],
  dir = "auto",
  isLoading = false,
  loadingPlaceholder = "در حال بارگذاری...",
  placeholder = "انتخاب کنید",
  disabled = false,
  onChange,
  ...props
}: TypedSelectProps<T>) {
  return (
    <select
      {...props}
      disabled={isLoading || disabled}
      onChange={e => onChange?.(e.target.value as T)}
    >
      <option value="">{isLoading ? loadingPlaceholder : placeholder}</option>

      {options.map(option => (
        <option key={option.id} value={option.value}>
          {option.text}
        </option>
      ))}
    </select>
  )
}

function FieldInfo({ field }: { field: AnyFieldApi }) {
  const { isValid, isValidating } = field.state.meta
  const showError = !isValid

  const errorMsg = field.state.meta.errors.map(e => parseError(e, "یه مشکلی پیش اومده")).join("، ")

  return (
    <>
      {showError ? <p className={skins.errorMsg()}>{errorMsg}</p> : null}
      {isValidating ? <p className={skins.hint()}>در حال بررسی...</p> : null}
    </>
  )
}

function parseNumber(value: number | undefined | null, fallback = 0) {
  value = Number(value)
  return Number.isNaN(value) || value == null ? fallback : value
}
