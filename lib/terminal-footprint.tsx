// KF350-3.50 drawing Rev A, 2021-03-13, references/C474892.pdf.
// Two poles: 3.50 mm pitch, 0.80 mm leads, recommended 1.00 mm PCB holes,
// 7.00 x 6.90 mm body. Wires enter the negative-Y face in this orientation.
// Copper matches the exact JLC import; explicit access metadata replaces an
// incorrect direction inferred from the imported CAD model's center.
export function TerminalFootprint({ name }: { name: string }) {
  return (
    <footprint insertionDirection="from_y_neg">
      <platedhole
        portHints={["pin1"]}
        pcbX={-1.75}
        pcbY={0}
        outerDiameter={2}
        holeDiameter={1}
        shape="circle"
        solderPasteDisabled
      />
      <platedhole
        portHints={["pin2"]}
        pcbX={1.75}
        pcbY={0}
        outerDiameter={2}
        holeDiameter={1}
        shape="circle"
        solderPasteDisabled
      />
      <silkscreenrect
        pcbX={0}
        pcbY={0.05}
        width={7}
        height={6.9}
        strokeWidth={0.15}
      />
      <silkscreenline
        x1={-3.5}
        y1={-1.9}
        x2={3.5}
        y2={-1.9}
        strokeWidth={0.15}
      />
      <fabricationnotetext text={name} pcbX={-4.7} pcbY={0} fontSize={0.8} />
      <courtyardrect pcbX={0} pcbY={0.05} width={8.5} height={7.7} />
    </footprint>
  )
}
