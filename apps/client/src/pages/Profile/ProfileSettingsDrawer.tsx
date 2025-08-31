import { apiRequest } from "@gikdev/react-datapi/src"
import { zodResolver } from "@hookform/resolvers/zod"
import { PasswordIcon, WarningIcon } from "@phosphor-icons/react"
import type { KeyData, Ufm } from "@repo/api-client/client"
import {
  BtnTemplates,
  DrawerSheet,
  // FileInput,
  Input,
  Labeler,
  TextArea,
  useDrawerSheet,
} from "@repo/shared/components"
import { createControlledAsyncToast, createFieldsWithLabels } from "@repo/shared/helpers"
import { useAtomValue } from "jotai"
import { memo, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import z from "zod"
import { profileAtom } from "#/atoms"
import genDatApiConfig from "#/shared/datapi-config"
import routes from "../routes"
import { QUERY_KEYS } from "./navigation"

// import { MAX_FILE_SIZE_FOR_UPLOAD } from "@repo/shared/lib"
// import { uploadFile } from "#/shared/customForm"

// const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"]

const { fields, labels } = createFieldsWithLabels({
  displayName: "نام *",
  codeMelli: "کد ملی: ",
  city: "شهر: ",
  address: "آدرس: ",
  // melliID: "کارت ملی: ",
  // kasbsID: "جواز کسب: ",
})

// const imageNotes = [
//   FileInput.helpers.generateAllowedExtensionsNote(["png", "jpg", "jpeg"]),
//   FileInput.helpers.generateFileSizeNote(MAX_FILE_SIZE_FOR_UPLOAD),
//   FileInput.helpers.generateFileTypeNote("تصویر"),
// ]

const profileSettingsSchema = z.object({
  [fields.displayName]: z.string().optional().nullable().default(""),
  [fields.codeMelli]: z.string().optional().nullable().default(""),
  [fields.city]: z.string().optional().nullable().default(""),
  [fields.address]: z.string().optional().nullable().default(""),
  // [fields.melliID]: z.string().uuid().optional().nullable().default(null),
  // [fields.kasbsID]: z.string().uuid().optional().nullable().default(null),
})

type ProfileSettingsFormValues = z.input<typeof profileSettingsSchema>

function _ProfileSettingsDrawer() {
  const profile = useAtomValue(profileAtom)
  const [showDrawer, setShowDrawer] = useDrawerSheet(QUERY_KEYS.changeProfile)
  const { register, formState, handleSubmit, reset, trigger } = useForm<ProfileSettingsFormValues>({
    resolver: zodResolver(profileSettingsSchema),
  })
  const { errors, isSubmitting } = formState
  const navigate = useNavigate()

  useEffect(() => {
    reset(profile)
  }, [profile, reset])

  const handleClose = () => {
    setShowDrawer(false)
  }

  async function onSubmit(data: ProfileSettingsFormValues) {
    const { reject, resolve } = createControlledAsyncToast({
      pending: "در حال ثبت تغییرات...",
      success: "تغییرات با موفقیت ثبت شد!",
    })

    apiRequest({
      config: genDatApiConfig(),
      options: {
        url: "/Customer/UpdateF",
        method: "POST",
        body: JSON.stringify(mapToApiPayload(data)),
        onSuccess: () => {
          resolve()
          handleClose()
          reset()
          navigate(routes.logout)
        },
        onError: msg => {
          reject(msg)
        },
      },
    })
  }

  const submitTheFormManually = async () => {
    const isValid = await trigger()
    if (isValid) handleSubmit(onSubmit)()
  }

  return (
    <DrawerSheet
      open={showDrawer}
      title="تنظیمات پروفایل"
      icon={PasswordIcon}
      onClose={handleClose}
      actions={
        <div className="flex flex-col gap-2 p-2">
          <div className="bg-yellow-3 border border-yellow-7 text-yellow-11 p-2 rounded-md">
            <WarningIcon size={24} weight="fill" className="inline me-2" />
            <span>
              بعد اینکه تغییرات با موفقیت ذخیره شد، به طور خودکار از حساب خود خارج میشوید، که
              تغییرات کامل اعمال شوند!
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <BtnTemplates.Cancel onClick={handleClose} />

            <BtnTemplates.Save
              disabled={isSubmitting}
              themeType="filled"
              onClick={submitTheFormManually}
            />
          </div>
        </div>
      }
    >
      <form className="min-h-full flex flex-col py-4 gap-5" autoComplete="off">
        <Labeler labelText={labels.displayName} errorMsg={errors.displayName?.message}>
          <Input
            {...register(fields.displayName)}
            className={errors.displayName ? "border-red-7" : ""}
            dir="ltr"
          />
        </Labeler>
        <Labeler labelText={labels.city} errorMsg={errors.city?.message}>
          <Input
            {...register(fields.city)}
            className={errors.city ? "border-red-7" : ""}
            dir="ltr"
          />
        </Labeler>
        <Labeler labelText={labels.codeMelli} errorMsg={errors.codeMelli?.message}>
          <Input
            {...register(fields.codeMelli)}
            className={errors.codeMelli ? "border-red-7" : ""}
            dir="ltr"
          />
        </Labeler>
        <Labeler labelText={labels.address} errorMsg={errors.address?.message}>
          <TextArea
            {...register(fields.address)}
            className={errors.address ? "border-red-7" : ""}
            dir="ltr"
          />
        </Labeler>
      </form>
    </DrawerSheet>
  )
}

const ProfileSettingsDrawer = memo(_ProfileSettingsDrawer)
export default ProfileSettingsDrawer

function mapToApiPayload(input: ProfileSettingsFormValues): Ufm {
  const dataVal: KeyData[] = []

  // Helper to add fields only if they have values
  const addField = (key: string, value: string | null | undefined) => {
    if (value !== null && value !== undefined && value !== "") {
      dataVal.push({ key, val: value })
    }
  }

  addField("DisplayName", input[fields.displayName])
  addField("CodeMelli", input[fields.codeMelli])
  addField("City", input[fields.city])
  addField("Address", input[fields.address])

  // if (input[fields.melliID] && z.string().uuid().safeParse(input[fields.melliID]).success) {
  //   addField("MelliID", input[fields.melliID])
  // }

  // if (input[fields.kasbsID] && z.string().uuid().safeParse(input[fields.kasbsID]).success) {
  //   addField("KasbsID", input[fields.kasbsID])
  // }

  return { dataVal }
}
