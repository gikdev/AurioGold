import { InfoIcon, ReceiptXIcon } from "@phosphor-icons/react"
import type { StockPriceSourceResponse } from "@repo/api-client/client"
import { BtnTemplates, DrawerSheet, useDrawerSheetNumber } from "@repo/shared/components"
import { Link } from "react-router"
import { KeyValueDetail, KeyValueDetailsContainer } from "#/components"
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
      {priceSource === undefined && (
        <div className="bg-red-2 border border-red-6 text-red-11 p-4 flex flex-col gap-2 items-center rounded-md">
          <ReceiptXIcon size={64} />
          <p className="text-xl font-bold text-red-12">پیدا نشد!</p>
          <p>منبع قیمت مورد نظر پیدا نشد!</p>
        </div>
      )}

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
