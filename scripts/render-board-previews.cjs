const { convertCircuitJsonToPcbSvg } = require("circuit-to-svg")
const { Resvg } = require("@resvg/resvg-js")
const fs = require("node:fs")
const circuit = JSON.parse(fs.readFileSync("dist/index/circuit.json", "utf8"))
for (const layer of ["top", "bottom"]) {
  const svg = convertCircuitJsonToPcbSvg(circuit, {
    layer,
    width: 1600,
    height: 1100,
    showFabricationNotes: false,
  })
  const folder = "previews/A0-prototype.12"
  fs.mkdirSync(folder, { recursive: true })
  fs.writeFileSync(`${folder}/${layer}.svg`, svg)
  fs.writeFileSync(`${folder}/${layer}.png`, new Resvg(svg).render().asPng())
}
fs.copyFileSync("previews/A0-prototype.12/top.png", "previews/A0-prototype.12/pcb.png")
fs.copyFileSync("dist/index/schematic.svg", "previews/A0-prototype.12/schematic.svg")
