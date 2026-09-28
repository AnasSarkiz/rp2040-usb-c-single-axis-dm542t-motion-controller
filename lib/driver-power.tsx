import { TPS63030DSKR } from "../imports/TPS63030DSKR"
import { PowerSwitch } from "./power-switch"
import { TPS3839K33DBZR } from "../imports/TPS3839K33DBZR"
import { SWPA4018S1R5NT } from "../imports/SWPA4018S1R5NT"

export function DriverPower() {
  return (
    <>
      <net name="VDRV" isPowerNet nominalTraceWidth="0.5mm" />
      <net name="DRIVER_VIN" isPowerNet nominalTraceWidth="0.5mm" />
      <TPS63030DSKR
        name="U7"
        schHeight={1.2}
        pcbX={-3}
        pcbY={-20}
        schX={0}
        schY={11}
        connections={{
          VOUT: "net.VDRV",
          L2: "net.BOOST_L2",
          PGND: "net.GND",
          L1: "net.BOOST_L1",
          VIN: "net.DRIVER_VIN",
          EN: "net.DRIVER_REG_ENABLE",
          pin7: "net.DRIVER_VIN",
          VINA: "net.DRIVER_VIN",
          GND: "net.GND",
          FB: "net.DRIVER_FB",
          EP: "net.GND",
        }}
      />
      <PowerSwitch
        name="U8"
        pcbX={-18}
        pcbY={-22}
        schX={-9}
        schY={11}
        connections={{
          pin1: "net.V5",
          pin2: "net.GND",
          pin3: "net.DRIVER_POWER",
          pin4: "net.DRIVER_FAULT",
          pin5: "net.DRIVER_ILIM",
          pin6: "net.DRIVER_VIN",
        }}
      />
      <TPS3839K33DBZR
        name="U9"
        pcbX={1}
        pcbY={-11}
        schX={9}
        schY={11}
        connections={{
          GND: "net.GND",
          N_RESET: "net.SUPERVISOR_RESET",
          VDD: "net.V3V3",
        }}
      />
      <SWPA4018S1R5NT
        name="L1"
        pcbX={-9}
        pcbY={-20}
        pcbRotation={90}
        schX={-4.5}
        schY={11}
        connections={{ pin1: "net.BOOST_L1", pin2: "net.BOOST_L2" }}
      />
    </>
  )
}
