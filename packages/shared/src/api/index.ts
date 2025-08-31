import { postApiTyFilesUpload } from "@repo/api-client/client"
import { v4 as uuidv4 } from "uuid"
import { getToken } from "#shared/auth"

export type UploadResult = { success: true; fileStr: string } | { success: false; errorMsg: string }

export async function uploadFile(
  app: "admin" | "client",
  file: File,
  isPrivate: boolean,
): Promise<string> {
  const fileName = file.name
  const lastDotPosition = fileName.lastIndexOf(".")
  const fileExt = fileName.slice(lastDotPosition, fileName.length)

  const res = await postApiTyFilesUpload({
    throwOnError: true,
    auth: getToken(app),
    body: {
      File: file,
      Name: uuidv4() + fileExt,
      Description: "",
      IsPrivate: isPrivate,
    },
  })

  return isPrivate ? res.data?.id || "" : res.data?.adress || ""
}
