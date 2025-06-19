import { apiRequest } from "@gikdev/react-datapi/src"
import { zodResolver } from "@hookform/resolvers/zod"
import styled from "@master/styled.react"
import { ArrowsClockwiseIcon, SignInIcon } from "@phosphor-icons/react"
import type { CustomerLoginModel, MasterLoginModel } from "@repo/api-client/client"
import { storageManager } from "@repo/shared/adapters"
import { Btn, Heading, Hr, Input, Labeler } from "@repo/shared/components"
import { createControlledAsyncToast, createFieldsWithLabels } from "@repo/shared/helpers"
import { sha512 } from "js-sha512"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { z } from "zod"
import genDatApiConfig from "#/shared/datapi-config"
import routes from "../routes"

const { fields, labels } = createFieldsWithLabels({
  phone: "شماره *",
  password: "گذرواژه *",
})

const loginSchema = z.object({
  [fields.phone]: z.string().trim().min(1, `${labels.phone} باید وارد شود!`),
  [fields.password]: z.string().trim(),
})
type LoginFormValues = z.infer<typeof loginSchema>

const StyledForm = styled.form`
  bg-slate-2 border-2 border-slate-6 w-full max-w-96 
  px-4 py-8 flex flex-col gap-4 text-center rounded-lg
`

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
      un: data.phone,
      pw: sha512(data.password ?? ""),
    })

    await apiRequest<CustomerLoginModel>({
      options: {
        baseUrl: genDatApiConfig().baseUrl,
        url: "/Master/loginMaster",
        method: "POST",
        body: dataToSend,
        onError: msg => reject(msg),
        onSuccess(data) {
          resolve()

          for (const key in data) {
            storageManager.save(key, String(data[key as keyof CustomerLoginModel]), "sessionStorage")
          }

          navigate(routes.home)
        },
      },
    })
  }

  return (
    <div className="min-h-dvh flex justify-center items-center px-4 py-8 bg-slate-1 -m-2">
      <StyledForm onSubmit={handleSubmit(onSubmit)} data-testid="login-form">
        <div className="flex items-center justify-between">
          <Heading as="h2" size={2}>
            ورود
          </Heading>

          <a
            href={window.location.href}
            className="p-2 hover:bg-slate-3 rounded-full active:scale-90 inline-block"
          >
            <ArrowsClockwiseIcon size={20} />
          </a>
        </div>

        <Hr />

        <Labeler labelText={labels.phone} errorMsg={errors.phone?.message}>
          <Input
            data-testid="username"
            dir="ltr"
            type="text"
            autoFocus
            {...register(fields.phone)}
          />
        </Labeler>

        <Labeler labelText={labels.password} errorMsg={errors.password?.message}>
          <Input data-testid="password" dir="ltr" type="password" {...register(fields.password)} />
        </Labeler>

        <Btn
          data-testid="submit"
          type="submit"
          themeType="filled"
          theme="primary"
          disabled={isSubmitting}
        >
          <SignInIcon size={24} />
          <span>ورود</span>
        </Btn>
      </StyledForm>
    </div>
  )
}
