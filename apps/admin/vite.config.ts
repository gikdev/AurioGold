import path from "node:path"
import { config } from "@repo/profile-manager"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { getVersion } from "./config.ts"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 8888 },
  build: {
    emptyOutDir: true,
    outDir: path.join(__dirname, `../../dist/${config.currentProfileKey}-${getVersion()}`),
  },
  resolve: {
    alias: {
      "#shared": path.resolve(__dirname, "../../packages/shared/src"),
      "#": path.resolve(__dirname, "./src"),
    },
  },
})
