import { expect, test } from "bun:test"
import { AutoroutingDrcEngine, type SimplifiedPcbTraces } from "high-density-repair03/lib"
import { getPipeline9ViaCopperClearance } from "lib/autorouter-pipelines/AutoroutingPipeline9_PreloadedTraceGraph/getPipeline9ViaCopperClearance"
import type { SimpleRouteJson } from "lib/types"

test("indexed via spacing converts the board drill gap to copper-edge units", () => {
  const srj: SimpleRouteJson = {
    layerCount: 4, minTraceWidth: 0.15, minViaDiameter: 0.6,
    minViaHoleDiameter: 0.3, minViaHoleEdgeToViaHoleEdgeClearance: 0.46,
    bounds: { minX: -2, minY: -2, maxX: 2, maxY: 2 },
    obstacles: [], connections: [],
  }
  const params = { originalSrj: srj, defaultViaDiameter: 0.6,
    defaultViaHoleDiameter: 0.3, minimumCopperClearance: 0.1 }
  const margin = getPipeline9ViaCopperClearance(params)
  expect(margin).toBeCloseTo(0.16)
  for (const [centerSpacing, expectedErrors] of [[0.7, 1], [0.76, 0]]) {
    const traces: SimplifiedPcbTraces = [0, centerSpacing!].map((x, index) => ({
      type: "pcb_trace", pcb_trace_id: `trace${index}`, connection_name: `net${index}`,
      route: [{ route_type: "via", x, y: 0, from_layer: "top", to_layer: "bottom",
        via_diameter: 0.6, via_hole_diameter: 0.3 }],
    }))
    const errors = new AutoroutingDrcEngine({ ...srj, traces: undefined }, { viaClearance: margin }).evaluate(traces).errors
    expect(errors.filter(error => error.type === "pcb_via_clearance_error")).toHaveLength(expectedErrors!)
  }
  srj.traces = [{ type: "pcb_trace", pcb_trace_id: "smaller_annulus", connection_name: "n",
    route: [{ route_type: "via", x: 1, y: 1, from_layer: "top", to_layer: "bottom",
      via_diameter: 0.5, via_hole_diameter: 0.3 }] }]
  expect(getPipeline9ViaCopperClearance(params)).toBeCloseTo(0.26)
})
