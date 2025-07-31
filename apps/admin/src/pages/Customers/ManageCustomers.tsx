import { ArrowClockwiseIcon, UserCirclePlusIcon, UsersThreeIcon } from "@phosphor-icons/react"
import type { CustomerDto } from "@repo/api-client/client"
import { getApiMasterGetCustomersOptions } from "@repo/api-client/tanstack"
import {
  Btn,
  BtnTemplates,
  createTypedTableFa,
  FloatingActionBtn,
  TitledCard,
  useViewModes,
} from "@repo/shared/components"
import { getIsMobile } from "@repo/shared/hooks"
import { cellRenderers } from "@repo/shared/lib"
import { useQuery } from "@tanstack/react-query"
import type { ColDef } from "ag-grid-community"
import { Link } from "react-router"
import { generateLabelPropertyGetter } from "#/shared/customForm"
import { getHeaderTokenOnly } from "#/shared/react-query"
import CreateCustomerDrawer from "./CreateCustomerDrawer"
import CustomerBalanceDrawer from "./CustomerBalanceDrawer"
import { CustomerCard, CustomerCardsContainer } from "./CustomerCards"
import CustomerDetails from "./CustomerDetails"
import CustomerDocDrawer from "./CustomerDocDrawer"
import CustomerTransferDrawer from "./CustomerTransferDrawer"
import { customerFormFields } from "./customerFormShared"
import DeleteCustomerModal from "./DeleteCustomerModal"
import EditCustomerDrawer from "./EditCustomerDrawer"
import { CustomerNavigation } from "./navigation"

export const useCustomersQuery = () =>
  useQuery(getApiMasterGetCustomersOptions(getHeaderTokenOnly()))

export default function ManageCustomers() {
  const isMobile = getIsMobile()
  const { renderedIconsToggle, viewMode } = useViewModes()
  const { data: customers = [], refetch, isPending, isSuccess } = useCustomersQuery()

  const titledCardActions = (
    <div className="ms-auto flex items-center gap-2">
      <Btn className="h-10 w-10 p-1" onClick={() => refetch()}>
        <ArrowClockwiseIcon size={24} />
      </Btn>

      <CreateCustomerFAB />
      {renderedIconsToggle}
    </div>
  )

  return (
    <>
      <DeleteCustomerModal reloadCustomers={() => refetch()} />
      <CreateCustomerDrawer reloadCustomers={() => refetch()} />
      <EditCustomerDrawer customers={customers} reloadCustomers={() => refetch()} />
      <CustomerDetails customers={customers} />
      <CustomerDocDrawer customers={customers} />
      <CustomerTransferDrawer customers={customers} />
      <CustomerBalanceDrawer customers={customers} />

      <TitledCard
        title="مدیریت مشتریان"
        icon={UsersThreeIcon}
        titleSlot={titledCardActions}
        className={!isMobile && viewMode === "table" ? "max-w-240" : undefined}
      >
        {isPending && <div className="h-100 rounded-md animate-pulse bg-slate-4" />}

        {isSuccess && viewMode === "cards" && (
          <CustomerCardsContainer>
            {customers.map(c => (
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

        {isSuccess && viewMode === "table" && <CustomersTable customers={customers} />}
      </TitledCard>
    </>
  )
}

function CreateCustomerFAB() {
  return (
    <FloatingActionBtn
      title="ایجاد مشتری جدید"
      icon={UserCirclePlusIcon}
      to={CustomerNavigation.createNew()}
      theme="success"
      fallback={
        <Btn
          type="button"
          className="h-10 w-10 text-xs px-0"
          theme="success"
          title="ایجاد مشتری جدید"
          as={Link}
          to={CustomerNavigation.createNew()}
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
      <BtnTemplates.IconInfo
        as={Link}
        to={CustomerNavigation.details(id!)}
        className="min-h-8 w-8 p-1"
      />
      <BtnTemplates.IconEdit
        as={Link}
        to={CustomerNavigation.edit(id!)}
        className="min-h-8 w-8 p-1"
      />
      <BtnTemplates.IconDelete
        as={Link}
        to={CustomerNavigation.delete(id!)}
        className="min-h-8 w-8 p-1"
      />
    </div>
  )
}

const getLabelProperty = generateLabelPropertyGetter(customerFormFields.labels)

const columnDefs: ColDef<CustomerDto>[] = [
  { headerName: "مدیریت", cellRenderer: ManagementBtns },
  { field: "groupName", headerName: getLabelProperty("groupId") },
  { field: "groupIntName", headerName: getLabelProperty("numericGroupId") },
  { field: "displayName", headerName: getLabelProperty("displayName") },
  { field: "mobile", headerName: getLabelProperty("phone"), cellRenderer: cellRenderers.Ltr },
  {
    field: "codeMelli",
    headerName: getLabelProperty("nationalId"),
    cellRenderer: cellRenderers.Ltr,
  },
  {
    field: "isActive",
    headerName: getLabelProperty("isActive"),
    cellRenderer: cellRenderers.TrueFalse,
  },
  {
    field: "isBlocked",
    headerName: getLabelProperty("isBlocked"),
    cellRenderer: cellRenderers.TrueFalse,
  },
  {
    field: "allowedDevices",
    headerName: getLabelProperty("maxAllowedDevices"),
    cellRenderer: cellRenderers.Ltr,
    minWidth: 240,
  },
  { field: "id", headerName: "آی‌دی", cellRenderer: cellRenderers.Ltr },
]

const Table = createTypedTableFa<CustomerDto>()

function CustomersTable({ customers }: { customers: CustomerDto[] }) {
  return (
    <div className="h-160">
      <Table columnDefs={columnDefs} rowData={customers} />
    </div>
  )
}
