import styled from "@master/styled.react"
import { Switch as RadixSwitch } from "radix-ui"
import { forwardRef } from "react"
import type { ComponentProps, ComponentPropsWithoutRef, ForwardedRef } from "react"

export interface SwitchProps extends ComponentPropsWithoutRef<typeof RadixSwitch.Root> {
  /** Optional classes to apply when the switch is ON */
  checkedClassName?: string
  /** Optional classes to apply when the switch is OFF */
  unCheckedClassName?: string
}

/**
 * A custom switch component built on top of Radix UI with dynamic styling.
 *
 * @example
 * ```tsx
 * <Switch
 *   checked={isEnabled}
 *   onCheckedChange={setIsEnabled}
 *   checkedClassName="bg-green-600"
 *   unCheckedClassName="bg-red-400"
 * />
 * ```
 */
export const Switch = forwardRef(function Switch(
  props: SwitchProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const {
    checked,
    checkedClassName = "bg-amber-9",
    unCheckedClassName = "bg-slate-6",
    className = "",
    ...rest
  } = props

  const StyledSwitchRoot = styled(RadixSwitch.Root)(
    "w-12 h-7 p-1 flex items-center rounded transition-all cursor-pointer",
    checked ? checkedClassName : unCheckedClassName,
    checked ? "justify-end" : "justify-start",
    className,
  )

  const StyledThumb = styled(RadixSwitch.Thumb)`
    size-5 bg-white inline-block rounded shadow-lg
  `

  return (
    <StyledSwitchRoot
      ref={ref as ComponentProps<typeof StyledSwitchRoot>["ref"]}
      checked={checked}
      {...rest}
    >
      <StyledThumb />
    </StyledSwitchRoot>
  )
})
