import { useApiRequest } from "@gikdev/react-datapi/src"
import { PenIcon } from "@phosphor-icons/react"
import { storageManager } from "@repo/shared/adapters"
import { BtnTemplates, TextArea, TitledCardExpandable } from "@repo/shared/components"
import z from "zod"
import { useCustomForm } from "#/shared/customForm"
import { type MasterInfo, MemoizedAnimatedReloadBtn, saveKey } from "./shared"

const EditMainPageContentSchema = z.object({
  content: z.string().default(""),
})
type EditMainPageContentFormValues = z.input<typeof EditMainPageContentSchema>

export default function EditMainPageContentCard() {
  const { formState, register, handleSubmit, reset } = useCustomForm(EditMainPageContentSchema, {
    content: "",
  })
  const { isSubmitting } = formState

  const masterInfoRes = useApiRequest<string, MasterInfo | null>(() => ({
    url: "/Master/GetMasterInfo",
    defaultValue: "",
    transformResponse: raw => raw?.mainPage || "",
    onSuccess: data => reset({ content: data }),
  }))

  const handleSave = (data: EditMainPageContentFormValues) => {
    saveKey("MainPage", data.content || "", () => {
      storageManager.save("admin_mainPage", data.content || "", "sessionStorage")
    })
  }

  const btns = <MemoizedAnimatedReloadBtn onClick={() => masterInfoRes.reload()} />

  return (
    <TitledCardExpandable title="ثبت صفحه اصلی" icon={PenIcon} btns={btns}>
      <form onSubmit={handleSubmit(handleSave)} className="flex flex-col gap-5 overflow-hidden">
        <TextArea className="min-h-60" {...register("content")} />
        <BtnTemplates.Save disabled={isSubmitting} className="" themeType="filled" type="submit" />
      </form>
    </TitledCardExpandable>
  )
}
