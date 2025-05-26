import clsx, { type ClassValue } from "clsx"
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ElementType,
  forwardRef,
} from "react"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

type StyledProps<T extends ElementType> = ComponentPropsWithoutRef<T> & {
  as?: T
  className?: string
}

export function styled<TDefault extends React.ElementType>(
  DefaultComponent: TDefault,
  ...baseClass: ClassValue[]
) {
  return forwardRef<ComponentRef<TDefault>, StyledProps<TDefault>>(
    ({ as, className, ...props }, ref) => {
      const Component = as || DefaultComponent
      return <Component ref={ref} className={cn(baseClass, className)} {...props} />
    },
  )
}
