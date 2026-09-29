// Native A4 sheets use schematic units of 10 mm. Each functional sheet is
// kept within roughly 24 x 17 units, with space for net labels and IC notes.
export const schematicSheets = [
  "MCU and decoupling",
  "USB input and protection",
  "Logic power and sensing",
  "Flash and clock",
  "Reset and debug",
  "Driver power",
  "Motion outputs",
  "Limit inputs",
] as const

type SchematicPlacement = {
  schX: number
  schY: number
  schSheetName: (typeof schematicSheets)[number]
}

const schematicPlacements: Record<string, SchematicPlacement> = {}

// 1. MCU and decoupling
schematicPlacements.U1 = { schX: -6, schY: 0, schSheetName: schematicSheets[0] }
schematicPlacements.C4 = { schX: 2, schY: 4, schSheetName: schematicSheets[0] }
schematicPlacements.C5 = { schX: 8, schY: 4, schSheetName: schematicSheets[0] }
schematicPlacements.C6 = {
  schX: 3.4,
  schY: 4,
  schSheetName: schematicSheets[0],
}
schematicPlacements.C7 = {
  schX: 4.8,
  schY: 4,
  schSheetName: schematicSheets[0],
}
schematicPlacements.C8 = {
  schX: 2,
  schY: 2.7,
  schSheetName: schematicSheets[0],
}
schematicPlacements.C9 = {
  schX: 9.4,
  schY: 4,
  schSheetName: schematicSheets[0],
}
schematicPlacements.C10 = {
  schX: 3.4,
  schY: 2.7,
  schSheetName: schematicSheets[0],
}
schematicPlacements.C11 = {
  schX: 4.8,
  schY: 2.7,
  schSheetName: schematicSheets[0],
}
schematicPlacements.C12 = {
  schX: 2,
  schY: 1.4,
  schSheetName: schematicSheets[0],
}
schematicPlacements.C13 = {
  schX: 10.8,
  schY: 4,
  schSheetName: schematicSheets[0],
}

// 2. USB input and protection
schematicPlacements.J1 = { schX: -8, schY: 0, schSheetName: schematicSheets[1] }
schematicPlacements.U4 = { schX: 1, schY: 0, schSheetName: schematicSheets[1] }
schematicPlacements.F1 = { schX: -8, schY: 6, schSheetName: schematicSheets[1] }
schematicPlacements.U5 = { schX: 1, schY: 6, schSheetName: schematicSheets[1] }
schematicPlacements.R1 = {
  schX: -7,
  schY: -6,
  schSheetName: schematicSheets[1],
}
schematicPlacements.R2 = {
  schX: -2,
  schY: -6,
  schSheetName: schematicSheets[1],
}
schematicPlacements.R3 = { schX: 7, schY: 0, schSheetName: schematicSheets[1] }
schematicPlacements.R4 = { schX: 7, schY: -4, schSheetName: schematicSheets[1] }
schematicPlacements.C1 = { schX: 7, schY: 6, schSheetName: schematicSheets[1] }

// 3. Logic power and sensing
schematicPlacements.U3 = { schX: -6, schY: 4, schSheetName: schematicSheets[2] }
schematicPlacements.C2 = {
  schX: -10,
  schY: 0,
  schSheetName: schematicSheets[2],
}
schematicPlacements.C3 = { schX: -2, schY: 0, schSheetName: schematicSheets[2] }
schematicPlacements.LED1 = {
  schX: 5,
  schY: 4,
  schSheetName: schematicSheets[2],
}
schematicPlacements.R9 = { schX: 5, schY: 0, schSheetName: schematicSheets[2] }
schematicPlacements.R24 = {
  schX: 10,
  schY: 4,
  schSheetName: schematicSheets[2],
}
schematicPlacements.R25 = {
  schX: 10,
  schY: 0,
  schSheetName: schematicSheets[2],
}
schematicPlacements.C19 = {
  schX: 10,
  schY: -4,
  schSheetName: schematicSheets[2],
}
schematicPlacements.TP1 = {
  schX: -9,
  schY: -5,
  schSheetName: schematicSheets[2],
}
schematicPlacements.TP2 = {
  schX: -4,
  schY: -5,
  schSheetName: schematicSheets[2],
}
schematicPlacements.TP3 = {
  schX: 1,
  schY: -5,
  schSheetName: schematicSheets[2],
}
schematicPlacements.TP4 = {
  schX: 5,
  schY: -5,
  schSheetName: schematicSheets[2],
}

