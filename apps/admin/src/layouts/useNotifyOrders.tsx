import { CheckIcon, XIcon } from "@phosphor-icons/react"
import type { OrderFm } from "@repo/api-client"
import { notifManager, storageManager } from "@repo/shared/adapters"
import { Btn } from "@repo/shared/components"
import { parseError } from "@repo/shared/helpers"
import { formatPersianPrice } from "@repo/shared/utils"
import { useAtomValue } from "jotai"
import { useCallback, useEffect, useRef } from "react"
import { toast } from "react-toastify"
import notifSfx from "#/assets/notification.mp3"
import { connectionRefAtom, connectionStateAtom } from "#/atoms"
import { useAcceptOrder } from "#/pages/Orders/shared"
import routes from "#/pages/routes"

export const transactionMethods = [
  { code: 0, title: "گرمی", unitTitle: "گرم", name: "gram" },
  { code: 1, title: "تعدادی", unitTitle: "عدد", name: "count" },
  { code: 2, title: "مثقالی", unitTitle: "مثقال", name: "mesghal" },
] as const

export function useNotifyOrders() {
  const connection = useAtomValue(connectionRefAtom)
  const connectionState = useAtomValue(connectionStateAtom)
  const notifIDs = useRef<Set<[closeToast: () => void, orderId: number]>>(new Set())
  const notifSound = useWithSound(notifSfx)
  const { mutate: acceptOrder } = useAcceptOrder()

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    const handleDecided = (_isAccepted: boolean, orderId: number) => {
      for (const [closeToast, notifOrderId] of notifIDs.current) {
        if (notifOrderId === orderId) closeToast()
      }
    }

    connection?.on("ReceiveOrder2", showNewOrderNotification)
    connection?.on("Decided", handleDecided)

    return () => {
      connection?.off("ReceiveOrder2", showNewOrderNotification)
      connection?.off("Decided", handleDecided)
    }
  }, [connection, connectionState])

  function handleOrder(
    closeToast: () => void,
    orderId: number,
    userId: number,
    isAccepted: boolean,
  ) {
    closeToast()

    if (!connection) {
      notifManager.notify(
        `وقتی که به سرور وصل نیستیم، نمیتوان سفارشی را ${isAccepted ? "تایید" : "رد"} کرد.`,
        "toast",
        { status: "warning" },
      )
      return
    }

    acceptOrder(
      {
        body: {
          gid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          id: Number(orderId),
          str: "",
          tf: isAccepted,
        },
      },
      {
        onError: err => notifManager.notify(parseError(err), "toast", { status: "error" }),
        onSuccess: () => {
          connection
            .invoke(
              "DecideOrder",
              storageManager.get("admin_ttkk", "sessionStorage"),
              isAccepted,
              orderId,
              userId,
            )
            .then(() => {
              notifManager.notify(isAccepted ? "سفارش تایید شد" : "سفارش رد شد", "toast", {
                status: "info",
              })
            })
            .catch(() => {
              notifManager.notify(
                `موقع ${isAccepted ? "تایید" : "رد"} کردن سفارش به مشکلی بر خوردیم`,
                "toast",
                { status: "error" },
              )
            })
        },
      },
    )
  }

  function showNewOrderNotification(
    _orderId: number,
    orderDto: Required<OrderFm>,
    userDisplayName: string,
  ) {
    try {
      notifSound.play()
    } catch (_err) {
      notifManager.notify("error when trying to play the order notif sound", "console", {
        status: "warning",
      })
    }

    const transactionMethod = transactionMethods[orderDto.stockUnit]

    // if (Notification.permission === "granted") {
    //   new Notification("سفارش جدید", {
    //     badge: "/images/vgold-icon.png",
    //     body: `سفارش ${orderDto.side === 1 ? "خرید" : "فروش"} محصول ${orderDto.stockName} به مقدار ${Math.abs(orderDto.volume).toLocaleString()} ${orderDto.stockUnit === 1 ? "عدد" : "گرم"} با مظنه ${Math.abs(orderDto.price).toLocaleString()} ریال و ارزش ${Math.abs(orderDto.value).toLocaleString()} ریال توسط کاربر ${userDisplayName} دریافت شد!`,
    //     dir: "rtl",
    //     icon: "/images/vgold-icon.png",
    //     lang: "FA",
    //     requireInteraction: false,
    //     silent: false,
    //   })
    // }

    toast(
      ({ closeToast }) => {
        notifIDs.current.add([closeToast, orderDto.id])

        return (
          <div className="p-4 flex flex-col gap-4">
            <a
              className="font-bold text-slate-12 text-xl text-center block border-b border-slate-6 pb-4"
              href={routes.orders}
            >
              سفارش جدید
            </a>

            <a className="text-lg text-center text-slate-11" href={routes.orders}>
              <span>سفارش </span>
              <strong className="text-amber-9">{orderDto.side === 1 ? "خرید" : "فروش"} </strong>
              <span>محصول </span>
              <strong className="text-amber-9">{orderDto.stockName} </strong>
              <span>به مقدار </span>
              <strong className="text-amber-9">
                <NumberRepresentor
                  num={
                    transactionMethod.name === "count"
                      ? Number(orderDto.volume.toFixed(0))
                      : orderDto.volume
                  }
                />{" "}
              </strong>
              <strong className="text-amber-9">{transactionMethod.unitTitle} </strong>
              <span>با مظنه </span>
              <strong className="text-amber-9">
                <NumberRepresentor num={orderDto.price} />{" "}
              </strong>
              <strong className="text-amber-9">ریال </strong>
              <span>و ارزش </span>
              <strong className="text-amber-9">
                <NumberRepresentor num={orderDto.value} />{" "}
              </strong>
              <strong className="text-amber-9">ریال </strong>
              <span>توسط کاربر </span>
              <strong className="text-amber-9">{userDisplayName} </strong>
              <span>دریافت شد!</span>
            </a>

            <div className="flex gap-2 text-lg">
              <Btn
                theme="success"
                className="flex-1"
                data-testid="accept-order-btn"
                onClick={() => handleOrder(closeToast, orderDto.id, orderDto.userID ?? 0, true)}
              >
                <CheckIcon size={24} />
                <span>تایید</span>
              </Btn>

              <Btn
                theme="error"
                className="flex-1"
                data-testid="reject-order-btn"
                onClick={() => handleOrder(closeToast, orderDto.id, orderDto.userID ?? 0, false)}
              >
                <XIcon size={24} />
                <span>رد</span>
              </Btn>
            </div>
          </div>
        )
      },
      { position: "top-right", autoClose: 30 * 1000 },
    )
  }
}

function useWithSound(audioSource: string) {
  const soundRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    soundRef.current = new Audio(audioSource)
  }, [audioSource])

  const play = useCallback(() => {
    soundRef.current?.play().catch(() => {
      notifManager.notify("error when trying to play a sound", ["console", "toast"], {
        status: "dev-only",
      })
    })
  }, [])

  const pause = useCallback(() => {
    soundRef.current?.pause()
  }, [])

  return { play, pause }
}

function NumberRepresentor({ num }: { num: number }) {
  return <span dir="ltr">{formatPersianPrice(Math.abs(num))}</span>
}
