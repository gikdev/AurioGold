#!/usr/bin/env bun

import { createWriteStream } from "node:fs"
import { cp, exists, rm } from "node:fs/promises"
import path from "node:path"
import archiver from "archiver"
import { $ } from "bun"
import adminConfig from "../apps/admin/config"
import clientConfig from "../apps/client/config"
import { currentProfile, currentProfileKey, type ProfileKey } from "../packages/profile-manager/src"
import { type AppName, apps, copyAssets, executeStep } from "./shared"

interface BuildContext {
  profile: ProfileKey
  appVersions: Record<AppName, number>
}

const buildContext: BuildContext = {
  profile: currentProfileKey,
  appVersions: {
    admin: adminConfig.version,
    client: clientConfig.version,
  },
}

function generateAppReleaseName(appName: AppName, currentProfileName: ProfileKey, version: number) {
  return `v${version}-${currentProfileName}-${appName}`
}

async function buildAllApps() {
  console.log("🔨 Building all applications...")
  await $`npm run build`
  console.log("✅ Build completed")
}

async function copyAppDistribution(appName: AppName) {
  console.log(`📦 Copying ${appName} distribution...`)

  const sourceDistPath = path.join(__dirname, "..", "apps", appName, "dist")
  const targetFolderName = generateAppReleaseName(
    appName,
    buildContext.profile,
    buildContext.appVersions[appName],
  )
  const targetDistPath = path.join(__dirname, "..", "dist", targetFolderName)

  console.log(`  Source: ${sourceDistPath}`)
  console.log(`  Target: ${targetDistPath}`)

  // Validate source exists
  if (!(await exists(sourceDistPath))) {
    throw new Error(`Source distribution not found: ${sourceDistPath}`)
  }

  // Clean target if exists
  if (await exists(targetDistPath)) {
    console.log("  Cleaning existing target...")
    await rm(targetDistPath, { recursive: true, force: true })
  }

  // Copy distribution
  await cp(sourceDistPath, targetDistPath, { recursive: true })
  console.log(`✅ Copied ${appName} to ${targetFolderName}`)
}

async function patchProfileStuff(appName: AppName, title: string) {
  const folderNameApp = generateAppReleaseName(
    appName,
    buildContext.profile,
    buildContext.appVersions[appName],
  )
  const distAppIndexHtmlFile = Bun.file(
    path.join(__dirname, "..", "dist", folderNameApp, "index.html"),
  )

  let appIndexHtmlFileContents = await distAppIndexHtmlFile.text()
  if (appIndexHtmlFileContents.includes("</title>")) {
    appIndexHtmlFileContents = appIndexHtmlFileContents.replace(
      /<title[^>]*>[\s\S]*?<\/title>/i,
      `<title>${title}</title>`,
    )
  }

  await Bun.write(distAppIndexHtmlFile, appIndexHtmlFileContents)
}

async function createZip(appName: AppName) {
  const folderName = generateAppReleaseName(
    appName,
    buildContext.profile,
    buildContext.appVersions[appName],
  )
  const sourcePath = path.join(__dirname, "..", "dist", folderName)
  const zipPath = path.join(__dirname, "..", "dist", `${folderName}.zip`)

  console.log(`🗜️  Creating zip: ${folderName}.zip`)

  const output = createWriteStream(zipPath)
  const archive = archiver("zip", { zlib: { level: 9 } })

  archive.pipe(output)
  archive.directory(sourcePath, false) // false = don't include parent folder
  await archive.finalize()

  console.log(`✅ Created ${folderName}.zip`)
}

async function main() {
  console.log("🚀 Starting build process...")
  console.log(`Profile: ${buildContext.profile}`)
  console.log(`Versions: ${buildContext.appVersions}`)
  console.log("")

  for (const appName of apps) {
    await executeStep(`Copy ${appName} assets`, () => copyAssets(appName))
  }

  await executeStep("Build", buildAllApps)

  for (const appName of apps) {
    let title = "UNDEFINED_TITLE"
    if (appName === "admin") title = currentProfile.appTitleAdmin
    if (appName === "client") title = currentProfile.appTitleClient

    await executeStep(`Copy ${appName}`, () => copyAppDistribution(appName))
    await executeStep(`Patch stuff for ${appName}`, () => patchProfileStuff(appName, title))
    await executeStep(`Zip ${appName}`, () => createZip(appName))
  }

  console.log("")
  console.log("🎉 All steps completed successfully!")
}

main()
