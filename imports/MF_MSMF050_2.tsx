import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"]
} as const

export const MF_MSMF050_2 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      symbol={
        <symbol>
          <schematicpath points={[{"x":-0.3,"y":-0.1},{"x":-0.2,"y":-0.1}]} strokeColor="#880000" />
          <schematicpath svgPath="M -0.2 -0.1 C -0.1 0.1 0 -0.1 0 -0.1 C 0.1 -0.3 0.2 -0.1 0.2 -0.1" strokeColor="#880000" />
          <schematicpath points={[{"x":0.2,"y":-0.1},{"x":0.3,"y":-0.1}]} strokeColor="#880000" />
          <port name="pin1" pinNumber={1} aliases={["1"]} direction="left" schX={-0.5} schY={-0.1} schStemLength={0.2} />
          <port name="pin2" pinNumber={2} aliases={["2"]} direction="right" schX={0.5} schY={-0.1} schStemLength={0.2} />
        </symbol>
      }
      supplierPartNumbers={{
  "jlcpcb": [
    "C17313"
  ]
}}
      manufacturerPartNumber="MF-MSMF050-2"
      footprint={<footprint>
        <smtpad portHints={["pin2"]} pcbX="1.853438mm" pcbY="0mm" width="1.4066774mm" height="3.4992056mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="-1.853438mm" pcbY="0mm" width="1.4066774mm" height="3.4992056mm" shape="rect" />
<silkscreenpath route={[{"x":-2.7939999999999827,"y":1.797761199999968},{"x":-2.7939999999999827,"y":-1.7582387999999582}]} />
<silkscreenpath route={[{"x":2.793999999999869,"y":1.77800000000002},{"x":2.793999999999869,"y":-1.7779999999999063}]} />
<silkscreenpath route={[{"x":-1.2699999999999818,"y":-2.0319999999999254},{"x":-2.5400000000000773,"y":-2.0319999999999254}]} />
<silkscreenpath route={[{"x":1.2699999999998681,"y":-2.0319999999999254},{"x":2.5399999999999636,"y":-2.0319999999999254}]} />
<silkscreenpath route={[{"x":-2.5400000000000773,"y":2.032000000000039},{"x":-1.2349480000000312,"y":2.032000000000039}]} />
<silkscreenpath route={[{"x":2.5399999999999636,"y":2.032000000000039},{"x":1.2699999999998681,"y":2.032000000000039}]} />
<silkscreenpath route={[{"x":0,"y":0},{"x":-0.22450640302690772,"y":-0.09299359697320142},{"x":-0.31750000000010914,"y":-0.31749999999988177},{"x":-0.22450640302690772,"y":-0.5420064030266758},{"x":0,"y":-0.6349999999999909}]} />
<silkscreenpath route={[{"x":0,"y":0},{"x":0.22450640302668035,"y":0.09299359697320142},{"x":0.31749999999999545,"y":0.31749999999999545},{"x":0.22450640302668035,"y":0.5420064030267895},{"x":0,"y":0.6349999999999909}]} />
<silkscreentext text="{NAME}" pcbX="0mm" pcbY="3.032mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-3.0439999999999827,"y":2.282000000000039},{"x":3.043999999999869,"y":2.282000000000039},{"x":3.043999999999869,"y":-2.2819999999999254},{"x":-3.0439999999999827,"y":-2.2819999999999254},{"x":-3.0439999999999827,"y":2.282000000000039}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C17313.obj?uuid=f8be6105a8d64dcca382e4bf731dc2b6",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C17313.step?uuid=f8be6105a8d64dcca382e4bf731dc2b6",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: -0.000012699999842880061, y: 0, z: 0 },
      }}
      {...props}
    />
  )
}