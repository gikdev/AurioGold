import {
  CardsIcon,
  InfoIcon,
  PenIcon,
  TableIcon,
  TrashIcon,
  UserCirclePlusIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react"
import type { CustomerDto } from "@repo/api-client/client"
import { Btn, FloatingActionBtn, TableFa, TitledCard } from "@repo/shared/components"
import { useIsMobile } from "@repo/shared/hooks"
import type { ColDef } from "ag-grid-community"
import { useState } from "react"
import { Link } from "react-router"
import routes from "../routes"
import CreateCustomerForm from "./CreateCustomerForm"
import { CustomerCard, CustomerCardsContainer } from "./CustomerCards"
import CustomerDetails from "./CustomerDetails"
import { useDrawerSheet } from "./DrawerSheet"
import EditCustomerForm from "./EditCustomerForm"
import { IconsToggle, createViewModes } from "./IconsToggle"

const sampleCustomers: Required<CustomerDto>[] = [
  {
    id: 3027,
    masterID: 1,
    groupID: 6,
    groupIntID: 3,
    displayName: "Reza reza",
    mobile: "09121212121",
    codeMelli: "",
    address: "",
    city: "",
    melliID: null,
    kasbsID: null,
    isActive: true,
    isBlocked: false,
    allowedDevices: 4,
    connectedDevices: null,
    groupName: "15",
    groupIntName: "پفکیان",
    accountingID: null,
  },
  {
    id: 3057,
    masterID: 1,
    groupID: 6,
    groupIntID: 4,
    displayName: "بنیامین",
    mobile: "09364635201",
    codeMelli: "",
    address: "",
    city: "",
    melliID: null,
    kasbsID: null,
    isActive: true,
    isBlocked: false,
    allowedDevices: 10,
    connectedDevices: null,
    groupName: "15",
    groupIntName: "5 خط",
    accountingID: null,
  },
  {
    id: 3058,
    masterID: 1,
    groupID: 6,
    groupIntID: 4,
    displayName: "محمو",
    mobile: "09127642796",
    codeMelli: "",
    address: "",
    city: "",
    melliID: null,
    kasbsID: null,
    isActive: true,
    isBlocked: false,
    allowedDevices: 1,
    connectedDevices: null,
    groupName: "15",
    groupIntName: "5 خط",
    accountingID: null,
  },
  {
    id: 3059,
    masterID: 1,
    groupID: 7,
    groupIntID: 3,
    displayName: "بهرامی2",
    mobile: "09309421787",
    codeMelli: "",
    address: "",
    city: "",
    melliID: null,
    kasbsID: null,
    isActive: true,
    isBlocked: false,
    allowedDevices: 10,
    connectedDevices: null,
    groupName: "20",
    groupIntName: "پفکیان",
    accountingID: "138510275",
  },
  {
    id: 3060,
    masterID: 1,
    groupID: 1,
    groupIntID: 2,
    displayName: "smhss",
    mobile: "09196025113",
    codeMelli: "025",
    address: "pardisann",
    city: "qhomm",
    melliID: null,
    kasbsID: null,
    isActive: false,
    isBlocked: false,
    allowedDevices: 5,
    connectedDevices: null,
    groupName: "گروه صفر",
    groupIntName: "پشمکیان",
    accountingID: null,
  },
  {
    id: 3061,
    masterID: 1,
    groupID: 1,
    groupIntID: 2,
    displayName: "smhs2",
    mobile: "09383073240",
    codeMelli: "035",
    address: "tehran",
    city: "qhods",
    melliID: null,
    kasbsID: null,
    isActive: true,
    isBlocked: true,
    allowedDevices: 1,
    connectedDevices: null,
    groupName: "گروه صفر",
    groupIntName: "پشمکیان",
    accountingID: null,
  },
  {
    id: 3062,
    masterID: 1,
    groupID: 6,
    groupIntID: 2,
    displayName: "smhss3",
    mobile: "09045443714",
    codeMelli: "025",
    address: "tehran",
    city: "qhods",
    melliID: null,
    kasbsID: null,
    isActive: true,
    isBlocked: false,
    allowedDevices: 2,
    connectedDevices: null,
    groupName: "15",
    groupIntName: "پشمکیان",
    accountingID: null,
  },
  {
    id: 3064,
    masterID: 1,
    groupID: 1,
    groupIntID: 2,
    displayName: "تست",
    mobile: "0811153935001",
    codeMelli: "",
    address: "",
    city: "",
    melliID: null,
    kasbsID: null,
    isActive: false,
    isBlocked: true,
    allowedDevices: 3,
    connectedDevices: null,
    groupName: "گروه صفر",
    groupIntName: "پشمکیان",
    accountingID: null,
  },
  {
    id: 3066,
    masterID: 1,
    groupID: 1,
    groupIntID: 2,
    displayName: "علی",
    mobile: "09128055416",
    codeMelli: "",
    address: "",
    city: "",
    melliID: null,
    kasbsID: null,
    isActive: true,
    isBlocked: false,
    allowedDevices: 3,
    connectedDevices: null,
    groupName: "گروه صفر",
    groupIntName: "پشمکیان",
    accountingID: "1001",
  },
]

const viewModeSetup = createViewModes([
  { id: "cards", icon: CardsIcon },
  { id: "table", icon: TableIcon },
])
type ViewModes = typeof viewModeSetup.type
const viewModes = viewModeSetup.items

export default function ManageCustomers() {
  const isMobile = useIsMobile()
  const [viewMode, setMode] = useState<ViewModes>("cards")

  const titledCardActions = (
    <div className="ms-auto flex items-center gap-2">
      <CreateCustomerFAB />
      <IconsToggle items={viewModes} activeItemId={viewMode} onChange={setMode} />
    </div>
  )

  return (
    <>
      <CreateCustomerForm />
      <EditCustomerForm />
      <CustomerDetails />

      <TitledCard
        title="مدیریت مشتریان"
        icon={UsersThreeIcon}
        titleSlot={titledCardActions}
        className={!isMobile && viewMode === "table" ? "max-w-240" : undefined}
      >
        {viewMode === "cards" && (
          <CustomerCardsContainer>
            {sampleCustomers.map(c => (
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

        {viewMode === "table" && <CustomersTable customers={sampleCustomers} />}
      </TitledCard>
    </>
  )
}

function CreateCustomerFAB() {
  const [, setOpen] = useDrawerSheet("create-new")
  const openDrawer = () => setOpen(true)

  return (
    <FloatingActionBtn
      onClick={openDrawer}
      title="ایجاد مشتری جدید"
      icon={UserCirclePlusIcon}
      to={routes.customers_createNew}
      theme="success"
      fallback={
        <Btn
          type="button"
          onClick={openDrawer}
          className="h-10 w-10 text-xs px-0"
          theme="success"
          title="ایجاد مشتری جدید"
          as={Link}
          to={routes.customers_createNew}
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
      <Btn as={Link} to={routes.customers_viewDetailsById(id)} className="h-8 w-8 p-1" theme="info">
        <InfoIcon size={20} />
      </Btn>

      <Btn as={Link} to={routes.customers_editById(id)} className="h-8 w-8 p-1" theme="warning">
        <PenIcon size={20} />
      </Btn>

      <Btn as={Link} to={routes.customers_deleteById(id)} className="h-8 w-8 p-1" theme="error">
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
