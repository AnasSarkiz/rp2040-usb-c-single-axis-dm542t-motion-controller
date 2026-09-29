const gerberToSvg = require("gerber-to-svg")
const fs = require("node:fs")
const { Resvg } = require("@resvg/resvg-js")
const project = require("../project.json")
const iteration = project.source_version.split(".").at(-1)
const folder = `fabrication/${project.hardware_revision}-${project.source_version.replace("0.1.0-", "")}`
if (!fs.existsSync(folder))
  throw new Error(`No current fabrication export: ${folder}`)
for (const layer of [
  "F_Cu",
  "B_Cu",
  "F_Mask",
  "B_Mask",
  "F_Paste",
  "F_SilkScreen",
  "Edge_Cuts",
]) {
  const converter = gerberToSvg(
    fs.readFileSync(`${folder}/exported/${layer}.gbr`, "utf8"),
  )
  converter.on("data", (svg) => {
    fs.writeFileSync(`evidence/iteration-${iteration}-gerber-${layer}.svg`, svg)
    fs.writeFileSync(
      `evidence/iteration-${iteration}-gerber-${layer}.png`,
      new Resvg(svg, {
        background: "white",
        fitTo: { mode: "width", value: 1600 },
      })
        .render()
        .asPng(),
    )
  })
  converter.on("error", (error) => {
    throw error
  })
}
