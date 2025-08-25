export function calcOutputWeight(
  rialValue: number,
  totalSidePrice: number,
  priceToUnitRatio: number,
  maxDecimalCount: number,
) {
  const base = (rialValue / totalSidePrice) * priceToUnitRatio
  // Make sure it's not negative
  const fixed = base.toFixed(maxDecimalCount < 0 ? 0 : maxDecimalCount)
  const numbered = Number.parseFloat(fixed)
  const isNan = Number.isNaN(numbered)
  return isNan ? 0 : numbered
}

export function calcOutputRial(
  weightValue: number,
  totalSidePrice: number,
  priceToUnitRatio: number,
): number {
  return Math.floor((weightValue * totalSidePrice) / priceToUnitRatio)
}

export const transactionMethods = [
  { code: 0, title: "گرمی", unitTitle: "گرم", name: "gram" },
  { code: 1, title: "تعدادی", unitTitle: "عدد", name: "count" },
  { code: 2, title: "مثقالی", unitTitle: "مثقال", name: "mesghal" },
] as const
