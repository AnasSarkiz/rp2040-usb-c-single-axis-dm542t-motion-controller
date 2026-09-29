import { FunctionalLabels, probeLabels } from "./silkscreen"
import { DriverPower } from "./driver-power"
import { TerminalFootprint } from "./terminal-footprint"
import { passiveSchematicPosition } from "./schematic-layout"
import { passiveComponents } from "./passive-components"
import {
  RP2040Attributes,
  TYPE_C_31_M_12Attributes,
  AO3400AAttributes,
} from "./pin-attributes"
import { RP2040 } from "../imports/RP2040"
import { W25Q16JVSSIQ } from "../imports/W25Q16JVSSIQ"
import { AP2112K_3_3TRG1 } from "../imports/AP2112K_3_3TRG1"
import { UsbProtection } from "./symbol-usbprotection"
import { TYPE_C_31_M_12 } from "../imports/TYPE_C_31_M_12"
import { OutputMosfet } from "./output-mosfet"
import { ClockCrystal } from "./symbol-clockcrystal"
import { TS_1187A_B_A_B } from "../imports/TS_1187A_B_A_B"
import { KF350_3_5_2P } from "../imports/KF350_3_5_2P"
import { LM66100DCKR } from "../imports/LM66100DCKR"
import { InputFuse } from "./symbol-inputfuse"
import { KT_0805G } from "../imports/KT_0805G"
import { passives } from "./passives"
import catalog from "./catalog.json"

