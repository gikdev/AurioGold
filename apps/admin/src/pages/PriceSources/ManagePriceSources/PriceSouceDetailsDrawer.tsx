import { InfoIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react"
import type { StockPriceSourceResponse } from "@repo/api-client/client"
import {
  DrawerSheet,
  EntityNotFoundCard,
  KeyValueDetail,
  KeyValueDetailsContainer,
} from "@repo/shared/components"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { generateLabelPropertyGetter } from "#/shared/customForm"
import { skins } from "#/shared/forms/skins"
import { type PriceSourceId, priceSourcesOptions, usePriceSourcesStore } from "./shared"
import { priceSourceFormFields } from "./PriceSourceDrawer/stuff"

interface PriceSourceDetailsProps {
  sourceId: PriceSourceId
  onClose: () => void
}

export function PriceSourceDetailsDrawer({ onClose, sourceId }: PriceSourceDetailsProps) {
  const { data: sources = [] } = useQuery(priceSourcesOptions)
  const priceSource = useMemo(() => sources.find(g => g.id === sourceId), [sources, sourceId])

  return (
    <DrawerSheet
      open
      onClose={onClose}
      title="مشخصات منبع قیمت"
      icon={InfoIcon}
      btns={<Btns sourceId={sourceId} />}
    >
      {priceSource ? (
        <PriceSourceDetails priceSource={priceSource} />
      ) : (
        <EntityNotFoundCard entity="منبع قیمت" />
      )}
    </DrawerSheet>
  )
}

const Btns = ({ sourceId }: { sourceId: PriceSourceId }) => (
  <>
    <button
      type="button"
      className={skins.btn({ intent: "warning" })}
      onClick={() => usePriceSourcesStore.getState().edit(sourceId)}
    >
      <PencilSimpleIcon />
      <span>ویرایش</span>
    </button>

    <button
      type="button"
      className={skins.btn({ intent: "error" })}
      onClick={() => usePriceSourcesStore.getState().remove(sourceId)}
    >
      <TrashIcon />
      <span>حذف</span>
    </button>
  </>
)

const getLabelProperty = generateLabelPropertyGetter(priceSourceFormFields.labels)

const PriceSourceDetails = ({ priceSource }: { priceSource: StockPriceSourceResponse }) => (
  <KeyValueDetailsContainer>
    <KeyValueDetail title={getLabelProperty("name")} value={priceSource.name} />
    <KeyValueDetail ltr title={getLabelProperty("code")} value={priceSource.code} />
    <KeyValueDetail ltr title={getLabelProperty("price")} value={priceSource.price} />
    <KeyValueDetail ltr title={getLabelProperty("sourceUrl")} value={priceSource.sourceUrl} />
    <KeyValueDetail ltr title="آی‌دی" value={priceSource.id} />
  </KeyValueDetailsContainer>
)
