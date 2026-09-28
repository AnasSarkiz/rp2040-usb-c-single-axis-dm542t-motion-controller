import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["IN"],
  pin2: ["GND"],
  pin3: ["EN"],
  pin4: ["N_FAULT"],
  pin5: ["ILIM"],
  pin6: ["OUT"],
} as const

// The catalog importer classifies this six-pin IC as a two-terminal switch.
// Model all six functions as an IC. Land pattern matches C55266; datasheet
// TPS2553 SLVS841F, DBV0006A, and imported geometry are retained for comparison.
export function PowerSwitch(props: ChipProps<typeof pinLabels>) {
  return (
    <chip
      {...props}
      pinLabels={pinLabels}
      manufacturerPartNumber="TPS2553DBVR"
      supplierPartNumbers={{ jlcpcb: ["C55266"] }}
      schPinArrangement={{
        leftSide: ["pin1", "pin3", "pin4"],
        rightSide: ["pin6", "pin5", "pin2"],
      }}
      pinAttributes={{
        pin1: { requiresPower: true },
        IN: { requiresPower: true },
        pin2: { requiresGround: true },
        GND: { requiresGround: true },
        pin3: { isInput: true },
        EN: { isInput: true },
        pin4: { isPassive: true },
        N_FAULT: { isPassive: true },
        pin5: { isPassive: true },
        ILIM: { isPassive: true },
        pin6: { providesPower: true },
        OUT: { providesPower: true },
      }}
      footprint={
        <footprint>
          <smtpad
            portHints={["pin1"]}
            pcbX={1.35001}
            pcbY={-0.94996}
            width={1.0999978}
            height={0.5999988}
            shape="rect"
          />
          <smtpad
            portHints={["pin2"]}
            pcbX={1.35001}
            pcbY={0}
            width={1.0999978}
            height={0.5999988}
            shape="rect"
          />
          <smtpad
            portHints={["pin3"]}
            pcbX={1.35001}
            pcbY={0.94996}
            width={1.0999978}
            height={0.5999988}
            shape="rect"
          />
          <smtpad
            portHints={["pin4"]}
            pcbX={-1.35001}
            pcbY={0.94996}
            width={1.0999978}
            height={0.5999988}
            shape="rect"
          />
          <smtpad
            portHints={["pin5"]}
            pcbX={-1.35001}
            pcbY={0}
            width={1.0999978}
            height={0.5999988}
            shape="rect"
          />
          <smtpad
            portHints={["pin6"]}
            pcbX={-1.35001}
            pcbY={-0.94996}
            width={1.0999978}
            height={0.5999988}
            shape="rect"
          />
          <silkscreenrect width={1.7} height={2.8} />
          <silkscreencircle pcbX={1.397} pcbY={-1.651} radius={0.127} />
          <silkscreentext text="{NAME}" pcbX={0} pcbY={2.56} fontSize={1} />
          <courtyardrect
            width={4.31}
            height={3.83}
            pcbX={0.01245}
            pcbY={-0.10135}
          />
        </footprint>
      }
      cadModel={{
        objUrl:
          "https://modelcdn.tscircuit.com/easyeda_models/assets/C55266.obj?uuid=229b69761e2c45dba6a83d8866dec72d",
        stepUrl:
          "https://modelcdn.tscircuit.com/easyeda_models/assets/C55266.step?uuid=229b69761e2c45dba6a83d8866dec72d",
        pcbRotationOffset: 180,
        modelOriginPosition: { x: 0.0000254, y: -0.0000889, z: -0.048939 },
      }}
    />
  )
}
