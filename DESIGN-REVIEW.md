# A0 engineering review

Reviewed 2026-09-29 (local date). Schematic and BOM review supports proceeding to native routing. Physical performance remains unverified. Calculations below are design allocations, not measurements. See VALIDATION.md for the separate routing, fabrication and physical-test gates.

## References and selected driver

The [official DM542T V4.0 manual](https://www.omc-stepperonline.com/download/DM542T_V4.0.pdf), revision 4.0 / October 2020, specifies 7–16 mA input current, 4.5–5 V high for the 5 V setting, 0–0.5 V low, ≥2.5 µs pulse high and low, ≥5 µs direction setup and 200 ms enable lead. Set S2 to **5 V**; its factory setting is 24 V. Energizing ENA disables the output; opening ENA enables it. Loss of control power can restore holding torque. No additional numeric DIR hold requirement was found; firmware holds direction through each pulse and provides a 2 ms reversal guard.

The [RP2040 hardware guide](https://datasheets.raspberrypi.com/rp2040/hardware_design_with_rp2040.pdf), [datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf) and [minimal reference CAD](https://datasheets.raspberrypi.com/rp2040/Minimal-KiCAD.zip) supply the reference topology. Retrieved minimal CAD is R3-S1 / July 2026; its MIT license is preserved in references/Minimal-KiCAD-LICENSE.txt. The PCB layout is original. The [Pololu Tic T249](https://www.pololu.com/product/3139) informed command/status usability; no Pololu firmware or CAD is reused.

## MCU, USB and reset

All six RP2040 IOVDD pins, ADC_AVDD, USB_VDD and VREG_IN connect to 3V3. VREG_OUT feeds both DVDD pins; TESTEN and exposed pad 57 are grounded. Unused GPIOs are explicitly unconnected. One-microfarad regulator capacitors and local 100 nF bypasses follow the reference; actual loop lengths and return paths must pass routed review. GPIO0/1/2/3 drive STEP/DIR/ENABLE/ARM, 4/5 read MIN/MAX, 6/7 sequence driver power, 8 reads its fault, 25 drives status and 26 reads protected V5.

W25Q16JVSSIQ is the **208-mil SOIC-8**, not the narrow package. Pins 1 CS, 2 DO, 3 WP, 4 GND, 5 DI, 6 CLK, 7 HOLD and 8 VCC map to QSPI. Pico SDK 2.2.0 boot2_w25q080 explicitly supports W25Q16JV; divider 4 is selected. ABM8-272-T3 is 12 MHz / 10 pF load. Two 15 pF capacitors give 7.5 pF series equivalent plus parasitics; XOUT uses 1 kΩ damping. Physical oscillator startup and USB timing remain bring-up tests.

[AP2112K-3.3](https://www.diodes.com/assets/Datasheets/AP2112.pdf) VIN and EN connect to V5, output to 3V3, NC unused. C2 is 1 µF/25 V and C3 is 2.2 µF/25 V X7R, increasing output-capacitance margin over the 1 µF recommendation. Local 100 nF bypasses supplement this. At an allocated 75 mA MCU/flash load, (5.25−3.3)×0.075 = 0.146 W; using 184 °C/W gives about 27 °C rise. Indoor design range is 0–50 °C; actual temperature and effective MLCC behavior require measurement.

[TPS3839K33](https://www.ti.com/lit/ds/symlink/tps3839.pdf) monitors 3V3: 2.93 V nominal falling threshold (2.857–2.974 V range), 120–350 ms reset release. Its push-pull output drives RUN through R8=1 kΩ; pressing RESET sinks at most about 3.3 mA, below its ±10 mA absolute rating. This reset forces GPIO high impedance; STEP/ARM pulldowns then break the pulse path. Scope brownout and reset transients before motor operation.

USB-C duplicated power/data contacts are joined, shell is grounded, CC1 and CC2 each have independent 5.1 kΩ pulldowns and SBU is unused. [USBLC6-2SC6](https://www.st.com/resource/en/datasheet/usblc6-2.pdf) protects D+/D−; 27 Ω termination is near the MCU. CC pins terminate only in their pull-downs. The Bourns 500 mA hold fuse protects the upstream path; it is not an active current limiter. [LM66100](https://www.ti.com/lit/ds/symlink/lm66100.pdf) VIN follows the fuse, VOUT feeds V5, CE is tied to VOUT for reverse blocking, ST/GND grounded, NC unused. Power injection through test pads, signal terminals or USB data is unsupported.

TS-1187A switch drawing was inspected: imported pins 1/2 form one internal pair and 3/4 the other. Both pairs are wired explicitly. BOOTSEL pulls flash CS through 1 kΩ; RESET pulls RUN to ground.

## Driver supply and output margins

[TPS63030](https://www.ti.com/lit/ds/symlink/tps63030.pdf) provides **4.75 V nominal VDRV**, avoiding raw USB upper/lower-voltage dependence at the driver. PS/SYNC is tied high for forced PWM and its ±1% feedback specification. R26/R27/R28 are 75k/10k/10k, all 0.1%, 25 ppm/°C. L1 is Sunlord SWPA4018S1R5NT, 1.5 µH ±30%, DCR max 39 mΩ, 1.8 A heating rating and 3.35 A saturation rating. The manufacturer's 4018 table and mechanical drawing were visually inspected. Imported pad width gives a larger toe fillet than the example land pattern; its pad height covers the specified terminal dimensions. C21 is 22 µF input, C22/C23 are 22 µF each output, all 25 V X5R; C24 is 100 nF at VINA. These exceed recommended nominal capacitance; effective capacitance/ripple and startup under DC bias remain physical acceptance tests. R31=10k discharges VDRV after shutdown.

[TPS2553DBVR](https://www.ti.com/lit/ds/symlink/tps2553.pdf), SLVS841F, limits the switched driver branch. Pins: 1 IN=V5, 2 GND, 3 EN=GPIO6, 4 open-drain /FAULT=GPIO8 with 10k pull-up to 3V3, 5 ILIM=100k to GND, 6 OUT=DRIVER_VIN. Section 9.5.1 equations with 1% R32 give approximately **232–306 mA** branch limiting. The internal switch controls inrush; firmware delays converter enable by 20 ms and readiness by another 20 ms. /FAULT after startup latches this rail off until USB unmount/reset. Hardware limiting operates during startup and independently of firmware. EN pulldowns hold both supply stages off during reset and bootloader operation.

Five [AO3400A](https://www.aosmd.com/sites/default/files/res/datasheets/AO3400A.pdf) N-MOSFETs provide current sinks: pin 1 gate, 2 source, 3 drain. RDS(on) max 48 mΩ at 2.5 V gives 1.54 mV at 16 mA through the two series STEP/ARM switches. Gate divider 100 Ω / 10k gives 3.267 V nominal. DIR uses one switch. Q4 defaults on when VDRV exists; GPIO ENABLE turns Q5 on to pull Q4's gate low and release ENA. R17=100k consumes only 47.5 µA when pulled down. No additional series optocoupler resistor is fitted for the selected manual's 5 V connection.

`scripts/power-budget.py` includes feedback tolerance, 0–50 °C drift, 1% line/load reserve, ±25 mV allocated ripple, two FET drops and ≤1 Ω signal-pair loop resistance. Calculated driver-terminal range is **4.599–4.884 V**, within 4.5–5 V. This depends on meeting the ripple/cable allocations; measure them. Converter input must remain ≥4.1 V under load for the stated USB budget. ADC threshold 2600 corresponds nominally to 4.19 V at V5; it detects coarse supply faults, not precise driver voltage.

## USB power and firmware behavior

The descriptor requests **500 mA after configuration**. Driver power stays off before configuration and during suspend. The conservative attachment-capacitance tally, including unswitched downstream capacitors, is 9.35 µF. Pre-configuration current allocation is 80 mA (75 MCU/flash, 5 other), below 100 mA. At 48.5 mA driver load and 70% converter efficiency budget, running allocation is 160.3 mA. Branch limiting plus the 80 mA allocation is at most about 386 mA. Measure actual inrush and current; the 80 mA allocation is not a guaranteed component maximum or a USB certification result.

Suspend aborts motion, drops ARM first, turns off both driver supply stages, clears/disables PIO and timers, disables watchdog/ADC and enters RP2040 deep sleep with USB clocks retained for resume. System clock is reduced to 12 MHz while waiting; unused PLL_SYS is off. Resume flushes commands and requires fresh ENABLE after rail sequencing. TinyUSB USB-reset, suspend and CDC-DTR callbacks also stop motion. SDK USB background polling is disabled using its public configuration, with main-loop USB service. No SDK internals are patched. Suspend current **must be measured below 2.5 mA**; the implementation is not a claim of measured compliance. [USB-IF guidance](https://compliance.usb.org/index.asp?UpdateFile=Electrical).

The SDK-compatible Raspberry Pi CDC VID/PID uses custom manufacturer/product strings and unique flash ID serial, following [Raspberry Pi's USB identifier guidance](https://www.raspberrypi.com/documentation/microcontrollers/microcontroller-chips.html#usb-identifiers). No private PID allocation is claimed.

## Limits, timing and sourcing

NC dry contacts give approximately 0.30 V closed and 3.3 V open, with about 1 ms opening / 91 µs closing RC constants. USBLC6 ESD protection does not support sustained 24 V. Broken wires assert the corresponding limit; two asserted limits fault. Homing requires stable transitions, bounded travel and time. PIO generates 10 µs high/low minimums, the planner caps 2000 steps/s, direction guard is 2 ms and enable lead is ≥200 ms. Software tests exercise these states; physical pulse suppression and loaded timing are untested.

All **85 fitted components** have exact manufacturer/package/JLC mappings and positive assembly-eligible quantities checked in official JLC listings, with individual UTC dates in `bom.csv`. Catalog imports remain unchanged; local wrappers correct the TPS2553 schematic classification and add missing MOSFET reference labels without altering supplier pads. The KF350 terminal footprint follows its drawing (3.5 mm pitch, 1 mm holes, 6.9 mm depth, 8.8 mm height). Top-bank wire entry points upward; lower-bank entry downward. Allow 5 mm underside clearance for leads. Manual-weld terminal assembly must be confirmed at quote review.

JLC planning target: 90×60×1 mm, two-layer FR-4, 1 oz outer copper, ≥0.15 mm signal/clearance, 0.4/0.5 mm power trunks, ≥0.3/0.6 mm via drill/pad, ≥0.5 mm copper-edge clearance. No controlled-impedance claim. Actual copper, ground return, drill clearance, power necks, mask/paste and assembler review are later gates. Mounting and connector access have been visually reviewed; physical enclosure fit remains untested.

## Schematic review annotations (prototype.13)

Every IC U1–U9 has adjacent `schematictext` describing its role and relevant
operating point or rating. Notes distinguish the board's design budgets from
component ratings and from physical measurements. USB protection, reverse
blocking, the 3.3 V regulator, boot/reset controls and flash are separated in
the schematic to keep symbols, labels and the notes clear of wires.

The added flash supply range is 2.7–3.6 V ([Winbond W25Q16JV family](https://www.winbond.com/hq/product/code-storage-flash/qspi-nor/w25q-jv/?__locale=en&partNo=W25Q16JVBYIQ)); the fitted part remains W25Q16JVSSIQ. The 600 mA AP2112 rating is an IC rating ([Diodes](https://www.diodes.com/part/view/AP2112)), not permission to exceed the USB or thermal budget. The 1.5 A LM66100 rating ([TI](https://www.ti.com/product/LM66100)) likewise does not increase the board limit. The TPS63030 input range is 1.8–5.5 V ([TI](https://www.ti.com/product/TPS63030)); the board's required input and driver-current budget remain as documented above. References checked 2026-09-29. Other notes use the established design calculations and datasheets above.

U1 and U7 use increased schematic pin spacing, with enough box width for their pin names. The USB footprint explicitly declares entry from its local negative-Y face, which rotates to the left board edge; this corrects model inference without changing copper or the connector position.
