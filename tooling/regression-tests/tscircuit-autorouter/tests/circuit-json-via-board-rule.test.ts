import { expect, test } from "bun:test"
import { createPcbBoardElement } from "lib/testing/utils/convertToCircuitJson"

test("router board conversion carries the requested via drill clearance", () => {
  const board = createPcbBoardElement({
    layerCount: 4,
    minTraceWidth: 0.15,
    minViaHoleEdgeToViaHoleEdgeClearance: 0.46,
    bounds: { minX: -5, maxX: 5, minY: -5, maxY: 5 },
    obstacles: [],
    connections: [],
  })
  expect(board.min_via_hole_edge_to_via_hole_edge_clearance).toBe(0.46)
})
