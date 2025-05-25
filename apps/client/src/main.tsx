import { NuqsAdapter } from "nuqs/adapters/react-router/v7"
import { StrictMode, Suspense, lazy } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router"
import Loading from "./pages/Loading"
import pages from "./pages/pages"
import "./styles/index.css"

const Home = lazy(() => import("./pages/Home"))

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NuqsAdapter>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path={pages.home} element={<Home />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </NuqsAdapter>
  </StrictMode>,
)
