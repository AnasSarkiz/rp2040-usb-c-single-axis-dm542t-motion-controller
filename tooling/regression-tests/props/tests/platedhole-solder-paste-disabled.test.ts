import { expect, test } from "bun:test"
import { platedHoleProps } from "../lib/components/platedhole"

test("plated holes preserve explicit paste intent without changing defaults", () => {
  const hole = { shape: "circle", holeDiameter: 1, outerDiameter: 2 }
  expect(platedHoleProps.parse(hole).solderPasteDisabled).toBeUndefined()
  for (const solderPasteDisabled of [true, false]) {
    expect(
      platedHoleProps.parse({ ...hole, solderPasteDisabled })
        .solderPasteDisabled,
    ).toBe(solderPasteDisabled)
  }
  expect(() =>
    platedHoleProps.parse({ ...hole, solderPasteDisabled: "false" }),
  ).toThrow()
})
