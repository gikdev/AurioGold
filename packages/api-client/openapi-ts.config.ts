import { defineConfig } from "@hey-api/openapi-ts"
import { currentProfile } from "@repo/profile-manager"

export default defineConfig({
  input: `${currentProfile.apiBaseUrl}/swagger/v1/swagger.json`,
  output: "generated-client",
  plugins: [
    {
      name: "@hey-api/client-fetch",
      exportFromIndex: true,
      runtimeConfigPath: "./src/fetch-client-config.ts",
    },
    { name: "@tanstack/react-query", exportFromIndex: true },
    { name: "@hey-api/typescript", enums: "javascript" },
    { name: "@hey-api/sdk" },
  ],
})
