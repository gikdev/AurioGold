import { apiRequest } from "@gikdev/react-datapi/src"
import { zodResolver } from "@hookform/resolvers/zod"
import styled from "@master/styled.react"
import { ArrowClockwiseIcon, SignInIcon } from "@phosphor-icons/react"
import type { CustomerLoginModel, LoginModel } from "@repo/api-client/client"
import { storageManager } from "@repo/shared/adapters"
import { Btn, Heading, Hr, Input, Labeler } from "@repo/shared/components"
import { createControlledAsyncToast, createFieldsWithLabels } from "@repo/shared/helpers"
import { useSetAtom } from "jotai"
import { sha512 } from "js-sha512"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
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

const StyledForm = styled.form`
  bg-slate-2 border border-slate-6 w-full max-w-96 
  px-4 py-8 flex flex-col gap-5 text-center rounded-lg
`

export default function Login() {
  const setProfile = useSetAtom(profileAtom)
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
        onError: msg => reject(msg),
        onSuccess(data) {
          resolve()

          setProfile(data)
          if (data.masterID)
            storageManager.save("masterID", data.masterID.toString(), "sessionStorage")
          if (data.ttkk) storageManager.save("ttkk", data.ttkk.toString(), "sessionStorage")
          if (data.userID) storageManager.save("userID", data.userID.toString(), "sessionStorage")

          navigate(routes.home)
        },
      },
    })
  }

  return (
    <div className="min-h-dvh flex justify-center items-center px-4 py-8 bg-slate-1 -m-2">
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between">
          <Heading as="h2" size={2}>
            ورود
          </Heading>

          <Btn as="a" href={window.location.href} className="rounded-full w-10 p-1">
            <ArrowClockwiseIcon size={20} />
          </Btn>
        </div>

        <Hr />

        <Labeler labelText={labels.phone} errorMsg={errors.phone?.message}>
          <Input dir="ltr" type="text" autoFocus {...register(fields.phone)} />
        </Labeler>

        <Labeler labelText={labels.password} errorMsg={errors.password?.message}>
          <Input dir="ltr" type="password" {...register(fields.password)} />
        </Labeler>

        <Btn
          className="justify-between"
          type="submit"
          themeType="filled"
          theme="primary"
          disabled={isSubmitting}
        >
          <span>ورود</span>
          <SignInIcon mirrored size={24} />
        </Btn>
      </StyledForm>
    </div>
  )
}
