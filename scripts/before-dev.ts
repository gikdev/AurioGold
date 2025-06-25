#!/usr/bin/env bun

import { cp, exists, rm } from "node:fs/promises"
import { currentProfileKey } from "../packages/profile-manager/src"
import path from "node:path"

const apps = ["admin", "client"] as const
type AppName = (typeof apps)[number]

async function copyStuff(appName: AppName) {
  console.log(`📦 Copying ${appName} stuff...`)

  const sourcePath1 = path.join(__dirname, "..", "assets", "profiles", currentProfileKey)
  const targetPath1 = path.join(__dirname, "..", "apps", appName, "public", "profile")
  const sourcePath2 = path.join(__dirname, "..", "assets", "shared")
  const targetPath2 = path.join(__dirname, "..", "apps", appName, "public", "shared")

  if (!(await exists(sourcePath1))) {
    throw new Error(`Source path 1 not found: ${sourcePath1}`)
  }

  if (!(await exists(sourcePath2))) {
    throw new Error(`Source path 2 not found: ${sourcePath2}`)
  }

  if (await exists(targetPath1)) {
    console.log("  Cleaning target 1...")
    await rm(targetPath1, { recursive: true, force: true })
  }

  if (await exists(targetPath2)) {
    console.log("  Cleaning target 2...")
    await rm(targetPath2, { recursive: true, force: true })
  }

  // Copy stuff
  await cp(sourcePath1, targetPath1, { recursive: true })
  await cp(sourcePath2, targetPath2, { recursive: true })
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
  console.log("🚀 Starting build process...")
  console.log(`Profile: ${currentProfileKey}`)
  console.log("")

  for (const appName of apps) {
    await executeStep(`Copy ${appName}`, () => copyStuff(appName))
  }

  console.log("")
  console.log("🎉 All steps completed successfully!")
}

main()
