import { cva } from "../lib/cva.config"

const labelerContainer = cva({ base: "flex flex-col gap-2" })

const labelerLabelsContainer = cva({ base: "flex gap-1 items-center flex-wrap" })

const input = cva({
  base: `
    w-full
    px-4 py-2
    rounded
    min-h-13
    outline-0

    border
    border-slate-7 focus:border-amber-8 disabled:border-slate-6
    text-slate-11  focus:text-slate-12  disabled:text-slate-11
    bg-slate-3     focus:bg-slate-5     disabled:bg-slate-3
    cursor-text                         disabled:cursor-not-allowed

    disabled:opacity-50

    transition-all
  `,
})

const select = cva({
  base: `
    w-full
    px-4 py-2
    rounded
    min-h-13 
    outline-0
    text-base

    border
    border-slate-7 focus:border-amber-8 disabled:border-slate-6
    text-slate-11  focus:text-slate-12  disabled:text-slate-11
    bg-slate-3     focus:bg-slate-5     disabled:bg-slate-3
    cursor-pointer                      disabled:cursor-not-allowed

    disabled:opacity-50

    transition-all
  `,
})

const textarea = cva({
  base: `
    w-full
    px-4 py-2
    rounded
    min-h-16
    outline-0

    border
    border-slate-7 focus:border-amber-8 disabled:border-slate-6
    text-slate-11  focus:text-slate-12  disabled:text-slate-11
    bg-slate-3     focus:bg-slate-5     disabled:bg-slate-3
    cursor-text                         disabled:cursor-not-allowed

    disabled:opacity-50

    transition-colors
  `,
})

const hint = cva({ base: "text-xs" })
const errorMsg = cva({ base: "text-red-10 text-xs" })

const btn = cva({
  base: `
    rounded

    flex items-center

    active:scale-95 disabled:active:scale-100
    cursor-pointer  disabled:cursor-not-allowed

    disabled:bg-slate-3
    disabled:text-slate-11
    disabled:opacity-50
    disabled:border-slate-6

    select-none
    *:shrink-0
    *:break-words
    [&_svg]:text-[1.5em]

    hover:brightness-110  disabled:hover:brightness-100
    hover:scale-[1.05]    disabled:hover:scale-100
  `,
  variants: {
    intent: {
      success: "",
      error: "",
      warning: "",
      info: "",
      primary: "",
      neutral: "",
    },
    style: {
      filled: "",
      outline: "border",
    },
    size: {
      small: " min-h-8  py-1 px-3 text-sm   gap-0.5",
      medium: "min-h-10 py-2 px-4 text-base gap-1  ",
      large: " min-h-12 py-3 px-5 text-lg   gap-1.5",
    },
    isIcon: {
      false: null,
      true: "aspect-square px-1 gap-0",
    },
    justify: {
      center: "justify-center",
      between: "justify-between",
    },
  },
  compoundVariants: [
    // isIcon
    { size: "small", isIcon: true, className: "w-8" },
    { size: "medium", isIcon: true, className: "w-10" },
    { size: "large", isIcon: true, className: "w-12" },

    // Outline variants
    {
      intent: "success",
      style: "outline",
      className: "bg-jade-3 text-jade-11 border border-jade-7",
    },
    { intent: "error", style: "outline", className: "bg-red-3 text-red-11 border border-red-7" },
    {
      intent: "warning",
      style: "outline",
      className: "bg-yellow-3 text-yellow-11 border border-yellow-7",
    },
    { intent: "info", style: "outline", className: "bg-blue-3 text-blue-11 border border-blue-7" },
    {
      intent: "primary",
      style: "outline",
      className: "bg-brand-3 text-brand-11 border border-brand-7",
    },
    {
      intent: "neutral",
      style: "outline",
      className: "bg-slate-3 text-slate-11 border border-slate-7",
    },

    // Filled variants
    { intent: "success", style: "filled", className: "bg-green-9 text-slate-12" },
    { intent: "error", style: "filled", className: "bg-red-9 text-slate-12" },
    { intent: "warning", style: "filled", className: "bg-yellow-9 text-slate-1" },
    { intent: "info", style: "filled", className: "bg-blue-9 text-slate-12" },
    { intent: "primary", style: "filled", className: "bg-brand-9 text-slate-1" },
    { intent: "neutral", style: "filled", className: "bg-slate-12 text-slate-1" },
  ],
  defaultVariants: {
    intent: "neutral",
    style: "outline",
    size: "medium",
    isIcon: false,
    justify: "center",
  },
})

export const skins = {
  labelerContainer,
  labelerLabelsContainer,
  input,
  select,
  textarea,
  errorMsg,
  btn,
  hint,
}
