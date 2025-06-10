import { useApiRequest } from "@gikdev/react-datapi/src"
import {
  ArrowCounterClockwiseIcon,
  CardsIcon,
  InfoIcon,
  PenIcon,
  TableIcon,
  TrashIcon,
  UserCirclePlusIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react"
import type { CustomerDto } from "@repo/api-client/client"
import {
  Btn,
  FloatingActionBtn,
  IconsToggle,
  TableFa,
  TitledCard,
  createViewModes,
} from "@repo/shared/components"
import { useIsMobile } from "@repo/shared/hooks"
import type { ColDef } from "ag-grid-community"
import { useState } from "react"
import { Link } from "react-router"
import { queryStateUrls } from "."
import CreateCustomerDrawer from "./CreateCustomerDrawer"
import { CustomerCard, CustomerCardsContainer } from "./CustomerCards"
import CustomerDetails from "./CustomerDetails"
import DeleteCustomerModal from "./DeleteCustomerModal"
import EditCustomerDrawer from "./EditCustomerDrawer"

const viewModeSetup = createViewModes([
  { id: "cards", icon: CardsIcon },
  { id: "table", icon: TableIcon },
])
type ViewModes = typeof viewModeSetup.type
const viewModes = viewModeSetup.items

export default function ManageCustomers() {
  const isMobile = useIsMobile()
  const [viewMode, setMode] = useState<ViewModes>("cards")
  const customersRes = useApiRequest<CustomerDto[]>(() => ({
    url: "/Master/GetCustomers",
    defaultValue: [],
  }))

  const titledCardActions = (
    <div className="ms-auto flex items-center gap-2">
      <Btn className="h-10 w-10 p-1" onClick={() => customersRes.reload()}>
        <ArrowCounterClockwiseIcon size={24} />
      </Btn>

      <CreateCustomerFAB />
      <IconsToggle items={viewModes} activeItemId={viewMode} onChange={setMode} />
    </div>
  )

  return (
    <>
      <DeleteCustomerModal reloadCustomers={() => customersRes.reload()} />
      <CreateCustomerDrawer reloadCustomers={() => customersRes.reload()} />
      <EditCustomerDrawer
        reloadCustomers={() => customersRes.reload()}
        customers={customersRes.data ?? []}
      />
      <CustomerDetails customers={customersRes.data ?? []} />

      <TitledCard
        title="مدیریت مشتریان"
        icon={UsersThreeIcon}
        titleSlot={titledCardActions}
        className={!isMobile && viewMode === "table" ? "max-w-240" : undefined}
      >
        {customersRes.loading && <div className="h-100 rounded-md animate-pulse bg-slate-4" />}

        {customersRes.success && !customersRes.loading && viewMode === "cards" && (
          <CustomerCardsContainer>
            {(customersRes.data || []).map(c => (
              <CustomerCard
                key={c.id}
                displayName={c.displayName}
                id={c.id}
                isActive={c.isActive}
                isBlocked={c.isBlocked}
              />
            ))}
          </CustomerCardsContainer>
        )}

        {customersRes.success && !customersRes.loading && viewMode === "table" && (
          <CustomersTable customers={customersRes.data || []} />
        )}
      </TitledCard>
    </>
  )
}

function CreateCustomerFAB() {
  return (
    <FloatingActionBtn
      title="ایجاد مشتری جدید"
      icon={UserCirclePlusIcon}
      to={queryStateUrls.createNew()}
      data-testid="create-customer-btn"
      theme="success"
      fallback={
        <Btn
          type="button"
          className="h-10 w-10 text-xs px-0"
          theme="success"
          title="ایجاد مشتری جدید"
          as={Link}
          to={queryStateUrls.createNew()}
          data-testid="create-customer-btn"
        >
          <UserCirclePlusIcon size={24} className="transition-all" />
        </Btn>
      }
    />
  )
}

function ManagementBtns({ data: { id } }: { data: CustomerDto }) {
  return (
    <div className="flex items-center gap-1 py-1">
      <Btn as={Link} to={queryStateUrls.details(id)} className="h-8 w-8 p-1" theme="info">
        <InfoIcon size={20} />
      </Btn>

      <Btn as={Link} to={queryStateUrls.edit(id)} className="h-8 w-8 p-1" theme="warning">
        <PenIcon size={20} />
      </Btn>

      <Btn as={Link} to={queryStateUrls.delete(id)} className="h-8 w-8 p-1" theme="error">
        <TrashIcon size={20} />
      </Btn>
    </div>
  )
}

const columnDefs: ColDef[] = [
  { headerName: "مدیریت", cellRenderer: ManagementBtns },
  { field: "groupName", headerName: "گروه گرمی" },
  { field: "groupIntName", headerName: "گروه عددی" },
  { field: "displayName", headerName: "نام" },
  { field: "mobile", headerName: "موبایل" },
  { field: "codeMelli", headerName: "کد ملی" },
  { field: "isActive", headerName: "فعال هست؟" },
  { field: "isBlocked", headerName: "مسدود کردن معامله" },
  { field: "allowedDevices", headerName: "تعداد دستگاه های مجاز", minWidth: 200 },
  { field: "id", headerName: "آیدی" },
]

function CustomersTable({ customers }: { customers: CustomerDto[] }) {
  return (
    <div className="h-160">
      <TableFa columnDefs={columnDefs} rowData={customers} />
    </div>
  )
}
