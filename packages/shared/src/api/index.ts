import { postApiTyFilesUpload } from "@repo/api-client/client"
import { v4 as uuidv4 } from "uuid"
import { getToken } from "#shared/auth"
import { parseError } from "#shared/helpers"

export type UploadResult = { success: true; fileStr: string } | { success: false; errorMsg: string }

const fallbackErrorMsg = "آپلود فایل ناموفق بود"

export async function uploadFile(file: File, isPrivate: boolean): Promise<UploadResult> {
  try {
    const fileName = file.name
    const lastDotPosition = fileName.lastIndexOf(".")
    const fileExt = fileName.slice(lastDotPosition, fileName.length)

    const res = await postApiTyFilesUpload({
      auth: getToken(),
      body: {
        File: file,
        Name: uuidv4() + fileExt,
        Description: "",
        IsPrivate: isPrivate,
      },
    })

    if (res.error) throw res.error

    return { success: true, fileStr: isPrivate ? res.data?.id || "" : res.data?.adress || "" }
  } catch (err) {
    return { success: false, errorMsg: parseError(err, fallbackErrorMsg) }
  }
}
