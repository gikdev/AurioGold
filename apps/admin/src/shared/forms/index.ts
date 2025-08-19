import genDatApiConfig from "../datapi-config"

const getBearer = () => ({
  Authorization: `Bearer ${genDatApiConfig().token}`,
})

export const getHeaderTokenOnly = () => ({
  headers: { ...getBearer() },
})

interface Field {
  state: {
    meta: {
      isValid: boolean
      errors?: Array<{ message?: string } | undefined>
    }
  }
}

export const extractError = (field: Field) =>
  field.state.meta.isValid ? undefined : field.state.meta.errors?.map(e => e?.message)?.join("، ")

// import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
//
// const { fieldContext, formContext, useFieldContext } = createFormHookContexts()
//
// const { useAppForm } = createFormHook({
//   fieldContext,
//   formContext,
//   fieldComponents: {},
//   formComponents: {},
// })
