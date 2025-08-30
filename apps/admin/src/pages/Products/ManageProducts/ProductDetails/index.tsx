import { InfoIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react"
import { getApiStockPriceSourceGetStockPriceSourcesOptions } from "@repo/api-client/tanstack"
import { getHeaderTokenOnly } from "@repo/shared/auth"
import {
  DrawerSheet,
  EntityNotFoundCard,
  KeyValueDetail,
  KeyValueDetailsContainer,
} from "@repo/shared/components"
import { skins } from "@repo/shared/forms"
import { cellRenderers } from "@repo/shared/lib"
import { useQuery } from "@tanstack/react-query"
import { generateLabelPropertyGetter } from "#/shared/customForm"
import { productFormFields } from "../ProductDrawer/utils"
import {
  transactionMethods,
  transactionStatuses,
  transactionTypes,
  useStocksQuery,
} from "../shared"
import { type ProductId, useProductsStore } from "../store"
import { DetailsCardsSection } from "./DetailsCardsSection"

const getLabelProperty = generateLabelPropertyGetter(productFormFields.labels)

interface ProductDetailsProps {
  onClose: () => void
  productId: ProductId
}

export function ProductDetails({ onClose, productId }: ProductDetailsProps) {
  const { data: stocks = [] } = useStocksQuery()
  const product = stocks.find(p => p.id === productId)
  const resSources = useQuery(
    getApiStockPriceSourceGetStockPriceSourcesOptions(getHeaderTokenOnly()),
  )

  return (
    <DrawerSheet
      open
      onClose={onClose}
      title="مشخصات محصول"
      icon={InfoIcon}
      btns={<Btns productId={productId} />}
    >
      {product === undefined && <EntityNotFoundCard entity="محصول" />}

      {product && (
        <div className="flex flex-col gap-2">
          <DetailsCardsSection productId={productId} />

          <hr className="h-0.5 border-none max-w-32 w-full bg-brand-6 mx-auto my-5" />

          <KeyValueDetailsContainer className="flex flex-col gap-3">
            <KeyValueDetail
              title="آخرین آپدیت"
              value={product.dateUpdate}
              cellRendered={<cellRenderers.DateAndTime value={product.dateUpdate || new Date(0)} />}
            />
            <KeyValueDetail title={getLabelProperty("name")} value={product.name} />
            <KeyValueDetail
              title={getLabelProperty("accountingCode")}
              value={product.accountCode}
            />
            <KeyValueDetail
              title={getLabelProperty("customerBuyingDiff")}
              value={product.diffBuyPrice}
              cellRendered={<cellRenderers.PersianCurrency value={product.diffBuyPrice} />}
            />
            <KeyValueDetail
              title={getLabelProperty("customerSellingDiff")}
              value={product.diffSellPrice}
              cellRendered={<cellRenderers.PersianCurrency value={product.diffSellPrice} />}
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
              cellRendered={<cellRenderers.PersianCurrency value={product.minValue} />}
            />
            <KeyValueDetail
              title={getLabelProperty("maxProductValue")}
              value={product.maxValue}
              cellRendered={<cellRenderers.PersianCurrency value={product.maxValue} />}
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
              cellRendered={<cellRenderers.PersianCurrency value={product.price} />}
            />
            <KeyValueDetail
              title={getLabelProperty("priceStep")}
              value={product.priceStep}
              cellRendered={<cellRenderers.PersianCurrency value={product.priceStep} />}
            />
            <KeyValueDetail
              title={getLabelProperty("priceDiffStep")}
              value={product.diffPriceStep}
              cellRendered={<cellRenderers.PersianCurrency value={product.diffPriceStep} />}
            />
            {resSources.isSuccess ? (
              <KeyValueDetail
                title={getLabelProperty("priceSource")}
                value={resSources.data.find(p => p.id === product.priceSourceID)?.name || "-"}
              />
            ) : null}
            <KeyValueDetail
              title={getLabelProperty("priceToGramRatio")}
              value={product.unitPriceRatio}
              cellRendered={<cellRenderers.PersianComma value={product.diffPriceStep} />}
            />
            <KeyValueDetail
              title={getLabelProperty("transactionMethod")}
              value={product.unit ? transactionMethods?.[product.unit]?.text : "-"}
            />
            <KeyValueDetail
              title={getLabelProperty("transactionStatus")}
              value={product.status ? transactionStatuses?.[product.status]?.text : "-"}
            />
            <KeyValueDetail
              title={getLabelProperty("transactionType")}
              value={product.mode ? transactionTypes?.[product.mode]?.text : "-"}
            />
            <KeyValueDetail
              title="آی‌دی"
              value={product.id}
              cellRendered={<cellRenderers.PersianComma value={product.diffPriceStep} />}
            />
          </KeyValueDetailsContainer>
        </div>
      )}
    </DrawerSheet>
  )
}

const Btns = ({ productId }: { productId: ProductId }) => (
  <>
    <button
      type="button"
      className={skins.btn({ intent: "warning" })}
      onClick={() => useProductsStore.getState().edit(productId)}
    >
      <PencilSimpleIcon />
      <span>ویرایش</span>
    </button>

    <button
      type="button"
      className={skins.btn({ intent: "error" })}
      onClick={() => useProductsStore.getState().delete(productId)}
    >
      <TrashIcon />
      <span>حذف</span>
    </button>
  </>
)
