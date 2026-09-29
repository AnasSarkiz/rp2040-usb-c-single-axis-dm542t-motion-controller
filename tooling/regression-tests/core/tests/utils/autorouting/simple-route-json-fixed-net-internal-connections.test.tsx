import { expect, test } from "bun:test"
import { getSimpleRouteJsonFromCircuitJson } from "lib/utils/autorouting/getSimpleRouteJsonFromCircuitJson"
import { getTestFixture } from "tests/fixtures/get-test-fixture"

test("internal switch links do not make other pads or a ground plane assignable", async () => {
  const { circuit } = getTestFixture()
  circuit.pcbRoutingDisabled = true
  circuit.add(
    <board width={24} height={14} layers={4}>
      <net name="GND" />
      <copperpour layer="inner1" connectsTo="net.GND" unbroken />
      <chip
        name="SW1"
        footprint="soic4"
        pcbX={-5}
        internallyConnectedPins={[["pin1", "pin2"]]}
        connections={{ pin1: "net.GND", pin2: "net.GND" }}
      />
      <resistor
        name="R1"
        resistance="10k"
        footprint="0603"
        pcbX={5}
        connections={{ pin1: "net.GND", pin2: "net.SIGNAL" }}
      />
      <pcbnotetext
        text="Only SW1 pads have internal links; GND plane stays fixed"
        pcbY={5}
        fontSize={0.5}
      />
    </board>,
  )
  await circuit.renderUntilSettled()
  const subcircuitComponent = circuit.firstChild
  if (!subcircuitComponent) throw new Error("Expected board")
  const { simpleRouteJson } = getSimpleRouteJsonFromCircuitJson({
    db: circuit.db,
    subcircuitComponent,
  })
  const plane = simpleRouteJson.obstacles.find(
    (obstacle) => obstacle.isCopperPour,
  )
  expect(plane).toBeDefined()
  expect(plane?.netIsAssignable).not.toBe(true)
  expect(plane?.offBoardConnectsTo).toBeUndefined()
  const resistorPads = simpleRouteJson.obstacles.filter(
    (obstacle) => obstacle.circuitJsonMetadata?.source_component_name === "R1",
  )
  expect(resistorPads).toHaveLength(2)
  expect(
    resistorPads.every(
      (pad) => !pad.netIsAssignable && !pad.offBoardConnectsTo,
    ),
  ).toBe(true)
  const internallyConnectedPads = simpleRouteJson.obstacles.filter(
    (obstacle) =>
      obstacle.circuitJsonMetadata?.source_component_name === "SW1" &&
      obstacle.netIsAssignable,
  )
  expect(internallyConnectedPads).toHaveLength(2)
  expect(internallyConnectedPads[0]?.offBoardConnectsTo).toEqual(
    internallyConnectedPads[1]?.offBoardConnectsTo,
  )
  await expect(circuit).toMatchPcbSnapshot(import.meta.path)
})
