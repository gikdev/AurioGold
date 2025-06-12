import type { CustomerDto } from "@repo/api-client/client"
import { HeadingLine } from "@repo/shared/layouts"
import { atom } from "jotai"
import ManageCustomers from "./ManageCustomers"

export const customersAtom = atom<CustomerDto[]>([])

export default function Customers() {
  return (
    <HeadingLine title="مدیریت مشتریان">
      <ManageCustomers />
    </HeadingLine>
  )
}
