# Rejected routed prototype — 0.1.0-prototype.19 / A0

Do not fabricate. Fresh native output from candidate 19j has 84 DRC errors. The native shorts check reports 29 raster/Gerber findings; the independent connectivity audit finds three shorted net groups. Independent geometry finds three via-pair violations, 13 ordinary drill-to-pad violations and 29 non-GND traces on the reserved inner1 plane. All required ports are joined, but the unintended connections make this result unacceptable.

The eight native A4 landscape schematic sheets and eight-page schematic-a4.pdf are reviewed. Per-sheet SVGs are included because the default schematic.svg is only the first sheet. All 273 required pin/net mappings match prototype.18. PCB previews are diagnostic renders, not fabrication approval or physical photos. Snapshots failed and were not accepted. There is no current approved manufacturing export.

See build-status.json for source/output hashes and validation/ for independent reports. Full candidate history and unresolved router/fanout blockers are in ../VALIDATION.md. The worker timeout remains 60 minutes; hosted overall timeout resolution is unverified.
