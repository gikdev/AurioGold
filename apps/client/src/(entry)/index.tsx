import { AllCommunityModule, ModuleRegistry } from "ag-grid-community"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { AppRouter } from "./AppRouter"
import { Providers } from "./Providers"
import { registerServiceWorker } from "./serviceWorker"
import "../styles/index.css"

declare global {
  interface Window {
    __IS_DEV_MODE: boolean
  }
}

window.__IS_DEV_MODE = import.meta.env.DEV

ModuleRegistry.registerModules([AllCommunityModule])

registerServiceWorker()

const container = document.querySelector("#root")
if (!container) throw new Error("No `#root` found!")

const root = createRoot(container)
root.render(
  <StrictMode>
    <Providers />
    <AppRouter />
  </StrictMode>,
)
