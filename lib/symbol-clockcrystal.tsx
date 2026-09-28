import { ABM8_272_T3 } from "../imports/ABM8_272_T3"

// Original catalog symbol and pads, with its reference label restored.
export function ClockCrystal(props: Parameters<typeof ABM8_272_T3>[0]) {
  return (
    <ABM8_272_T3
      {...props}
      symbol={
        <symbol>
          <port
            name="pin1"
            pinNumber={1}
            aliases={["1"]}
            direction="left"
            schX={-0.6}
            schY={-0.2}
            schStemLength={0.2}
          />
          <port
            name="pin3"
            pinNumber={3}
            aliases={["3"]}
            direction="right"
            schX={0.6}
            schY={0.2}
            schStemLength={0.2}
          />
          <port
            name="pin4"
            pinNumber={4}
            aliases={["GND2", "GND"]}
            direction="left"
            schX={-0.6}
            schY={0.2}
            schStemLength={0.2}
          />
          <port
            name="pin2"
            pinNumber={2}
            aliases={["GND1", "GND"]}
            direction="right"
            schX={0.6}
            schY={-0.2}
            schStemLength={0.2}
          />
          <schematicrect
            schX={0}
            schY={0}
            width={0.8}
            height={0.8}
            strokeWidth={0.02}
            color="#880000"
          />
          <schematiccircle
            center={{ x: -0.3, y: -0.3 }}
            radius={0.03}
            strokeWidth={0.02}
            color="#880000"
            isFilled
            fillColor="#880000"
          />
          <schematicpath
            points={[
              { x: -0.1, y: -0.14 },
              { x: -0.1, y: 0.14 },
            ]}
            strokeColor="#881100"
          />
          <schematicpath
            points={[
              { x: 0.1, y: -0.14 },
              { x: 0.1, y: 0.14 },
            ]}
            strokeColor="#881100"
          />
          <schematicpath
            points={[
              { x: -0.4, y: -0.2 },
              { x: -0.2, y: -0.2 },
              { x: -0.2, y: 0 },
              { x: -0.1, y: 0 },
            ]}
            strokeColor="#880000"
          />
          <schematicpath
            points={[
              { x: 0.4, y: 0.2 },
              { x: 0.2, y: 0.2 },
              { x: 0.2, y: 0 },
              { x: 0.1, y: 0 },
            ]}
            strokeColor="#880000"
          />
          <schematicrect
            schX={0}
            schY={0}
            width={0.08}
            height={0.28}
            strokeWidth={0.02}
            color="#880000"
          />
          <schematictext
            text={props.name}
            schX={0}
            schY={0.6}
            fontSize={0.18}
          />
        </symbol>
      }
    />
  )
}
