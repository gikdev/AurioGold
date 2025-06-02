import { apiRequest } from "@gikdev/react-datapi/src"
import { zodResolver } from "@hookform/resolvers/zod"
import { FloppyDiskBackIcon, UserCircleIcon } from "@phosphor-icons/react"
import { Btn, Input, Labeler } from "@repo/shared/components"
import Cookies from "js-cookie"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router"
import { toast } from "react-toastify"
import { z } from "zod"
import routes from "../routes"

const profileSchema = z.object({
  displayName: z.string().min(1, "نام نباید خالی باشد"),
  profileImage: z.any().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileForm() {
  const { register, handleSubmit, reset, formState } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  })
  const { errors } = formState

  useEffect(() => {
    reset({
      displayName: Cookies.get("name") || "",
    })
  }, [reset])

  async function onSubmit(data: ProfileFormValues) {
    const oldName = Cookies.get("name")
    const newName = data.displayName
    const hasNameChanged = newName !== oldName

    const imageUrlHolder: string | null = null

    const hasImageChanged = imageUrlHolder !== null

    if (!hasNameChanged && !hasImageChanged) {
      toast.info("تغییری انجام نشده است")
      return
    }

    const payload = {
      dataVal: [
        ...(hasNameChanged ? [{ key: "Name", val: newName }] : []),
        ...(hasImageChanged ? [{ key: "LogoUrl", val: imageUrlHolder }] : []),
      ],
    }

    apiRequest({
      options: {
        url: "/Master/UpdateF",
        method: "POST",
        body: JSON.stringify(payload),
        onSuccess: () => {
          for (const item of payload.dataVal) {
            const { key, val } = item
            Cookies.set(key.charAt(0).toLowerCase() + key.slice(1), val || "")
          }
          toast.success("با موفقیت انجام شد")
        },
      },
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid sm:grid-cols-2 gap-y-6 gap-x-4 items-end"
    >
      <Labeler labelText="نام" errorMsg={errors.displayName?.message}>
        <Input
          {...register("displayName")}
          dir="rtl"
          className={errors.displayName ? "border-red-7" : ""}
        />
      </Labeler>

      <Labeler labelText="عکس پروفایل:">
        <Input type="file" {...register("profileImage")} name="profileImage" />
      </Labeler>

      <Btn type="button">
        <UserCircleIcon />
        <span>خروج از حساب</span>
      </Btn>

      <Btn type="submit" themeType="filled" theme="primary">
        <FloppyDiskBackIcon />
        <span>ذخیره</span>
      </Btn>

      <p className="text-center sm:col-span-2">
        اینجا می‌تونین
        <Link className="text-amberdark-9 underline" to={routes.profile_changePassword}>
          رمزتون رو عوض کنین
        </Link>
      </p>
    </form>
  )
}
