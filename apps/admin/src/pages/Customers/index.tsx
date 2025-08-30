import { HeadingLine } from "@repo/shared/layouts"
import { CustomerBalanceDrawer } from "./CustomerBalanceDrawer"
import { CustomerDetailsDrawer } from "./CustomerDetailsDrawer"
import { CustomerDocDrawer } from "./CustomerDocDrawer"
import { CustomerDrawer } from "./CustomerDrawer"
import { CustomerTransferDrawer } from "./CustomerTransferDrawer"
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
      <CustomerBalanceDrawerWrapper />
      <CustomerDocDrawerWrapper />
      <CustomerTransferDrawerWrapper />
    </HeadingLine>
  )
}

const handleClose = () => useCustomersStore.getState().reset()

function CreateCustomerDrawerWrapper() {
  const mode = useCustomersStore(s => s.mode)

  const isOpen = mode === "create"

  return isOpen && <CustomerDrawer mode="create" onClose={handleClose} />
}

function EditCustomerDrawerWrapper() {
  const mode = useCustomersStore(s => s.mode)
  const customerId = useCustomersStore(s => s.customerId)

  const isOpen = mode === "edit" && typeof customerId === "number"

  return isOpen && <CustomerDrawer mode="edit" onClose={handleClose} customerId={customerId} />
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

function CustomerBalanceDrawerWrapper() {
  const mode = useCustomersStore(s => s.mode)
  const customerId = useCustomersStore(s => s.customerId)

  const isOpen = mode === "balance" && typeof customerId === "number"

  return isOpen && <CustomerBalanceDrawer customerId={customerId} onClose={handleClose} />
}

function CustomerDocDrawerWrapper() {
  const mode = useCustomersStore(s => s.mode)
  const customerId = useCustomersStore(s => s.customerId)

  const isOpen = mode === "doc" && typeof customerId === "number"

  return isOpen && <CustomerDocDrawer customerId={customerId} onClose={handleClose} />
}

function CustomerTransferDrawerWrapper() {
  const mode = useCustomersStore(s => s.mode)
  const customerId = useCustomersStore(s => s.customerId)
  const stockId = useCustomersStore(s => s.stockId)

  const isOpen =
    mode === "transfer" && typeof customerId === "number" && typeof stockId === "number"

  return (
    isOpen && (
      <CustomerTransferDrawer customerId={customerId} onClose={handleClose} stockId={stockId} />
    )
  )
}
