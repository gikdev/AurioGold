import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowsLeftRightIcon,
  ProhibitIcon,
  QuestionIcon,
} from "@phosphor-icons/react"
import type { StockStatus } from "@repo/api-client/client"

export function calcA11yStuff(status: StockStatus | undefined) {
  switch (status) {
    case 0:
      return {
        classes: "text-slate-10",
        Icon: ProhibitIcon,
        name: "غیرفعال",
      }

    case 1:
      return {
        classes: "text-green-10",
        Icon: ArrowRightIcon,
        name: "قابل خرید توسط مشتری",
      }

    case 2:
      return {
        classes: "text-red-10",
        Icon: ArrowLeftIcon,
        name: "قابل فروش توسط مشتری",
      }

    case 3:
      return {
        classes: "text-blue-10",
        Icon: ArrowsLeftRightIcon,
        name: "قابل خرید و فروش",
      }

    default:
      return {
        Icon: QuestionIcon,
        classes: "text-slate-10",
        name: "؟؟؟",
      }
  }
}
