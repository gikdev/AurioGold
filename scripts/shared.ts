import { cp, exists, rm } from "node:fs/promises"
import path from "node:path"
import { currentProfileKey } from "../packages/profile-manager/src"

export const apps = ["admin", "client"] as const
export type AppName = (typeof apps)[number]

export async function executeStep<T>(stepName: string, stepFn: () => Promise<T>): Promise<T> {
  try {
    return await stepFn()
  } catch (error) {
    console.error(`❌ ${stepName} failed:`, error)
    process.exit(1)
  }
}

export async function copyAssets(appName: AppName) {
  const stuff = [
    {
      source: path.join(__dirname, "..", "assets", "shared"),
      target: path.join(__dirname, "..", "apps", appName, "public", "shared"),
    },
    {
      source: path.join(__dirname, "..", "assets", "profiles", currentProfileKey, "shared"),
      target: path.join(__dirname, "..", "apps", appName, "public", "profile", "shared"),
    },
    {
      source: path.join(__dirname, "..", "assets", "profiles", currentProfileKey, appName),
      target: path.join(__dirname, "..", "apps", appName, "public", "profile", "app"),
    },
  ]

  for (const { source } of stuff) {
    if (!(await exists(source))) {
      throw new Error(`Source path not found: ${source}`)
    }
  }

  for (const { target } of stuff) {
    if (await exists(target)) {
      await rm(target, { recursive: true, force: true })
    }
  }

  for (const { source, target } of stuff) {
    await cp(source, target, { recursive: true })
  }
}
