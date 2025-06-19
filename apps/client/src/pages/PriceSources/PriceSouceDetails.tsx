import { InfoIcon } from "@phosphor-icons/react"
import type { StockPriceSourceResponse } from "@repo/api-client/client"
import {
  BtnTemplates,
  DrawerSheet,
  EntityNotFoundCard,
  KeyValueDetail,
  KeyValueDetailsContainer,
  useDrawerSheetNumber,
} from "@repo/shared/components"
import { Link } from "react-router"
import { generateLabelPropertyGetter } from "#/shared/customForm"
import { queryStateKeys, queryStateUrls } from "."
import { priceSourceFormFields } from "./priceSourceFormShared"

interface PriceSourceDetailsProps {
  priceSources: StockPriceSourceResponse[]
}

const getLabelProperty = generateLabelPropertyGetter(priceSourceFormFields.labels)

export default function PriceSourceDetails({ priceSources }: PriceSourceDetailsProps) {
  const [priceSourceId, setPriceSourceId] = useDrawerSheetNumber(queryStateKeys.details)
  const priceSource = priceSources.find(g => g.id === priceSourceId)

  const btns = (
    <>
      <BtnTemplates.Edit as={Link} to={queryStateUrls.edit(priceSourceId!)} />
      <BtnTemplates.Delete as={Link} to={queryStateUrls.delete(priceSourceId!)} />
    </>
  )

  return (
    <DrawerSheet
      onClose={() => setPriceSourceId(null)}
      open={priceSourceId !== null}
      title="مشخصات منبع قیمت"
      icon={InfoIcon}
      btns={btns}
    >
      {priceSource === undefined && <EntityNotFoundCard entity="منبع قیمت" />}

      {priceSource && (
        <KeyValueDetailsContainer>
          <KeyValueDetail title={getLabelProperty("name")} value={priceSource.name} />
          <KeyValueDetail ltr title={getLabelProperty("code")} value={priceSource.code} />
          <KeyValueDetail ltr title={getLabelProperty("price")} value={priceSource.price} />
          <KeyValueDetail ltr title={getLabelProperty("sourceUrl")} value={priceSource.sourceUrl} />
          <KeyValueDetail ltr title="آی‌دی" value={priceSource.id} />
        </KeyValueDetailsContainer>
      )}
    </DrawerSheet>
  )
}
