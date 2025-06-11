import { apiRequest } from "@gikdev/react-datapi/src"
import { zodResolver } from "@hookform/resolvers/zod"
import { PasswordIcon } from "@phosphor-icons/react"
import type { ChangePasswordDto } from "@repo/api-client/client"
import { Btn, FormCard, Input, Labeler } from "@repo/shared/components"
import { createControlledAsyncToast, createFieldsWithLabels } from "@repo/shared/helpers"
import { usePasswordEyeBtn } from "@repo/shared/hooks"
import { sha512 } from "js-sha512"
import { useForm } from "react-hook-form"
import z from "zod"
import genDatApiConfig from "#/shared/datapi-config"

const { fields, labels } = createFieldsWithLabels({
  oldPassword: "گذرواژه قدیمی",
  newPassword: "گذرواژه جدید",
  newPasswordRepeat: "تکرار گذرواژه جدید",
})

const changePasswordSchema = z
  .object({
    [fields.oldPassword]: z.string().trim(),
    [fields.newPassword]: z.string().trim(),
    [fields.newPasswordRepeat]: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.newPasswordRepeat) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${labels.newPassword} و ${labels.newPasswordRepeat} یکی نیستند!`,
        path: [fields.newPasswordRepeat],
      })
    }

    if (data.oldPassword === data.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${labels.newPassword} و ${labels.oldPassword} یکی هستند! نمی‌توان ${labels.newPassword} را همان ${labels.oldPassword} گذاشت!`,
        path: [fields.newPassword],
      })
    }
  })

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

export default function ChangePasswordFormCard() {
  const { ChangePasswordVisibilityBtn, inputType } = usePasswordEyeBtn()
  const { register, formState, handleSubmit, reset } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  })
  const { errors, isSubmitting } = formState

  async function onSubmit(data: ChangePasswordFormValues) {
    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال تغییر گذرواژه شما...",
      success: "گذرواژه شما با موفقیت تغییر کرد!",
    })

    apiRequest({
      config: genDatApiConfig(),
      options: {
        url: "/Master/resetPasswordMaster",
        method: "PUT",
        body: JSON.stringify(mapToApiPayload(data)),
        onSuccess: () => {
          resolve()
          reset()
        },
        onError: msg => {
          reject(msg)
        },
      },
    })
  }

  return (
    <FormCard
      onSubmit={handleSubmit(onSubmit)}
      icon={PasswordIcon}
      title="تعویض گذرواژه"
      titleSlot={<ChangePasswordVisibilityBtn />}
    >
      <Labeler labelText={labels.oldPassword} errorMsg={errors.oldPassword?.message}>
        <Input
          {...register(fields.oldPassword)}
          className={errors.oldPassword ? "border-red-7" : ""}
          type={inputType}
          dir="ltr"
        />
      </Labeler>

      <Labeler labelText={labels.newPassword} errorMsg={errors.newPassword?.message}>
        <Input
          {...register(fields.newPassword)}
          className={errors.newPassword ? "border-red-7" : ""}
          type={inputType}
          dir="ltr"
        />
      </Labeler>

      <Labeler labelText={labels.newPasswordRepeat} errorMsg={errors.newPasswordRepeat?.message}>
        <Input
          {...register(fields.newPasswordRepeat)}
          className={errors.newPasswordRepeat ? "border-red-7" : ""}
          type={inputType}
          dir="ltr"
        />
      </Labeler>

      <Btn type="submit" themeType="filled" theme="primary" disabled={isSubmitting}>
        <PasswordIcon size={20} />
        <span>تغییر رمز</span>
      </Btn>
    </FormCard>
  )
}

function mapToApiPayload(data: ChangePasswordFormValues): ChangePasswordDto {
  return {
    oldPassword: sha512(data.oldPassword),
    newPassword: data.newPassword,
  }
}
