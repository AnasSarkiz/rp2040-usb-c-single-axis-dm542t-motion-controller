# RP2040 USB-C Single-Axis Stepper Motion Controller for External DM542T Drivers with STEP/DIR/ENABLE Outputs and Dual Limit-Switch Inputs

**Prototype source release 0.1.0-prototype.4 — revision A0 — incomplete, untested. Not ready to order.**

A USB-powered RP2040 controller concept for one external STEPPERONLINE DM542T V4.0 driver, with buffered STEP/DIR/ENABLE signals, two normally-closed dry-contact limit inputs, USB bootloader access, SWD test pads, reset/boot buttons and status LEDs.

The 90 × 60 mm two-layer design uses four 3.2 mm NPTH mounting holes on an 80 × 50 mm pattern. Proposed firmware provides signed relative moves, speed, acceleration, stop, enable/disable, homing, heartbeat and status, with a 2000-step/s software cap and hardware-timed 10 µs STEP pulses.

The draft package contains tscircuit sources, an exact 85-component JLCPCB BOM, firmware sources and build instructions, software tests and a bring-up checklist. The power design includes a regulated 4.75 V driver rail, current limiting, brownout reset and USB suspend handling. Routed copper, fabrication files, assembler review and physical testing remain outstanding. Actual USB suspend current remains unmeasured. Rendered views must be labeled renders; there are no physical board photos or measured hardware results.

Use the driver's 5 V input setting. No 24 V sensors or motor supply may connect to this board. Loss of controller power can leave the separately powered driver enabled and holding torque. Other driver revisions have not been validated. Intended limits are not measured operating specifications.

The user authorized GitHub and tscircuit source publication on 2026-09-29. This is a work-in-progress source package; fabrication and a sale-ready store release remain blocked by VALIDATION.md. No price, availability date, safety certification or hardware-tested claim is assigned.
