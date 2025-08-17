import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { NuqsAdapter } from "nuqs/adapters/react-router/v7"
import { Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router"
import { queryClient } from "#/shared"
import { BaseWrapper } from "../layouts/BaseWrapper"
import Protected from "../layouts/Protected"
import RootLayout from "../layouts/RootLayout"
import Loading from "../pages/Loading"
import { protectedRoutes, publicRoutes } from "./routes.config"

export const AppRouter = () => (
  <BrowserRouter>
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools client={queryClient} />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<RootLayout />}>
              {/* Public routes */}
              {publicRoutes}

              {/* Protected routes */}
              <Route element={<Protected />}>
                <Route element={<BaseWrapper />}>{protectedRoutes}</Route>
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </QueryClientProvider>
    </NuqsAdapter>
  </BrowserRouter>
)
