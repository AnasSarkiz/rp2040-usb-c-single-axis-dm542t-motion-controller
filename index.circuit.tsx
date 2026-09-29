import { Fragment } from "react"
import { SchematicNotes } from "./lib/schematic-notes"
import { CircuitParts } from "./lib/circuit"
import { EvaluationNotice } from "./lib/silkscreen"
import project from "./project.json"
import { schematicSheets } from "./lib/schematic-layout"

// Native routing enabled after the documented A0 placement gate passed.
// Fabrication remains gated by routed geometry and physical prototype review.
export default function MotionControllerBoard() {
  return (
    <board
      autorouterEffortLevel="5x"
      autorouterVersion="beta_pipeline9"
      title={project.title}
      width="90mm"
      height="60mm"
      thickness="1mm"
      layers={4}
      schLayout={{ layoutMode: "relative" }}
      schTraceAutoLabelEnabled
      schMaxTraceDistance={3}
      minTraceWidth="0.15mm"
      minTraceToPadEdgeClearance="0.15mm"
      minPadEdgeToPadEdgeClearance="0.15mm"
      minViaEdgeToPadEdgeClearance="0.15mm"
      minViaHoleEdgeToViaHoleEdgeClearance="0.46mm"
      minPlatedHoleDrillEdgeToDrillEdgeClearance="0.25mm"
      minBoardEdgeClearance="0.5mm"
      minViaHoleDiameter="0.3mm"
      minViaPadDiameter="0.6mm"
      autorouter={{
        local: true,
        traceClearance: "0.2mm",
        allowViaInPad: false,
      }}
    >
      {schematicSheets.map((name, sheetIndex) => (
        <Fragment key={name}>
          <schematicsheet
            name={name}
            displayName={name}
            sheetIndex={sheetIndex}
            sheetSize="A4"
          >
            <SchematicNotes sheetName={name} />
          </schematicsheet>
        </Fragment>
      ))}
      <CircuitParts />
      <copperpour
        name="GroundPlane"
        connectsTo="net.GND"
        layer="inner1"
        unbroken
        clearance="0.2mm"
        boardEdgeMargin="0.5mm"
        cutoutMargin="0.5mm"
      />
      <copperpour
        connectsTo="net.GND"
        layer="bottom"
        clearance="0.15mm"
        boardEdgeMargin="0.5mm"
        cutoutMargin="0.5mm"
      />
      <keepout
        shape="circle"
        radius="4.03mm"
        pcbX={-40}
        pcbY={-25}
        layers={["top", "inner1", "inner2", "bottom"]}
      />
      <keepout
        shape="circle"
        radius="4.03mm"
        pcbX={40}
        pcbY={-25}
        layers={["top", "inner1", "inner2", "bottom"]}
      />
      <keepout
        shape="circle"
        radius="4.03mm"
        pcbX={40}
        pcbY={25}
        layers={["top", "inner1", "inner2", "bottom"]}
      />
      <keepout
        shape="circle"
        radius="4.03mm"
        pcbX={-40}
        pcbY={25}
        layers={["top", "inner1", "inner2", "bottom"]}
      />
      <hole name="H1" diameter="3.2mm" pcbX={-40} pcbY={-25} />
      <hole name="H2" diameter="3.2mm" pcbX={40} pcbY={-25} />
      <hole name="H3" diameter="3.2mm" pcbX={40} pcbY={25} />
      <hole name="H4" diameter="3.2mm" pcbX={-40} pcbY={25} />
      <silkscreentext
        text={project.silkscreen[0]}
        fontSize="1.8mm"
        pcbX={0}
        pcbY={28}
      />
      <silkscreentext
        text={project.silkscreen[1]}
        fontSize="1.8mm"
        pcbX={-3}
        pcbY={25}
      />
      <silkscreentext
        text={project.silkscreen[2]}
        fontSize="1.8mm"
        pcbX={0}
        pcbY={-28.5}
      />
      <EvaluationNotice />
    </board>
  )
}
