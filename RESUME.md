# Resume A0 / 0.1.0-prototype.11

Read AGENTS.md, VERSIONING.md and VALIDATION.md. User requires component moves after routing errors and pushes of every saved version to both services.

Cleaned overlapping component and signal labels. Preserved all physical copper, holes, mounting clearances and component positions from prototype.10; only test-pad port-hint spelling changes from 1 to pin1. Replaced implied probe footprints with identical 1.4 mm copper pads and explicitly zero stencil paste using the supported solderPasteMargin property. All routed checks and software tests pass. Gerber export review identifies unavoidable through-hole terminal paste in the installed core; fabrication approval remains blocked.

Latest routing: 0 native PCB errors; 0 shorts findings; 0 drill-to-pad violations; disconnected nets: [].

Two-layer 90x60x1 mm board, 85 parts. Follow native DRC, shorts, dimensional AND physical-connectivity audits; native success alone missed an open ADC net in prototype.3. No DRC changes or suppression. Source publishing is authorized; no prototype order or physical testing exists.

Routing and software checks are complete. Prototype.11 labels and bare-test-pad paste are corrected. Stage 6 is blocked by the installed core generating unconfigurable paste on circular terminal holes, subtitle bullet glyph omission, and missing assembler acceptance. See fabrication/A0-prototype.11/README.md. No generated-artifact workaround is authorized or used.
