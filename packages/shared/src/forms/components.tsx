import { createFormHook } from "@tanstack/react-form"
import { Btn } from "./components/Btn"
import { MultilineText } from "./components/MultilineText"
import { SimpleNumber } from "./components/SimpleNumber"
import { SimplePassword } from "./components/SimplePassword"
import { SimpleSelect } from "./components/SimpleSelect"
import { SimpleSwitch } from "./components/SimpleSwitch"
import { SimpleText } from "./components/SimpleText"
import { fieldContext, formContext } from "./components/shared"

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
  },
  formComponents: {
    Btn,
  },
})
