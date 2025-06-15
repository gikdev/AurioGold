import { useApiRequest } from "@gikdev/react-datapi/src"
import {
  ArrowCounterClockwiseIcon,
  CirclesThreePlusIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react"
import type { CustomerDto, StockPriceSourceResponse } from "@repo/api-client/client"
import {
  Btn,
  BtnTemplates,
  FloatingActionBtn,
  TitledCard,
  createTypedTableFa,
  useViewModes,
} from "@repo/shared/components"
import { getIsMobile } from "@repo/shared/hooks"
import type { ColDef } from "ag-grid-community"
import { Link } from "react-router"
import { cellRenderers } from "#/shared/agGrid"
import { generateLabelPropertyGetter } from "#/shared/customForm"
import { queryStateUrls } from "."
import CreatePriceSourceDrawer from "./CreatePriceSourceDrawer"
import DeletePriceSourceModal from "./DeletePriceSourceModal"
import EditPriceSourceDrawer from "./EditPriceSourceDrawer"
import PriceSourceDetails from "./PriceSouceDetails"
import { PriceSourceCard, PriceSourceCardsContainer } from "./PriceSourceCard"
import { priceSourceFormFields } from "./priceSourceFormShared"

export default function ManagePriceSources() {
  const isMobile = getIsMobile()
  const { renderedIconsToggle, viewMode } = useViewModes()
  const sourcesRes = useApiRequest<StockPriceSourceResponse[]>(() => ({
    url: "/StockPriceSource/GetStockPriceSources",
    defaultValue: [],
  }))

  const titledCardActions = (
    <div className="ms-auto flex items-center gap-2">
      <Btn className="h-10 w-10 p-1" onClick={() => sourcesRes.reload()}>
        <ArrowCounterClockwiseIcon size={24} />
      </Btn>

      <CreatePriceSourceFAB />
      {renderedIconsToggle}
    </div>
  )

  return (
    <>
      <DeletePriceSourceModal reloadPriceSources={() => sourcesRes.reload()} />
      <CreatePriceSourceDrawer reloadPriceSources={() => sourcesRes.reload()} />
      <EditPriceSourceDrawer
        reloadPriceSources={() => sourcesRes.reload()}
        priceSources={sourcesRes.data ?? []}
      />
      <PriceSourceDetails priceSources={sourcesRes.data ?? []} />

      <TitledCard
        title="مدیریت منابع قیمت"
        icon={UsersThreeIcon}
        titleSlot={titledCardActions}
        className={!isMobile && viewMode === "table" ? "max-w-240" : undefined}
      >
        {sourcesRes.loading && <div className="h-100 rounded-md animate-pulse bg-slate-4" />}

        {sourcesRes.success && !sourcesRes.loading && viewMode === "cards" && (
          <PriceSourceCardsContainer>
            {(sourcesRes.data || []).map(s => (
              <PriceSourceCard
                key={s.id}
                id={s.id ?? 0}
                name={s.name ?? "---"}
                price={s.price ?? 0}
              />
            ))}
          </PriceSourceCardsContainer>
        )}

        {sourcesRes.success && !sourcesRes.loading && viewMode === "table" && (
          <PriceSourcesTable priceSources={sourcesRes.data || []} />
        )}
      </TitledCard>
    </>
  )
}

function CreatePriceSourceFAB() {
  return (
    <FloatingActionBtn
      title="ایجاد منبع جدید"
      icon={CirclesThreePlusIcon}
      to={queryStateUrls.createNew()}
      data-testid="create-price-source-btn"
      theme="success"
      fallback={
        <Btn
          type="button"
          className="h-10 w-10 text-xs px-0"
          theme="success"
          title="ایجاد منبع جدید"
          as={Link}
          to={queryStateUrls.createNew()}
          data-testid="create-price-source-btn"
        >
          <CirclesThreePlusIcon size={24} className="transition-all" />
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
        to={queryStateUrls.details(id!)}
        className="min-h-8 w-8 p-1"
      />
      <BtnTemplates.IconEdit as={Link} to={queryStateUrls.edit(id!)} className="min-h-8 w-8 p-1" />
      <BtnTemplates.IconDelete
        as={Link}
        to={queryStateUrls.delete(id!)}
        className="min-h-8 w-8 p-1"
      />
    </div>
  )
}

const getLabelProperty = generateLabelPropertyGetter(priceSourceFormFields.labels)

const columnDefs: ColDef<StockPriceSourceResponse>[] = [
  { headerName: "مدیریت", cellRenderer: ManagementBtns },
  {
    field: "name",
    headerName: getLabelProperty("name"),
    cellRenderer: cellRenderers.Rtl,
  },
  {
    field: "code",
    headerName: getLabelProperty("code"),
    cellRenderer: cellRenderers.Ltr,
    minWidth: 200,
  },
  {
    field: "price",
    headerName: getLabelProperty("price"),
    cellRenderer: cellRenderers.PersianComma,
  },
  {
    field: "sourceUrl",
    headerName: getLabelProperty("sourceUrl"),
    cellRenderer: cellRenderers.AutoLink,
    minWidth: 200,
  },
  {
    field: "id",
    headerName: "آی‌دی",
    cellRenderer: cellRenderers.Ltr,
    minWidth: 100,
  },
]

const Table = createTypedTableFa<StockPriceSourceResponse>()

function PriceSourcesTable({ priceSources }: { priceSources: StockPriceSourceResponse[] }) {
  return (
    <div className="h-160">
      <Table columnDefs={columnDefs} rowData={priceSources} />
    </div>
  )
}
