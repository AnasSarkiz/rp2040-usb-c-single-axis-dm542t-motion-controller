# A0 / 0.1.0-prototype.13 manufacturing review package

**Untested prototype. Design checks pass; manufacturer/assembler acceptance is pending. Not yet approved to order.**

Board: **RP2040 USB-C Single-Axis Stepper Motion Controller for External DM542T Drivers with STEP/DIR/ENABLE Outputs and Dual Limit-Switch Inputs**.

The native `gerbers.zip` and unchanged `exported/` files come from one validated
routed Circuit JSON. The generator is source-built with the explicit fixes and
provenance in `../../tooling/`. No copper, generated JSON, or Gerber was patched.
Copper, holes, vias, and component positions remain identical to prototype.12.

Upload `gerbers.zip`, `assembly-bom.csv`, and `exported/pick_and_place.csv` for
review. The complete authored BOM has accurate package descriptions and exact
LCSC codes; the native BOM inside the ZIP retains sparse importer descriptions.
The placement file contains 85 fitted designators, all on top, matching the BOM.
Coordinates are millimetres from the board centre, X right and Y up. Rotations
use the native JLCPCB exporter convention. See `assembly.svg` and F_Fab for part
references, pin-one marks, component outlines, and assembly orientation.

## Fabrication specification

- 90 × 60 × 1.0 mm FR-4; two copper layers; nominal 1 oz outer copper.
- Green solder mask, white top legend; ENIG finish for the fine-pitch MCU.
- Outline: X ±45 mm, Y ±30 mm. Routed edges; no V-cuts or castellations.
- Four finished Ø3.2 mm NPTH mounting holes at (±40, ±25) mm. Additional USB
  locating holes are in the NPTH file. Preserve plated USB slots (Excellon G85),
  Ø1.0 mm terminal holes, and Ø0.3 mm vias in the plated drill file.
- Copper-edge clearance ≥0.5 mm; copper is ≥4.01059 mm from mounting centres.
- Preserve the supplied mask apertures. Vias are tented; exposed test pads remain
  accessible. J2–J6 require through-hole soldering after reflow, not pin-in-paste.
- The assembler must design any necessary handling rails/tooling/fiducials on
  the production panel, retaining the finished 90 × 60 mm outline and connectors.

## Completed review and pending acceptance

There is no stencil paste on any of the eleven bare test pads or ten terminal
pad positions. The explicit terminal paste-control regression passes. Source
and Gerber text now include both requested bullet separators. Printed text is
≥1.016 mm high; all printed strokes are ≥0.15 mm. The actual-Gerber legend audit
checks exposed-pad clearance, outline margin, and text-to-text spacing.
Detailed small component references/outline artwork are retained on F_Fab;
the fabricated legend carries readable controls, indicators, test signals,
connector polarity, board identity, and REV A0.

Pending manufacturer review: confirm the 1.0 mm stackup and ENIG option; verify
USB slots/terminal hole fit; match every library part and its zero orientation
against the pad positions and pin-one/polarity marks; approve top stencil
thickness/apertures, including RP2040 and TPS63030 exposed pads and USB anchors;
confirm through-hole terminal assembly and production-panel handling. Default
SMT paste reduction remains the generator's 70% linear size. It requires stencil
engineering approval and is not asserted to be an optimized production stencil.

No manufacturer acceptance, purchase, assembled board, or physical test is
claimed. The stage-6 status remains pending until actual feedback is reviewed.

## Reproduce

Use the locked dependencies and ordinary `tsci build` / `tsci export ... --format
gerbers` commands from the board directory. Run `bun run test:fabrication`,
`firmware/.venv/bin/python scripts/check-silkscreen.py`, and the electrical tests.
`bun scripts/render-gerbers.cjs` renders the actual Gerbers; the preview script
renders the board without overlaying the separate assembly-note layer.

Manufacturer limits checked 2026-09-29:
[PCB capabilities](https://jlcpcb.com/capabilities/pcb-capabilities),
[BOM format](https://jlcpcb.com/help/article/bill-of-materials-for-pcb-assembly).

Prototype.13 adds schematic review notes and explicit USB plug-entry metadata. Physical copper, holes, paste, mask and legend geometry remain unchanged from prototype.12.
