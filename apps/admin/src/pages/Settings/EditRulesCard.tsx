import { useApiRequest } from "@gikdev/react-datapi/src"
import { PenIcon } from "@phosphor-icons/react"
import { storageManager } from "@repo/shared/adapters"
import { BtnTemplates, TextArea, TitledCardExpandable } from "@repo/shared/components"
import z from "zod"
import { useCustomForm } from "#/shared/customForm"
import { type MasterInfo, MemoizedAnimatedReloadBtn, saveKey } from "./shared"

const EditRulesSchema = z.object({
  rules: z.string().default(""),
})
type EditRulesFormValues = z.input<typeof EditRulesSchema>

export default function EditRulesCard() {
  const { formState, register, handleSubmit, reset } = useCustomForm(EditRulesSchema, { rules: "" })
  const { isSubmitting } = formState

  const masterInfoRes = useApiRequest<string, MasterInfo | null>(() => ({
    url: "/Master/GetMasterInfo",
    defaultValue: "",
    transformResponse: raw => raw?.rulls || "",
    onSuccess: data => reset({ rules: data }),
  }))

  const handleSave = (data: EditRulesFormValues) => {
    saveKey("Rulls", data.rules || "", () => {
      storageManager.save("admin_rulls", data.rules || "", "sessionStorage")
    })
  }

  const btns = <MemoizedAnimatedReloadBtn onClick={() => masterInfoRes.reload()} />

  return (
    <TitledCardExpandable title="ثبت قوانین" icon={PenIcon} btns={btns}>
      <form onSubmit={handleSubmit(handleSave)} className="flex flex-col gap-5 overflow-hidden">
        <TextArea className="min-h-60" {...register("rules")} />
        <BtnTemplates.Save disabled={isSubmitting} className="" themeType="filled" type="submit" />
      </form>
    </TitledCardExpandable>
  )
}
