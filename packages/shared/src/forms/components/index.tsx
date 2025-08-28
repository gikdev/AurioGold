import { createFormHook } from "@tanstack/react-form"
import { Btn } from "./Btn"
import { FileInput } from "./FileInput"
import { MultilineText } from "./MultilineText"
import { SimpleNumber } from "./SimpleNumber"
import { SimplePassword } from "./SimplePassword"
import { SimpleSelect } from "./SimpleSelect"
import { SimpleSwitch } from "./SimpleSwitch"
import { SimpleText } from "./SimpleText"
import { fieldContext, formContext } from "./shared"

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    SimpleNumber,
    SimpleText,
    MultilineText,
    SimpleSelect,
    SimplePassword,
    SimpleSwitch,
    FileInput,
  },
  formComponents: {
    Btn,
  },
})
