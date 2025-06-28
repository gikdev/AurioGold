import { PenIcon } from "@phosphor-icons/react"
import { Btn } from "@repo/shared/components"
import { allowedTypes, handleImageLoadError } from "./profileImageUtils"
import { useProfileImageUpload } from "./useProfileImageUpload"

export default function ProfileImage() {
  const { imageUrl, fileInputRef, handleFileChange } = useProfileImageUpload()

  return (
    <div className="relative">
      <Btn as="label" className="w-10 p-0 absolute left-1 top-1" title="تغییر عکس پروفایل">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={allowedTypes.join(",")}
          onChange={handleFileChange}
        />

        <PenIcon size={24} />
      </Btn>

      <img
        src={imageUrl}
        alt="عکس پروفایل"
        title="عکس پروفایل"
        className="w-full block rounded-md"
        onError={handleImageLoadError}
      />
    </div>
  )
}
