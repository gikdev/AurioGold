#!/usr/bin/env bun

import { currentProfileKey } from "../packages/profile-manager/src"
import { apps, copyAssets, executeStep } from "./shared"

async function main() {
  console.log(`🚀 Starting 'before-dev' process... Profile: ${currentProfileKey}\n`)

  for (const appName of apps) {
    await executeStep(`Copy ${appName} stuff`, () => copyAssets(appName))
  }

  console.log("\n🎉 All steps completed successfully!")
}

main()
