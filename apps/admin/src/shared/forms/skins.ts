import { cva } from "../cva.config"

export const labelerContainer = cva({ base: "flex flex-col gap-2" })
export const labelerLabelsContainer = cva({ base: "flex gap-1 items-center flex-wrap" })
export const input = cva({
  base: `
    px-4 py-3 bg-slate-3 border border-slate-7
    rounded text-slate-11 w-full focus:border-amber-8
    focus:bg-slate-5 focus:text-slate-12 transition-all
  `,
})
export const textarea = cva({
  base: `
    px-4 py-3 bg-slate-3 border border-slate-6
    transition-colors rounded text-slate-11 w-full
    outline-0 min-h-10 focus:border-brand-8
    focus:bg-slate-5 focus:text-slate-12
  `,
})
