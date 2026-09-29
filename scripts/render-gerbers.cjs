const gerberToSvg = require("gerber-to-svg")
const fs = require("node:fs")
const { Resvg } = require("@resvg/resvg-js")
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
    fs.readFileSync(
      `fabrication/A0-prototype.12/exported/${layer}.gbr`,
      "utf8",
    ),
  )
  converter.on("data", (svg) => {
    fs.writeFileSync(`evidence/iteration-12-gerber-${layer}.svg`, svg)
    fs.writeFileSync(
      `evidence/iteration-12-gerber-${layer}.png`,
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
