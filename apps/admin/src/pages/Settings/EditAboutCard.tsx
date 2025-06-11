import { useApiRequest } from "@gikdev/react-datapi/src"
import { PenIcon } from "@phosphor-icons/react"
import { storageManager } from "@repo/shared/adapters"
import { BtnTemplates, TextArea, TitledCardExpandable } from "@repo/shared/components"
import z from "zod"
import { useCustomForm } from "#/shared/customForm"
import { type MasterInfo, MemoizedAnimatedReloadBtn, saveKey } from "./shared"

const EditAboutSchema = z.object({
  about: z.string().default(""),
})
type EditAboutFormValues = z.input<typeof EditAboutSchema>

export default function EditAboutCard() {
  const { formState, register, handleSubmit, reset } = useCustomForm(EditAboutSchema, { about: "" })
  const { isSubmitting } = formState

  const masterInfoRes = useApiRequest<string, MasterInfo | null>(() => ({
    url: "/Master/GetMasterInfo",
    defaultValue: "",
    transformResponse: raw => raw?.aboutUs || "",
    onSuccess: data => reset({ about: data }),
  }))

  const handleSave = (data: EditAboutFormValues) => {
    saveKey("AboutUs", data.about || "", () => {
      storageManager.save("aboutUs", data.about || "", "sessionStorage")
    })
  }

  const btns = <MemoizedAnimatedReloadBtn onClick={() => masterInfoRes.reload()} />

  return (
    <TitledCardExpandable title="ثبت درباره ما" icon={PenIcon} btns={btns}>
      <form onSubmit={handleSubmit(handleSave)} className="flex flex-col gap-5 overflow-hidden">
        <TextArea className="min-h-60" {...register("about")} />
        <BtnTemplates.Save disabled={isSubmitting} className="" themeType="filled" type="submit" />
      </form>
    </TitledCardExpandable>
  )
}
