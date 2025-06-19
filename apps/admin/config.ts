import config from "./config.json"

export const version = config.version
export const getVersion = () => `v${version}`
