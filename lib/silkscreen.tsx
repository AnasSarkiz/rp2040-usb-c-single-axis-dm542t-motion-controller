// Fabricated legends use >=1.8 mm font size: the vector font's 0.09 stroke
// ratio emits >=0.162 mm lines. Detailed part references remain on F_Fab.
export const probeLabels: Record<
  string,
  { text: string; x: number; y: number }
> = {
  V5: { text: "5V", x: -13, y: 18.5 },
  V3V3: { text: "3V3", x: -9, y: 18.5 },
  V1V1: { text: "1V1", x: -5, y: 18.5 },
  GND: { text: "GND", x: -1, y: 18.5 },
  STEP: { text: "STEP", x: 13.5, y: 11 },
  DIR: { text: "DIR", x: -3.5, y: 11 },
  ENABLE: { text: "ENABLE", x: 28, y: 2 },
  ARM: { text: "ARM", x: 12, y: -4 },
  SWCLK: { text: "SWCLK", x: 7, y: -2 },
  SWDIO: { text: "SWDIO", x: 8, y: 3.2 },
  RUN: { text: "RUN", x: 5.6, y: -6.2 },
}

export function FunctionalLabels() {
  return (
    <>
      <silkscreentext text="USB-C" pcbX={-40} pcbY={7} fontSize="1.8mm" />
      <silkscreentext text="BOOT" pcbX={-29} pcbY={9.5} fontSize="1.8mm" />
      <silkscreentext text="RESET" pcbX={-29} pcbY={-24} fontSize="1.8mm" />
      <silkscreentext text="PWR" pcbX={-29} pcbY={22} fontSize="1.8mm" />
      <silkscreentext text="STATE" pcbX={-21} pcbY={22} fontSize="1.8mm" />
    </>
  )
}
