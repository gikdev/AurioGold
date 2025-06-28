import { defineConfig } from "../../scripts/appConfig"
import config from "./config.json"

export const version = config.version
export const getVersion = () => version
export const getVersionStr = () => `v${version}`

export default defineConfig({
  version,
})
