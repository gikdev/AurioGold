import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./styles/index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <h1>Hello world!</h1>
    <h1 className="text-stupid-1">Hello world!</h1>
    <h1 className="text-stupid-2">Hello world!</h1>
    <h1 className="text-stupid-3">Hello world!</h1>
  </StrictMode>,
)
