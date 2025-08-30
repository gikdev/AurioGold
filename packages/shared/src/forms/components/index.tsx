import { createFormHook } from "@tanstack/react-form"
import { Btn } from "./Btn"
import { CommaField } from "./CommaField"
import { CurrencyField } from "./CurrencyField"
import { FileInput } from "./FileInput"
import { MultilineText } from "./MultilineText"
import { SimpleNumber } from "./SimpleNumber"
import { SimplePassword } from "./SimplePassword"
import { SimpleRadios } from "./SimpleRadios"
import { SimpleSelect } from "./SimpleSelect"
import { SimpleSwitch } from "./SimpleSwitch"
import { SimpleText } from "./SimpleText"
import { fieldContext, formContext } from "./shared"
import { TomanField } from "./TomanField"

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
    SimpleRadios,
    CurrencyField,
    CommaField,
    TomanField,
  },
  formComponents: {
    Btn,
  },
})
