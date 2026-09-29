import { expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import * as opentype from "opentype.js"
import {
  svgAlphabet,
  lineAlphabet,
  glyphAdvanceRatio,
  strokeWidthRatio,
} from "../index"
import outlinePolygons from "../outline-polygons"

test("bullet is present in stroke, outline, and generated font exports", async () => {
  expect(lineAlphabet["•"].length).toBeGreaterThan(0)
  expect(outlinePolygons["•"].length).toBeGreaterThan(0)
  expect(glyphAdvanceRatio["•"]).toBe(glyphAdvanceRatio["A"])
  const bytes = readFileSync("dist/TscircuitAlphabet.ttf")
  const font = opentype.parse(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
  )
  const bullet = font.charToGlyph("•")
  expect(bullet.unicode).toBe(0x2022)
  expect(bullet.path.commands.length).toBeGreaterThan(0)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 0.7 1" width="280" height="400"><rect width="0.7" height="1" fill="white"/><path d="${svgAlphabet["•"]}" stroke="black" stroke-width="${strokeWidthRatio}" stroke-linecap="round" fill="none"/></svg>`
  await expect(svg).toMatchSvgSnapshot(import.meta.path)
})
