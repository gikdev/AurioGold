import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import path from "node:path"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 8888 },
  resolve: {
    alias: {
      "#shared": path.resolve(__dirname, "../../packages/shared/src"),
      "#": path.resolve(__dirname, "./src"),
    },
  },
})
