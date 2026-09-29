# Validation record — revision A0

Product: **RP2040 USB-C Single-Axis Stepper Motion Controller for External DM542T Drivers with STEP/DIR/ENABLE Outputs and Dual Limit-Switch Inputs**

Reviewed 2026-09-29 local time. **Untested prototype; via-spacing audit failed for prototype.13; correction in progress. Not fabrication ready.** GitHub and tscircuit source publication is user-authorized. This board now has its own Git repository. Earlier source/dependency manifests identify pre-Git states; they do not constitute recoverable complete source snapshots. A0-draft-2 manifests are historical; the power circuit and firmware have changed since then.

## Stage status

| Stage | Status | Evidence / remaining work |
|---|---|---|
| 1. Confirm requirements | in progress | Four-layer 90×60×1 mm candidate; 1 oz outer/0.5 oz inner copper target. Exact manufacturer dielectric stackup and acceptance remain unconfirmed. |
| 2. Review schematic and BOM | passed | DESIGN-REVIEW.md; 85 exact sourced components; regulated driver voltage/current budgets, supervisor, USB sequencing/suspend and overload handling reviewed. Physical electrical limits remain unmeasured. |
| 3. Validate placement before routing | passed | Candidate 14c unrouted native build and board invariants pass; zero placement DRC errors/warnings; reviewed PCB image. R5/C2 rotation heuristics accepted as optimization suggestions. |
| 4. Route and validate copper | blocked | 0.1.0-prototype.14: 57 native PCB errors; 10 shorts findings; 4 drill-to-pad violations; disconnected nets: []. See latest iteration below. |
| 5. Automated and visual routed checks | blocked | Prototype.14 route rejected: native/shorts/via/plane checks fail. No routed snapshot accepted. Current workspace additionally requires A4 sheet organization; existing large schematic sheet still needs conversion. |
| 6. Approve prototype fabrication | blocked | No fabrication package generated for rejected prototype.14. Historical prototype.13 exports are withdrawn from ordering because of via-spacing failures. Manufacturer acceptance remains pending. |
| 7. Test physical prototype | not started | No physical hardware. BRING-UP.md defines required measurements. |
| 8. Prepare store release | in progress | Exact name and revision in README, metadata and prototype source listing. GitHub/tscircuit projects created; source publication authorized. Sale-ready release remains incomplete. |

## Requirements and selected references

