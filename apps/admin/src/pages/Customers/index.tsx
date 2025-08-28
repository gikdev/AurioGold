import { HeadingLine } from "@repo/shared/layouts"
import { CustomerDetailsDrawer } from "./CustomerDetailsDrawer"
import { DeleteCustomerModal } from "./DeleteCustomerModal"
import { ManagementCard } from "./ManagementCard"
import { useCustomersStore } from "./store"

export default function Customers() {
  return (
    <HeadingLine title="مدیریت مشتریان">
      <ManagementCard />
      <CreateCustomerDrawerWrapper />
      <EditCustomerDrawerWrapper />
      <DeleteCustomerModalWrapper />
      <CustomerDetailsDrawerWrapper />
      <CustomerDocDrawerWrapper />
      <CustomerTransferDrawerWrapper />
      <CustomerBalanceDrawerWrapper />
    </HeadingLine>
  )
}

const handleClose = () => useCustomersStore.getState().reset()

function CreateCustomerDrawerWrapper() {
  return null
}

function EditCustomerDrawerWrapper() {
  return null
}

function DeleteCustomerModalWrapper() {
  const mode = useCustomersStore(s => s.mode)
  const customerId = useCustomersStore(s => s.customerId)

  const isOpen = mode === "delete" && typeof customerId === "number"

  return isOpen && <DeleteCustomerModal onClose={handleClose} customerId={customerId} />
}

function CustomerDetailsDrawerWrapper() {
  const mode = useCustomersStore(s => s.mode)
  const customerId = useCustomersStore(s => s.customerId)

  const isOpen = mode === "details" && typeof customerId === "number"

  return isOpen && <CustomerDetailsDrawer customerId={customerId} onClose={handleClose} />
}

function CustomerDocDrawerWrapper() {
  return null
}

function CustomerTransferDrawerWrapper() {
  return null
}

function CustomerBalanceDrawerWrapper() {
  return null
}
