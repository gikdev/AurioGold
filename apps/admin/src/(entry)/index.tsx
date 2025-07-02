import { AllCommunityModule, ModuleRegistry } from "ag-grid-community"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { AppRouter } from "./AppRouter"
import { ToastProvider } from "./ToastProvider"
import { registerServiceWorker } from "./serviceWorker"
import "../styles/index.css"

ModuleRegistry.registerModules([AllCommunityModule])

registerServiceWorker()

const container = document.querySelector("#root")
if (!container) throw new Error("No `#root` found!")

const root = createRoot(container)
root.render(
  <StrictMode>
    <ToastProvider />
    <AppRouter />
  </StrictMode>
)
