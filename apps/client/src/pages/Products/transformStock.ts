import type { StockDto } from "@repo/api-client/client"

export function transformStock(input: StockDto): Required<StockDto> {
  // if server answers nothing, or a message, this will throw an error to say that server had error!
  if (typeof input === "string") throw new Error("WHat are yu doing?")

  return {
    id: input.id ?? 0,
    name: input.name || "---",
    description: input.description || null,
    price: input.price ?? null,
    diffBuyPrice: input.diffBuyPrice ?? null,
    diffSellPrice: input.diffSellPrice ?? null,
    priceStep: input.priceStep ?? null,
    diffPriceStep: input.diffPriceStep ?? null,
    status: input.status ?? 0,
    mode: input.mode ?? 0,
    maxAutoMin: input.maxAutoMin ?? null,
    dateUpdate: input.dateUpdate ? new Date(input.dateUpdate).toISOString() : new Date(0).toISOString(),
    minValue: input.minValue ?? null,
    maxValue: input.maxValue ?? null,
    minVoume: input.minVoume ?? 0,
    maxVoume: input.maxVoume ?? 0,
    isCountable: input.isCountable ?? false,
    unitPriceRatio: input.unitPriceRatio ?? 0,
    decimalNumber: input.decimalNumber ?? 0,
    supply: input.supply ?? 0,
    priceSourceID: input.priceSourceID ?? null,
    unit: input.unit ?? 0,
  }
}
