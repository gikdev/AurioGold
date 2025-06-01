import { NuqsAdapter } from "nuqs/adapters/react-router/v7"
import { StrictMode, Suspense, lazy } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router"
import { Bounce, ToastContainer } from "react-toastify"
import { BaseWrapper } from "./layouts/BaseWrapper"
import Protected from "./layouts/Protected"
import RootLayout from "./layouts/RootLayout"
import Loading from "./pages/Loading"
import routes from "./pages/routes"
import "./styles/index.css"

const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/Login"))
const NotFound = lazy(() => import("./pages/NotFound"))

const container = document.querySelector("#root")
if (!container) throw new Error("No `#root` found!")
const root = createRoot(container)
root.render(
  <StrictMode>
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
    <BrowserRouter>
      <NuqsAdapter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path={routes.login} element={<Login />} />
              <Route element={<Protected />}>
                <Route element={<BaseWrapper />}>
                  <Route index element={<Home />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </NuqsAdapter>
    </BrowserRouter>
  </StrictMode>,
)
