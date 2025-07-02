import { Bounce, ToastContainer } from "react-toastify"
import { JsonToastContainer } from "../pages/Customers/useJsonToast"

export const ToastProvider = () => (
  <>
    <JsonToastContainer />
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
      theme="dark"
      toastStyle={{ fontFamily: "Vazirmatn" }}
      transition={Bounce}
    />
  </>
)