// 4. Flash and clock
schematicPlacements.U2 = { schX: -6, schY: 3, schSheetName: schematicSheets[3] }
schematicPlacements.SW1 = { schX: 5, schY: 3, schSheetName: schematicSheets[3] }
schematicPlacements.R5 = { schX: 0, schY: 3, schSheetName: schematicSheets[3] }
schematicPlacements.R6 = { schX: 5, schY: -1, schSheetName: schematicSheets[3] }
schematicPlacements.C14 = {
  schX: -9,
  schY: -3,
  schSheetName: schematicSheets[3],
}
schematicPlacements.Y1 = {
  schX: -3,
  schY: -3,
  schSheetName: schematicSheets[3],
}
schematicPlacements.R7 = { schX: 2, schY: -3, schSheetName: schematicSheets[3] }
schematicPlacements.C15 = {
  schX: -5,
  schY: -7,
  schSheetName: schematicSheets[3],
}
schematicPlacements.C16 = {
  schX: 0,
  schY: -7,
  schSheetName: schematicSheets[3],
}

// 5. Reset and debug
schematicPlacements.U9 = { schX: -7, schY: 4, schSheetName: schematicSheets[4] }
schematicPlacements.SW2 = { schX: 2, schY: 4, schSheetName: schematicSheets[4] }
schematicPlacements.R8 = { schX: -2, schY: 4, schSheetName: schematicSheets[4] }
schematicPlacements.C25 = {
  schX: -7,
  schY: -1,
  schSheetName: schematicSheets[4],
}
schematicPlacements.TP9 = {
  schX: -8,
  schY: -6,
  schSheetName: schematicSheets[4],
}
schematicPlacements.TP10 = {
  schX: -2,
  schY: -6,
  schSheetName: schematicSheets[4],
}
schematicPlacements.TP11 = {
  schX: 4,
  schY: -6,
  schSheetName: schematicSheets[4],
}
schematicPlacements.LED2 = {
  schX: 8,
  schY: 4,
  schSheetName: schematicSheets[4],
}
schematicPlacements.R10 = { schX: 8, schY: 0, schSheetName: schematicSheets[4] }

// 6. Driver power
schematicPlacements.U8 = { schX: -7, schY: 4, schSheetName: schematicSheets[5] }
schematicPlacements.U7 = { schX: 4, schY: 4, schSheetName: schematicSheets[5] }
schematicPlacements.L1 = { schX: -1, schY: 4, schSheetName: schematicSheets[5] }
schematicPlacements.C26 = {
  schX: -11,
  schY: -1,
  schSheetName: schematicSheets[5],
}
schematicPlacements.C21 = {
  schX: 0,
  schY: -1,
  schSheetName: schematicSheets[5],
}
schematicPlacements.C24 = {
  schX: 4,
  schY: -1,
  schSheetName: schematicSheets[5],
}
schematicPlacements.C22 = {
  schX: 8,
  schY: -1,
  schSheetName: schematicSheets[5],
}
schematicPlacements.C23 = {
  schX: 12,
  schY: -1,
  schSheetName: schematicSheets[5],
}
schematicPlacements.R29 = {
  schX: -11,
  schY: -5,
  schSheetName: schematicSheets[5],
}
schematicPlacements.R32 = {
  schX: -7,
  schY: -5,
  schSheetName: schematicSheets[5],
}
schematicPlacements.R33 = {
  schX: -3,
  schY: -5,
  schSheetName: schematicSheets[5],
}
schematicPlacements.R30 = {
  schX: 1,
  schY: -5,
  schSheetName: schematicSheets[5],
}
schematicPlacements.R26 = {
  schX: 5,
  schY: -5,
  schSheetName: schematicSheets[5],
}
schematicPlacements.R27 = {
  schX: 9,
  schY: -5,
  schSheetName: schematicSheets[5],
}
schematicPlacements.R28 = {
  schX: 9,
  schY: -8,
  schSheetName: schematicSheets[5],
}
schematicPlacements.R31 = {
  schX: 5,
  schY: -8,
  schSheetName: schematicSheets[5],
}

