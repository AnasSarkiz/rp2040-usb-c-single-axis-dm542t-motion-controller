import { expect, test } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { getDrcErrors } from "lib/testing/getDrcErrors"
import type { SimpleRouteJson } from "lib/types"

test("repair DRC preserves the declared via drill gap even with relaxed defaults", () => {
  const srj: SimpleRouteJson = {
    layerCount: 4,
    minTraceWidth: 0.15,
    minViaHoleEdgeToViaHoleEdgeClearance: 0.46,
    bounds: { minX: -5, maxX: 5, minY: -5, maxY: 5 },
    obstacles: [],
    connections: [],
  }
  const circuit: AnyCircuitElement[] = [
    {
      type: "pcb_board",
      pcb_board_id: "board",
      center: { x: 0, y: 0 },
      width: 10,
      height: 10,
      thickness: 1,
      num_layers: 4,
      material: "fr4",
      min_via_hole_edge_to_via_hole_edge_clearance: srj.minViaHoleEdgeToViaHoleEdgeClearance,
    },
    ...[0, 0.7].map((x, index): AnyCircuitElement => ({
      type: "pcb_via",
      pcb_via_id: `via_${index}`,
      x,
      y: 0,
      outer_diameter: 0.6,
      hole_diameter: 0.3,
      layers: ["top", "inner1", "inner2", "bottom"],
    })),
  ]
  const violations = getDrcErrors(circuit, { viaClearance: 0.1 }).errors
  expect(violations).toHaveLength(1)
  expect(violations[0]).toMatchObject({
    type: "pcb_via_clearance_error",
    minimum_clearance: 0.46,
  })
  const secondVia = circuit[2]
  if (secondVia?.type !== "pcb_via") throw new Error("Missing test via")
  secondVia.x = 0.76
  expect(getDrcErrors(circuit, { viaClearance: 0.1 }).errors).toEqual([])
})
