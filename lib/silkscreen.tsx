// Board-space reference labels for crowded areas; purchased land patterns stay intact.
export const referenceLabels: Record<string, { x: number; y: number }> = {
  C4: { x: -13, y: 8.9 },
  C8: { x: -1.7, y: 3.5 },
  C9: { x: -3.2, y: 4.8 },
  C10: { x: -6.3, y: 7.4 },
  C11: { x: -8.9, y: 9.4 },
  C14: { x: -28.5, y: -3.1 },
  C16: { x: 0.3, y: -4.4 },
  C19: { x: -11, y: 9.2 },
  U1: { x: -5, y: -6 },
  U3: { x: -27, y: -12.5 },
  R20: { x: 11, y: -11.2 },
  R8: { x: 2, y: -5.2 },
}

function ReferenceLabel({
  name,
  position,
}: {
  name: string
  position: { x: number; y: number }
}) {
  return (
    <silkscreentext
      text={name}
      pcbX={position.x}
      pcbY={position.y}
      fontSize="0.8mm"
    />
  )
}

export function ReferenceLabels() {
  return (
    <>
      {Object.entries(referenceLabels).map(([name, position]) => (
        <ReferenceLabel key={name} name={name} position={position} />
      ))}
    </>
  )
}
