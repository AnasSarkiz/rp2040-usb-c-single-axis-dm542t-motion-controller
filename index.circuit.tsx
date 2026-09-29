import { CircuitParts } from "./lib/circuit"
import project from "./project.json"

// Native routing enabled after the documented A0 placement gate passed.
// Fabrication remains gated by routed geometry and physical prototype review.
export default function MotionControllerBoard() {
  return (
    <board
      title={project.title}
      width="90mm"
      height="60mm"
      thickness="1mm"
      layers={2}
      schLayout={{ layoutMode: "relative" }}
      schTraceAutoLabelEnabled
      schMaxTraceDistance={3}
      minTraceWidth="0.15mm"
      minTraceToPadEdgeClearance="0.15mm"
      minPadEdgeToPadEdgeClearance="0.15mm"
      minViaEdgeToPadEdgeClearance="0.15mm"
      minViaHoleEdgeToViaHoleEdgeClearance="0.25mm"
      minPlatedHoleDrillEdgeToDrillEdgeClearance="0.25mm"
      minBoardEdgeClearance="0.5mm"
      minViaHoleDiameter="0.3mm"
      minViaPadDiameter="0.6mm"
      autorouter={{
        local: true,
        traceClearance: "0.15mm",
        allowViaInPad: false,
      }}
    >
      <schematicsheet
        name="Controller"
        sheetSize="ANSI_B"
        sheetWidth={520}
        sheetHeight={500}
      >
        <CircuitParts />
      </schematicsheet>
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
        layers={["top", "bottom"]}
      />
      <keepout
        shape="circle"
        radius="4.03mm"
        pcbX={40}
        pcbY={-25}
        layers={["top", "bottom"]}
      />
      <keepout
        shape="circle"
        radius="4.03mm"
        pcbX={40}
        pcbY={25}
        layers={["top", "bottom"]}
      />
      <keepout
        shape="circle"
        radius="4.03mm"
        pcbX={-40}
        pcbY={25}
        layers={["top", "bottom"]}
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
    </board>
  )
}
