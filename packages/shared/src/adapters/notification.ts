import { type ToastOptions, toast } from "react-toastify"

type NotifStatus = "success" | "error" | "warning" | "default" | "info"

interface NotifOptions {
  status?: NotifStatus
  toastOptions?: ToastOptions
}

interface NotifAdapter {
  notify: (msg: string, options?: NotifOptions) => void
}

type NotifKey = "toast" | "console"

const adapters: Record<NotifKey, NotifAdapter> = {
  console: {
    notify: (msg, options = { status: "default" }) => {
      switch (options.status) {
        case "success":
          console.log("✅", msg)
          break
        case "error":
          console.error("❌", msg)
          break
        case "info":
          console.info("ℹ️", msg)
          break
        case "warning":
          console.warn("⚠️", msg)
          break
        default:
          console.log(msg)
          break
      }
    },
  },

  toast: {
    notify: (msg, options = {}) => {
      const { status = "default", toastOptions = {} } = options

      switch (status) {
        case "error":
          toast.error(msg, toastOptions)
          break
        case "warning":
          toast.warn(msg, toastOptions)
          break
        case "success":
          toast.success(msg, toastOptions)
          break
        case "info":
          toast.info(msg, toastOptions)
          break
        default:
          toast(msg, toastOptions)
          break
      }
    },
  },
}

export const notifManager = {
  notify: (msg: string, targetOrTargets: NotifKey | NotifKey[], options?: NotifOptions) => {
    if (!Array.isArray(targetOrTargets)) {
      adapters[targetOrTargets].notify(msg, options)
      return
    }

    for (const target of targetOrTargets) {
      adapters[target].notify(msg, options)
    }
  },
}