export function CircuitParts() {
  return (
    <>
      <DriverPower />
      <FunctionalLabels />
      <net name="GND" isGroundNet />
      <net name="VBUS" isPowerNet nominalTraceWidth="0.5mm" />
      <net name="V5" isPowerNet nominalTraceWidth="0.5mm" />
      <net name="V3V3" isPowerNet nominalTraceWidth="0.4mm" />
      <net name="V1V1" isPowerNet nominalTraceWidth="0.3mm" />
      <net name="FUSED_VBUS" isPowerNet nominalTraceWidth="0.5mm" />
      <RP2040
        name="U1"
        pcbStyle={{ silkscreenTextVisibility: "hidden" }}
        schHeight={5.8}
        pinAttributes={RP2040Attributes}
        pcbX={-10}
        pcbY={0}
        pcbRotation={90}
        schX={0 * 0.3}
        schY={0 * 0.3}
        connections={{
          pin1: "net.V3V3",
          pin10: "net.V3V3",
          pin22: "net.V3V3",
          pin33: "net.V3V3",
          pin42: "net.V3V3",
          pin43: "net.V3V3",
          pin44: "net.V3V3",
          pin48: "net.V3V3",
          pin49: "net.V3V3",
          pin23: "net.V1V1",
          pin50: "net.V1V1",
          pin45: "net.V1V1",
          pin19: "net.GND",
          pin57: "net.GND",
          pin20: "net.XIN",
          pin21: "net.XOUT",
          pin24: "net.SWCLK",
          pin25: "net.SWDIO",
          pin26: "net.RUN",
          pin46: "net.MCU_DM",
          pin47: "net.MCU_DP",
          pin51: "net.QSPI_D3",
          pin52: "net.QSPI_CLK",
          pin53: "net.QSPI_D0",
          pin54: "net.QSPI_D2",
          pin55: "net.QSPI_D1",
          pin56: "net.QSPI_CS",
          GPIO0: "net.STEP",
          GPIO1: "net.DIR",
          GPIO2: "net.ENABLE",
          GPIO3: "net.ARM",
          GPIO4: "net.LIMIT_MIN",
          GPIO5: "net.LIMIT_MAX",
          GPIO6: "net.DRIVER_POWER",
          GPIO7: "net.DRIVER_REG_ENABLE",
          GPIO8: "net.DRIVER_FAULT",
          GPIO25: "net.STATUS",
          GPIO26_ADC0: "net.VBUS_SENSE",
        }}
      />
      <W25Q16JVSSIQ
        name="U2"
        pcbX={-22}
        pcbY={-4.5}
        pcbRotation={90}
        schX={-5.5}
        schY={7}
        connections={{
          pin1: "net.QSPI_CS",
          pin2: "net.QSPI_D1",
          pin3: "net.QSPI_D2",
          pin4: "net.GND",
          pin5: "net.QSPI_D0",
          pin6: "net.QSPI_CLK",
          pin7: "net.QSPI_D3",
          pin8: "net.V3V3",
        }}
      />
      <AP2112K_3_3TRG1
        name="U3"
        pcbStyle={{ silkscreenTextVisibility: "hidden" }}
        schHeight={0.6}
        pcbX={-27}
        pcbY={-10}
        schX={-15 * 0.3}
        schY={-5 * 0.3}
        connections={{
          VIN: "net.V5",
          GND: "net.GND",
          EN: "net.V5",
          VOUT: "net.V3V3",
        }}
      />
      <UsbProtection
        name="U4"
        pinAttributes={{
          pin2: { requiresGround: true },
          pin5: { requiresPower: true },
          pin1: { isPassive: true },
          pin3: { isPassive: true },
          pin4: { isPassive: true },
          pin6: { isPassive: true },
        }}
        pcbX={-31}
        pcbY={0}
        schX={-25 * 0.3}
        schY={0 * 0.3}
        connections={{
          pin1: "net.USB_DP",
          pin6: "net.USB_DP",
          pin3: "net.USB_DM",
          pin4: "net.USB_DM",
          pin2: "net.GND",
          pin5: "net.VBUS",
        }}
      />
      <LM66100DCKR
        name="U5"
        pcbX={-34}
        pcbY={-4}
        pcbRotation={90}
        schX={-25 * 0.3}
        schY={-6 * 0.3}
        connections={{
          VIN: "net.FUSED_VBUS",
          GND: "net.GND",
          N_CE: "net.V5",
          VOUT: "net.V5",
          ST: "net.GND",
        }}
      />
      <UsbProtection
        name="U6"
        pinAttributes={{
          pin2: { requiresGround: true },
          pin5: { requiresPower: true },
          pin1: { isPassive: true },
          pin3: { isPassive: true },
          pin4: { isPassive: true },
          pin6: { isPassive: true },
        }}
        pcbX={17}
        pcbY={-15}
        schX={22 * 0.3}
        schY={-10 * 0.3}
        connections={{
          pin1: "net.LIMIT_MIN_WIRE",
          pin6: "net.LIMIT_MIN_WIRE",
          pin3: "net.LIMIT_MAX_WIRE",
          pin4: "net.LIMIT_MAX_WIRE",
          pin2: "net.GND",
          pin5: "net.V3V3",
        }}
      />
      <TYPE_C_31_M_12
        name="J1"
        pinAttributes={TYPE_C_31_M_12Attributes}
        pcbX={-40.5}
        pcbY={0}
        pcbRotation={270}
        schX={-35 * 0.3}
        schY={0 * 0.3}
        connections={{
          EH1: "net.GND",
          EH2: "net.GND",
          EH3: "net.GND",
          EH4: "net.GND",
          GND1: "net.GND",
          GND2: "net.GND",
          VBUS1: "net.VBUS",
          VBUS2: "net.VBUS",
          DP1: "net.USB_DP",
          DP2: "net.USB_DP",
          DN1: "net.USB_DM",
          DN2: "net.USB_DM",
          CC1: "net.CC1",
          CC2: "net.CC2",
        }}
      />
      <InputFuse
        name="F1"
        schRotation={-90}
        pinAttributes={{ pin1: { isPassive: true }, pin2: { isPassive: true } }}
        pcbX={-35}
        pcbY={-11}
        schX={-35 * 0.3}
        schY={-8 * 0.3}
        connections={{ pin1: "net.VBUS", pin2: "net.FUSED_VBUS" }}
      />
      <ClockCrystal
        name="Y1"
        pcbX={-2.9}
        pcbY={-3}
        pcbRotation={90}
        schX={-15 * 0.3}
        schY={-11 * 0.3}
        connections={{
          pin1: "net.XIN",
          pin3: "net.XTAL_OUT",
          GND1: "net.GND",
          GND2: "net.GND",
        }}
      />
      <TS_1187A_B_A_B
        name="SW1"
        pcbX={-29}
        pcbY={14}
        schX={-25 * 0.3}
        schY={9 * 0.3}
        internallyConnectedPins={[
          ["pin1", "pin2"],
          ["pin3", "pin4"],
        ]}
        connections={{
          pin1: "net.BOOT_SW",
          pin2: "net.BOOT_SW",
          pin3: "net.GND",
          pin4: "net.GND",
        }}
      />
      <TS_1187A_B_A_B
        name="SW2"
        pcbX={-29}
        pcbY={-19}
        schX={-25 * 0.3}
        schY={-13 * 0.3}
        internallyConnectedPins={[
          ["pin1", "pin2"],
          ["pin3", "pin4"],
        ]}
        connections={{
          pin1: "net.RUN",
          pin2: "net.RUN",
          pin3: "net.GND",
          pin4: "net.GND",
        }}
      />
      <KT_0805G
        name="LED1"
        schRotation={-90}
        pcbX={-29}
        pcbY={19}
        schX={-15 * 0.3}
        schY={15 * 0.3}
        connections={{ anode: "net.LED_PWR", cathode: "net.GND" }}
      />
      <KT_0805G
        name="LED2"
        schRotation={-90}
        pcbX={-21}
        pcbY={19}
        schX={-8 * 0.3}
        schY={15 * 0.3}
        connections={{ anode: "net.LED_STATUS", cathode: "net.GND" }}
      />
      <OutputMosfet
        name="Q1"
        pinAttributes={AO3400AAttributes}
        pcbX={15}
        pcbY={8}
        schX={4.5}
        schY={1.5}
        connections={{
          G: "net.STEP_GATE",
          D: "net.PUL_MINUS",
          S: "net.STEP_RETURN",
        }}
      />
      <OutputMosfet
        name="Q2"
        pinAttributes={AO3400AAttributes}
        pcbX={15}
        pcbY={1}
        schX={4.5}
        schY={-1.5}
        connections={{ G: "net.ARM_GATE", D: "net.STEP_RETURN", S: "net.GND" }}
      />
      <OutputMosfet
        name="Q3"
        pinAttributes={AO3400AAttributes}
        pcbX={3}
        pcbY={8}
        schX={8}
        schY={1.5}
        connections={{ G: "net.DIR_GATE", D: "net.DIR_MINUS", S: "net.GND" }}
      />
      <OutputMosfet
        name="Q4"
        pinAttributes={AO3400AAttributes}
        pcbX={15}
        pcbY={-6}
        schX={11.5}
        schY={1.5}
        connections={{
          G: "net.DISABLE_GATE",
          D: "net.ENA_MINUS",
          S: "net.GND",
        }}
      />
      <OutputMosfet
        name="Q5"
        pinAttributes={AO3400AAttributes}
        pcbX={21}
        pcbY={-6}
        schX={11.5}
        schY={-1.5}
        connections={{
          G: "net.ENABLE_GATE",
          D: "net.DISABLE_GATE",
          S: "net.GND",
        }}
      />
      {[
        {
          name: "J2",
          x: 6,
          y: 17,
          a: "VDRV",
          b: "PUL_MINUS",
          label: "PUL- PUL+",
        },
        {
          name: "J3",
          x: 18,
          y: 17,
          a: "VDRV",
          b: "DIR_MINUS",
          label: "DIR- DIR+",
        },
        {
          name: "J4",
          x: 30,
          y: 20,
          a: "VDRV",
          b: "ENA_MINUS",
          label: "ENA- ENA+",
        },
        {
          name: "J5",
          x: 11,
          y: -25,
          a: "LIMIT_MIN_WIRE",
          b: "GND",
          label: "MIN GND",
        },
        {
          name: "J6",
          x: 23,
          y: -25,
          a: "LIMIT_MAX_WIRE",
          b: "GND",
          label: "MAX GND",
        },
      ].map((connector, index) => (
        <group key={connector.name} pcbX={0} pcbY={0}>
          <KF350_3_5_2P
            name={connector.name}
            footprint={<TerminalFootprint name={connector.name} />}
            schPinArrangement={{ topSide: ["pin1"], bottomSide: ["pin2"] }}
            pinAttributes={{
              pin1: { isPassive: true },
              pin2: { isPassive: true },
            }}
            pcbX={connector.x}
            pcbY={connector.y}
            pcbRotation={index < 3 ? 180 : 0}
            schX={21}
            schY={6 - index * 4}
            connections={{
              pin1: `net.${connector.a}`,
              pin2: `net.${connector.b}`,
            }}
          />
          <silkscreentext
            text={connector.label}
            fontSize="1.8mm"
            pcbX={connector.x}
            pcbY={connector.y + (index < 3 ? 5.5 : 6)}
          />
        </group>
      ))}
      {passives.map((part) => {
        const purchased = catalog.find(
          (entry) => entry.componentCode === part.code,
        )
        if (!purchased)
          throw new Error(`Missing catalog evidence for ${part.name}`)
        const layout = {
          name: part.name,
          pcbX: part.pcbX,
          pcbY: part.pcbY,
          pcbRotation: part.pcbRotation,
          schRotation: part.nets.some((net) =>
            [
              "GND",
              "VBUS",
              "V5",
              "V3V3",
              "V1V1",
              "VDRV",
              "DRIVER_VIN",
            ].includes(net),
          )
            ? -90
            : 0,
          ...passiveSchematicPosition(part.name),
          manufacturerPartNumber: purchased.componentModelEn,
          supplierPartNumbers: { jlcpcb: [part.code] },
          connections: {
            pin1: `net.${part.nets[0]}`,
            pin2: `net.${part.nets[1]}`,
          },
        }
        const PassiveComponent = passiveComponents[part.code]
        return <PassiveComponent key={part.name} {...layout} />
      })}
      {[
        { rail: "V5", x: -13, y: 16 },
        { rail: "V3V3", x: -9, y: 16 },
        { rail: "V1V1", x: -5, y: 16 },
        { rail: "GND", x: -1, y: 16 },
        { rail: "STEP", x: 9, y: 11 },
        { rail: "DIR", x: 0, y: 11 },
        { rail: "ENABLE", x: 23, y: 2 },
        { rail: "ARM", x: 9, y: -4 },
        { rail: "SWCLK", x: 2, y: -2 },
        { rail: "SWDIO", x: 2, y: 1 },
        { rail: "RUN", x: 5, y: -4 },
      ].map(({ rail, x, y }, index) => (
        <group key={rail} pcbX={0} pcbY={0}>
          <testpoint
            name={`TP${index + 1}`}
            footprintVariant="pad"
            padDiameter="1.4mm"
            footprint={
              <footprint>
                <smtpad
                  shape="circle"
                  radius="0.7mm"
                  portHints={["pin1"]}
                  solderPasteMargin="-0.7mm"
                />
              </footprint>
            }
            pcbX={x}
            pcbY={y}
            schX={(-35 + index * 7) * 0.3}
            schY={-21}
            connections={{ pin1: `net.${rail}` }}
          />
          <silkscreentext
            text={probeLabels[rail].text}
            fontSize="1.8mm"
            pcbX={probeLabels[rail].x}
            pcbY={probeLabels[rail].y}
          />
        </group>
      ))}
    </>
  )
}