- USB-C nominal 5 V, full-speed USB data, one RP2040, one external STEPPERONLINE DM542T **V4.0**, manual rev 4.0 / October 2020, S2 at **5 V**. [Official manual](https://www.omc-stepperonline.com/download/DM542T_V4.0.pdf).
- Common-anode STEP/DIR/ENA, regulated 4.75 V nominal, 7–16 mA per active driver input, 4.5–5 V target at the driver. ≤1 Ω control-pair cable loop. No motor power, external injection or 24 V sensors. Indoor 0–50 °C intended range.
- 500 mA USB configuration request. Design budgets: 80 mA before configuration, about 160 mA running, about 386 mA including branch current limit; attachment capacitance 9.35 µF. Suspend must be ≤2.5 mA. These are allocations, not measurements; see evidence/power-budget.json and BRING-UP.md.
- Normally-closed dry-contact limits, reset/boot buttons, LEDs and 11 bare 1.4 mm test pads. Broken wires assert limits. Firmware cap 2000 steps/s, 10 µs high/low minimums, 2 ms direction guard, ≥200 ms enable lead, 1 s heartbeat timeout.
- User explicitly authorized a **new outline and mounting pattern**, replacing the original matching requirement: 90×60×1 mm FR-4, two layers, top assembly, four 3.2 mm finished NPTH holes at centered (±40,±25) mm, 80×50 mm spacing. Four 4 mm-radius both-layer keepouts reserve hardware clearance; 1 mm remains between each clearance circle and board edge. M3 hardware must fit this envelope. No specific enclosure fit claimed.
- JLCPCB target: 1 oz outer copper, signal width and copper spacing ≥0.15 mm, main power trunks 0.4/0.5 mm, vias ≥0.3 mm drill / 0.6 mm pad, via/drill separation ≥0.25 mm, copper-edge clearance ≥0.5 mm. [Manufacturer capabilities](https://jlcpcb.com/capabilities/pcb-capabilities). Fine-pitch escape necks and actual current capacity must be assessed from routed geometry. No controlled impedance claim on the two-layer stackup.

## Reproducibility

Bun 1.3.9; tscircuit 0.0.2646; CLI 0.1.2172; core 0.0.1971-a0.1; props 0.0.666-a0.1; alphabet 0.0.25-a0.1; TypeScript 5.9.3; Biome 2.5.14; @types/node 22.15.30; pinned bun.lock. Run commands only inside this board directory. Catalog electrical footprints are preserved; prototype.12 moves detailed reference artwork to the fabrication layer and adjusts pin-one legend positions/stroke widths. Locally authored symbol/footprint wrappers are explicit. Manufacturer PDFs remain local; official JLC assembly-stock snapshots are in references/catalog/. Datasheet URLs are in the BOM and design review. Individual catalog dates use UTC.

Firmware uses Pico SDK 2.2.0 (`a1438dff1d38bd9c65dbd693f0e5db4b9ae91779`), TinyUSB `86ad6e56c1700e85f1c5678607a762cfe3aa2f47`, CMake 3.31.6, Arm GNU 13.2.Rel1 / GCC 13.2.1. Exact archive hashes and subset-extraction record are in evidence/toolchain-install.json. Compiler binaries and SDK internals are unchanged; baseline and Cortex-M0+ runtime libraries are included. Firmware README records reconstruction/build/flash commands. ELF/BIN/HEX are software artifacts, not evidence of successful flashing.

Earlier disk exhaustion and a system compiler missing nosys.specs were resolved with task-local dependencies and the official Arm toolchain. Native `keepout` is the installed supported spelling. Manufacturing tolerances are direct board props, not a nested routingTolerances prop. Typechecking exposed and corrected the unsupported form before routing. No type escapes, ignored errors, DRC suppression or installed-artifact patches are used. Prototype.12 includes tested source-built generator forks, with official base commits, source patches, regression fixtures and hashed package archives in tooling/.

## Current commands and evidence

| Command | Result / evidence |
|---|---|
| `bun run format` / `bun run format:check` | Authored source formatting; evidence/a0-format.log / a0-format-check.log |
| `bun run typecheck` | evidence/a0-typecheck.log |
| `bun run bom` | 85 fitted electronic components, all exact codes and positive official assembly-eligible stock; evidence/a0-bom.log, bom.csv, BOM.md |
| `python3 scripts/power-budget.py` | Assertions pass; evidence/power-budget.log and .json |
| `bun run test:firmware` | Sanitized parser/motion tests pass; evidence/a0-motion-tests.log |
| `bun run test:power` | Sanitized sequencing, suspend/resume, undervoltage, wrap and overload-latch tests pass; evidence/a0-power-tests.log |
| `firmware/.venv/bin/cmake --build firmware/build-arm -j 4` | Cross-build passes with warnings as errors; evidence/a0-firmware-build.log |
| `bunx tsci check netlist index.circuit.tsx` | evidence/a0-netlist.log |
| `bunx tsci check pin_specification index.circuit.tsx` | evidence/a0-pin-specification.log |
| `bunx tsci check source index.circuit.tsx` | evidence/a0-source.log |
| `bunx tsci check schematic-placement index.circuit.tsx` | evidence/a0-schematic-placement.log |
| `bunx tsci check placement index.circuit.tsx` | evidence/a0-placement.log |
| `bunx tsci build index.circuit.tsx --pcb-png --pcb-svgs --schematic-svgs` | Unrouted gate evidence/a0-unrouted-build.log; later routed build must be recorded separately |
| `bun run test:board` | Generated connectivity/BOM and unrouted mechanical invariants; evidence/a0-board-tests.log |
| `bunx tsci check routing-difficulty index.circuit.tsx` | Congestion report: evidence/a0-routing-difficulty.log |
| `bunx tsci export index.circuit.tsx --format schematic-pdf --output dist/index/schematic.pdf` | evidence/a0-schematic-export.log, rendered review evidence/a0-schematic-review.png |
| `bunx tsci check shorts dist/index/circuit.json` | Current prototype.12 passes; earlier failures remain in the historical records below |
| `bunx tsci snapshot index.circuit.tsx` | Prototype.12 PCB change reviewed and accepted; PCB and schematic both match in CI mode |

## Review and warnings

Unrouted PCB reviewed for component/courtyard clearance, terminal wire entry, USB access, mounting envelopes and test-pad access. Top-bank terminals face upward, lower bank downward. The exact requested short title, subtitle and REV A0 are visible. Moving the USB connector inward by 0.5 mm corrects its shell-anchor copper-edge violation under the specified 0.5 mm rule. Its mouth remains accessible from the edge; reserve plug/enclosure access. Ordinary silkscreen/component cleanup and final mask/paste checks remain part of routed/fabrication review.

Schematic sheet enlarged to contain all sections. TPS2553 importer incorrectly uses a two-terminal switch; its local six-pin chip model now shows every function. Local wrappers restore missing reference text on custom symbols while preserving source imports. Numeric pin maps and exact BOM mappings are tested against emitted circuit JSON.

The 35 generic-model pin warnings concern imported connectors, FETs, fuse and crystal. They have no dedicated supply input in the IC sense; missing power/ground classifications and generic refdes conventions are accepted model limitations after manual pin review. No fictitious power pins were added to silence them. F1's horizontal power-path symbol has a cosmetic vertical-orientation recommendation; it remains electrically legible. Bare test pads have no component body; their copper/probe access is reviewed explicitly.

Terminal drawing KF350-3.50 Rev A / 2021-03-13 was inspected: 3.5 mm pitch, 0.8 mm leads, 1 mm recommended holes, 6.9 mm depth, 8.8 mm body height and 3.4 mm lead length. Allow 5 mm below the PCB and overhead screwdriver access. Standard PCBA/manual-weld eligibility and orientation must be confirmed during assembler review. No assembler feedback has been obtained.

## Physical and release limits

No prototype, scope captures, current/temperature measurements, motor tests or physical photos exist. Stage 7 remains pending regardless of software results. Loss of controller power or shutdown of VDRV releases ENA and can restore driver holding torque. This is not a safety-rated torque-off device. STORE-LISTING.md describes an incomplete prototype source release. The user authorized source publication on 2026-09-29; no fabrication order is authorized.

Stage-3 acceptance: all five required checks exited 0. Netlist/source report no errors; pin check has the 35 reviewed generic-model warnings. Final schematic-only flash relocation removed label collisions and did not change PCB placement/connectivity. Full rebuild and board invariant tests passed after that move. The reviewed PCB and schematic are preserved before routing.

## Routing investigation

The first native route generated 216 traces and 228 through vias, all 0.3/0.6 mm, with minimum wire width 0.15 mm. Its shorts check passed, but two RUN-net via pairs violated the 0.25 mm drill spacing. Independent geometry review additionally found two same-net drill holes intersecting U5 SMD pads. Neither result is accepted. Preserved candidate: evidence/routing-attempt-1/; logs a0-routed-build-1.log, a0-shorts-1.log and copper-measurements-1.json.

Explicit native local routes were added for the U5 ground pair, RUN escape and both converter-inductor connections. The second candidate introduced additional routing violations and shorts; it is preserved in evidence/routing-attempt-2/ and rejected. Native routing is being retried with additional phase clearance; board manufacturing checks remain unchanged.

The independent audit measured only 3.98074 mm copper distance from mounting centers because the circular pour exclusion uses straight polygon edges. Increasing the native keepout radius from 4.00 to 4.03 mm reserves the specified 4 mm hardware radius despite that approximation. Fresh placement check a0-placement-expanded-keepouts.log passes. This adds clearance; it does not relax a manufacturing rule.

Geometry audit: `firmware/.venv/bin/python scripts/measure-copper.py`, Shapely 2.1.2 / NumPy 2.5.3 (versions in evidence/geometry-tools-versions.txt). It checks all ordinary drills against SMD/test pads without excluding same-net pads, records trace/via dimensions and conservative copper edge/mounting distances. Native DRC/shorts remain mandatory. The empirical external-trace capacity estimate uses 30 µm copper and IPC-2221's coefficient 0.048; a 0.15 mm neck estimates 0.541 A at 10 °C rise, above the 0.386 A allocated input limit. This is a thermal design estimate, not a measurement; critical power paths and actual temperatures remain subject to review.

## Historical storage stop point (superseded by publication check below)

Disk exhaustion recurred at the four-layer preparation step. Copying the last candidate failed with ENOSPC; therefore **no four-layer modification or trial was completed**. A subsequent redundant two-layer build also failed while writing its results. The current source remains two-layer with native routing enabled, 4.03 mm keepouts and a bottom ground pour. Its latest complete electrical/placement checks remain relevant; routed acceptance is blocked.

The latest dist/index/circuit.json had extra trailing data after the failed write and was quarantined intact as evidence/enospc-corrupt-circuit.json.txt. It is not usable validation evidence. Previews in dist/index are rejected/stale and labeled in its README. Complete rejected candidates 1–3 and the accepted unrouted placement are preserved. Candidate 4 had 199 native errors before its later failed rewrite; its router input/output and log remain in dist/autorouter-debug-4/ and evidence/a0-routed-build-4.log. Candidate 4's attempted net selectors did not select the initial phase; the log shows only the implicit remaining phase ran. Those ineffective phase settings were removed, and experimental source files are preserved as text under evidence/ rather than treated as a successful repair.

Cleanup removed only this task's Python bytecode cache (19,480,508 bytes) and incomplete evidence copy. No unrelated files or source/dependency binaries were deleted. Disk free-space reporting fluctuated around 100–170 MB while actual writes failed. Several GB of stable free space are required before continuing.

Next: free storage; rebuild a complete current circuit; evaluate four layers with an internal ground plane under the brief's conditional two-layer preference; verify exact manufacturer's stackup if retained; revalidate affected placement/source and every copper layer. Resolve all native errors, shorts and independent drill/pad violations. Then run and visually review the required snapshot, generate/review manufacturing files and obtain assembler feedback. No snapshot or fabrication package is accepted. Physical stage 7 remains unperformed.

The tscircuit skill requires: “When the canonical approach is blocked, diagnose it. If it cannot be completed within scope, stop and report the blocker and the proper next action; never conceal it with a hack or fallback.” [Skill source](/Users/anassarkiz/.codex/skills/tscircuit/SKILL.md). Storage is the immediate execution blocker; failed copper checks independently prevent fabrication approval. No check was disabled or weakened.

Pre-publication source identity: evidence/source-manifest-A0-routing-blocked-5.json. Artifact inventory: evidence/artifact-manifest-A0-routing-blocked-5.json. These record the blocked state, including historical/rejected artifacts; they are not fabrication approval.

## Source publication check — 0.1.0-prototype.1

On 2026-09-29 the user required GitHub and tscircuit repositories and pushes for every version. Both public projects were created under AnasSarkiz. Storage recovered to approximately 26 GiB free. No electrical circuit or placement changes were made for publishing; prior schematic/BOM and unrouted placement reviews still apply. Package metadata, publication documentation and ignore rules changed. The exact tagged source is the first reproducible Git snapshot; older artifacts remain historical.

Fresh checks from this source:

- Formatting and TypeScript: passed (publish-format-check.log, publish-typecheck.log).
- Sanitized motion/parser and power-policy tests: passed (publish-motion-tests.log, publish-power-tests.log).
- Required pre-publish netlist and placement checks: passed with zero errors/warnings (publish-netlist.log, publish-placement.log).
- Native routed build with PCB PNG/SVG and schematic SVG: **failed**, exit 1, 199 emitted PCB errors (publish-build.log). Complete valid JSON is restored in dist/index and preserved under evidence/routing-prototype-1/. Errors include 50 trace, 9 pad/trace, 108 via/trace, 21 pad/pad, 1 via and 10 placement errors introduced by routed geometry.
- Native shorts check: **failed**, 26 reported raster/gerber findings; these are reported findings, not a claim of 26 unique electrical defects (publish-shorts.log).
- Routed board test: **failed** on the emitted errors (publish-board-tests.log).
- Independent copper audit: **failed**, 16 drill-to-pad violations; minimum trace width 0.15 mm; 212 vias with 0.3/0.6 mm drill/pad (publish-copper-measurements.log and copper-measurements-prototype-1.json).
- Current PCB overview inspected; dense MCU routing has visible overlaps. This rejected preview is not an accepted visual gate or physical photo. No snapshot accepted and no fabrication outputs approved.

The tscircuit CLI uploads sources and queues remote processing; successful upload is separate from a passing PCB build. The source package prominently discloses the failures. Local toolchains, private user brief, manufacturer PDF copies and corrupt output are excluded from both repositories. The tscircuit GitHub-app linkage request returned repository_not_accessible; direct authenticated CLI pushes to each service remain available. No permission bypass was used.

Next hardware work: resolve native routing/shorts and independent geometry failures, then complete routed visual/snapshot and fabrication gates. Current source is still two-layer; no four-layer trial has run. Source publication does not advance stages 4–7. See VERSIONING.md for the agreed push-every-version workflow.

Public export scope: the initial broad export was blocked by automatic approval review. The public snapshot contains authored board/firmware sources, component imports, the minimal supplier metadata used to reproduce the BOM, documentation, tests, and the concise public-validation.json record with artifact hashes. `.npmrc`, raw evidence/logs/generated renders, supplier reference downloads and private input remain local. Paths to those artifacts elsewhere in this document describe the local investigation archive, not files included in the public release. Historical whitespace warnings in generated evidence and the unchanged third-party license were reviewed; authored source whitespace checks pass.

## Placement iteration — 0.1.0-prototype.2

Rotated U1 and its decoupling/crystal cluster 90 degrees so USB exits toward the connector. Moved/rotated U5, relocated U9/C25 and R8 for clearer reset/power routing. Connectivity and BOM are unchanged. Netlist, pin specification, source, schematic placement and PCB placement were rechecked with routing disabled; placement has zero errors/warnings, and only the previously accepted generic pin/F1 style warnings remain. The unrouted build and board invariants pass; PCB placement overview was visually inspected.

Fresh native routing still fails: 199 emitted PCB errors, 24 shorts findings and 14 independent drill-to-pad violations. No result is accepted for fabrication. Checks and generated candidates are preserved locally as evidence/iteration-2-*. Tests and formatting/typecheck remain enabled. This placement revision is saved to both repositories to preserve the experiment before the next component moves.

## Placement iteration — 0.1.0-prototype.3

Moved signal/debug test pads toward their associated circuitry, reducing repeated cross-board branches. Unrouted placement/build/invariants pass and the placement overview was inspected. Native routed build now reports zero PCB errors; shorts test reports none; independent drill-to-pad audit passes (minimum 0.154998 mm), 0.5 mm copper-edge margin and 4.010594 mm mounting clearance. All traces are at least 0.15 mm; 173 vias are 0.3/0.6 mm. Format/typecheck and native firmware tests pass. Snapshots generated and reviewed but are NOT accepted due to the connectivity finding below.

A deeper layer-aware copper union audit checks all 57 nets and 273 required ports. It found one open net, VBUS_SENSE: source_net_36_mst2_0 terminates on bottom at U1 GPIO26_ADC0, whose pad is on top, without a via there. Native DRC did not report it. Therefore routing is still rejected. The new scripts/check-copper-connectivity.py reproduces this failure and is now part of the test command. Geometric pad handling is shared with the existing dimensional audit in scripts/copper_geometry.py. No check was weakened. The next placement iteration will move R24/R25/C19 toward U1's ADC pin.

Reviewed local views: iteration-3-top/bottom-detail.png, top/bottom-mcu.png, top/bottom-power.png and schematic.png; local logs are iteration-3-*. Minor silkscreen label overlaps around testpoints/reference text remain a fabrication-review task. Raw snapshots remain local until their full acceptance gate passes.

## Placement iteration — 0.1.0-prototype.4

Moved R24, R25 and C19 above U1 to shorten the ADC input route. This closes VBUS_SENSE but other routed copper violations recur.

Unrouted placement/build/invariants pass and the placement overview was inspected. Routing results: 188 native PCB errors; 34 shorts findings; 15 drill-to-pad violations; disconnected nets: []. This routing candidate is rejected. No manufacturing rule was weakened. Logs: local evidence/iteration-4-*. Generated geometry and audits are preserved in evidence/routing-prototype-4/.

## Placement iteration — 0.1.0-prototype.5

Tightened R24/R25/C19 spacing above the MCU; native DRC reports zero errors, but separate shorts/geometry/connectivity checks still fail, including the ADC bottom-layer endpoint.

Unrouted placement/build/invariants pass and the placement overview was inspected. Routing results: 0 native PCB errors; 20 shorts findings; 3 drill-to-pad violations; disconnected nets: ['VBUS_SENSE']. This routing candidate is rejected. No manufacturing rule was weakened. Logs: local evidence/iteration-5-*. Generated geometry and audits are preserved in evidence/routing-prototype-5/.

## Placement iteration — 0.1.0-prototype.6

Moved C13, C19 and the crystal network and introduced an explicit ADC trace. Review found pcbPath waypoint coordinates are relative to the rotated source component; the initial board-coordinate waypoint was wrong, so this routing is rejected and corrected in the next revision.

Unrouted placement/build/invariants pass and the placement overview was inspected. Routing results: 290 native PCB errors; 16 shorts findings; 0 drill-to-pad violations; disconnected nets: ['VDRV', 'BOOST_L2', 'GND', 'BOOST_L1', 'DRIVER_VIN', 'DRIVER_REG_ENABLE', 'DRIVER_FB', 'V5', 'DRIVER_POWER', 'DRIVER_FAULT', 'DRIVER_ILIM', 'SUPERVISOR_RESET', 'V3V3', 'V1V1', 'XIN', 'XOUT', 'SWCLK', 'SWDIO', 'RUN', 'MCU_DM', 'MCU_DP', 'QSPI_D3', 'QSPI_CLK', 'QSPI_D0', 'QSPI_D2', 'QSPI_D1', 'QSPI_CS', 'STEP', 'DIR', 'ENABLE', 'ARM', 'LIMIT_MIN', 'LIMIT_MAX', 'STATUS', 'VBUS_SENSE', 'USB_DP', 'USB_DM', 'VBUS', 'FUSED_VBUS', 'LIMIT_MIN_WIRE', 'LIMIT_MAX_WIRE', 'CC1', 'CC2', 'XTAL_OUT', 'BOOT_SW', 'LED_PWR', 'LED_STATUS', 'STEP_GATE', 'PUL_MINUS', 'STEP_RETURN', 'ARM_GATE', 'DIR_GATE', 'DIR_MINUS', 'DISABLE_GATE', 'ENA_MINUS', 'ENABLE_GATE', 'DRIVER_FB_SERIES']. This routing candidate is rejected. No manufacturing rule was weakened. Logs: local evidence/iteration-6-*. Generated geometry and audits are preserved in evidence/routing-prototype-6/.

## Placement iteration — 0.1.0-prototype.7

Moved C19 to (-10.5, 9.1) and removed the incorrect numeric PCB waypoint. Native routing leaves one ADC connection open; no shorts or drill violations were detected.

Unrouted placement/build/invariants pass and the placement overview was inspected. Routing results: 1 native PCB errors; 0 shorts findings; 0 drill-to-pad violations; disconnected nets: ['VBUS_SENSE']. This routing candidate is rejected. No manufacturing rule was weakened. Logs: local evidence/iteration-7-*. Generated geometry and audits are preserved in evidence/routing-prototype-7/.

## Placement iteration — 0.1.0-prototype.8

Moved C19 to (-10.5, 9.4) and added a direct pad-to-pad top-layer ADC trace. All 57 nets are connected, but native routing creates new shorts and clearance violations elsewhere; candidate rejected.

Unrouted placement/build/invariants pass and the placement overview was inspected. Routing results: 147 native PCB errors; 18 shorts findings; 7 drill-to-pad violations; disconnected nets: []. This routing candidate is rejected. No manufacturing rule was weakened. Logs: local evidence/iteration-8-*. Generated geometry and audits are preserved in evidence/routing-prototype-8/.

## Placement iteration — 0.1.0-prototype.9

Moved and rotated C19 adjacent to the MCU ADC pin and spread C4, C5, C10 and C11 for courtyard clearance. Native build reports zero errors and all nets connect, but independent copper and native shorts audits reject the route.

Unrouted placement/build/invariants pass and the placement overview was inspected. Routing results: 0 native PCB errors; 10 shorts findings; 5 drill-to-pad violations; disconnected nets: []. This routing candidate is rejected. No manufacturing rule was weakened. Logs: local evidence/iteration-9-*. Generated geometry and audits are preserved in evidence/routing-prototype-9/.

## Placement iteration — 0.1.0-prototype.10

Rotated U2 by 90 degrees and moved it to (-22, -4.5), moved its bypass C14 to (-28.5, -4.5), and moved C6, C8 and C23 away from prior via conflicts. Unrouted placement passes with zero errors/warnings. Native routed build, native shorts, independent dimensions/drills and independent 57-net/273-port physical connectivity all pass. Added rotated-pill geometry support with a bounds/area regression test; no audit limits changed.

Unrouted placement/build/invariants pass and the placement overview was inspected. Routing results: 0 native PCB errors; 0 shorts findings; 0 drill-to-pad violations; disconnected nets: []. All four copper checks pass; remaining visual/fabrication gates still apply. Logs: local evidence/iteration-10-*. Generated geometry and audits are preserved in evidence/routing-prototype-10/.

### Prototype.10 visual review and limits

Reviewed dist/index/pcb.png and schematic.svg plus evidence/iteration-10-top-mcu.png, iteration-10-top-power.png, iteration-10-bottom.png and iteration-10-schematic.png. Copper routing checks pass without changed tolerances. Component-reference labels overlap in the MCU/power regions, and TP6 DIR overlaps R15. These silkscreen items still need cleanup before fabrication approval. The initial snapshot mismatch is expected from the documented placement/copper changes; it is not hidden or accepted as a fabrication gate. Firmware motion and power-policy sanitizer tests and TypeScript pass. Earlier schematic/BOM review remains applicable because connectivity and fitted components are unchanged. Generic imported-part pin warnings and F1 schematic style suggestion remain accepted for the previously recorded reasons.

## Placement iteration — 0.1.0-prototype.11

Cleaned overlapping component and signal labels. Preserved all physical copper, holes, mounting clearances and component positions from prototype.10; only test-pad port-hint spelling changes from 1 to pin1. Replaced implied probe footprints with identical 1.4 mm copper pads and explicitly zero stencil paste using the supported solderPasteMargin property. All routed checks and software tests pass. Gerber export review identifies unavoidable through-hole terminal paste in the installed core; fabrication approval remains blocked.

Unrouted placement/build/invariants pass and the placement overview was inspected. Routing results: 0 native PCB errors; 0 shorts findings; 0 drill-to-pad violations; disconnected nets: []. All four copper checks pass; remaining visual/fabrication gates still apply. Logs: local evidence/iteration-11-*. Generated geometry and audits are preserved in evidence/routing-prototype-11/.

### Final prototype.11 evidence

Physical component placement is unchanged from the accepted unrouted prototype.10 placement. The emitted copper, holes, outline and keepouts are identical after excluding equivalent probe-pad port-hint aliases (`1` versus `pin1`). Thus the prior placement review remains applicable. Copper audits were rerun on the current JSON after the paste and label changes. All 57 nets / 273 required ports connect, no physical short groups exist, native DRC and shorts report zero errors, and ordinary drill-to-pad violations are zero. Minimum trace width 0.15 mm; vias 0.30/0.60 mm drill/pad; minimum drill-to-SMD clearance 0.1548845 mm; edge clearance 0.5 mm; mounting-centre copper clearance 4.010594 mm. The earlier 30 µm copper / IPC-2221 empirical estimate gives 0.5405 A for the narrowest track at 10 °C rise, above the 0.386 A budget; this is not a physical thermal test.

Reviewed final native PCB overview, top MCU/power closeups, bottom copper and unchanged schematic, then the actual exported F_Cu, B_Cu, F_Mask, F_Paste, F_SilkScreen and Edge_Cuts renders. Local paths: evidence/iteration-11-*. The Gerber review exposed unwanted paste on bare probes and terminals. Supported source-level paste margins resolve all probe openings. Core PlatedHole.doInitialPcbRender unconditionally adds paste on both sides of circular plated holes, and no public independent paste property exists in this installed version. The remaining ten terminal positions / twenty layer openings fail test:fabrication. The native Gerber font omits the two requested subtitle bullet glyphs although the source string is exact. Both are explicit stage-6 blockers. No generated copper/Gerber file was manually patched.

`gerber-to-svg@4.2.8` was added solely to review the exported files. Circuit, router, firmware and compiler versions remain pinned and unchanged. Final format/type/board/connectivity/firmware/geometry checks pass; PCB and schematic snapshots match in CI mode after visual review. Fabrication check fails for the documented terminal stencil issue. CPL has exactly 85 BOM designators, all top side; final assembler orientation/stackup/stencil acceptance and all physical tests remain unavailable.

## Fabrication iteration — 0.1.0-prototype.12

Source-built core/props fixes add explicit plated-hole paste control; J2–J6 now have no top/bottom paste. The source-built alphabet adds the requested U+2022 bullets. These are genuine source changes with regression tests and canonical builds, not edits to installed code, Circuit JSON, or exported Gerbers. Package versions, upstream commits, patches, licenses and archive hashes are recorded in tooling/manifest.json. The core version reporter accurately reports its local prerelease.

Manufacturer capability review identified undersized legend strokes/text. All functional text now uses 1.8 mm source font size, yielding actual Gerber character height ≥1.016242 mm and text stroke width 0.162 mm. Other printed strokes are ≥0.15 mm. Detailed component references/outlines remain on F_Fab. Actual exported Gerber checks find zero exposed-pad clearance, edge-margin or text-to-text violations at the recorded limits. Both subtitle bullets are visibly present. New parser tests check line/flash geometry and reject unsupported clear-polarity commands.

Electrical component positions, copper pads, plated/nonplated holes, vias, traces and pours are JSON-identical to prototype.11. No new routing error occurred, so no electrical component relocation was required. The previously accepted unrouted placement and datasheet/BOM review remain applicable. Current native checks were rerun; schematic and source connectivity are unchanged. Netlist/source/placement pass; the 35 generic pin-model warnings and F1 cosmetic orientation suggestion remain accepted for the reasons above.

Final native routed build and shorts pass with zero errors. Independent audits confirm 57 nets / 273 ports, no opens or short groups, minimum track width 0.15 mm, vias 0.30/0.60 mm drill/pad, minimum drill-to-pad clearance 0.1548845 mm, copper-edge 0.5 mm and mounting-centre clearance 4.010594 mm. The earlier current-budget estimate remains applicable because copper is unchanged; it is not a physical thermal result. Format, TypeScript, board, physical-connectivity, firmware sanitizer, rotated-pad geometry, paste and silkscreen tests pass. Initial PCB snapshot mismatch was reviewed as the intended legend/fabrication-layer change before updating. Both final snapshots match in CI mode; the schematic drawing is unchanged (its embedded font payload now includes the bullet glyph).

Reviewed final native PCB/snapshot and clean top/bottom previews, assembly drawing and unchanged schematic. Independently rendered the actual final F_Cu, B_Cu, F_Mask, B_Mask, F_Paste, F_SilkScreen and Edge_Cuts Gerbers and inspected each. PTH/NPTH drill files and USB slots match prototype.11. Local evidence: iteration-12-*. Public artifacts: previews/A0-prototype.12/ and fabrication/A0-prototype.12/. The fabrication manifest identifies the source tag, exact Circuit JSON hash and every exported-file hash. CPL contains exactly 85 BOM designators, all top side; reviewed package includes the complete assembly BOM.

Source-tool tests: props parsing/default/rejection tests and typecheck pass; core typecheck/build/version test and 17 plated-hole/paste regressions pass; alphabet build and all 10 tests pass. New visual fixtures were inspected. Upstream font generation's Boolean-union warning also occurs on the unchanged baseline; bullet stroke/outline/TTF regression tests pass. Optional DejaVu comparison font is unavailable and no comparison is claimed. The convenience reconstruction helper completed props/alphabet but its fresh core dependency installation stalled and was stopped; end-to-end helper verification is incomplete. The reviewed core archive was independently built/tested from the patched source checkout and the board's locked archive installation passes.

Internal design/export review is complete. Stage 6 still requires actual assembler acceptance of library orientation, stencil apertures/thickness, stackup and production-panel handling. Upload permission was requested; no manufacturer response or acceptance is invented. No fabrication order, physical prototype or measured operating limits exist. Stage 7 remains not started.

## Schematic review — 0.1.0-prototype.13

Added three `schematictext` lines beside each IC U1–U9, explaining its role and relevant board operating point or component rating. Notes distinguish nominal design budgets, IC ratings and unperformed physical tests; supporting references are in DESIGN-REVIEW.md. Separated USB, reverse blocking, regulator, flash and boot/reset symbols. U1 pin pitch is now 0.30 schematic units and U7 0.35, using supported per-pin margins; larger boxes fit the labels. Moved the status LED schematic symbol clear of the MCU rail label. PCB positions are unchanged.

Final schematic-placement analysis reports no text/trace, symbol or net-label collisions. Remaining suggestions are generous box-edge padding on unequal pin-count sides of U1/U7 and F1's horizontal orientation. They are accepted after viewing the actual schematic: the extra space supports readable labels, and the fuse remains legible between two labeled power rails. The deprecated schPinSpacing trial was removed and is not used. Final TypeScript and formatting pass.

Reviewed the final whole sheet and power, logic, I/O and passive closeups (evidence/iteration-13-schematic-final.png and iteration-13-final-*.png). Every IC note is present and readable; custom notes clear symbols, pin labels and wires. The main sheet and notes are available in previews/A0-prototype.13/schematic.svg. Snapshot acceptance is recorded below after CI verification.

Fresh native routed build and shorts pass with zero errors. Board, physical-connectivity, dimensional and firmware sanitizer tests pass: 57 nets / 273 ports, no opens/short groups or drill-to-pad violations. Source component/net/port/trace records exactly match prototype.12. All physical copper, pads, holes, vias, traces, pours, keepouts, paste and legend geometry remain unchanged. No PCB component moves or routing retries were necessary.

USB footprint entry is now explicitly from local negative Y, which rotates to the left board edge at its existing 270-degree placement. This fixes the CAD-model direction inference without changing copper or physical placement. The PCB placement command reports zero DRC errors/warnings but exits 1 for three pre-existing optimization heuristics (R5, C2, C13 possible 180-degree rotations). These are accepted as non-actionable optimization suggestions for this unchanged, fully routed board: measured copper has no crossings/shorts/clearance violations, and all required ports connect. Earlier records that described this command simply as passing omitted its heuristic exit status; the current result is explicit. Bare probe pads retain the documented no-body courtyard warnings. Netlist/source checks pass; the same 35 generic pin warnings remain accepted.

Regenerated fabrication/A0-prototype.13/ from the final routed JSON. All Gerber/drill/BOM/CPL contents equal prototype.12 after excluding creation-date comments; the assembly SVG is byte-identical. Therefore the prior visual copper, mask, paste, outline, drill, orientation and legend review remains applicable. Paste and actual-Gerber silkscreen audits rerun successfully. The new manifest links this source tag to the current JSON and exported bytes. Manufacturer acceptance and physical prototype testing remain pending; no order placed.

Final snapshot gate: reviewed the schematic difference before acceptance, updated the snapshots, then ran `tsci snapshot index.circuit.tsx --ci`; PCB and schematic both match (exit 0). Logs: evidence/iteration-13-snapshot-update.log and iteration-13-snapshot-ci.log. Stage 5 is passed with the documented accepted style/optimization suggestions; manufacturer acceptance and physical tests remain pending.

## Via-spacing correction in progress

User inspection triggered an expanded audit of prototype.13. Of 170 vias, RUN/SWCLK has 0.100000 mm copper spacing and V3V3/GND has 0.104849 mm, both below the recorded 0.15 mm rule. Minimum drill-edge spacing is 0.250568 mm (above the former 0.25 mm limit). Same-net ring overlaps are not shorts, but the new layout reserves more space for all vias. Native checks and the earlier independent audit missed different-net via-to-via copper clearance; previous stage-4/5 pass records are superseded. New regression tests reproduce the missed failure; the normal test command now runs an explicit via/drill geometry audit.

Candidate 14 moves SWCLK probe TP9 from (2,-2) to (3,-1), moves C4 from (-13,6) to (-13,7), and raises via drill-edge clearance to 0.46 mm. With 0.30/0.60 mm vias this requires 0.76 mm centres and 0.16 mm ring-edge spacing. This tightens the rule; it does not change the 0.15 mm acceptance threshold. Placement is checked unrouted before attempting native routing.

Four-layer assessment: user suggested four layers. Candidate 14a used four layers, a native unbroken inner1 GND pour and 0.46 mm via drill separation. Native build reported zero PCB errors, but independent geometry found via overlaps and 10 drill-to-pad violations, while physical connectivity and native shorts rejected shorts. Candidate 14b added a ground fanout phase and moved C8/C13; it failed fanout and left connections unrouted. Both are preserved locally as rejected candidates.

Root-cause investigation found that core expanded obstacle net aliases before assigning internal component links. A grounded switch thereby marked the entire ground plane and other fixed pads as net-assignable (80 obstacles). The source-built core 0.0.1971-a0.2 classifies own-pad internal links before alias expansion; the exact board SRJ now preserves a fixed ground plane and has 10 actual assignable obstacles. The new upstream-style regression failed before the fix and passes afterward; 23 related tests, typecheck and canonical build pass. Source patch, test/snapshot and hashed archive are preserved under tooling/. Candidate 14c also moves C12 to (-15.2,2.9), removes the failed fanout phase and uses supported 5x native routing effort. Unrouted placement has zero DRC errors/warnings; remaining R5/C2 suggestions are optimization heuristics. Placement image reviewed and unrouted invariants pass. Routing validation remains pending.

## Placement iteration — 0.1.0-prototype.14

Four-layer candidate, expanded via-spacing regression, and source-built core fix for internal-link net alias classification. Moved TP9 and C4/C8/C12/C13 before routing. Native routing and independent geometry still reject this candidate; source release only, not fabrication ready.

Unrouted placement/build/invariants pass and the placement overview was inspected. Routing results: 57 native PCB errors; 10 shorts findings; 4 drill-to-pad violations; disconnected nets: []. This routing candidate is rejected. No manufacturing rule was weakened. Logs: local evidence/iteration-14-*. Generated geometry and audits are preserved in evidence/routing-prototype-14/.

Final candidate 14c result: 57 native PCB errors, 10 native shorts findings, four ordinary drill-to-pad violations and four via-spacing violations. Minimum different-net ring gap is 0.0867456 mm; minimum drill gap is 0.131654 mm. All 57 nets/273 ports have contact, but five physical short groups invalidate connectivity. Although the input ground-plane obstacle is now correctly fixed, the native router still puts non-GND traces on inner1 despite `unbroken`; the expanded geometry audit rejects this too. This demonstrates an unresolved multilayer routing/plane-enforcement tooling blocker, not successful four-layer validation. The native build error exit and independent failures are preserved rather than suppressed.

No route snapshot was accepted and no current fabrication export was generated. Historical exported files remain immutable evidence, explicitly withdrawn from ordering. Four layers remain the proposed direction, pending routing/tooling fixes, a verified manufacturer stackup, current per-layer current-path review, A4 schematic organization and the remaining fabrication gates. Physical testing is not started.

Final source checks for prototype.14: format, TypeScript, netlist, pin specification and source pass; schematic-placement has no collisions (accepted padding/F1 style suggestions). Native PCB placement exits 1 for R5/C2 optimization heuristics with zero placement DRC errors/warnings. Via regression 5/5, rotated-pad geometry 1/1 and legend parser 2/2 pass. Fabrication/silkscreen commands fail explicitly because no export exists for this rejected revision; scripts now derive the target revision from project metadata instead of reading or overwriting historical exports. Reviewed inner1 diagnostic image visibly confirms the routing cuts through the intended reference plane. These successful source/tool tests do not override the failed routing gate.

## Source release 0.1.0-prototype.15 — cloud worker timeout

The supplied prototype.14 hosted log reports `Worker job timed out after 600000ms`, after routing advanced to highDensityForceImproveSolver (58%). Set native `build.workerTimeoutMs` to `1800000` (30 minutes) in `tscircuit.config.json`. Installed CLI 0.1.2172 schema accepts a positive integer; its build path passes this field to the worker pool. An explicit host environment timeout takes precedence; a separate sandbox deadline may still apply.

This release changes configuration and release documentation only. PCB source files and dependency versions are unchanged; all prior electrical/placement evidence and routing failures remain applicable. No local routing attempt was run for this config-only change, and no new copper or fabrication acceptance is claimed. Hosted completion with the increased limit remains unverified. Config schema checks, formatting and TypeScript checks passed. Existing stage blockers remain unchanged.

## Source release 0.1.0-prototype.16 — bottom evaluation notice

Added the exact requested wording on bottom silkscreen: “For evaluation only;” at (0, -10) mm and “not FCC approved for resale.” at (0, -13) mm, centered, 1.8 mm font. The board title, functional labels and hardware revision remain in place. Native bottom-layer mirroring is retained, for readable lettering when viewed from the underside.

Validation: formatting and TypeScript passed; native `tsci build index.circuit.tsx --routing-disabled --pcb-svgs` passed; `bun run test:placement` passed, including no routed traces and no emitted errors. Both emitted notice records have the exact text, bottom layer and 1.8 mm font. Visually inspected `previews/A0-prototype.16/bottom-silkscreen-unrouted.png`: two separated lines within the outline, clear of through-hole connector pads and mounting holes. This is a placement preview using top-view coordinates; its bottom text is mirrored as expected.

The change is silkscreen-only; electrical connections, component positions, routing settings and dependencies remain unchanged. No routing rerun, via-to-ink review or Gerber fabrication acceptance was performed. Existing prototype.14 routing failures remain unresolved and all stage blockers persist. The 30-minute build-worker timeout from prototype.15 is retained.

## Source release 0.1.0-prototype.17 — 60-minute worker timeout

The user reported “Build timed out after 30 minutes”. Increased native `build.workerTimeoutMs` from 1800000 to 3600000 (60 minutes). Validated the value against the installed CLI schema and retained the existing worker call-path verification. This setting controls individual CLI build workers; an explicit host environment override or separate overall platform deadline may still terminate the job earlier. Hosted completion remains unverified.

Configuration and release metadata only: electrical design, PCB placement, silkscreen, routing settings and dependency versions are unchanged from prototype.16. No new routing attempt or component move was made. Formatting and TypeScript checks passed. Existing routing, A4 sheet, stackup and fabrication blockers remain unchanged.

Readback of prototype.16 from `package_releases/get` confirms `user_code_job_error.error_code=user_code_job_timeout` and message “Build timed out after 30 minutes”. This is a hosted-job timeout report, not the CLI worker timeout message. No supported project setting for the overall hosted deadline was found in the installed config schema. The worker limit change is published as requested, but resolution of the reported platform timeout is not claimed; the service operator may need to increase that deadline.
