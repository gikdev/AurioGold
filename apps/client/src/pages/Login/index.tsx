import { apiRequest } from "@gikdev/react-datapi/src"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowClockwiseIcon, SignInIcon } from "@phosphor-icons/react"
import type { CustomerLoginModel, LoginModel } from "@repo/api-client/client"
import { currentProfile } from "@repo/profile-manager"
import { storageManager } from "@repo/shared/adapters"
import { Btn, Heading, Hr, Input, Labeler } from "@repo/shared/components"
import {
  createControlledAsyncToast,
  createFieldsWithLabels,
  parseError,
} from "@repo/shared/helpers"
import config from "config"
import { useSetAtom } from "jotai"
import { sha512 } from "js-sha512"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { emptyProfile, profileAtom } from "#/atoms"
import genDatApiConfig from "#/shared/datapi-config"
import routes from "../routes"

const { fields, labels } = createFieldsWithLabels({
  phone: "شماره *",
  password: "گذرواژه *",
})

const loginSchema = z.object({
  [fields.phone]: z.string().trim().min(1, `${labels.phone} باید وارد شود!`),
  [fields.password]: z.string().trim().min(1, `${labels.phone} باید وارد شود!`),
})
type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const setProfile = useSetAtom(profileAtom)
  const { register, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })
  const { errors, isSubmitting } = formState

  async function onSubmit(data: LoginFormValues) {
    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال ورود به برنامه...",
      success: "با موفقیت وارد شدید!",
    })

    const dataToSend = JSON.stringify({
      un: data.phone,
      pw: sha512(data.password),
    } satisfies LoginModel)

    await apiRequest<Required<CustomerLoginModel>, CustomerLoginModel>({
      options: {
        baseUrl: genDatApiConfig().baseUrl,
        url: "/Customer/loginCustomer",
        method: "POST",
        body: dataToSend,
        transformResponse: raw => ({ ...emptyProfile, ...raw }),
        onError: msg => reject(parseError(msg)),
        onSuccess(data) {
          resolve()

          setProfile(data)
          if (data.masterID)
            storageManager.save("masterID", data.masterID.toString(), "sessionStorage")
          if (data.ttkk) storageManager.save("ttkk", data.ttkk.toString(), "sessionStorage")
          if (data.userID) storageManager.save("userID", data.userID.toString(), "sessionStorage")

          location.replace(routes.home)
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

        <Labeler labelText={labels.phone} errorMsg={errors.phone?.message}>
          <Input data-testid="phone" dir="ltr" type="text" autoFocus {...register(fields.phone)} />
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

        <AppVersion />
      </form>
    </div>
  )
}

const Header = () => (
  <div className="flex items-center justify-between flex-wrap">
    <img src="/profile/shared/web-app-manifest-192x192.png" className="w-12" alt="" />
    <Heading as="h2" size={1}>
      {currentProfile.appTitleClient}
    </Heading>

    <Btn as="a" href={window.location.href} className="rounded-full w-10 p-1">
      <ArrowClockwiseIcon size={20} />
    </Btn>
  </div>
)

const AppVersion = () => (
  <p>
    <code>{config.versionStr}</code>
  </p>
)
