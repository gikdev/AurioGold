import { apiRequest } from "@gikdev/react-datapi/src"
import { zodResolver } from "@hookform/resolvers/zod"
import { PasswordIcon } from "@phosphor-icons/react"
import type { ChangePasswordDto } from "@repo/api-client/client"
import { BtnTemplates, DrawerSheet, Input, Labeler, useDrawerSheet } from "@repo/shared/components"
import { createControlledAsyncToast, createFieldsWithLabels } from "@repo/shared/helpers"
import { usePasswordEyeBtn } from "@repo/shared/hooks"
import { sha512 } from "js-sha512"
import { memo } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import genDatApiConfig from "#/shared/datapi-config"
import { QUERY_KEYS } from "./navigation"

const { fields, labels } = createFieldsWithLabels({
  oldPassword: "گذرواژه قدیمی *",
  newPassword: "گذرواژه جدید *",
  newPasswordRepeat: "تکرار گذرواژه جدید *",
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

function _ChangePasswordDrawer() {
  const [showDrawer, setShowDrawer] = useDrawerSheet(QUERY_KEYS.changePassword)
  const { ChangePasswordVisibilityBtn, inputType } = usePasswordEyeBtn()
  const { register, formState, handleSubmit, reset, trigger } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  })
  const { errors, isSubmitting } = formState

  const handleClose = () => {
    setShowDrawer(false)
  }

  async function onSubmit(data: ChangePasswordFormValues) {
    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال تغییر گذرواژه شما...",
      success: "گذرواژه شما با موفقیت تغییر کرد!",
    })

    apiRequest({
      config: genDatApiConfig(),
      options: {
        url: "/Customer/resetPassword",
        method: "PUT",
        body: JSON.stringify(mapToApiPayload(data)),
        onSuccess: () => {
          resolve()
          handleClose()
          reset()
        },
        onError: msg => {
          reject(msg)
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
      open={showDrawer}
      title="تعویض گذرواژه"
      icon={PasswordIcon}
      onClose={handleClose}
      additionalBtns={<ChangePasswordVisibilityBtn />}
      btns={
        <>
          <BtnTemplates.Cancel onClick={handleClose} />

          <BtnTemplates.Edit
            disabled={isSubmitting}
            themeType="filled"
            onClick={submitTheFormManually}
          />
        </>
      }
    >
      <form className="min-h-full flex flex-col py-4 gap-5" autoComplete="off">
        <input type="text" name="fake-username" autoComplete="username" className="hidden" />
        <input
          type="password"
          name="fake-password"
          autoComplete="new-password"
          className="hidden"
        />

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
      </form>
    </DrawerSheet>
  )
}

const ChangePasswordDrawer = memo(_ChangePasswordDrawer)
export default ChangePasswordDrawer

function mapToApiPayload({
  newPassword,
  oldPassword,
}: ChangePasswordFormValues): ChangePasswordDto {
  return {
    oldPassword: oldPassword ? sha512(oldPassword) : "",
    newPassword,
  }
}
