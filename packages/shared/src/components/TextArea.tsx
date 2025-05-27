import { styled } from "#shared/helpers"

export const TextArea = styled(
  "textarea",
  `
    px-4 py-3 bg-slate-3 border border-slate-6 rounded text-slate-11 w-full
    min-h-10 focus:border-transparent focus:bg-slate-5 focus:text-slate-12
  `,
)
