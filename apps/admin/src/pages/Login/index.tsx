import { apiRequest } from "@gikdev/react-datapi/src"
import { DEFAULT_ERROR_MESSAGES } from "@gikdev/react-datapi/src"
import { ArrowsClockwiseIcon, SignInIcon, SpinnerGapIcon } from "@phosphor-icons/react"
import type { LoginModel, MasterLoginModel } from "@repo/api-client/client"
import { notifManager, storageManager } from "@repo/shared/adapters"
import { Btn, Heading, Hr, Input, Labeler } from "@repo/shared/components"
import { styled } from "@repo/shared/helpers"
import { sha512 } from "js-sha512"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import routes from "../routes"

const StyledForm = styled(
  "form",
  `
    bg-slate-2 border-2 border-slate-6 w-full max-w-96 
    px-4 py-8 flex flex-col gap-4 text-center rounded-lg
  `,
)

export default function Login() {
  const { register, handleSubmit, formState } = useForm<LoginModel>()
  const { errors } = formState
  const navigate = useNavigate()
  const [isLoading, setLoading] = useState(false)

  const onSubmit = async (data: LoginModel) => {
    setLoading(true)
    const res = await loginAdmin(data)
    if (res.success) return navigate(routes.login)
    setLoading(false)
  }

  return (
    <div className="min-h-dvh flex justify-center items-center px-4 py-8">
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between">
          <Heading as="h2" size={2}>
            ورود
          </Heading>

          <a
            href={window.location.href}
            className="p-2 hover:bg-slatedark-3 rounded-full active:scale-90 inline-block"
          >
            <ArrowsClockwiseIcon size={20} />
          </a>
        </div>

        <Hr />

        <Labeler labelPrimary="نام کاربری:" errorMsg={errors.un?.message}>
          <Input type="text" {...register("un", { required: "نام کاربری الزامی هست" })} />
        </Labeler>

        <Labeler labelPrimary="رمز:" errorMsg={errors.pw?.message}>
          <Input type="password" {...register("pw", { required: "رمز ورود الزامی هست" })} />
        </Labeler>

        {isLoading ? (
          <Btn disabled themeType="filled" theme="primary">
            <SpinnerGapIcon size={24} className="animate-spin" />
            <span>در حال ورود</span>
          </Btn>
        ) : (
          <Btn type="submit" themeType="filled" theme="primary">
            <SignInIcon size={24} />
            <span>ورود</span>
          </Btn>
        )}
      </StyledForm>
    </div>
  )
}

function loginAdmin(data: LoginModel) {
  const dataToSend = JSON.stringify({
    un: data.un,
    pw: sha512(data.pw ?? ""),
  })

  return apiRequest<MasterLoginModel>({
    options: {
      url: "/Master/loginMaster",
      method: "POST",
      body: dataToSend,
      onError: msg => notifManager.notify(msg || DEFAULT_ERROR_MESSAGES.GENERAL, "toast"),
      onSuccess(data) {
        notifManager.notify("با موفقیت وارد شدید!", "toast", { status: "success" })
        for (const key in data) {
          storageManager.save(key, String(data[key as keyof MasterLoginModel]), "sessionStorage")
        }
      },
    },
  })
}
