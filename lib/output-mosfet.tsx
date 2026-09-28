import { AO3400A } from "../imports/AO3400A"

// Preserve the catalog land pattern and pin geometry; add the missing refdes.
export function OutputMosfet(props: Parameters<typeof AO3400A>[0]) {
  return (
    <AO3400A
      {...props}
      symbol={
        <symbol>
          <schematictext
            text={props.name}
            schX={0.75}
            schY={0.2}
            fontSize={0.18}
          />
          <schematicpath
            points={[
              { x: 0, y: 0 },
              { x: 0.12, y: -0.04 },
              { x: 0.12, y: 0.04 },
              { x: 0, y: 0 },
            ]}
            strokeColor="#880000"
            isFilled
            fillColor="#FEFEFE"
          />
          <schematicpath
            points={[
              { x: 0.4, y: 0.04 },
              { x: 0.34, y: -0.06 },
              { x: 0.46, y: -0.06 },
              { x: 0.4, y: 0.04 },
            ]}
            strokeColor="#880000"
            isFilled
            fillColor="#FEFEFE"
          />
          <schematicpath
            points={[
              { x: 0, y: 0.14 },
              { x: 0.2, y: 0.14 },
              { x: 0.2, y: 0.2 },
              { x: 0.4, y: 0.2 },
              { x: 0.4, y: 0.04 },
            ]}
            strokeColor="#880000"
          />
          <schematicpath
            points={[
              { x: 0, y: 0 },
              { x: 0.2, y: 0 },
              { x: 0.2, y: -0.2 },
              { x: 0.4, y: -0.2 },
              { x: 0.4, y: -0.06 },
            ]}
            strokeColor="#880000"
          />
          <schematicpath
            points={[
              { x: 0.2, y: -0.14 },
              { x: 0, y: -0.14 },
            ]}
            strokeColor="#880000"
          />
          <schematicpath
            points={[
              { x: -0.04, y: 0.18 },
              { x: -0.04, y: -0.18 },
            ]}
            strokeColor="#880000"
          />
          <schematicpath
            points={[
              { x: 0, y: 0.18 },
              { x: 0, y: 0.1 },
            ]}
            strokeColor="#880000"
          />
          <schematicpath
            points={[
              { x: 0, y: -0.04 },
              { x: 0, y: 0.04 },
            ]}
            strokeColor="#880000"
          />
          <schematicpath
            points={[
              { x: 0, y: -0.18 },
              { x: 0, y: -0.1 },
            ]}
            strokeColor="#880000"
          />
          <schematicpath
            points={[
              { x: -0.2, y: 0 },
              { x: -0.04, y: 0 },
            ]}
            strokeColor="#880000"
          />
          <schematicpath
            points={[
              { x: 0.48, y: 0.04 },
              { x: 0.44, y: 0.04 },
              { x: 0.36, y: 0.04 },
              { x: 0.32, y: 0.04 },
            ]}
            strokeColor="#880000"
          />
          <port
            name="pin3"
            pinNumber={3}
            aliases={["D"]}
            direction="up"
            schX={0.2}
            schY={0.4}
            schStemLength={0.2}
          />
          <port
            name="pin1"
            pinNumber={1}
            aliases={["G"]}
            direction="left"
            schX={-0.4}
            schY={0}
            schStemLength={0.2}
          />
          <port
            name="pin2"
            pinNumber={2}
            aliases={["S"]}
            direction="down"
            schX={0.2}
            schY={-0.4}
            schStemLength={0.2}
          />
        </symbol>
      }
    />
  )
}
