import { NuqsAdapter } from "nuqs/adapters/react-router/v7"
import { StrictMode, Suspense, lazy } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router"
import { BaseWrapper } from "./layouts/BaseWrapper"
import Loading from "./pages/Loading"
import pages from "./pages/pages"
import "./styles/index.css"

const Home = lazy(() => import("./pages/Home"))

const container = document.querySelector("#root")
if (!container) throw new Error("No `#root` found!")
const root = createRoot(container)
root.render(
  <StrictMode>
    <NuqsAdapter>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path={pages.base} element={<BaseWrapper />}>
              <Route index element={<Home />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </NuqsAdapter>
  </StrictMode>,
)
