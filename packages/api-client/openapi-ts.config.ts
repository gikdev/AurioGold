import { defineConfig } from "@hey-api/openapi-ts"
import { currentProfile } from "@repo/profile-manager"

export default defineConfig({
  input: `${currentProfile.apiBaseUrl}/swagger/v1/swagger.json`,
  output: "generated-client",
  plugins: [
    "@hey-api/client-fetch",
    "@tanstack/react-query",
    { name: "@hey-api/typescript", enums: "javascript" },
    { name: "@hey-api/sdk" },
  ],
})
