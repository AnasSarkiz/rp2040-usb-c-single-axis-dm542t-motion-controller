import { MF_MSMF050_2 } from "../imports/MF_MSMF050_2"

// Original catalog symbol and pads, with its reference label restored.
export function InputFuse(props: Parameters<typeof MF_MSMF050_2>[0]) {
  return (
    <MF_MSMF050_2
      {...props}
      symbol={
        <symbol>
          <schematicpath
            points={[
              { x: -0.3, y: -0.1 },
              { x: -0.2, y: -0.1 },
            ]}
            strokeColor="#880000"
          />
          <schematicpath
            svgPath="M -0.2 -0.1 C -0.1 0.1 0 -0.1 0 -0.1 C 0.1 -0.3 0.2 -0.1 0.2 -0.1"
            strokeColor="#880000"
          />
          <schematicpath
            points={[
              { x: 0.2, y: -0.1 },
              { x: 0.3, y: -0.1 },
            ]}
            strokeColor="#880000"
          />
          <port
            name="pin1"
            pinNumber={1}
            aliases={["1"]}
            direction="left"
            schX={-0.5}
            schY={-0.1}
            schStemLength={0.2}
          />
          <port
            name="pin2"
            pinNumber={2}
            aliases={["2"]}
            direction="right"
            schX={0.5}
            schY={-0.1}
            schStemLength={0.2}
          />
          <schematictext
            text={props.name}
            schX={0}
            schY={0.22}
            fontSize={0.18}
          />
        </symbol>
      }
    />
  )
}
