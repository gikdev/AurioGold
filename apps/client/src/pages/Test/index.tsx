import { zodResolver } from "@hookform/resolvers/zod"
import { GearSixIcon } from "@phosphor-icons/react"
import { createSelectWithOptions, Input, Labeler } from "@repo/shared/components"
import { HeadingLine } from "@repo/shared/layouts"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const profileSchema = z.object({
  name: z.string().min(1, "نام نباید خالی باشد"),
  email: z.string().email("ایمیل نامعتبر هست").min(1, "ایمیل نباید خالی باشد"),
  country: z.string().min(1, "کشور را انتخاب کنید"),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface Country {
  id: string
  name: string
}

export default function Test() {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const SelectWithCountry = createSelectWithOptions<Country>()

  const { register, formState, reset, getFieldState } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
  })
  const { errors } = formState

  function isFieldValid(name: keyof ProfileFormValues) {
    const field = getFieldState(name)
    return !field.error
  }

  // ✅ Fetch both the form values and countries
  useEffect(() => {
    async function fetchData() {
      const [userData, countryList] = await Promise.all([
        new Promise<ProfileFormValues>(res =>
          setTimeout(() => res({ name: "علی", email: "ali@example.com", country: "ir" }), 300),
        ),
        new Promise<Country[]>(res =>
          setTimeout(
            () =>
              res([
                { id: "ir", name: "ایران" },
                { id: "us", name: "آمریکا" },
                { id: "de", name: "آلمان" },
              ]),
            500,
          ),
        ),
      ])

      setCountries(countryList)
      reset(userData) // ✅ Inject fetched values into RHF
      setLoading(false)
    }

    fetchData()
  }, [reset])

  return (
    <HeadingLine title="پروفایل">
      <div className="flex flex-col gap-8 bg-slate-2 border border-slate-6 p-4 rounded-md">
        <h2 className="text-2xl font-bold flex items-center gap-1 justify-center">
          <GearSixIcon size={32} />
          <span>تنظیمات</span>
        </h2>

        <Labeler labelText="نام" errorMsg={errors.name?.message} isValid={isFieldValid("name")}>
          <Input {...register("name")} />
        </Labeler>

        <Labeler labelText="ایمیل" errorMsg={errors.email?.message} isValid={isFieldValid("email")}>
          <Input {...register("email")} />
        </Labeler>

        <Labeler
          labelText="کشور"
          errorMsg={errors.country?.message}
          isValid={isFieldValid("country")}
        >
          <SelectWithCountry
            {...register("country")}
            options={countries}
            isLoading={loading}
            keys={{ id: "id", value: "id", text: "name" }}
          />
        </Labeler>
      </div>
    </HeadingLine>
  )
}
