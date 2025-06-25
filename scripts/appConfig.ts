export interface Config {
  version: number
}

export function defineConfig(input: Config) {
  return {
    ...input,
    get versionStr(): string {
      return `v${input.version}`
    } 
  }
}
