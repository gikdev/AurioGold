import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
  input: "https://google.com", // TODO
  output: "generated-client",
  plugins: ["@hey-api/client-fetch"],
})
