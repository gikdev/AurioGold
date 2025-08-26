import { DeletePriceSourceModal } from "./DeletePriceSourceModal"
import { ManagementCard } from "./ManagementCard"
import { PriceSourceDetailsDrawer } from "./PriceSouceDetailsDrawer"
import { PriceSourceDrawer } from "./PriceSourceDrawer"
import { usePriceSourcesStore } from "./shared"

export function ManagePriceSources() {
  return (
    <>
      <ManagementCard />
      <PriceSourceDetailsDrawerWrapper />
      <DeletePriceSourceModalWrapper />
      <CreatePriceSourceDrawer />
      <EditPriceSourceDrawer />
    </>
  )
}

const handleClose = () => usePriceSourcesStore.getState().reset()

function PriceSourceDetailsDrawerWrapper() {
  const mode = usePriceSourcesStore(s => s.mode)
  const sourceId = usePriceSourcesStore(s => s.sourceId)

  const shouldBeOpen = mode === "details" && typeof sourceId === "number"

  return shouldBeOpen && <PriceSourceDetailsDrawer onClose={handleClose} sourceId={sourceId} />
}

function DeletePriceSourceModalWrapper() {
  const mode = usePriceSourcesStore(s => s.mode)
  const sourceId = usePriceSourcesStore(s => s.sourceId)

  const shouldBeOpen = mode === "remove" && typeof sourceId === "number"

  return shouldBeOpen && <DeletePriceSourceModal onClose={handleClose} sourceId={sourceId} />
}

function CreatePriceSourceDrawer() {
  const mode = usePriceSourcesStore(s => s.mode)

  const shouldBeOpen = mode === "create"

  return shouldBeOpen && <PriceSourceDrawer mode="create" onClose={handleClose} />
}

function EditPriceSourceDrawer() {
  const mode = usePriceSourcesStore(s => s.mode)
  const sourceId = usePriceSourcesStore(s => s.sourceId)

  const shouldBeOpen = mode === "edit" && typeof sourceId === "number"

  return shouldBeOpen && <PriceSourceDrawer mode="edit" sourceId={sourceId} onClose={handleClose} />
}
