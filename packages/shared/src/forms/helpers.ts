function generateAllowedExtensionsNote(formats: string[]) {
  return `فرمت‌های جایز: ${formats.join(" ،")}`
}

function generateFileSizeNote(maxFileSizeInMb: number) {
  return `حداکثر حجم مجاز فایل ${maxFileSizeInMb} مگابایت هست`
}

function generateFileTypeNote(fileTypes: string | string[]) {
  if (typeof fileTypes === "string") return `فقط میتوانید «${fileTypes}» انتخاب کنید`
  if (Array.isArray(fileTypes) && fileTypes.length === 1)
    return `فقط میتوانید «${fileTypes[0]}» انتخاب کنید`

  const fileTypesString = fileTypes
    .map((f, i) => (i >= fileTypes.length - 1 ? `و «${f}»` : `«${f}»، `))
    .join("")

  return `فقط میتوانید ${fileTypesString} انتخاب کنید`
}

export const notesHelpers = {
  generateAllowedExtensionsNote,
  generateFileSizeNote,
  generateFileTypeNote,
}
