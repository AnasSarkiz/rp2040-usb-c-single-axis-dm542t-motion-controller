const { convertCircuitJsonToPcbSvg } = require("circuit-to-svg")
const { Resvg } = require("@resvg/resvg-js")
const fs = require("node:fs")
const project = require("../project.json")
const folder = `previews/${project.hardware_revision}-${project.source_version.replace("0.1.0-", "")}`
const circuit = JSON.parse(fs.readFileSync("dist/index/circuit.json", "utf8"))
for (const layer of ["top", "bottom"]) {
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
