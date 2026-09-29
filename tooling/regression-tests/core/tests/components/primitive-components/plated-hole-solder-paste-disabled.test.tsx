import { expect, test } from "bun:test"
import { getTestFixture } from "tests/fixtures/get-test-fixture"

test("paste can be disabled for through holes without removing copper or mask", () => {
  const { circuit } = getTestFixture()
  circuit.add(
    <board width={20} height={12} routingDisabled>
      <platedhole
        name="CIRCLE"
        pcbX={-6}
        shape="circle"
        holeDiameter={1}
        outerDiameter={2}
        solderPasteDisabled
      />
      <platedhole
        name="PILL"
        pcbX={-2}
        shape="pill"
        holeWidth={1}
        holeHeight={2}
        outerWidth={2}
        outerHeight={3}
        solderPasteDisabled
      />
      <platedhole
        name="OVAL"
        pcbX={2}
        shape="oval"
        holeWidth={1}
        holeHeight={2}
        outerWidth={2}
        outerHeight={3}
        solderPasteDisabled
      />
      <platedhole
        name="DEFAULT"
        pcbX={6}
        shape="circle"
        holeDiameter={1}
        outerDiameter={2}
      />
    </board>,
  )
  circuit.render()
  const holes = circuit.db.pcb_plated_hole.list()
  expect(holes).toHaveLength(4)
  for (const hole of holes) expect(hole.is_covered_with_solder_mask).toBe(false)
  const paste = circuit.db.pcb_solder_paste.list()
  expect(paste).toHaveLength(2)
  expect(paste.map((aperture) => aperture.layer).sort()).toEqual([
    "bottom",
    "top",
  ])
  for (const aperture of paste) expect(aperture.x).toBe(6)
  expect(circuit).toMatchPcbSnapshot(import.meta.path)
})
