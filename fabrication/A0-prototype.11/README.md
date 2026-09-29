# A0 / 0.1.0-prototype.11 manufacturing review package

**Untested prototype — NOT APPROVED TO ORDER OR CUT A STENCIL.**

The native `gerbers.zip` and its unchanged `exported/` contents were generated from the routed circuit identified in `manifest.json`. Copper, connectivity and dimensional checks pass. The package contains top/bottom copper, mask, paste and silk, the outline, plated/NPTH drills, the native BOM and a JLCPCB placement file. `assembly-bom.csv` is the complete authored sourcing BOM; the native BOM has matching codes but less descriptive fields.

Target construction: 90 × 60 × 1.0 mm FR-4, two copper layers, nominal 1 oz outer copper, top component assembly. All 85 fitted designators match the placement file. Placement coordinates are millimetres relative to board centre, positive X right and positive Y up; rotations are the native JLCPCB export convention. The assembler must verify component library zero orientations, polarity and connector orientation before acceptance. No assembler review has occurred.

The outline spans X ±45 mm and Y ±30 mm. Four 3.2 mm finished mounting holes are NPTH at (±40, ±25) mm. The NPTH file also contains the USB locating holes. The plated drill file contains the USB shell slots, 1.0 mm terminal holes and 0.3 mm vias. Slots use Excellon G85 commands. Copper stays at least 0.5 mm from the board edge and 4.01059 mm from mounting centres.

## Blocking stencil issue

The installed `@tscircuit/core` 0.0.1971 unconditionally generates top and bottom solder-paste circles for circular plated holes. Its public `CirclePlatedHoleProps` has no independent paste control. The ten J2–J6 terminal positions therefore have twenty unwanted paste openings, across both stencil layers. These terminals are not intended for pin-in-paste assembly. `bun run test:fabrication` intentionally fails and records this defect in `review.json`.

Paste on all eleven bare test pads has been removed through supported source properties, without changing their copper or exposed solder-mask openings. The through-hole issue requires a proper core/API fix followed by regeneration, not editing exported Gerbers or suppressing the check. The exported font also omits the two bullet glyphs in the requested subtitle; the source text is exact, but this needs an export/font fix before final silkscreen approval. Stencil aperture/reduction approval for the exposed pads and fine-pitch ICs is also pending assembler feedback.

No order has been placed. No physical board, assembly, programming, USB, loaded output or motor test has been performed.

## Reproduce

From the board directory, build the current source, then use the installed CLI's supported `export ... --format gerbers` option with `dist/index/circuit.json` and an absolute output path. Run `python3 scripts/check-fabrication.py` after extracting the native archive. `bun scripts/render-gerbers.cjs` renders the actual exported layers with the pinned gerber-to-svg 4.2.8 dependency. Full gate results are in the board's VALIDATION.md.
