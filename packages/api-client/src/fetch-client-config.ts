import type { CreateClientConfig } from "../generated-client"

export const createClientConfig: CreateClientConfig = config => ({
  ...config,
})
