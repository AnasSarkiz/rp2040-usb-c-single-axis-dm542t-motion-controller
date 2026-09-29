import type { InductorProps } from "@tscircuit/props"

export const SWPA4018S1R5NT = (props: Omit<InductorProps, "inductance">) => {
  return (
    <inductor
      inductance="1.5uH"
      supplierPartNumbers={{
  "jlcpcb": [
    "C80662"
  ]
}}
      manufacturerPartNumber="SWPA4018S1R5NT"
      footprint={<footprint>
        <smtpad portHints={["pin2"]} pcbX="1.599946mm" pcbY="0mm" width="1.5999968mm" height="3.499993mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="-1.599946mm" pcbY="0mm" width="1.5999968mm" height="3.499993mm" shape="rect" />
<fabricationnotepath route={[{"x":-2.0699984000000313,"y":-1.8899886000000379},{"x":-2.0699984000000313,"y":-2.0961858000000575},{"x":2.0824443999999858,"y":-2.0961858000000575},{"x":2.080005999999912,"y":-1.8999962000000323}]} />
<fabricationnotepath route={[{"x":2.0699983999999176,"y":1.8999962000000323},{"x":2.0700999999999112,"y":2.0955000000000155},{"x":-2.08280000000002,"y":2.0955000000000155},{"x":-2.080006000000026,"y":1.8800064000000702}]} />
<fabricationnotetext text={props.name} pcbX="0.0127mm" pcbY="3.0828mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-2.6376000000000204,"y":2.33280000000002},{"x":2.663000000000011,"y":2.33280000000002},{"x":2.663000000000011,"y":-2.3582000000000107},{"x":-2.6376000000000204,"y":-2.3582000000000107},{"x":-2.6376000000000204,"y":2.33280000000002}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C80662.obj?uuid=54384860ccaa4399aecca69a879f17ac",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C80662.step?uuid=54384860ccaa4399aecca69a879f17ac",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0.000050000000000105516, z: 0 },
      }}
      {...props}
    />
  )
}