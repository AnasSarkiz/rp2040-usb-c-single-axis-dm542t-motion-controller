import type { InductorProps } from "@tscircuit/props"

export const SPH202012H1R5MT = (props: Omit<InductorProps, "inductance">) => {
  return (
    <inductor
      inductance="1.5uH"
      supplierPartNumbers={{
  "jlcpcb": [
    "C98375"
  ]
}}
      manufacturerPartNumber="SPH202012H1R5MT"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-0.905002mm" pcbY="0mm" width="0.999998mm" height="1.999996mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="0.905002mm" pcbY="0mm" width="0.999998mm" height="1.999996mm" shape="rect" />
<silkscreenpath route={[{"x":-1.100023199999896,"y":1.1999976000000743},{"x":1.0999724000000697,"y":1.1999976000000743}]} />
<silkscreenpath route={[{"x":-1.100023199999896,"y":-1.1999975999999606},{"x":1.0999977999999828,"y":-1.1999975999999606}]} />
<silkscreentext text="{NAME}" pcbX="0.010922mm" pcbY="2.1938mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-1.648777999999993,"y":1.4438000000000102},{"x":1.670622000000094,"y":1.4438000000000102},{"x":1.670622000000094,"y":-1.4438000000001239},{"x":-1.648777999999993,"y":-1.4438000000001239},{"x":-1.648777999999993,"y":1.4438000000000102}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C98375.obj?uuid=a7d89db24fa0448bb45d234d55204b87",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C98375.step?uuid=a7d89db24fa0448bb45d234d55204b87",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0, z: -0.01 },
      }}
      {...props}
    />
  )
}