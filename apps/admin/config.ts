import { defineConfig } from "../../scripts/appConfig"
import configJson from "./config.json"

export const version = configJson.version
export const getVersion = () => version
export const getVersionStr = () => `v${version}`

export default defineConfig({
  version,
})
