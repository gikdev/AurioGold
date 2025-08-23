import type { PropsWithChildren } from "react"
import { Navigate } from "react-router"
import { useProductId } from "./shared"

const isValidNumber = (n: unknown) => typeof n === "number" && !Number.isNaN(n)

export function HandleValidProductId({ children }: PropsWithChildren) {
  const productId = useProductId()
  const isValid = isValidNumber(productId)

  return isValid ? children : <Navigate to="/not-found" replace />
}
