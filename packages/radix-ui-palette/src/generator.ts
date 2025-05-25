import * as palette from "./light"
import type { ColorPalette } from "./types"

function generateCSSVariablesFromPalette(palette: ColorPalette): string {
  return Object.entries(palette)
    .map(([colorName, shades]) =>
      Object.entries(shades)
        .map(([shade, value]) => `--color-${colorName}-${shade}: ${value};`)
        .join("\n"),
    )
    .join("\n")
}

console.log(generateCSSVariablesFromPalette(palette))
