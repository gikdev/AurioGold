import { AllCommunityModule, ModuleRegistry } from "ag-grid-community"
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
import { AnimatePresence } from "motion/react"
import { JsonToastContainer } from "./pages/Customers/useJsonToast"

ModuleRegistry.registerModules([AllCommunityModule])

const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/Login"))
const Logout = lazy(() => import("./pages/Logout"))
const NotFound = lazy(() => import("./pages/NotFound"))
const Test = lazy(() => import("./pages/Test"))
const Profile = lazy(() => import("./pages/Profile"))
const SendSms = lazy(() => import("./pages/SendSms"))
const Customers = lazy(() => import("./pages/Customers"))
const GroupsGram = lazy(() => import("./pages/GroupsGram"))
const GroupsNumeric = lazy(() => import("./pages/GroupsNumeric"))
const OnlineUsers = lazy(() => import("./pages/OnlineUsers"))
const PriceSources = lazy(() => import("./pages/PriceSources"))
const Balance = lazy(() => import("./pages/Balance"))
const Orders = lazy(() => import("./pages/Orders"))
const Products = lazy(() => import("./pages/Products"))
const Settings = lazy(() => import("./pages/Settings"))

const container = document.querySelector("#root")
if (!container) throw new Error("No `#root` found!")
const root = createRoot(container)
root.render(
  <StrictMode>
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
    <BrowserRouter>
      <NuqsAdapter>
        <AnimatePresence mode="wait">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route element={<RootLayout />}>
                <Route path={routes.login} element={<Login />} />
                <Route path={routes.logout} element={<Logout />} />
                <Route element={<Protected />}>
                  <Route element={<BaseWrapper />}>
                    <Route index element={<Home />} />
                    <Route path={routes.profile} element={<Profile />} />
                    <Route path={routes.sendSms} element={<SendSms />} />
                    <Route path={routes.customers} element={<Customers />} />
                    <Route path={routes.groupsGram} element={<GroupsGram />} />
                    <Route path={routes.groupsNumeric} element={<GroupsNumeric />} />
                    <Route path={routes.onlineUsers} element={<OnlineUsers />} />
                    <Route path={routes.priceSources} element={<PriceSources />} />
                    <Route path={routes.balance} element={<Balance />} />
                    <Route path={routes.orders} element={<Orders />} />
                    <Route path={routes.products} element={<Products />} />
                    <Route path={routes.settings} element={<Settings />} />
                    <Route path={routes.test} element={<Test />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </AnimatePresence>
      </NuqsAdapter>
    </BrowserRouter>
  </StrictMode>,
)
