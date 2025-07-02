import { Bounce, ToastContainer } from "react-toastify"

export const Providers = () => (
  <>
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
