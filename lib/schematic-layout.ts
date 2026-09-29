// Electrical overview: signal resistors in rows, rail bypasses in compact banks.
// This affects schematic coordinates only; PCB placement is independent.
const bypass3v3 = [
  "C3",
  "C4",
  "C6",
  "C7",
  "C8",
  "C10",
  "C11",
  "C12",
  "C14",
  "C25",
]
const bypass1v1 = ["C5", "C9", "C13"]
const otherCaps: Record<string, { schX: number; schY: number }> = {
  C1: { schX: -16, schY: -16 },
  C2: { schX: -16, schY: -19 },
  C15: { schX: -4, schY: -19 },
  C16: { schX: -1, schY: -19 },
  C17: { schX: 5, schY: -16 },
  C18: { schX: 9, schY: -16 },
  C19: { schX: 13, schY: -16 },
}
export function passiveSchematicPosition(name: string) {
  if (name === "C26") return { schX: -14.6, schY: -19 }
  if (name === "C24") return { schX: -9.6, schY: 21 }
  const partNumber = Number(name.slice(1))
  if (name.startsWith("C") && partNumber >= 20 && name !== "C25")
    return { schX: -15 + (partNumber - 20) * 4, schY: 21 }
  if (name.startsWith("R") && partNumber >= 26)
    return { schX: -15 + (partNumber - 26) * 4, schY: 16 }
  if (name.startsWith("R")) {
    const index = Number(name.slice(1)) - 1
    return { schX: -15 + (index % 9) * 4, schY: -6 - Math.floor(index / 9) * 3 }
  }
  const rail3v3Index = bypass3v3.indexOf(name)
  if (rail3v3Index >= 0)
    return {
      schX: -12 + (rail3v3Index % 3) * 1.4,
      schY: -16 - Math.floor(rail3v3Index / 3) * 1.3,
    }
  const rail1v1Index = bypass1v1.indexOf(name)
  if (rail1v1Index >= 0) return { schX: -4 + rail1v1Index * 1.4, schY: -16 }
  const placement = otherCaps[name]
  if (!placement) throw new Error(`No schematic placement for ${name}`)
  return placement
}

// Supported per-pin margins enlarge dense symbols without the deprecated
// schPinSpacing prop (the installed core intentionally ignores that prop).
export const mcuPinStyle = Object.fromEntries(
  Array.from({ length: 57 }, (_, index) => [
    `pin${index + 1}`,
    { marginTop: 0.1 },
  ]),
)

export const driverRegulatorPinStyle = Object.fromEntries(
  Array.from({ length: 11 }, (_, index) => [
    `pin${index + 1}`,
    { marginTop: 0.15 },
  ]),
)
