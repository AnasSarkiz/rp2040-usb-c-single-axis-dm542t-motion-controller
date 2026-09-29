import { MF_MSMF050_2 } from "../imports/MF_MSMF050_2"

// Vertical fuse symbol with the supply input above; catalog pads unchanged.
export function InputFuse(props: Parameters<typeof MF_MSMF050_2>[0]) {
  return (
    <MF_MSMF050_2
      {...props}
      symbol={
        <symbol>
          <schematicpath
            points={[
              { x: 0, y: 0.3 },
              { x: 0, y: 0.2 },
            ]}
            strokeColor="#880000"
          />
          <schematicpath
            svgPath="M 0 0.2 C 0.2 0.1 0 0 0 0 C -0.2 -0.1 0 -0.2 0 -0.2"
            strokeColor="#880000"
          />
          <schematicpath
            points={[
              { x: 0, y: -0.2 },
              { x: 0, y: -0.3 },
            ]}
            strokeColor="#880000"
          />
          <port
            name="pin1"
            pinNumber={1}
            aliases={["1"]}
            direction="up"
            schX={0}
            schY={0.5}
            schStemLength={0.2}
          />
          <port
            name="pin2"
            pinNumber={2}
            aliases={["2"]}
            direction="down"
            schX={0}
            schY={-0.5}
            schStemLength={0.2}
          />
          <schematictext
            text={props.name}
            schX={0.35}
            schY={0}
            fontSize={0.18}
          />
        </symbol>
      }
    />
  )
}
