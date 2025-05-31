import { NuqsAdapter } from "nuqs/adapters/react-router/v7"
import { StrictMode, Suspense, lazy } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router"
import { BaseWrapper } from "./layouts/BaseWrapper"
import Loading from "./pages/Loading"
import routes from "./pages/routes"
import "./styles/index.css"
import RootLayout from "./layouts/RootLayout"

const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/Login"))

const container = document.querySelector("#root")
if (!container) throw new Error("No `#root` found!")
const root = createRoot(container)
root.render(
  <StrictMode>
    <BrowserRouter>
      <NuqsAdapter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path={routes.base} element={<RootLayout />}>
              <Route path={routes.login} element={<Login />} />
              <Route element={<BaseWrapper />}>
                <Route index element={<Home />} />
              </Route>
            </Route>
            <Route path="*"> ۴۰۴ پیدا نشد </Route>
          </Routes>
        </Suspense>
      </NuqsAdapter>
    </BrowserRouter>
  </StrictMode>,
)