// 7. Motion outputs
schematicPlacements.Q1 = { schX: -6, schY: 3, schSheetName: schematicSheets[6] }
schematicPlacements.Q2 = {
  schX: -6,
  schY: -1,
  schSheetName: schematicSheets[6],
}
schematicPlacements.Q3 = { schX: 1, schY: 3, schSheetName: schematicSheets[6] }
schematicPlacements.Q4 = { schX: 8, schY: 3, schSheetName: schematicSheets[6] }
schematicPlacements.Q5 = { schX: 8, schY: -1, schSheetName: schematicSheets[6] }
schematicPlacements.J2 = { schX: -6, schY: 7, schSheetName: schematicSheets[6] }
schematicPlacements.J3 = { schX: 1, schY: 7, schSheetName: schematicSheets[6] }
schematicPlacements.J4 = { schX: 8, schY: 7, schSheetName: schematicSheets[6] }
schematicPlacements.R11 = {
  schX: -11,
  schY: 3,
  schSheetName: schematicSheets[6],
}
schematicPlacements.R12 = {
  schX: -11,
  schY: 0,
  schSheetName: schematicSheets[6],
}
schematicPlacements.R13 = {
  schX: -11,
  schY: -4,
  schSheetName: schematicSheets[6],
}
schematicPlacements.R14 = {
  schX: -6,
  schY: -5,
  schSheetName: schematicSheets[6],
}
schematicPlacements.R15 = {
  schX: -2,
  schY: 3,
  schSheetName: schematicSheets[6],
}
schematicPlacements.R16 = {
  schX: 1,
  schY: -1,
  schSheetName: schematicSheets[6],
}
schematicPlacements.R17 = { schX: 5, schY: 3, schSheetName: schematicSheets[6] }
schematicPlacements.R18 = {
  schX: 4,
  schY: -1,
  schSheetName: schematicSheets[6],
}
schematicPlacements.R19 = {
  schX: 8,
  schY: -5,
  schSheetName: schematicSheets[6],
}
schematicPlacements.TP5 = {
  schX: -9,
  schY: -8,
  schSheetName: schematicSheets[6],
}
schematicPlacements.TP6 = {
  schX: -3,
  schY: -8,
  schSheetName: schematicSheets[6],
}
schematicPlacements.TP7 = {
  schX: 3,
  schY: -8,
  schSheetName: schematicSheets[6],
}
schematicPlacements.TP8 = {
  schX: 9,
  schY: -8,
  schSheetName: schematicSheets[6],
}

// 8. Limit inputs
schematicPlacements.U6 = { schX: -6, schY: 3, schSheetName: schematicSheets[7] }
schematicPlacements.J5 = {
  schX: -10,
  schY: -3,
  schSheetName: schematicSheets[7],
}
schematicPlacements.J6 = {
  schX: -5,
  schY: -3,
  schSheetName: schematicSheets[7],
}
schematicPlacements.R20 = { schX: 0, schY: 3, schSheetName: schematicSheets[7] }
schematicPlacements.R21 = { schX: 5, schY: 3, schSheetName: schematicSheets[7] }
schematicPlacements.R22 = {
  schX: 0,
  schY: -2,
  schSheetName: schematicSheets[7],
}
schematicPlacements.R23 = {
  schX: 5,
  schY: -2,
  schSheetName: schematicSheets[7],
}
schematicPlacements.C17 = {
  schX: 10,
  schY: 3,
  schSheetName: schematicSheets[7],
}
schematicPlacements.C18 = {
  schX: 10,
  schY: -2,
  schSheetName: schematicSheets[7],
}

export function schematicPosition(name: string): SchematicPlacement {
  const placement = schematicPlacements[name]
  if (!placement) throw new Error(`No A4 schematic placement for ${name}`)
  return placement
}

export const passiveSchematicPosition = schematicPosition

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
