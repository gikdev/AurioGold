#!/usr/bin/env bun

import { cp, exists, rm } from "node:fs/promises"
import { currentProfileKey } from "../packages/profile-manager/src"
import path from "node:path"

const apps = ["admin", "client"] as const
type AppName = (typeof apps)[number]

async function copyStuff(appName: AppName) {
  console.log(`📦 Copying ${appName} stuff...`)

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

  console.log("✅ Copied")
}

async function executeStep<T>(stepName: string, stepFn: () => Promise<T>): Promise<T> {
  try {
    return await stepFn()
  } catch (error) {
    console.error(`❌ ${stepName} failed:`, error)
    process.exit(1)
  }
}

async function main() {
  console.log("🚀 Starting `before-dev` process...")
  console.log(`Profile: ${currentProfileKey}`)
  console.log("")

  for (const appName of apps) {
    await executeStep(`Copy ${appName}`, () => copyStuff(appName))
  }

  console.log("")
  console.log("🎉 All steps completed successfully!")
}

main()
