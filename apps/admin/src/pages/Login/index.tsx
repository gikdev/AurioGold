import { apiRequest } from "@gikdev/react-datapi/src"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowClockwiseIcon, SignInIcon } from "@phosphor-icons/react"
import type { MasterLoginModel } from "@repo/api-client/client"
import { currentProfile } from "@repo/profile-manager"
import { storageManager } from "@repo/shared/adapters"
import { Btn, Heading, Hr, Input, Labeler } from "@repo/shared/components"
import { createControlledAsyncToast, createFieldsWithLabels } from "@repo/shared/helpers"
import config from "config"
import { sha512 } from "js-sha512"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { z } from "zod"
import genDatApiConfig from "#/shared/datapi-config"
import routes from "../routes"

const { fields, labels } = createFieldsWithLabels({
  username: "نام کاربری *",
  password: "گذرواژه *",
})

const loginSchema = z.object({
  [fields.username]: z.string().trim().min(1, `${labels.username} باید وارد شود!`),
  [fields.password]: z.string().trim(),
})
type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const { register, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })
  const { errors, isSubmitting } = formState
  const navigate = useNavigate()

  async function onSubmit(data: LoginFormValues) {
    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال ورود به برنامه...",
      success: "با موفقیت وارد شدید!",
    })

    const dataToSend = JSON.stringify({
      un: data.username,
      pw: sha512(data.password ?? ""),
    })

    await apiRequest<MasterLoginModel>({
      options: {
        baseUrl: genDatApiConfig().baseUrl,
        url: "/Master/loginMaster",
        method: "POST",
        body: dataToSend,
        onError: msg => reject(msg),
        onSuccess(data) {
          resolve()

          for (const key in data) {
            storageManager.save(key, String(data[key as keyof MasterLoginModel]), "sessionStorage")
          }

          navigate(routes.home)
        },
      },
    })
  }

  return (
    <div className="min-h-dvh flex justify-center items-center px-4 py-8 bg-slate-1 -m-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-slate-2 border-2 border-slate-6 w-full max-w-96 px-4 py-8 flex flex-col gap-4 text-center rounded-lg"
      >
        <Header />

        <Hr />

        <Labeler labelText={labels.username} errorMsg={errors.username?.message}>
          <Input
            data-testid="username"
            dir="ltr"
            type="text"
            autoFocus
            {...register(fields.username)}
          />
        </Labeler>

        <Labeler labelText={labels.password} errorMsg={errors.password?.message}>
          <Input data-testid="password" dir="ltr" type="password" {...register(fields.password)} />
        </Labeler>

        <Btn
          className="justify-between"
          data-testid="submit"
          disabled={isSubmitting}
          theme="primary"
          themeType="filled"
          type="submit"
        >
          <span>ورود</span>
          <SignInIcon mirrored size={24} />
        </Btn>

        <p>
          <code>{config.versionStr}</code>
        </p>
      </form>
    </div>
  )
}

const Header = () => (
  <div className="flex items-center justify-between flex-wrap">
    <img src="/profile/shared/web-app-manifest-192x192.png" className="w-12" alt="" />
    <Heading as="h2" size={1}>
      {currentProfile.appTitleClient} (ادمین)
    </Heading>

    <Btn as="a" href={window.location.href} className="rounded-full w-10 p-1">
      <ArrowClockwiseIcon size={20} />
    </Btn>
  </div>
)
