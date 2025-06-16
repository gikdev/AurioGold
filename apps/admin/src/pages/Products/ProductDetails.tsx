import { useApiRequest } from "@gikdev/react-datapi/src"
import { InfoIcon } from "@phosphor-icons/react"
import type { StockDtoForMaster, StockPriceSourceResponse } from "@repo/api-client/client"
import {
  BtnTemplates,
  DrawerSheet,
  useDrawerSheet,
  useDrawerSheetNumber,
} from "@repo/shared/components"
import { memo } from "react"
import { Link } from "react-router"
import { EntityNotFoundCard, KeyValueDetail, KeyValueDetailsContainer } from "#/components"
import { cellRenderers } from "#/shared/agGrid"
import { generateLabelPropertyGetter } from "#/shared/customForm"
import { Navigation, QUERY_KEYS } from "./navigation"
import {
  productFormFields,
  transactionMethods,
  transactionStatuses,
  transactionTypes,
} from "./productFormShared"

const getLabelProperty = generateLabelPropertyGetter(productFormFields.labels)

interface ProductDetailsProps {
  products: Required<StockDtoForMaster>[]
}

function _ProductDetails({ products }: ProductDetailsProps) {
  const [productId, setProductId] = useDrawerSheetNumber(QUERY_KEYS.productId)
  const [showDetailsDrawer, setShowDetailsDrawer] = useDrawerSheet(QUERY_KEYS.details)
  const product = products.find(p => p.id === productId)
  const resPriceSources = useApiRequest<Required<StockPriceSourceResponse>[]>(() => ({
    url: "/StockPriceSource/GetStockPriceSources",
    defaultValue: [],
  }))

  if (!productId) return null

  const handleClose = () => {
    setShowDetailsDrawer(false)
    setProductId(null)
  }

  const btns = (
    <>
      <BtnTemplates.Edit as={Link} to={Navigation.edit(productId)} />
      <BtnTemplates.Delete as={Link} to={Navigation.delete(productId)} />
    </>
  )

  return (
    <DrawerSheet
      onClose={handleClose}
      open={productId !== null && showDetailsDrawer}
      title="مشخصات مشتری"
      icon={InfoIcon}
      btns={btns}
    >
      {product === undefined && <EntityNotFoundCard entity="محصول" />}

      {product && (
        <KeyValueDetailsContainer className="flex flex-col gap-3">
          <KeyValueDetail title={getLabelProperty("name")} value={product.name} />
          <KeyValueDetail title={getLabelProperty("accountingCode")} value={product.accountCode} />
          <KeyValueDetail
            title={getLabelProperty("customerBuyingDiff")}
            value={product.diffBuyPrice}
            cellRendered={<cellRenderers.PersianComma value={product.diffBuyPrice} />}
          />
          <KeyValueDetail
            title={getLabelProperty("customerSellingDiff")}
            value={product.diffSellPrice}
            cellRendered={<cellRenderers.PersianComma value={product.diffSellPrice} />}
          />
          <KeyValueDetail
            title={getLabelProperty("description")}
            bottomSlot={
              product.description ? (
                <cellRenderers.LongText value={product.description} />
              ) : undefined
            }
            value={product.description ? undefined : "-"}
          />
          <KeyValueDetail title={getLabelProperty("maxAutoTime")} value={product.maxAutoMin} />
          <KeyValueDetail
            title={getLabelProperty("minProductValue")}
            value={product.minValue}
            cellRendered={<cellRenderers.PersianComma value={product.minValue} />}
          />
          <KeyValueDetail
            title={getLabelProperty("maxProductValue")}
            value={product.maxValue}
            cellRendered={<cellRenderers.PersianComma value={product.maxValue} />}
          />
          <KeyValueDetail
            title={getLabelProperty("minTransactionVolume")}
            value={product.minVoume}
            cellRendered={<cellRenderers.PersianComma value={product.minVoume} />}
          />
          <KeyValueDetail
            title={getLabelProperty("maxTransactionVolume")}
            value={product.maxVoume}
            cellRendered={<cellRenderers.PersianComma value={product.maxVoume} />}
          />
          <KeyValueDetail
            title={getLabelProperty("numOfDecimals")}
            value={product.decimalNumber}
            cellRendered={<cellRenderers.PersianComma value={product.decimalNumber} />}
          />
          <KeyValueDetail
            title={getLabelProperty("price")}
            value={product.price}
            cellRendered={<cellRenderers.PersianComma value={product.price} />}
          />
          <KeyValueDetail
            title={getLabelProperty("priceStep")}
            value={product.priceStep}
            cellRendered={<cellRenderers.PersianComma value={product.priceStep} />}
          />
          <KeyValueDetail
            title={getLabelProperty("priceDiffStep")}
            value={product.diffPriceStep}
            cellRendered={<cellRenderers.PersianComma value={product.diffPriceStep} />}
          />
          {resPriceSources.success ? (
            <KeyValueDetail
              title={getLabelProperty("priceSource")}
              value={resPriceSources.data?.find(p => p.id === product.priceSourceID)?.name || "-"}
            />
          ) : null}
          <KeyValueDetail
            title={getLabelProperty("priceToGramRatio")}
            value={product.unitPriceRatio}
            cellRendered={<cellRenderers.PersianComma value={product.diffPriceStep} />}
          />
          <KeyValueDetail
            title={getLabelProperty("transactionMethod")}
            value={transactionMethods?.[product.unit]?.name || "-"}
          />
          <KeyValueDetail
            title={getLabelProperty("transactionStatus")}
            value={transactionStatuses?.[product.status]?.name || "-"}
          />
          <KeyValueDetail
            title={getLabelProperty("transactionType")}
            value={transactionTypes?.[product.mode]?.name || "-"}
          />
          <KeyValueDetail
            title="آی‌دی"
            value={product.id}
            cellRendered={<cellRenderers.PersianComma value={product.diffPriceStep} />}
          />
        </KeyValueDetailsContainer>
      )}
    </DrawerSheet>
  )
}

const ProductDetails = memo(_ProductDetails)
export default ProductDetails
