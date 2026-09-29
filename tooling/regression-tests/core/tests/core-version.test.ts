import { expect, test } from "bun:test"
import { RootCircuit } from "../lib/RootCircuit"
import pkgJson from "../package.json"

test("emitted generator version identifies the installed source package", () => {
  expect(new RootCircuit().getCoreVersion()).toBe(pkgJson.version)
})
