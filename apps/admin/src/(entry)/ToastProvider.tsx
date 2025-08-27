import { currentThemeAtom } from "@repo/shared/atoms"
import { useAtomValue } from "jotai"
import { Bounce, ToastContainer } from "react-toastify"

export function ToastProvider() {
  const theme = useAtomValue(currentThemeAtom)

  return (
    <ToastContainer
      autoClose={5000}
      closeOnClick={false}
      draggable
      hideProgressBar={false}
      newestOnTop
      pauseOnFocusLoss
      pauseOnHover
      position="bottom-right"
      rtl
      theme={theme}
      toastStyle={{ fontFamily: "Vazirmatn" }}
      transition={Bounce}
    />
  )
}
