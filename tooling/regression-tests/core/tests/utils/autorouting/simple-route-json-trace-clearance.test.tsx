import { expect, test } from "bun:test"
import type { SimpleRouteJson } from "lib/utils/autorouting/SimpleRouteJson"
import { getTestFixture } from "tests/fixtures/get-test-fixture"

test("local routing receives the requested trace clearance", async () => {
  const { circuit } = getTestFixture()
  const inputs: SimpleRouteJson[] = []
  circuit.on("autorouting:start", ({ simpleRouteJson }) =>
    inputs.push(simpleRouteJson),
  )
  circuit.add(
    <board
      width="20mm"
      height="10mm"
      autorouter={{ local: true, traceClearance: "0.23mm" }}
    >
      <resistor
        name="R1"
        resistance="1k"
        footprint="0603"
        pcbX={-4}
        connections={{ pin2: "net.SIGNAL" }}
      />
      <resistor
        name="R2"
        resistance="1k"
        footprint="0603"
        pcbX={4}
        connections={{ pin1: "net.SIGNAL" }}
      />
    </board>,
  )
  await circuit.renderUntilSettled()
  expect(inputs).toHaveLength(1)
  expect(inputs[0]?.defaultObstacleMargin).toBe(0.23)
  expect(inputs[0]?.connections).toHaveLength(1)
  expect(inputs[0]?.connections[0]?.pointsToConnect).toHaveLength(2)
})
