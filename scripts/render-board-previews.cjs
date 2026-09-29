const { convertCircuitJsonToPcbSvg, convertCircuitJsonToSchematicSvg } = require("circuit-to-svg")
const { Resvg } = require("@resvg/resvg-js")
const fs = require("node:fs")
const project = require("../project.json")
const folder = `previews/${project.hardware_revision}-${project.source_version.replace("0.1.0-", "")}`
const circuit = JSON.parse(fs.readFileSync("dist/index/circuit.json", "utf8"))
const board = circuit.find((element) => element.type === "pcb_board")
if (![2, 4].includes(board.num_layers))
  throw new Error("Unsupported preview layer count")
const layers =
  board.num_layers === 4
    ? ["top", "inner1", "inner2", "bottom"]
    : ["top", "bottom"]
for (const layer of layers) {
  const svg = convertCircuitJsonToPcbSvg(circuit, {
    layer,
    width: 1600,
    height: 1100,
    showFabricationNotes: false,
  })
  fs.mkdirSync(folder, { recursive: true })
  fs.writeFileSync(`${folder}/${layer}.svg`, svg)
  fs.writeFileSync(`${folder}/${layer}.png`, new Resvg(svg).render().asPng())
}
fs.copyFileSync(`${folder}/top.png`, `${folder}/pcb.png`)
fs.copyFileSync("dist/index/schematic.svg", `${folder}/schematic.svg`)

const sheets = circuit.filter((element) => element.type === "schematic_sheet")
for (const sheet of sheets) {
  if (sheet.sheet_size !== "a4" || sheet.sheet_width !== 297 || sheet.sheet_height !== 210)
    throw new Error(`Not a native A4 sheet: ${sheet.name}`)
  const svg = convertCircuitJsonToSchematicSvg(circuit, {
    schematicSheetIndex: sheet.sheet_index,
    width: 1684,
    height: 1191,
  })
  const basename = `schematic-sheet-${sheet.sheet_index + 1}`
  fs.writeFileSync(`dist/index/${basename}.svg`, svg)
  fs.writeFileSync(`${folder}/${basename}.svg`, svg)
  fs.writeFileSync(`${folder}/${basename}.png`, new Resvg(svg).render().asPng())
}
