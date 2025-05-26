import { defineConfig } from "@hey-api/openapi-ts"
import { currentProfile } from "@repo/profile-manager"

export default defineConfig({
  input: `${currentProfile.apiBaseUrl}/swagger/v1/swagger.json`,
  output: "generated-client",
  plugins: ["@hey-api/client-fetch"],
})
