import { Fragment } from "react"

// Board operating points and component ratings; sources in DESIGN-REVIEW.md.
// IC ratings do not override the USB budget or imply measured board performance.
const chipNotes = [
  {
    name: "U1",
    x: 1.8,
    y: 7,
    lines: [
      "U1 / RP2040 motion + USB controller",
      "3.3 V I/O; internal 1.1 V core rail",
      "12 MHz crystal; firmware limit 2000 steps/s",
    ],
  },
  {
    name: "U2",
    x: -6.9,
    y: 8.7,
    lines: [
      "U2 / QSPI program flash",
      "16 Mbit (2 MiB); powered from 3.3 V",
      "Device supply range: 2.7-3.6 V",
    ],
  },
  {
    name: "U3",
    x: -18.9,
    y: 13.5,
    lines: [
      "U3 / 3.3 V linear regulator",
      "5 V input; IC rated 600 mA",
      "Board load is USB / thermal limited",
    ],
  },
  {
    name: "U4",
    x: -19,
    y: 3.5,
    lines: [
      "U4 / USB D+ and D- ESD clamp",
      "USB full speed; VBUS clamp rail 5 V",
      "ESD protection, not sustained overvoltage",
    ],
  },
  {
    name: "U5",
    x: -26,
    y: 13.5,
    lines: [
      "U5 / reverse-current blocking diode",
      "5 V USB path; IC rated 1.5 A",
      "Board USB request: 500 mA after config",
    ],
  },
  {
    name: "U6",
    x: 13.8,
    y: 0.8,
    lines: [
      "U6 / dual limit-input ESD clamp",
      "3.3 V logic; NC dry contacts only",
      "No 24 V sensors; open wire asserts limit",
    ],
  },
  {
    name: "U7",
    x: -3,
    y: 13.5,
    lines: [
      "U7 / buck-boost driver supply",
      "VDRV = 4.75 V nominal; 48.5 mA budget",
      "IC input range 1.8-5.5 V; forced PWM",
    ],
  },
  {
    name: "U8",
    x: -14.2,
    y: 9.4,
    lines: [
      "U8 / switched branch current limiter",
      "5 V input; ILIM = 100k to ground",
      "Calculated current limit: 232-306 mA",
    ],
  },
  {
    name: "U9",
    x: 7,
    y: 13.5,
    lines: [
      "U9 / 3.3 V brownout supervisor",
      "Reset threshold 2.93 V nominal",
      "Reset release delay: 120-350 ms",
    ],
  },
]

export function SchematicNotes() {
  return (
    <>
      {chipNotes.map((note) =>
        note.lines.map((text, index) => (
          <Fragment key={`${note.name}-${index}`}>
            <schematictext
              text={text}
              schX={note.x}
              schY={note.y - index * 0.48}
              anchor="left"
              fontSize={0.28}
              color="#24364b"
            />
          </Fragment>
        )),
      )}
      <schematictext
        text="RP2040 USB-C Motion Controller / REV A0 / Design review"
        schX={-26}
        schY={24}
        anchor="left"
        fontSize={0.5}
      />
      <schematictext
        text="Nominal design values unless marked as IC ratings. Physical prototype untested."
        schX={-26}
        schY={23}
        anchor="left"
        fontSize={0.28}
      />
    </>
  )
}
