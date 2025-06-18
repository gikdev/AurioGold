import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 4444 },
  resolve: {
    alias: {
      "#shared": path.resolve(__dirname, "../../packages/shared/src"),
    },
  },
})
