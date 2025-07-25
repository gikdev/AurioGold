import { pluginReact } from "@rsbuild/plugin-react"
import { defineConfig } from "@rslib/core"

export default defineConfig({
  source: {
    entry: {
      index: ["./src/**"],
    },
  },
  lib: [
    {
      bundle: false,
      dts: true,
      format: "esm",
    },
  ],
  output: {
    target: "web",
    sourceMap: true,
  },
  plugins: [pluginReact()],
  resolve: {
    alias: {
      "#/*": ["./src/*"],
    },
  },
})
