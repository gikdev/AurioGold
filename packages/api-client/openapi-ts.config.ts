import { defineConfig } from "@hey-api/openapi-ts"
import { currentProfile } from "@repo/profile-manager"

export default defineConfig({
  input: `${currentProfile.apiBaseUrl}/swagger/v1/swagger.json`,
  output: "generated-client",
  plugins: [
    "@hey-api/typescript",
    "@hey-api/client-fetch",
    "@hey-api/schemas",
    { dates: true, name: "@hey-api/transformers", bigInt: false },
    { enums: "javascript", name: "@hey-api/typescript" },
    { name: "@hey-api/sdk", transformer: true },
    "@tanstack/react-query",
    "zod",
  ],
})
