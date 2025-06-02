// import { zodResolver } from "@hookform/resolvers/zod"
// import { GearSixIcon } from "@phosphor-icons/react"
// import { Btn, Input, Labeler, SelectWithOptions } from "@repo/shared/components"
// import { HeadingLine } from "@repo/shared/layouts"
// import { useEffect, useState } from "react"
// import { useForm } from "react-hook-form"
// import { z } from "zod"

// const profileSchema = z.object({
//   name: z.string().min(1, "نام نباید خالی باشد"),
//   email: z.string().email("ایمیل نامعتبر هست").min(1, "ایمیل نباید خالی باشد"),
//   country: z.string().min(1, "کشور را انتخاب کنید"),
// })

// type ProfileFormValues = z.infer<typeof profileSchema>

// interface Country {
//   id: string
//   name: string
// }

// export default function Test() {
//   const [countries, setCountries] = useState<Country[]>([])
//   const [loading, setLoading] = useState(true)

//   const { register, formState, reset, handleSubmit } = useForm<ProfileFormValues>({
//     resolver: zodResolver(profileSchema),
//   })
//   const { errors } = formState

//   useEffect(() => {
//     async function fetchData() {
//       const [userData, countryList] = await Promise.all([
//         new Promise<ProfileFormValues>(res =>
//           setTimeout(() => res({ name: "علی", email: "ali@example.com", country: "ir" }), 300),
//         ),
//         new Promise<Country[]>(res =>
//           setTimeout(
//             () =>
//               res([
//                 { id: "ir", name: "ایران" },
//                 { id: "us", name: "آمریکا" },
//                 { id: "de", name: "آلمان" },
//               ]),
//             500,
//           ),
//         ),
//       ])

//       setCountries(countryList)
//       reset(userData)
//       setLoading(false)
//     }

//     fetchData()
//   }, [reset])

//   function onSubmit(data: ProfileFormValues) {
//     console.log("Submitted:", data)
//   }

//   return (
//     <HeadingLine title="پروفایل">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="flex flex-col gap-8 bg-slate-2 border border-slate-6 p-4 rounded-md max-w-[40rem] mx-auto"
//       >
//         <h2 className="text-2xl font-bold flex items-center gap-1 justify-center">
//           <GearSixIcon size={32} />
//           <span>تنظیمات</span>
//         </h2>

//         <Labeler labelText="نام" errorMsg={errors.name?.message}>
//           <Input {...register("name")} className={errors.name ? "border-red-7" : ""} />
//         </Labeler>

//         <Labeler labelText="ایمیل" errorMsg={errors.email?.message}>
//           <Input {...register("email")} className={errors.email ? "border-red-7" : ""} />
//         </Labeler>

//         <Labeler labelText="کشور" errorMsg={errors.country?.message}>
//           <SelectWithOptions
//             {...register("country")}
//             options={countries}
//             isLoading={loading}
//             keys={{ id: "id", value: "id", text: "name" }}
//           />
//         </Labeler>

//         <Btn type="submit">submit</Btn>
//       </form>
//     </HeadingLine>
//   )
// }
import { zodResolver } from "@hookform/resolvers/zod"
import { FloppyDiskBackIcon, UserCircleIcon } from "@phosphor-icons/react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"
import { Btn, Input, Labeler } from "@repo/shared/components"
import { Link } from "react-router"
import { apiRequest } from "@gikdev/react-datapi/src"
import routes from "../routes"
import { storageManager } from "@repo/shared/adapters"

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
      displayName: storageManager.get("name", "sessionStorage") || "",
    })
  }, [reset])

  async function onSubmit(data: ProfileFormValues) {
    const oldName = storageManager.get("name", "sessionStorage")
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
            storageManager.save(
              key.charAt(0).toLowerCase() + key.slice(1),
              val || "",
              "sessionStorage",
            )
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

// CONTINUE:
// Uncaught TypeError: Cannot convert object to primitive value
